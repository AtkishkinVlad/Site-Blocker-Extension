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

    if (!tabId) return;
    if (!url.startsWith('http') && !url.startsWith('https')) return;
    if (url.includes('confirm.html')) return;

    const result = await browser.storage.local.get('blockedSites');
    const sites: string[] = result['blockedSites'] || [];
    if (sites.length === 0) return;

    if (urlMatchesBlocked(url, sites)) {
      console.log('[BG] Blocking:', url);
      const encodedUrl = encodeURIComponent(url);
      const confirmUrl = `confirm.html?tabId=${tabId}&url=${encodedUrl}`;
      await browser.tabs.update(tabId, { url: confirmUrl });
    }
  });

  browser.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === 'navigate') {
      const url = message.url;
      
      browser.tabs.create({ url: url, active: true }).then((tab) => {
        if (sender.tab?.id) {
          browser.tabs.remove(sender.tab.id);
        }
      });
    }
  });
});