import { buildClientSummary, type ClientDraft } from './client-draft';
import type { ClientLocale } from './client-catalog';
const headings = /^(СЕРВІСИ|SERVICES|WORKFLOWS(?: · .*)?|ВЛАСНІ ОПИСИ|CUSTOM REQUESTS|РОБОЧИЙ ВІДБІР · ДСП|WORKING SHORTLIST · CONFIDENTIAL|БЮДЖЕТНА ПОЗИЦІЯ|BUDGET POSITION|ДАНІ ТА ВІДПОВІДАЛЬНІСТЬ|DATA & RESPONSIBILITY|ПРИМІТКИ|NOTES)$/;
export function scopeDocumentSections(summary:string) {
 const lines=summary.split('\n');
 const title=lines.shift()??'ISRM';
 const sections:{title:string;lines:string[]}[]=[{title:'',lines:[]}];
 for(const line of lines){
  if(headings.test(line)) sections.push({title:line,lines:[]});
  else sections[sections.length-1]!.lines.push(line);
 }
 return {title,sections};
}
export function buildClientMarkdown(draft:ClientDraft,locale:ClientLocale) {
 const doc=scopeDocumentSections(buildClientSummary(draft,locale));
 return '# '+doc.title+'\n\n'+doc.sections.map(section=>(section.title?'## '+section.title+'\n\n':'')+section.lines.join('\n').trim().replace(/^• /gm,'- ')).join('\n\n')+'\n';
}
