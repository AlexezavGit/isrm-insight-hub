import { Users, MessagesSquare, Handshake, UserCheck, FileSearch, BookOpen, Layers, RefreshCw } from 'lucide-react';
import type { ClientLocale } from '@/lib/client-catalog';
const acquisition = [
 {Icon:Users,uk:'Аудиторії й потреби',en:'Audiences & needs'},
 {Icon:MessagesSquare,uk:'Професійний діалог',en:'Professional dialogue'},
 {Icon:Handshake,uk:'Доречна пропозиція',en:'Relevant opportunity'},
 {Icon:UserCheck,uk:'Членство й клієнти',en:'Membership & clients'},
];
// The lower flow returns from experience to products, renewing the upper flow.
const expertise = [
 {Icon:BookOpen,uk:'Продукти й поширення',en:'Products & sharing'},
 {Icon:Layers,uk:'Синтез і трансформація',en:'Synthesis & transformation'},
 {Icon:FileSearch,uk:'Джерела й перевірка',en:'Sources & review'},
 {Icon:RefreshCw,uk:'Досвід і нові запити',en:'Experience & new enquiries'},
];
export function WorkflowTimeline({locale}:{locale:ClientLocale}) {
 const uk=locale==='uk';
 return <figure className="workflow-shared-timeline">
  <a className="workflow-timeline-label" href="#scope-workflow-engagement">
   <span>{uk?'Цикл залучення / acquisition':'Engagement / acquisition cycle'}</span><span aria-hidden="true">→</span>
  </a>
  <div className="workflow-timeline-scroll" role="region" aria-label={uk?'Два цикли на спільній горизонтальній осі':'Two cycles on a shared horizontal rail'} tabIndex={0}>
   <div className="workflow-timeline-rail">
    <div className="workflow-timeline-axis" aria-hidden="true" />
    <ol className="workflow-timeline-lane is-acquisition">
     {acquisition.map(({Icon,...step},i)=><li key={step.en} style={{gridColumn:`${i*2+1} / span 2`}}><Icon size={18} aria-hidden="true"/><span>{step[locale]}</span></li>)}
    </ol>
    <ol className="workflow-timeline-lane is-expertise" reversed>
     {[...expertise].reverse().map(({Icon,...step},i)=><li key={step.en} style={{gridColumn:`${8-i*2} / span 2`}}><Icon size={18} aria-hidden="true"/><span>{step[locale]}</span></li>)}
    </ol>
   </div>
  </div>
  <a className="workflow-timeline-label is-return" href="#scope-workflow-expertise"><span aria-hidden="true">←</span><span>{uk?'Циркуляція та трансформація експертизи':'Expertise circulation & transformation'}</span></a>
  <figcaption>{uk?'Результати взаємодії стають досвідом; перевірена експертиза повертається у нові пропозиції та взаємодії. Кожен workflow погоджується окремо.':'Interactions create experience; reviewed expertise returns as new offers and interactions. Each workflow is agreed separately.'}</figcaption>
 </figure>;
}
