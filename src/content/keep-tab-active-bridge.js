/**
 * ISOLATED world @ document_start — bridge for keep-tab-active MAIN patch.
 * Reads real document.hidden (this world is not patched) for requestAnimationFrame proxy.
 * Techniques adapted from Always Active Window (MPL-2.0):
 * https://github.com/brian-girko/always-active
 */
(function () {
  const PORT_ID = 'invisible-window-keep-active-port';

  let port;
  try {
    port = document.getElementById(PORT_ID);
    port.remove();
  } catch (_) {
    port = document.createElement('span');
    port.id = PORT_ID;
    port.hidden = true;
    port.setAttribute('aria-hidden', 'true');
    (document.documentElement || document.head || document).append(port);
  }

  const syncEnabled = () => {
    try {
      chrome.storage.sync.get({ enabled: true, canvasShield: true }, (data) => {
        port.dataset.enabled = data.enabled === false ? 'false' : 'true';
        port.dataset.canvasShield = data.canvasShield === false ? 'false' : 'true';
      });
    } catch (_) {
      port.dataset.enabled = 'true';
      port.dataset.canvasShield = 'true';
    }
  };

  port.dataset.hidden = String(document.hidden);
  port.dataset.enabled = 'true';
  port.dataset.canvasShield = 'true';
  syncEnabled();

  port.addEventListener('state', () => {
    port.dataset.hidden = String(document.hidden);
  });

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync') return;
      if (changes.enabled) {
        port.dataset.enabled = changes.enabled.newValue === false ? 'false' : 'true';
      }
      if (changes.canvasShield) {
        port.dataset.canvasShield = changes.canvasShield.newValue === false ? 'false' : 'true';
      }
    });
  } catch (_) {
    /* ignore */
  }
})();
