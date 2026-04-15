const STORAGE_KEY = 'blockedSites';

function urlMatchesBlocked(url: string, blockedSites: string[]): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    for (const site of blockedSites) {
      const trimmed = site.trim();
      if (!trimmed) continue;

      try {
        if (trimmed.startsWith('regex:')) {
          const pattern = trimmed.slice(6);
          const regex = new RegExp(pattern);
          if (regex.test(url) || regex.test(hostname)) return true;
        } else if (trimmed.startsWith('domain:')) {
          const domain = trimmed.slice(7);
          if (hostname === domain || hostname.endsWith('.' + domain)) return true;
        } else if (trimmed.startsWith('url:')) {
          const targetUrl = trimmed.slice(4);
          if (url === targetUrl || url.startsWith(targetUrl)) return true;
        } else {
          if (hostname === trimmed || hostname.endsWith('.' + trimmed)) return true;
        }
      } catch (e) {
        console.error('Error matching site:', trimmed, e);
      }
    }
  } catch (e) {
    console.error('Error parsing URL:', url, e);
  }
  return false;
}

export default defineBackground(() => {
  browser.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const url = details.url;
    const tabId = details.tabId;

    console.log('[BG] onBeforeNavigate:', url, 'tabId:', tabId);

    if (!tabId) return;
    if (!url.startsWith('http')) return;
    
    if (url.includes('confirm.html')) {
      console.log('[BG] Skipping confirm.html');
      return;
    }

    const result = await browser.storage.local.get(STORAGE_KEY);
    const sites: string[] = result[STORAGE_KEY] || [];

    if (sites.length === 0) return;

    if (urlMatchesBlocked(url, sites)) {
      console.log('[BG] Blocking URL:', url);
      const encodedUrl = encodeURIComponent(url);
      const confirmUrl = `confirm.html?tabId=${tabId}&url=${encodedUrl}`;
      console.log('[BG] Redirecting to:', confirmUrl);
      await browser.tabs.update(tabId, { url: confirmUrl });
    }
  });
});