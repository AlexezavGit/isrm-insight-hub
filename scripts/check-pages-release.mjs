const expected = process.env.ISRM_RELEASE_SHA;
if (!expected || !/^[a-f0-9]{40}$/.test(expected)) throw new Error('Missing expected release commit');
let ready = false;
for (let attempt = 0; attempt < 12; attempt++) {
  try {
    const response = await fetch(`https://isrm.pages.dev/release.json?v=${expected}`, {
      cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    if (response.ok && (await response.json()).commit === expected) { ready = true; break; }
  } catch { /* Wait for the new deployment to reach the edge. */ }
  await new Promise(resolve => setTimeout(resolve, 5000));
}
if (!ready) throw new Error('Production has not returned the expected release commit');
for (const pathname of ['/proposal', '/scope', '/?view=map', '/ISRM_Project_Description.md', '/ISRM_Community_Member_Survey_Draft.md']) {
  const response = await fetch(`https://isrm.pages.dev${pathname}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Production check failed: ${pathname} HTTP ${response.status}`);
  const text = await response.text();
  if (!text.includes('ISRM')) throw new Error(`Unexpected response: ${pathname}`);
}
console.log(`Production verified at isrm.pages.dev for ${expected}`);
