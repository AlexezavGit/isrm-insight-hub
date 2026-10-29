import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const root='/Users/alexzvo/Documents/ChatGPT/isrm';
const out=root+'/outputs/isrm-architecture-20261029';
await fs.mkdir(out,{recursive:true});
const original=root+'/isrm-insight-hub/docs/archive/developer-review-20261028/ISRM_Developer_Estimate_EN.xlsx';
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(original));
console.log((await wb.inspect({kind:'sheet',include:'id,name',maxChars:1000})).ndjson);
const before=await wb.render({sheetName:'Development Estimate',range:'A2:H16',scale:1});
await fs.writeFile(out+'/estimate-before.png',new Uint8Array(await before.arrayBuffer()));
const estimate=wb.worksheets.getItem('Development Estimate'),rates=wb.worksheets.getItem('Rates and Scope');
estimate.getRange('A41').values=[['Planning hours retained for architect confirmation. No client-price or partner-settlement change.']];
rates.getRange('A19').values=[['29 October clarification: integration-led delivery. Compare platform, adapted interface and bespoke options.']];
rates.getRange('A23').values=[['C07 includes 96 adapter hours; C08 includes 80 QA hours. Do not add these tasks again as blanket overhead.']];
rates.getRange('A25').values=[['Supplier quote must state API boundaries, reuse evidence, licences, support, tax and calendar dependencies.']];
const s=wb.worksheets.add('Architect Response');
s.showGridLines=false;s.tabColor='#143343';
s.getRange('A1:H42').format={font:{name:'Arial',size:10,color:'#173342'},verticalAlignment:'center',rowHeight:28};
for(const [i,width]of[10,48,16,18,18,22,52].entries())s.getRange(String.fromCharCode(65+i)+':'+String.fromCharCode(65+i)).format.columnWidth=width;
s.getRange('A2').values=[['ISRM. Architect quotation response']];s.getRange('A2').format.font={name:'Arial',size:16,bold:true,color:'#143343'};
s.getRange('A3:G3').format.borders={bottom:{style:'thin',color:'#B59B55'}};
s.getRange('B4').values=[['29 October 2026. Input cells are amber; blank supplier inputs remain unquoted.']];
const header=(row,labels)=>{const r=s.getRange('A'+row+':G'+row);r.values=[labels];r.format={fill:'#143343',font:{name:'Arial',size:10,color:'#FFFFFF',bold:true},wrapText:true,rowHeight:43,verticalAlignment:'center',horizontalAlignment:'center'};};
header(6,['ID','Production work package','Baseline hours','Supplier hours','Supplier GBP/hour','Supplier labour GBP','Dependencies / reuse evidence']);
const names=['Architecture and option comparison','Responsive member interface and configurator','Approved import, profiles and dossiers','Fields, relationships, groups and lists','Recorded-path graph and ordinary search','Authorisation, storage and audit','Existing OSINT researcher adapter','Quality assurance and security tests','Deployment and handover'];
for(let i=0;i<9;i++){
 const r=i+7;s.getRange('A'+r+':B'+r).values=[['C0'+(i+1),names[i]]];
 s.getRange('C'+r).formulas=[["='Development Estimate'!F"+(i+7)]];
 s.getRange('F'+r).formulas=[['=IF(AND(ISNUMBER(D'+r+'),ISNUMBER(E'+r+')),D'+r+'*E'+r+',"")']];
 s.getRange('A'+r+':G'+r).format.rowHeight=43;
}
s.getRange('B7:B15').format.wrapText=true;s.getRange('G7:G15').format.wrapText=true;
s.getRange('D7:E15').format.fill='#FFF1CA';s.getRange('D7:E15').format.font.color='#164CB2';s.getRange('G7:G15').format.fill='#FFF1CA';
s.getRange('C7:C15').format.font.color='#187343';s.getRange('E7:F18').setNumberFormat('"£"#,##0.00;("£"#,##0.00);"—"');
s.getRange('B18').values=[['Core quotation']];s.getRange('C18').formulas=[['=SUM(C7:C15)']];
s.getRange('D18').formulas=[['=IF(COUNT(D7:D15)=9,SUM(D7:D15),"")']];
s.getRange('F18').formulas=[['=IF(COUNT(F7:F15)=9,SUM(F7:F15),"")']];
s.getRange('G18').formulas=[['=IF(COUNT(F7:F15)=9,"Supplier inputs complete; scope and tax still to confirm","Awaiting complete supplier hours and rates")']];
s.getRange('A18:G18').format={fill:'#F6F3E9',font:{name:'Arial',size:10,bold:true,color:'#173342'},rowHeight:48,wrapText:true};
s.getRange('B20').values=[['Baseline cost remains in Development Estimate. Existing author remuneration is outside this supplier quote.']];
s.getRange('B22').values=[['Compare the same operational enquiry, not different definitions of MVP.']];
header(24,['Option','Reuse / component strategy','Setup GBP','Annual operating GBP','Three-year GBP','Status','Boundary / licence / exit']);
const options=[['Existing platform','Configure an established platform'],['Adapt current interface','Reuse accepted UI and standard services'],['Bespoke gap only','Build only a demonstrated missing capability']];
for(let i=0;i<3;i++){
 const r=25+i;s.getRange('A'+r+':B'+r).values=[options[i]];
 s.getRange('E'+r).formulas=[['=IF(AND(ISNUMBER(C'+r+'),ISNUMBER(D'+r+')),C'+r+'+3*D'+r+',"")']];
 s.getRange('F'+r).formulas=[['=IF(COUNT(C'+r+':D'+r+')=2,"Compare scope and exclusions","Awaiting quotation")']];
 s.getRange('A'+r+':G'+r).format.rowHeight=68;
}
s.getRange('A25:G27').format.wrapText=true;s.getRange('C25:D27').format.fill='#FFF1CA';s.getRange('C25:D27').format.font.color='#164CB2';s.getRange('G25:G27').format.fill='#FFF1CA';
s.getRange('C25:E27').setNumberFormat('"£"#,##0;("£"#,##0);"—"');
s.getRange('B30').values=[['Setup must include implementation and agreed fees; annual cost must include the named operating boundary.']];
s.getRange('B32').values=[['Unknown licence/API/review costs must be quoted or explicitly excluded, not entered as zero.']];
s.getRange('B34').values=[['Reference: ISRM Architecture Clarification, 29 October 2026, sections 3–7.']];
s.getRange('B36').values=[['Rate and FX source assumptions remain dated 28 October 2026 in Rates and Scope; refresh before agreement.']];
s.freezePanes.freezeRows(6);
wb.recalculate();
assert.equal(s.getRange('C18').values[0][0],640);
assert.equal(estimate.getRange('E33').values[0][0]>19203,true);
assert.equal(s.getRange('F18').values[0][0],'');
// Verify that zero is a valid quoted price and missing information remains missing.
s.getRange('D7:E7').values=[[10,50]];wb.recalculate();assert.equal(s.getRange('F7').values[0][0],500);assert.equal(s.getRange('F18').values[0][0],'');
s.getRange('D7:E7').clear({applyTo:'contents'});wb.recalculate();
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!',options:{useRegex:true,maxResults:20},maxChars:1500})).ndjson);
for(const [sheet,range,file]of[['Development Estimate','C32:E36','estimate-summary.png'],['Rates and Scope','A2:D10','estimate-rates.png'],['Architect Response','A2:G18','architect-response.png']]){
 const blob=await wb.render({sheetName:sheet,range,scale:1.5});await fs.writeFile(out+'/'+file,new Uint8Array(await blob.arrayBuffer()));
}
await(await SpreadsheetFile.exportXlsx(wb)).save(out+'/ISRM_Developer_Estimate_EN.xlsx');
console.log('Estimate updated. Baseline 640 hours retained; supplier totals await complete inputs.');
