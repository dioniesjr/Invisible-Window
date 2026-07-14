/**
 * MAIN world @ document_start — every http(s) tab/frame.
 * Makes the page report as still focused/visible while you alt-tab away.
 *
 * Techniques adapted from Always Active Window (MPL-2.0):
 * https://github.com/brian-girko/always-active/blob/master/v3/data/inject/main.js
 */
(function () {
  if (globalThis.__invisibleWindowKeepTabActivePatched) return;
  globalThis.__invisibleWindowKeepTabActivePatched = true;

  const PORT_ID = 'invisible-window-keep-active-port';

  let port = document.getElementById(PORT_ID);
  if (!port) {
    port = document.createElement('span');
    port.id = PORT_ID;
    port.hidden = true;
    port.setAttribute('aria-hidden', 'true');
    (document.documentElement || document.head || document).append(port);
  }

  if (port.dataset.enabled !== 'false') {
    port.dataset.enabled = 'true';
  }

  const block = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  };

  const isEnabled = () => port.dataset.enabled !== 'false';
  const blurOn = () => port.dataset.blur !== 'false';
  const focusOn = () => port.dataset.focus !== 'false';
  const visibilityOn = () => port.dataset.visibility !== 'false';
  const mouseleaveOn = () => port.dataset.mouseleave !== 'false';
  const mouseoutOn = () => port.dataset.mouseout !== 'false';
  const pointercaptureOn = () => port.dataset.pointercapture !== 'false';
  const redirectOn = () => port.dataset.redirect !== 'false';

  const isPageRoot = (target) =>
    target === window || target === document || target === globalThis;

  const MASKED = new Set([
    'visibilitychange',
    'webkitvisibilitychange',
    'pagehide',
    'pageshow',
    'blur',
    'focus',
    'focusin',
    'focusout',
    'freeze',
    'resume',
  ]);

  function shouldMask(type, target) {
    const t = String(type).toLowerCase();
    if (!MASKED.has(t)) return false;
    return isPageRoot(target);
  }

  const origAdd = EventTarget.prototype.addEventListener;
  const origRemove = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (shouldMask(type, this)) return;
    return origAdd.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function (type, listener, options) {
    if (shouldMask(type, this)) return;
    return origRemove.call(this, type, listener, options);
  };

  function neutralizeHandlerProperty(obj, name) {
    if (!obj) return;
    try {
      Object.defineProperty(obj, name, {
        get: () => null,
        set: () => {},
        configurable: true,
      });
    } catch (_) {
      /* ignore */
    }
  }

  if (typeof document !== 'undefined') {
    neutralizeHandlerProperty(document, 'onvisibilitychange');
    neutralizeHandlerProperty(document, 'onwebkitvisibilitychange');
    neutralizeHandlerProperty(document, 'onpagehide');
    neutralizeHandlerProperty(document, 'onpageshow');
    neutralizeHandlerProperty(document, 'onfocus');
    neutralizeHandlerProperty(document, 'onblur');
    neutralizeHandlerProperty(document, 'onfocusin');
    neutralizeHandlerProperty(document, 'onfocusout');
  }
  if (typeof window !== 'undefined') {
    neutralizeHandlerProperty(window, 'onblur');
    neutralizeHandlerProperty(window, 'onfocus');
    neutralizeHandlerProperty(window, 'onpagehide');
    neutralizeHandlerProperty(window, 'onvisibilitychange');
  }

  const vstateDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  const once = {
    visibilitychange:
      vstateDesc && typeof vstateDesc.get === 'function'
        ? vstateDesc.get.call(document) === 'hidden'
        : false,
    webkitvisibilitychange:
      vstateDesc && typeof vstateDesc.get === 'function'
        ? vstateDesc.get.call(document) === 'hidden'
        : false,
  };

  Object.defineProperty(document, 'visibilityState', {
    get() {
      if (!isEnabled()) {
        return port.dataset.hidden === 'true' ? 'hidden' : 'visible';
      }
      return 'visible';
    },
    configurable: true,
    enumerable: true,
  });

  Object.defineProperty(document, 'webkitVisibilityState', {
    get() {
      if (!isEnabled()) {
        return port.dataset.hidden === 'true' ? 'hidden' : 'visible';
      }
      return 'visible';
    },
    configurable: true,
  });

  Object.defineProperty(document, 'hidden', {
    get() {
      if (!isEnabled()) {
        return port.dataset.hidden === 'true';
      }
      return false;
    },
    configurable: true,
    enumerable: true,
  });

  Object.defineProperty(document, 'webkitHidden', {
    get() {
      if (!isEnabled()) {
        return port.dataset.hidden === 'true';
      }
      return false;
    },
    configurable: true,
  });

  if (typeof navigation !== 'undefined' && window.top === window) {
    const redirect = (e) => {
      if (redirect.href) {
        e.preventDefault();
        e.returnValue = 'no';
      }
    };
    navigation.addEventListener('navigate', (navigateEvent) => {
      if (navigateEvent.navigationType === 'reload') {
        redirect.href = navigateEvent.destination.url;
      }
    });
    document.addEventListener(
      'visibilitychange',
      () => {
        delete redirect.href;
        removeEventListener('beforeunload', redirect);
        try {
          if (vstateDesc && typeof vstateDesc.get === 'function') {
            const state = vstateDesc.get.call(document);
            if (state === 'hidden' && isEnabled() && redirectOn()) {
              addEventListener('beforeunload', redirect);
            }
          }
        } catch (_) {
          /* ignore */
        }
      },
      true
    );
  }

  document.addEventListener(
    'visibilitychange',
    (e) => {
      port.dispatchEvent(new Event('state'));
      if (isEnabled() && visibilityOn()) {
        if (once.visibilitychange) {
          once.visibilitychange = false;
          return;
        }
        block(e);
      }
    },
    true
  );

  document.addEventListener(
    'webkitvisibilitychange',
    (e) => {
      if (isEnabled() && visibilityOn()) {
        if (once.webkitvisibilitychange) {
          once.webkitvisibilitychange = false;
          return;
        }
        block(e);
      }
    },
    true
  );

  window.addEventListener(
    'pagehide',
    (e) => {
      if (isEnabled() && visibilityOn()) {
        block(e);
      }
    },
    true
  );

  window.addEventListener(
    'pageshow',
    (e) => {
      if (isEnabled() && visibilityOn() && isPageRoot(e.target)) {
        block(e);
      }
    },
    true
  );

  window.addEventListener(
    'lostpointercapture',
    (e) => {
      if (isEnabled() && pointercaptureOn()) {
        block(e);
      }
    },
    true
  );

  if (Document.prototype.hasFocus) {
    const origHasFocus = Document.prototype.hasFocus;
    Document.prototype.hasFocus = new Proxy(origHasFocus, {
      apply(target, self, args) {
        if (isEnabled() && focusOn()) {
          return true;
        }
        return Reflect.apply(target, self, args);
      },
    });
  }

  const onPageRootEvent = (e) => isPageRoot(e.target);

  const onfocus = (e) => {
    if (isEnabled() && focusOn() && onPageRootEvent(e)) {
      block(e);
    }
  };
  document.addEventListener('focus', onfocus, true);
  window.addEventListener('focus', onfocus, true);

  const onfocusin = (e) => {
    if (isEnabled() && focusOn() && onPageRootEvent(e)) {
      block(e);
    }
  };
  document.addEventListener('focusin', onfocusin, true);
  window.addEventListener('focusin', onfocusin, true);

  const onfocusout = (e) => {
    if (isEnabled() && focusOn() && onPageRootEvent(e)) {
      block(e);
    }
  };
  document.addEventListener('focusout', onfocusout, true);
  window.addEventListener('focusout', onfocusout, true);

  const onblur = (e) => {
    if (isEnabled() && blurOn() && onPageRootEvent(e)) {
      block(e);
    }
  };
  document.addEventListener('blur', onblur, true);
  window.addEventListener('blur', onblur, true);

  window.addEventListener(
    'mouseleave',
    (e) => {
      if (isEnabled() && mouseleaveOn()) {
        if (e.target === document || e.target === window) {
          block(e);
        }
      }
    },
    true
  );

  window.addEventListener(
    'mouseout',
    (e) => {
      if (isEnabled() && mouseoutOn()) {
        if (e.target === document.documentElement || e.target === document.body) {
          block(e);
        }
      }
    },
    true
  );

  let lastTime = 0;
  window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply(target, self, args) {
      if (isEnabled() && port.dataset.hidden === 'true') {
        const currTime = Date.now();
        const timeToCall = Math.max(0, 16 - (currTime - lastTime));
        const id = setTimeout(() => {
          args[0](performance.now());
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      }
      return Reflect.apply(target, self, args);
    },
  });

  window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply(target, self, args) {
      if (isEnabled() && port.dataset.hidden === 'true') {
        clearTimeout(args[0]);
      }
      return Reflect.apply(target, self, args);
    },
  });
})();
