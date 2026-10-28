import { appendFile } from 'node:fs/promises';

const account = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const token = process.env.CLOUDFLARE_API_TOKEN || '';
if (!/^[a-f0-9]{32}$/i.test(account) || !token) throw new Error('Cloudflare repository secrets are missing or invalid');
const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/isrm`, {
  headers: { Authorization: `Bearer ${token}` },
  signal: AbortSignal.timeout(20000),
});
if (!response.ok) throw new Error(`Cannot read the existing isrm Pages project (HTTP ${response.status})`);
const body = await response.json();
const project = body.result;
if (!body.success || project?.name !== 'isrm' || project?.subdomain !== 'isrm.pages.dev') {
  throw new Error('The Cloudflare secrets do not identify the expected isrm.pages.dev project');
}
const branch = project.production_branch;
if (typeof branch !== 'string' || !/^[A-Za-z0-9_./-]{1,200}$/.test(branch)) throw new Error('Invalid production branch');
if (!process.env.GITHUB_OUTPUT) throw new Error('Missing GitHub Actions output path');
await appendFile(process.env.GITHUB_OUTPUT, `production_branch=${branch}\n`);
// The Pages branch label may differ from the source branch. Never recreate the
// project or guess a branch: deploy into its existing production environment.
console.log(`Verified existing isrm.pages.dev target; production branch ${branch}`);
