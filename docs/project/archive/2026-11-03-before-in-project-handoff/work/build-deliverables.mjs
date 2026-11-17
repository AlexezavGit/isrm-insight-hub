import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {marked} from '/Users/alexzvo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js';
const base='/Users/alexzvo/Documents/ChatGPT/isrm', root=path.join(base,'isrm-insight-hub');
const out=path.join(base,'work/isrm-deep-audit/deliverable');
const finalRoot='/Users/alexzvo/Documents/Codex/2026-10-31/product-design-audit-users-alexzvo-codex/outputs/isrm-deep-audit-2026-10-31';
const exportArchive=path.join(base,'work/isrm-deep-audit/export-before-navigation-2026-11-01');
try {await fs.access(exportArchive);} catch {await fs.cp(out,exportArchive,{recursive:true});}
await fs.mkdir(out,{recursive:true});
for(const dir of ['screens','prototype-screens','refinement-screens','implementation-screens']) await fs.cp(path.join(root,'docs/reviews/deep-audit-2026-10-31',dir),path.join(out,dir),{recursive:true});
await fs.cp(path.join(root,'docs/reviews/app-first-2026-11-02/screens'),path.join(out,'app-first-screens'),{recursive:true});
await fs.cp(path.join(root,'docs/reviews/workspace-revision-2026-11-03/screens'),path.join(out,'workspace-revision-screens'),{recursive:true});
for(const dir of ['sources','evidence','session-notes']) {
 try {await fs.cp(path.join(root,'docs/project',dir),path.join(out,'project',dir),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
}
await fs.copyFile(path.join(root,'docs/project/REGISTRY.csv'),path.join(out,'project/REGISTRY.csv'));
await fs.copyFile(path.join(root,'docs/project/REGISTRY.csv'),path.join(out,'ISRM_REGISTRY_2026-11-01.csv'));
const specs=[
 ['docs/reviews/workspace-revision-2026-11-03/README.md','ISRM_Workspace_Revision_2026-11-03','Робочий простір: огляд, панелі й конфігуратор'],
 ['docs/reviews/app-first-2026-11-02/README.md','ISRM_App_First_2026-11-03','Застосунок, перший вхід і композиція функцій'],
 ['docs/reviews/deep-audit-2026-10-31/README.md','ISRM_Deep_Audit_Briefing_2026-10-31','Брифінг та навчальна роль'],
 ['docs/reviews/deep-audit-2026-10-31/PROTOTYPE.md','ISRM_Deep_Audit_Prototype_2026-11-01','Прототип та сценарії'],
 ['docs/project/ENTRY.md','ISRM_Project_Entry_2026-10-31','ENTRY: документація та гілки'],
 ['PROJECT_OVERLAY_ISRM.md','ISRM_Project_Overlay_2026-11-01','Прив’язка проєкту'],
 ['docs/reviews/deep-audit-2026-10-31/IMPLEMENTATION-ORDER.md','ISRM_Work_Order_2026-11-01','Порядок реалізації та повторне використання'],
 ['docs/reviews/deep-audit-2026-10-31/BRIEFING-REVISION.md','ISRM_Briefing_Revision_2026-11-02','Редакція презентації: сервіси та workflow'],
 ['docs/reviews/deep-audit-2026-10-31/LOCAL-IMPLEMENTATION.md','ISRM_Local_Implementation_2026-11-02','Локальна реалізація: результат і перевірки'],
];
const map=new Map(),queue=[],copied=[],unresolved=[];
for(const [src,name,title] of specs){const abs=path.join(root,src);map.set(abs,{html:name+'.html',md:name+'.md'});queue.push({src:abs,name,title});}
const panelSource=path.join(root,'docs/reviews/deep-audit-2026-10-31/PANEL-MECHANICS.html');
const panelOutput='ISRM_Panel_Mechanics_2026-11-01.html';
map.set(panelSource,{html:panelOutput,md:panelOutput});
const panelHtml=(await fs.readFile(panelSource,'utf8')).replace('href="PROTOTYPE.md"','href="ISRM_Deep_Audit_Prototype_2026-11-01.html"');
await fs.writeFile(path.join(out,panelOutput),panelHtml);
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const style=`:root{color-scheme:light}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#19353d;background:#f4f5f2;margin:0;line-height:1.65}main{max-width:1120px;margin:24px auto;background:white;padding:40px 50px;border:1px solid #d1d9d9}nav{display:flex;flex-wrap:wrap;gap:10px 20px;border-bottom:1px solid #bdc9c9;padding-bottom:18px;margin-bottom:28px;font-size:15px}h1{font-size:32px;line-height:1.2;max-width:900px}h2{font-size:24px;margin-top:50px;padding-top:20px;border-top:2px solid #bdc9c9}h3{font-size:20px}p{max-width:94ch}a{color:#075566;text-underline-offset:3px}img{display:block;max-width:100%;height:auto;border:1px solid #bdc9c9;margin:24px auto}blockquote{margin:24px 0;padding:14px 24px;border-left:4px solid #46717a;background:#f2f6f4}table{border-collapse:collapse;width:100%;font-size:14px;margin:24px 0}th,td{border:1px solid #cad4d3;padding:12px;vertical-align:top;text-align:left}th{background:#edf2ef}code{font-size:.91em;overflow-wrap:anywhere;background:#edf2ef;padding:.1em .3em}small{color:#4d666c}@media(max-width:760px){main{margin:0;padding:22px 18px}h1{font-size:26px}h2{font-size:22px}table{font-size:12px;display:block;overflow-x:auto}th,td{padding:8px}}@media print{body{background:white}main{border:0;margin:0;padding:0;max-width:none}nav{display:none}h2{break-after:avoid}img{break-inside:avoid}table{font-size:10px}a{color:inherit}}`;
const nav=from=>'<nav aria-label="Документи аудиту">'+[['index.html','Початок'],...specs.slice(0,4).map(([,n,t])=>[n+'.html',t])].map(([p,t])=>`<a href="${encodeURI(path.relative(path.dirname(from),p))}">${escape(t)}</a>`).join('')+'</nav>';
const wrap=(title,body,from)=>`<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ISRM — ${escape(title)}</title><style>${style}</style></head><body><main>${nav(from)}${body}</main></body></html>`;
async function targetFor(abs){
 if(map.has(abs))return map.get(abs);
 const rel=path.relative(root,abs);
 if(rel.startsWith('docs/project/sources'))return {html:'project/'+path.relative(path.join(root,'docs/project'),abs),md:'project/'+path.relative(path.join(root,'docs/project'),abs)};
 if(rel.startsWith('docs/project/evidence/'))return {html:'project/'+path.relative(path.join(root,'docs/project'),abs),md:'project/'+path.relative(path.join(root,'docs/project'),abs)};
 if(rel==='docs/project/REGISTRY.csv')return {html:'project/REGISTRY.csv',md:'project/REGISTRY.csv'};
 if(rel.startsWith('docs/reviews/workspace-revision-2026-11-03/screens/'))return {html:'workspace-revision-screens/'+path.basename(abs),md:'workspace-revision-screens/'+path.basename(abs)};
 if(rel.startsWith('docs/reviews/app-first-2026-11-02/screens/'))return {html:'app-first-screens/'+path.basename(abs),md:'app-first-screens/'+path.basename(abs)};
 if(rel.startsWith('docs/reviews/deep-audit-2026-10-31/screens/')||rel.startsWith('docs/reviews/deep-audit-2026-10-31/prototype-screens/')||rel.startsWith('docs/reviews/deep-audit-2026-10-31/refinement-screens/')||rel.startsWith('docs/reviews/deep-audit-2026-10-31/implementation-screens/'))return {html:path.relative(path.join(root,'docs/reviews/deep-audit-2026-10-31'),abs),md:path.relative(path.join(root,'docs/reviews/deep-audit-2026-10-31'),abs)};
 const stat=await fs.stat(abs);
 if(stat.isDirectory()){
  if(abs===path.join(root,'docs/project/sources'))return {html:'project/sources/index.html',md:'project/sources/index.html'};
  const readme=path.join(abs,'README.md');await fs.access(readme);return targetFor(readme);
 }
 if(!/\.(md|csv|json|txt|xlsx|pdf|png|jpg|jpeg|svg)$/i.test(abs))throw Error('Unsupported reference '+abs);
 const stem=crypto.createHash('sha256').update(abs).digest('hex').slice(0,10)+'-'+path.basename(abs,path.extname(abs));
 const name=path.join('references',stem);
 const md=/\.md$/i.test(abs);
 const entry={html:name+(md?'.html':path.extname(abs)),md:name+path.extname(abs)};
 map.set(abs,entry);
 await fs.mkdir(path.join(out,'references'),{recursive:true});
 const bytes=await fs.readFile(abs);
 copied.push({source:abs,file:entry.md,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),meaning:'Exact source snapshot; financial correctness and approval not implied'});
 if(md) queue.push({src:abs,name,title:path.basename(abs),reference:true});
 else await fs.writeFile(path.join(out,entry.md),bytes);
 return entry;
}
async function relink(src,body,outputName,kind){
 const matches=[...body.matchAll(/(!?\[[^\]]*\])\(([^)]+)\)/g)];
 const replacements=new Map();
 for(const m of matches){
  const target=m[2];if(/^(https?:|#|mailto:)/.test(target))continue;
  const [file,fragment]=target.split('#');
  if(file.startsWith('/')&&!file.startsWith('/Users/')){replacements.set(m[0],`${m[1]}(https://isrm.pages.dev${target})`);continue;}
  const abs=path.resolve(path.dirname(src),decodeURI(file));
  let dest;
  if(abs===path.join(root,'docs/project/sources'))dest={html:'project/sources/index.html',md:'project/sources/index.html'};
  else {try{dest=await targetFor(abs);}catch(e){if(specs.some(([s])=>path.join(root,s)===src))throw e; unresolved.push({source:src,target:abs,status:'Original historical reference unavailable in this copy'});replacements.set(m[0],m[1].replace(/^!/, '').slice(1,-1)+' — `'+abs+'` (посилання історичного джерела недоступне у цій копії)');continue;}}
  const rel=kind==='html'?encodeURI(path.relative(path.dirname(outputName+'.html'),dest.html)):path.join(finalRoot,dest.md);
  replacements.set(m[0],`${m[1]}(${rel}${fragment?'#'+fragment:''})`);
 }
 for(const [a,b] of replacements)body=body.split(a).join(b);
 return body;
}
for(let i=0;i<queue.length;i++){
 const {src,name,title,reference}=queue[i],original=await fs.readFile(src,'utf8');
 const md=await relink(src,original,name,'md'),html=await relink(src,original,name,'html');
 await fs.mkdir(path.dirname(path.join(out,name)),{recursive:true});
 await fs.writeFile(path.join(out,name+'.md'),reference?original:md);
 await fs.writeFile(path.join(out,name+'.html'),wrap(title,marked.parse(html),name+'.html'));
}
const sourceNames=(await fs.readdir(path.join(root,'docs/project/sources'))).filter(n=>n!=='index.html');
await fs.writeFile(path.join(out,'project/sources/index.html'),wrap('Повні джерела вимог','<h1>Джерела вимог і тверджень</h1><p>Прямі рішення Алекса відділяються від процитованих чужих аудитів. Наявність фінансового твердження в джерелі не підтверджує його.</p><ul>'+sourceNames.map(n=>`<li><a href="${encodeURI(n)}">${escape(n)}</a></li>`).join('')+'</ul>','project/sources/index.html'));
await fs.writeFile(path.join(out,'index.html'),wrap('Навігація аудиту',"<h1>ISRM — локальна реалізація, аудит і джерела</h1><p><strong>Поточний результат:</strong> <a href=\"ISRM_Workspace_Revision_2026-11-03.html\">Робочий простір: огляд експертизи, одна панель і конфігуратор функцій</a>.</p><p><a href=\"http://127.0.0.1:8771/\">Відкрити локальний застосунок</a> · <a href=\"ISRM_Project_Entry_2026-10-31.html\">ENTRY: джерела та поточний стан</a></p><p>Пакет за прямими уточненнями 3 листопада реалізовано локально. Вступ, окремі туторіали, збережені пошуки зі знімками й цикл workflow перевірені. У поточній роботі публікація не виконувалася. ШІ-дослідження, рецензії та знайомства не активовані.</p><table><tr><th>Матеріал</th><th>Стан і призначення</th></tr><tr><td><a href=\"ISRM_App_First_2026-11-03.html\">Попередній пакет: застосунок як основний продукт</a></td><td>Історія рішення й незалежне порівняння продуктових моделей. Подальші інтерфейсні зміни — у поточному результаті.</td></tr><tr><td><a href=\"ISRM_Deep_Audit_Briefing_2026-10-31.html\">Брифінг і навчальна роль</a></td><td>Погоджений початковий розбір із подальшими уточненнями.</td></tr><tr><td><a href=\"ISRM_Deep_Audit_Prototype_2026-11-01.html\">Аудит прототипу</a></td><td>Погоджена специфікація та історичні докази. Механіку пари панелей замінено поточним прямим рішенням.</td></tr><tr><td><a href=\"ISRM_Local_Implementation_2026-11-02.html\">Перший локальний пакет</a></td><td>Попередні реалізація, перевірки й відкриті частини.</td></tr></table><p><a href=\"ISRM_Briefing_Revision_2026-11-02.html\">Редакція презентації EN/UK</a> · <a href=\"ISRM_Work_Order_2026-11-01.html\">Порядок реалізації та повторне використання</a> · <a href=\"ISRM_Project_Overlay_2026-11-01.html\">OVERLAY</a></p><p><a href=\"ISRM_Panel_Mechanics_2026-11-01.html\">Історична інтерактивна схема пари панелей</a> · <a href=\"project/REGISTRY.csv\">Реєстр</a> · <a href=\"project/sources/index.html\">Повні джерела</a></p><p>Повний аналітичний аудит конфігуратора, scope й історичного фінансового корпусу залишається відкритим. Локальний результат не є прийманням до промислової експлуатації.</p>",'index.html'));
await fs.writeFile(path.join(out,'project/evidence/reference-copy-manifest.json'),JSON.stringify({copied,unresolved},null,2)+'\n');
console.log(JSON.stringify({staging:out,final:finalRoot,documents:queue.length,referenceSnapshots:copied.length,unresolvedHistoricalReferences:unresolved.length}));
