import { scopeDocumentSections } from '@/lib/scope-document';
import type { ClientLocale } from '@/lib/client-catalog';
export function ScopePrintDocument({summary,locale}:{summary:string;locale:ClientLocale}) {
 const doc=scopeDocumentSections(summary);
 return <article className="client-print-summary scope-print-document">
  <header className="scope-print-brand"><img src="/favicon.svg" width="36" height="36" alt=""/><div><strong>ISRM</strong><span>INSIGHT HUB</span></div><p>{locale==='uk'?'Обсяг · бюджет · запит на пропозицію':'Scope · budget · proposal request'}</p></header>
  <h1>{doc.title}</h1>
  {doc.sections.map((section,i)=><section className="scope-print-section" key={i}>
   {section.title&&<h2>{section.title}</h2>}
   {section.lines.filter(Boolean).map((line,j)=>line.startsWith('• ')?<p className="scope-print-item" key={j}>{line.slice(2)}</p>:<p key={j}>{line}</p>)}
  </section>)}
  <footer className="scope-print-footer">{locale==='uk'?'Матеріал для обговорення · остаточні обсяг, ціна й умови підлягають погодженню.':'Discussion material · final scope, price and terms remain subject to agreement.'}</footer>
 </article>;
}
