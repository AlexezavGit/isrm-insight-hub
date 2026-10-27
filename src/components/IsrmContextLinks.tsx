import { ISRM_CONTEXT, type ContextKey } from '@/lib/isrm-context';
import type { ClientLocale } from '@/lib/client-catalog';
export function IsrmContextLinks({context,locale,compact=false}:{context:ContextKey;locale:ClientLocale;compact?:boolean}) {
 return <div className={`isrm-context-links ${compact?'is-compact':''}`}>
  {(compact?ISRM_CONTEXT[context].slice(0,1):ISRM_CONTEXT[context]).map((item,i)=><div key={i}>
   <p>{item.text[locale]}</p>
   <p className="isrm-context-sources">{item.links.map(link=><a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</p>
  </div>)}
 </div>;
}
