chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enabled', 'canvasShield'], (data) => {
    const patch = {};
    if (typeof data.enabled !== 'boolean') patch.enabled = true;
    if (typeof data.canvasShield !== 'boolean') patch.canvasShield = true;
    if (Object.keys(patch).length) chrome.storage.sync.set(patch);
  });
});
