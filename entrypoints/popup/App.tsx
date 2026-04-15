import { useState, useEffect } from 'react';

function App() {
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    browser.storage.local.get('blockedSites').then((result) => {
      const sites = result.blockedSites || [];
      setBlockedSites(sites);
      setInputValue(sites.join('\n'));
    });
  }, []);

  const handleSave = async () => {
    const sites = inputValue.split('\n').filter(s => s.trim());
    await browser.storage.local.set({ blockedSites: sites });
    setBlockedSites(sites);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container">
      <h1>Site Blocker</h1>
      <p className="description">
        Enter sites to block (one per line). Use prefixes:
        <code>domain:</code>, <code>url:</code>, <code>regex:</code>
      </p>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="youtube.com&#10;domain:facebook.com&#10;url:https://example.com/page&#10;regex:.*\.evil\.*"
        rows={10}
      />
      <button onClick={handleSave}>
        {saved ? 'Saved!' : 'Apply Changes'}
      </button>
    </div>
  );
}

export default App;