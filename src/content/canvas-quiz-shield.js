/**
 * MAIN world @ document_start — Canvas quiz pages/frames only.
 * Blocks quiz leave-tracking requests (page_blurred / page_focused).
 * Does not block normal answer autosave.
 */
(function () {
  if (globalThis.__invisibleWindowCanvasQuizShield) return;
  globalThis.__invisibleWindowCanvasQuizShield = true;

  const PORT_ID = 'invisible-window-keep-active-port';
  const EVENTS_URL = /\/submissions\/\d+\/events(?:\?|$|\/)/i;
  const TRACKING_BODY = /page_blurred|page_focused/i;

  const shieldOn = () => {
    const port = document.getElementById(PORT_ID);
    if (port && port.dataset.canvasShield === 'false') return false;
    if (port && port.dataset.enabled === 'false') return false;
    return true;
  };

  function urlBlocked(url) {
    if (!url) return false;
    return EVENTS_URL.test(String(url));
  }

  function bodyBlocked(data) {
    if (data == null) return false;
    if (typeof data === 'string') return TRACKING_BODY.test(data);
    if (data instanceof URLSearchParams) return TRACKING_BODY.test(data.toString());
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      for (const [, v] of data.entries()) {
        if (TRACKING_BODY.test(String(v))) return true;
      }
      return false;
    }
    try {
      return TRACKING_BODY.test(String(data));
    } catch (_) {
      return false;
    }
  }

  function shouldBlockRequest(url, body) {
    if (!shieldOn()) return false;
    return urlBlocked(url) || (body != null && bodyBlocked(body));
  }

  if (navigator.sendBeacon) {
    const origBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = function (url, data) {
      if (shouldBlockRequest(url, data)) {
        return true;
      }
      return origBeacon(url, data);
    };
  }

  if (window.fetch) {
    const origFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      const url = typeof input === 'string' ? input : input?.url;
      const body = init?.body;
      if (shouldBlockRequest(url, body)) {
        return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content' }));
      }
      return origFetch(input, init);
    };
  }

  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__invisibleWindowShieldUrl = url;
    return origOpen.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    if (shouldBlockRequest(this.__invisibleWindowShieldUrl, body)) {
      try {
        Object.defineProperty(this, 'status', { value: 204 });
        Object.defineProperty(this, 'readyState', { value: 4 });
        if (typeof this.onreadystatechange === 'function') {
          this.onreadystatechange(new Event('readystatechange'));
        }
        this.dispatchEvent(new Event('load'));
        this.dispatchEvent(new Event('loadend'));
      } catch (_) {
        /* ignore */
      }
      return;
    }
    return origSend.call(this, body);
  };
})();
