const enabledEl = document.getElementById('enabled');
const canvasShieldEl = document.getElementById('canvasShield');
const statusEl = document.getElementById('status');

function setStatus(text) {
  statusEl.textContent = text || '';
}

function load() {
  chrome.storage.sync.get({ enabled: true, canvasShield: true }, (data) => {
    enabledEl.checked = data.enabled !== false;
    canvasShieldEl.checked = data.canvasShield !== false;
  });
}

function save() {
  chrome.storage.sync.set(
    {
      enabled: enabledEl.checked,
      canvasShield: canvasShieldEl.checked,
    },
    () => setStatus('Saved. Hard-refresh open tabs.')
  );
}

enabledEl.addEventListener('change', save);
canvasShieldEl.addEventListener('change', save);
load();
