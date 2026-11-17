import { build } from 'esbuild';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('pages-upload');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp('dist/assets', path.join(output, 'assets'), {
  recursive: true,
  filter: (file) => !file.endsWith('.map') && !file.endsWith('.DS_Store'),
});
// Only the agreed public files enter the deployment. Internal docs/ and plan/
// are never copied. Both Markdown documents were approved on 28 October 2026.
for (const name of [
  '_headers', '_redirects', '_routes.json', 'favicon.svg', 'robots.txt',
  'ISRM_Project_Description.md', 'ISRM_Community_Member_Survey_Draft.md',
]) await cp(path.join('dist', name), path.join(output, name));

await build({
  entryPoints: ['dist/_worker.js/index.js'],
  outfile: path.join(output, '_worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  external: ['node:*', 'cloudflare:*'],
  conditions: ['workerd', 'worker', 'browser'],
  minify: true,
  legalComments: 'none',
  // The project marks its sources side-effect-free, but Nitro's runtime import
  // initialises SSR. Preserve that import in the single-file Pages worker.
  ignoreAnnotations: true,
});

const commit = process.env.ISRM_RELEASE_SHA || 'local';
if (commit !== 'local' && !/^[a-f0-9]{40}$/.test(commit)) throw new Error('Invalid release commit');
await writeFile(path.join(output, 'release.json'), JSON.stringify({ commit }) + '\n');
const routesPath = path.join(output, '_routes.json');
const routes = JSON.parse(await readFile(routesPath, 'utf8'));
routes.exclude = [...new Set([...(routes.exclude || []), '/release.json'])];
await writeFile(routesPath, JSON.stringify(routes, null, 2) + '\n');
console.log(`Prepared Pages release ${commit}; ${(await readdir(output)).length} top-level entries`);
