import { spawnSync } from 'node:child_process';

const account = (process.env.CLOUDFLARE_ACCOUNT_ID || '').trim();
const token = (process.env.CLOUDFLARE_API_TOKEN || '').trim();
const branch = process.env.ISRM_PRODUCTION_BRANCH || '';
const commit = process.env.ISRM_RELEASE_SHA || '';
if (!/^[a-f0-9]{32}$/i.test(account) || !token) throw new Error('Missing valid Cloudflare credentials');
if (!/^[A-Za-z0-9_./-]{1,200}$/.test(branch) || !/^[a-f0-9]{40}$/.test(commit)) throw new Error('Invalid release destination or commit');

// Pass normalised credentials directly to Wrangler, without writing them to
// files, GitHub outputs or subsequent steps. Never print their values.
const result = spawnSync('npm', [
  'exec', '--yes', '--package=wrangler@4.83.0', '--', 'wrangler',
  'pages', 'deploy', 'pages-upload', '--project-name=isrm',
  `--branch=${branch}`, `--commit-hash=${commit}`,
], {
  stdio: 'inherit',
  env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_API_TOKEN: token },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
