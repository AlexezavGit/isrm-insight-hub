import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='/Users/alexzvo/Documents/ChatGPT/isrm/isrm-insight-hub';
const out='/Users/alexzvo/Documents/ChatGPT/isrm/outputs/isrm-pricing-en-20261028';
const tmp='/tmp/isrm-pricing-en';
await fs.mkdir(out,{recursive:true});
const ink='#173342',navy='#143343',gold='#B59B55',cream='#F6F3E9',amber='#FFF1CA';
const gbp='"£"#,##0;("£"#,##0);"—"';
const v=(s,c,x)=>s.getRange(c).values=[[x]];
const f=(s,c,x)=>{s.getRange(c).formulas=[[x]];s.getRange(c).format.font.color=x.includes('!')?'#187343':ink;};
const input=(s,r)=>{s.getRange(r).format.fill=amber;s.getRange(r).format.font.color='#164CB2';};
const cash=(s,r)=>s.getRange(r).setNumberFormat(gbp);
const init=(s,title,widths,end=45)=>{s.showGridLines=false;s.getRange('A1:H'+end).format={font:{name:'Arial',size:10,color:ink},rowHeight:26,verticalAlignment:'center'};widths.forEach((w,i)=>s.getRange(String.fromCharCode(65+i)+':'+String.fromCharCode(65+i)).format.columnWidth=w);v(s,'A2',title);s.getRange('A2').format.font={name:'Arial',size:15,bold:true,color:navy};s.getRange('A3:H3').format.borders={bottom:{style:'thin',color:gold}};};
const header=(s,row,labels)=>{const r=s.getRange('A'+row+':'+String.fromCharCode(64+labels.length)+row);r.values=[labels];r.format={fill:navy,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,verticalAlignment:'center',horizontalAlignment:'center',rowHeight:42};};
const note=(s,row,text)=>{v(s,'A'+row,text);s.getRange('A'+row).format.font={name:'Arial',size:10,color:'#56656C',italic:true};};
const total=(s,row,end='H')=>{s.getRange('A'+row+':'+end+row).format.fill=cream;s.getRange('A'+row+':'+end+row).format.font.bold=true;};
const scopes=[['core','Core application'],['engagement','Engagement and acquisition'],['expertise','Expertise into products'],['monitoring','Situational monitoring pilot']];
const wbs=[
 ['C01','core','Technical architecture',64],['C02','core','UX and responsive interface',48],['C03','core','Import, profiles and dossiers',96],['C04','core','Fields, relationships, groups and lists',80],['C05','core','Production graph and search improvements',40],['C06','core','Authorisation, storage and audit',96],['C07','core','Integration of the existing AI OSINT researcher',96],['C08','core','Quality assurance and security verification',80],['C09','core','Deployment and handover',40],
 ['E01','engagement','Audience journeys and membership/client enquiries',64],['E02','engagement','Campaign forms and agreed connectors',64],['E03','engagement','Workflow automation and measurement',48],['E04','engagement','Testing and workflow handover',40],
 ['X01','expertise','Knowledge and evidence registry',80],['X02','expertise','Review, transformation and publication',64],['X03','expertise','Agreed knowledge and learning connectors',64],['X04','expertise','Testing, measurement and handover',48],
 ['M01','monitoring','Pilot scenario, signal schema and access',16],['M02','monitoring','One licensed source connector and cache',32],['M03','monitoring','Topics, regions and expertise links',24],['M04','monitoring','Human review and corrections queue',32],['M05','monitoring','Briefing, source links and version archive',24],['M06','monitoring','Testing, rights checks and pilot handover',32]];
const wb=Workbook.create();
const names=['Comparison','Current Development','Assumptions','Development','Executors','Internal Settlement','OSINT and Operations','Repository Review'];
const sh=Object.fromEntries(names.map(n=>[n,wb.worksheets.add(n)]));
const a=sh.Assumptions;init(a,'ISRM. Rates and planning assumptions',[44,15,22,76,4,75],60);
header(a,4,['Input','Value','Unit','Basis']);
const inputs=[
 ['UA upper developer rate',50,'USD/hour','Strong-senior upper published band, Q3 2026. Not a quotation.'],
 ['UA developer quotation benchmark',40,'USD/hour','Senior median. Mid-level $30/hour is not used for this scope.'],
 ['UK lower developer comparison',55,'GBP/hour','Hourly median, lower than the £525/day median at 8 hours. Not the market minimum.'],
 ['USD exchange rate',45.6008,'UAH/USD','28 Oct 2026, retained from prior model via NBU reproductions.'],
 ['GBP exchange rate',60.7909,'UAH/GBP','28 Oct 2026, retained from prior model. Direct NBU API unavailable.'],
 ['UA upper rate in GBP',null,'GBP/hour','USD rate converted using the same dated FX.'],
 ['UA senior median in GBP',null,'GBP/hour','Developer quotation benchmark.'],
 ['Prior overhead reference',0.30,'share of future development','Reference only. Actual overhead is the full cost of delivery functions.'],
 ['Profit mark-up on full cost',0.15,'share of full delivery cost','New editable planning assumption, before tax. Not an agreed distribution.'],
 ['Desired discount from UK',0.30,'share of UK budget','Target only. Full costs and profit floor take precedence.'],
 ['Hours used to convert a day rate',8,'hours/day','Conversion assumption, not source-defined day length.'],
 ['Client services average',394,'GBP/day','YunoJuno 2026 report, UK discipline average.'],
 ['Marketing and communications average',418,'GBP/day','YunoJuno 2026 report, UK discipline average.'],
 ['Strategy average',518,'GBP/day','YunoJuno 2026 report, UK discipline average.'],
 ['Product management average',521,'GBP/day','YunoJuno 2026 report, UK discipline average.'],
 ['Project management average',406,'GBP/day','Reference only. Product-owner rows use product management.'],
 ['OSINT contractor median',649,'GBP/day','IT Jobs Watch to 28 Oct 2026. 10 day quotes, a median rather than mean.'],
 ['Legal hourly fee reference',3000,'UAH/hour','One Ukrainian law-firm fee. Proxy, not Alex’s agreed fee or a market mean.'],
 ['Initial operating period',3,'months','Operating allowances are provisional, not supplier quotations.'],
 ['Existing-work valuation rate',50,'USD/hour','Provisional payment inside development; not an invoice or agreed fee.']];
a.getRange('A5:D24').values=inputs;f(a,'B10','=IF(AND(ISNUMBER(B5),ISNUMBER(B8),ISNUMBER(B9),B9>0),B5*B8/B9,"n.a.")');f(a,'B11','=IF(AND(ISNUMBER(B6),ISNUMBER(B8),ISNUMBER(B9),B9>0),B6*B8/B9,"n.a.")');input(a,'B5:B9');input(a,'B12:B24');a.getRange('B12:B14').setNumberFormat('0.0%');a.getRange('B10:B11').setNumberFormat('"£"0.00');a.getRange('D5:D24').format.wrapText=true;a.getRange('A5:D24').format.rowHeight=43;
header(a,26,['Workstream','Selected 1/0','Status','Rule']);
scopes.forEach(([id,label],i)=>a.getRange('A'+(27+i)+':D'+(27+i)).values=[[label,i===0?1:0,i===0?'Current planning case':'Potential only','Additional workflows require the core and a separate client decision.']]);
input(a,'B27:B30');a.getRange('B27:B30').dataValidation={rule:{type:'list',values:['0','1']}};a.getRange('D27:D30').format.wrapText=true;a.getRange('A27:D30').format.rowHeight=35;
header(a,33,['Source','Value / coverage','Checked','Limitations']);
const sources=[
 ['Lemon.io Ukraine','$40 senior median; $43–50 strong senior band','28 Oct 2026','Developer pay rates, not client agency prices.','https://lemon.io/rate-calculator/ukraine/'],
 ['IT Jobs Watch Software Developer','£55/hour; £525/day medians','27 Oct 2026 sample','34 hourly and 253 daily quotes, different samples.','https://www.itjobswatch.co.uk/contracts/uk/software%20developer.do'],
 ['YunoJuno 2026 report','UK discipline averages','28 Oct 2026','2024–2025 observations. Directional function values, not agreed Ukrainian fees.','https://www.yunojuno.com/freelancer-rates-report'],
 ['IT Jobs Watch OSINT','£649/day overall UK median','28 Oct 2026 sample','10 day quotes. £730 is excluding London, not the overall median.','https://www.itjobswatch.co.uk/contracts/uk/osint.do'],
 ['Alliance of Justice legal price','UAH 3,000/hour','28 Oct 2026','One provider fee, not a commercial/privacy market average.','https://ajlawfirm.com.ua/price/'],
 ['NBU exchange-rate reference','USD 45.6008; GBP 60.7909','28 Oct 2026','Retained previous-model values via secondary reproductions. Refresh before agreement.','https://bank.gov.ua/en/markets/exchangerates'],
 ['UA retail screening','UAH 750/person','Prior review 28 Oct','Different service depth from UK due diligence.','https://mp-polygraph.com.ua/services/onlajn-skryning-i-profajlyng-kandydativ/'],
 ['Axeten public guidelines','From £250 / £500 per person','Dec 2024 guide','Retail illustration, excluding VAT. Current bulk quote required.','https://www.axeten.com/osint-investigation-price-guidelines']];
sources.forEach((r,i)=>{a.getRange('A'+(34+i)+':D'+(34+i)).values=[r.slice(0,4)];v(a,'F'+(34+i),r[4]);});a.getRange('A34:D41').format.wrapText=true;a.getRange('A34:F41').format.rowHeight=42;
note(a,44,'Function hours, rates and allowances are planning estimates requiring agreement.');note(a,46,'The workbook revises the internal commercial proposal. Published website prices are not changed.');a.freezePanes.freezeRows(4);
const c=sh['Current Development'];init(c,'ISRM. Current demonstration',[60,14,22,23],27);
note(c,4,'Replacement-value estimate for the current application, not all-branch timesheets.');
header(c,6,['Delivered component','Midpoint hours','UA upper value','UK lower value']);
const delivered=[['Graph, relationships, search, dossiers and groups',52],['Shared interface and filing-card design',20],['Six-slide briefing and visual transitions',20],['Scope calculator, Markdown, email and print',32],['Sample preparation and access modes',16],['Responsive design, accessibility and checks',20],['Cloudflare, Git synchronisation and deployment',12]];
c.getRange('A7:B13').values=delivered;
for(let r=7;r<=13;r++){f(c,'C'+r,'=B'+r+"*'Assumptions'!$B$24*'Assumptions'!$B$8/'Assumptions'!$B$9");f(c,'D'+r,'=B'+r+"*'Assumptions'!$B$7");}
v(c,'A15','Current demonstration total');for(const col of ['B','C','D'])f(c,col+'15','=SUM('+col+'7:'+col+'13)');input(c,'B7:B13');cash(c,'C7:D15');total(c,15,'D');c.getRange('A7:A13').format.wrapText=true;c.getRange('A7:D13').format.rowHeight=35;
note(c,18,'172 hours is the midpoint of the earlier 132–212-hour estimate, not the whole month’s effort.');
note(c,20,'This provisional payment is funded inside Development, not again in Internal Settlement.');
note(c,22,'Replacement hours are not automatically production-ready reuse. Developers must accept reuse credit.');
note(c,24,'Other historical deliverables are inventoried in Repository Review and are not separately priced here.');
const d=sh.Development;init(d,'ISRM. Development allocation',[10,15,54,13,16,14,21,22],49);
header(d,6,['ID','Workstream','Future work package','Planned hours','Accepted reuse','Future hours','UA upper cost','UA median cost']);
d.getRange('A7:D29').values=wbs;wbs.forEach((x,i)=>{const r=i+7;v(d,'E'+r,0);f(d,'F'+r,'=D'+r+'-E'+r);f(d,'G'+r,'=F'+r+"*'Assumptions'!$B$10");f(d,'H'+r,'=F'+r+"*'Assumptions'!$B$11");});
input(d,'D7:E29');for(let row=7;row<=29;row++)d.dataValidations.add({range:'E'+row,rule:{type:'whole',operator:'between',formula1:0,formula2:'D'+row}});cash(d,'G7:H29');d.getRange('C7:C29').format.wrapText=true;d.getRange('A7:H29').format.rowHeight=34;
d.getRange('C32:D32').values=[['Core development cash bridge','GBP']];d.getRange('C32:D32').format={fill:navy,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:42,wrapText:true};
const bridge=[[33,'Future development allocation at UA upper','=SUM(G7:G15)'],[34,'Existing-work payment within development',"='Current Development'!C15"],[35,'Total development allocation','=SUM(B33:B34)'],[36,'Less: existing-work payment','=B34'],[37,'Balance for future development','=B35-B36'],[38,'Future cost at UA senior median','=SUM(H7:H15)'],[39,'Headroom before developer quotation','=B37-B38']];
bridge.forEach(([r,label,formula])=>{v(d,'C'+r,label);f(d,'D'+r,formula.replace(/B(\d+)/g,'D$1'));});cash(d,'D33:D39');d.getRange('C35:D35').format.font.bold=true;d.getRange('C37:D37').format.font.bold=true;
note(d,42,'The earlier 640-hour schedule is future production work before a reuse audit. Existing-work remuneration is now funded explicitly.');
note(d,44,'The total development allocation is increased to fund both parts. Existing payment is deducted once from that allocation.');
note(d,46,'No automatic 172-hour reuse deduction is made. Accepted credit reduces the future schedule and its cost.');
note(d,48,'Core includes 96 hours of OSINT integration. Running 11,000 investigations is separate.');d.freezePanes.freezeRows(6);
const e=sh.Executors;init(e,'ISRM. Delivery functions and overhead',[16,43,17,12,19,22,20],43);
header(e,6,['Workstream','Function','Proposed executor','Hours','Benchmark £/hour','Function fee £','Share of overhead']);
const funcs=[
 ['core','Client liaison and approvals','Alex',40,16],['core','Contract, privacy and rights','Alex',16,'legal'],['core','OSINT protocol and test sample','Dmytro',48,21],['core','Strategy and product definition','Oleksii',40,18],['core','Product ownership and acceptance','Oleksii',56,19],
 ['engagement','Client decisions and approvals','Alex',16,16],['engagement','Communication rights and terms','Alex',12,'legal'],['engagement','Campaign, content and follow-up','Dmytro',128,17],['engagement','OSINT audience segmentation','Dmytro',24,21],['engagement','Acquisition product strategy','Oleksii',40,18],['engagement','Product ownership and acceptance','Oleksii',32,19],
 ['expertise','Authorship and reuse rights','Alex',16,'legal'],['expertise','Audience needs and distribution','Dmytro',40,17],['expertise','Evidence and review protocol','Dmytro',48,21],['expertise','Expertise-product strategy','Oleksii',40,18],['expertise','Product ownership and acceptance','Oleksii',40,19],
 ['monitoring','Source licensing and pilot terms','Alex',12,'legal'],['monitoring','Sources, signals and review protocol','Dmytro',48,21],['monitoring','Pilot editorial process','Dmytro',16,17],['monitoring','Pilot use case and strategy','Oleksii',24,18],['monitoring','Product ownership and acceptance','Oleksii',24,19]];
e.getRange('A7:D27').values=funcs.map(x=>x.slice(0,4));
funcs.forEach((x,i)=>{const r=i+7;f(e,'E'+r,x[4]==='legal'?"='Assumptions'!$B$22/'Assumptions'!$B$9":"='Assumptions'!$B$"+x[4]+"/'Assumptions'!$B$15");f(e,'F'+r,'=D'+r+'*E'+r);f(e,'G'+r,'=F'+r+'/SUMIFS($F$7:$F$27,$A$7:$A$27,A'+r+')');});
input(e,'C7:D27');cash(e,'F7:F27');e.getRange('E7:E27').setNumberFormat('"£"0.00');e.getRange('G7:G27').setNumberFormat('0.0%');e.getRange('B7:C27').format.wrapText=true;e.getRange('A7:G27').format.rowHeight=36;
e.getRange('B30:E30').values=[['Workstream','Function overhead GBP','Prior 30% allowance','Required overhead rate']];e.getRange('B30:E30').format={fill:navy,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:42};
scopes.forEach(([id,label],i)=>{const r=31+i;v(e,'B'+r,label);f(e,'C'+r,'=SUMIFS($F$7:$F$27,$A$7:$A$27,"'+id+'")');f(e,'D'+r,"=SUMIFS('Development'!$G$7:$G$29,'Development'!$B$7:$B$29,\""+id+"\")*'Assumptions'!$B$12");f(e,'E'+r,'=C'+r+"/SUMIFS('Development'!$G$7:$G$29,'Development'!$B$7:$B$29,\""+id+'")');});cash(e,'C31:D34');e.getRange('E31:E34').setNumberFormat('0.0%');
note(e,37,'Overhead is the full estimated value of these functions. It is not capped at 30% or added a second time.');
note(e,39,'Fees follow the function. Replace the proposed executor if another provider undertakes the work.');
note(e,41,'UK averages, an OSINT median and a legal-provider fee are explicit proxies, not negotiated personal remuneration.');e.freezePanes.freezeRows(6);
const o=sh['OSINT and Operations'];init(o,'ISRM. Direct operating allowances',[18,52,14,20,22,28],39);
header(o,6,['Workstream','Item','Quantity','GBP/unit','Allowance GBP','Basis']);
const ops=[['core','Hosting and storage',3,50],['core','AI/API use',3,100],['core','Licensed research sources',3,120],['core','Email and communications',3,20],['engagement','Creative, production and translation',1,1000],['engagement','Campaign media allowance',1,1500],['expertise','External editing and peer review',1,1200],['expertise','Knowledge / learning licences',3,100],['monitoring','Licensed monitoring source',3,200],['monitoring','Additional hosting and API use',3,50]];
ops.forEach((x,i)=>{const r=i+7;o.getRange('A'+r+':D'+r).values=[x];f(o,'E'+r,'=C'+r+'*D'+r);v(o,'F'+r,'Planning allowance, not a quotation');});
input(o,'D7:D16');input(o,'C11:C13');for(const row of [7,8,9,10,14,15,16])f(o,'C'+row,"='Assumptions'!$B$23");cash(o,'D7:E16');o.getRange('B7:F16').format.wrapText=true;o.getRange('A7:F16').format.rowHeight=36;
note(o,19,'Three-month starting allowances. Unlimited usage, ongoing reviews and 11,000 investigations are not included.');
header(o,22,['Retail illustration','People','Price/person','Currency','Arithmetic GBP']);
o.getRange('A23:D25').values=[['UA basic screening',11000,750,'UAH'],['UK links analysis from',11000,250,'GBP'],['UK due diligence from',11000,500,'GBP']];f(o,'E23',"=B23*C23/'Assumptions'!B9");f(o,'E24','=B24*C24');f(o,'E25','=B25*C25');cash(o,'E23:E25');
note(o,28,'Different depth and services. Retail multiplication is neither a bulk quotation nor proven platform savings.');
note(o,30,'Contribution and executor income are before tax. Fees, rights, licence terms and tax treatment require agreement.');
const s=sh.Comparison;init(s,'ISRM. Funded budget and UK comparison',[35,13,23,23,23,24,23,18],43);s.tabColor=navy;
note(s,4,'Same scope and function fees on both sides. UA future development $50/hour; UK £55/hour. Existing payment is shared.');
header(s,6,['Workstream','Future hours','UA development GBP','Functions and direct costs','Full UA cost GBP','Modelled UK budget','Proposed budget GBP','Below / (above) UK']);
scopes.forEach(([id,label],i)=>{const r=i+7;v(s,'A'+r,label);f(s,'B'+r,"=SUMIFS('Development'!$F$7:$F$29,'Development'!$B$7:$B$29,\""+id+'")');f(s,'C'+r,"=SUMIFS('Development'!$G$7:$G$29,'Development'!$B$7:$B$29,\""+id+'")'+(id==='core'?"+'Current Development'!C15":''));f(s,'D'+r,"=SUMIFS('Executors'!$F$7:$F$27,'Executors'!$A$7:$A$27,\""+id+"\")+SUMIFS('OSINT and Operations'!$E$7:$E$16,'OSINT and Operations'!$A$7:$A$16,\""+id+'")');f(s,'E'+r,'=SUM(C'+r+':D'+r+')');f(s,'F'+r,'=B'+r+"*'Assumptions'!$B$7+D"+r+(id==='core'?"+'Current Development'!C15":''));f(s,'G'+r,'=ROUNDUP(MAX(F'+r+"*(1-'Assumptions'!$B$14),E"+r+"*(1+'Assumptions'!$B$13)),0)");f(s,'H'+r,'=1-G'+r+'/F'+r);});
v(s,'A12','Core and all optional workflows');for(const col of ['B','C','D','E','F','G'])f(s,col+'12','=SUM('+col+'7:'+col+'10)');f(s,'H12','=1-G12/F12');cash(s,'C7:G12');s.getRange('H7:H12').setNumberFormat('0.0%;(0.0%);"—"');total(s,12);s.getRange('A7:H12').format.rowHeight=36;
header(s,15,['Workstream','30% discount target','Cost plus profit floor','Proposed revenue','Contribution before tax','Actual cost mark-up']);
scopes.forEach(([id,label],i)=>{const r=16+i,b=7+i;v(s,'A'+r,label);f(s,'B'+r,'=F'+b+"*(1-'Assumptions'!$B$14)");f(s,'C'+r,'=E'+b+"*(1+'Assumptions'!$B$13)");f(s,'D'+r,'=G'+b);f(s,'E'+r,'=D'+r+'-E'+b);f(s,'F'+r,'=E'+r+'/E'+b);});cash(s,'B16:E19');s.getRange('F16:F19').setNumberFormat('0.0%');s.getRange('A16:F19').format.rowHeight=36;
note(s,22,'The 30% discount is a target, not a cost cap. Proposed revenue funds all functions, allowances and the profit floor.');
note(s,24,'Actual UK position is calculated from the funded price. A negative percentage means above the modelled UK budget.');
header(s,27,['Selected case','GBP']);
for(const [r,label,col]of [[28,'Proposed revenue','G'],[29,'Full delivery cost','E']]){v(s,'A'+r,label);f(s,'B'+r,'='+scopes.map((_,i)=>col+(7+i)+"*'Assumptions'!B"+(27+i)).join('+'));}
v(s,'A30','Contribution before tax');f(s,'B30','=B28-B29');cash(s,'B28:B30');total(s,30,'B');
note(s,33,'Modelled UK costs are not agency quotations. Function proxies are the same on both sides for consistent scope.');
note(s,35,'Current-work payment is already in the core development column. Do not subtract it from contribution again.');
note(s,37,'Commercial amounts are for agreement. Published website prices are unchanged pending a decision.');
const z=sh['Internal Settlement'];init(z,'ISRM. Internal remuneration and workflow potential',[18,23,24,23,24,25],35);
note(z,4,'Function fees plus potential profit. Existing-development payment is handled exclusively in Development.');
header(z,6,['Executor','Core function fees','Potential workflow fees','Core profit share','Workflow profit share','Total potential income']);
['Alex','Dmytro','Oleksii'].forEach((name,i)=>{const r=i+7;v(z,'A'+r,name);f(z,'B'+r,'=SUMIFS(\'Executors\'!$F$7:$F$27,\'Executors\'!$C$7:$C$27,A'+r+',\'Executors\'!$A$7:$A$27,"core")');f(z,'C'+r,"=SUMIFS('Executors'!$F$7:$F$27,'Executors'!$C$7:$C$27,A"+r+')-B'+r);f(z,'D'+r,"=MAX(0,'Comparison'!E16)/3");f(z,'E'+r,"=(MAX(0,'Comparison'!E17)+MAX(0,'Comparison'!E18)+MAX(0,'Comparison'!E19))/3");f(z,'F'+r,'=SUM(B'+r+':E'+r+')');});cash(z,'B7:F9');v(z,'A11','Total');for(const col of ['B','C','D','E','F'])f(z,col+'11','=SUM('+col+'7:'+col+'9)');cash(z,'B11:F11');total(z,11,'F');
header(z,14,['Workstream','Potential revenue','Function fees','Delivery cost','Contribution']);
scopes.forEach(([id,label],i)=>{const r=i+15;v(z,'A'+r,label);f(z,'B'+r,"='Comparison'!G"+(7+i));f(z,'C'+r,"=SUMIFS('Executors'!$F$7:$F$27,'Executors'!$A$7:$A$27,\""+id+'")');f(z,'D'+r,"='Comparison'!E"+(7+i));f(z,'E'+r,"='Comparison'!E"+(16+i));});cash(z,'B15:E18');
note(z,21,'Workflow potential assumes all three options are commissioned. It is not contracted revenue.');
note(z,23,'Equal thirds apply only to positive contribution after delivery costs. The split remains a commercial assumption.');
note(z,25,'Function remuneration is benchmark-valued and provisional. Changing the executor moves the associated fee.');
note(z,27,'Amounts are before tax. Final fees, invoices, collection dates and profit rights require agreement.');
const ar=sh['Repository Review'];init(ar,'ISRM. Repository coverage of the current-work estimate',[47,24,27,59],32);
header(ar,6,['Work identified','Treatment','Hours charged here','Reason']);
ar.getRange('A7:D12').values=[
 ['Present published demonstration','Current Development',172,'Seven result groups. Replacement value, not a measured month of effort.'],
 ['Legacy member cabinet and workflow prototypes','Retained / adapted','Not separately priced','Substantial code remains in current source; do not charge shared code twice.'],
 ['Historical proposals, scope and service catalogues','Superseded / reused','Not separately priced','Earlier components are variants or partly reused outputs.'],
 ['Partner proposal and finance prototypes','Separate internal prototype','Not separately priced','Present in source, but not an accepted client production service.'],
 ['OAuth/login experiments and redirects','Historical / retired','Not separately priced','A branch does not prove completed production authentication.'],
 ['UI boilerplate and snapshots','Excluded from hour inference','No added charge','Line counts, commits and calendar dates are not timesheets.']];
ar.getRange('A7:D12').format.wrapText=true;ar.getRange('A7:D12').format.rowHeight=58;
const branches=JSON.parse(await fs.readFile(root+'/docs/partner-review/git-branch-audit-20261028.json','utf8'));
v(ar,'A15','References compared');v(ar,'B15',branches.length);v(ar,'A16','Distinct branch heads');v(ar,'B16',new Set(branches.map(x=>x.sha)).size);v(ar,'A17','Dates with source changes, all branches');v(ar,'B17',19);
note(ar,20,'Source histories cover 22 Sep to 28 Oct 2026. The current 172 hours are not an all-branch retrospective valuation.');
note(ar,22,'Refreshed branch trees were compared on 28 Oct. Other outputs require separate acceptance and estimation.');
const dev=Workbook.create(),q=dev.worksheets.add('Development Estimate'),r=dev.worksheets.add('Rates and Scope');
init(r,'ISRM. Developer quotation assumptions',[46,19,24,75],27);header(r,4,['Input','Value','Unit','Basis']);
r.getRange('A5:D10').values=[['Senior developer median',40,'USD/hour','Lemon.io Ukraine Q3 2026. Developer rate, not client agency price.'],['USD exchange rate',45.6008,'UAH/USD','28 Oct 2026 retained reference. Refresh at agreement.'],['GBP exchange rate',60.7909,'UAH/GBP','28 Oct 2026 retained reference. Refresh at agreement.'],['Converted benchmark',null,'GBP/hour','USD rate converted using the same dated FX.'],['Current demonstration replacement estimate',172,'hours','Not accepted production completion, reuse credit or a timesheet.'],['Source benchmark','Q3 2026','reference','https://lemon.io/rate-calculator/ukraine/']];
f(r,'B8','=B5*B6/B7');input(r,'B5:B7');r.getRange('B8').setNumberFormat('"£"0.00');r.getRange('D5:D10').format.wrapText=true;r.getRange('A5:D10').format.rowHeight=43;
note(r,13,'Core includes 96 hours for integration of the existing AI OSINT researcher. Investigation usage is separate.');
note(r,15,'Accepted reuse starts at zero. Inspect the repository and propose credits against future work packages.');
note(r,17,'No internal settlement, client margin or confidential executor remuneration is included.');
note(r,19,'Please return quoted hours, rate, deliverables, reuse, calendar duration, dependencies and exclusions.');
note(r,21,'Optional workflows require a separate instruction. This workbook is a quotation request, not an order.');
init(q,'ISRM. Development estimate for supplier review',[10,16,56,14,16,15,20,23],43);
header(q,6,['ID','Workstream','Future work package','Planned hours','Accepted reuse','Future hours','Median GBP/hour','Reference cost GBP']);q.getRange('A7:D29').values=wbs;
wbs.forEach((x,i)=>{const row=i+7;v(q,'E'+row,0);f(q,'F'+row,'=D'+row+'-E'+row);f(q,'G'+row,"='Rates and Scope'!$B$8");f(q,'H'+row,'=F'+row+'*G'+row);});
input(q,'D7:E29');for(let row=7;row<=29;row++)q.dataValidations.add({range:'E'+row,rule:{type:'whole',operator:'between',formula1:0,formula2:'D'+row}});cash(q,'H7:H29');q.getRange('G7:G29').setNumberFormat('"£"0.00');q.getRange('C7:C29').format.wrapText=true;q.getRange('A7:H29').format.rowHeight=34;
q.getRange('C32:E32').values=[['Estimate summary','Hours','Reference GBP']];q.getRange('C32:E32').format={fill:navy,font:{name:'Arial',size:10,bold:true,color:'#FFFFFF'},rowHeight:42};scopes.forEach(([id,label],i)=>{const row=i+33;v(q,'C'+row,label);f(q,'D'+row,'=SUMIFS($F$7:$F$29,$B$7:$B$29,"'+id+'")');f(q,'E'+row,'=SUMIFS($H$7:$H$29,$B$7:$B$29,"'+id+'")');});cash(q,'E33:E36');q.getRange('C33:E33').format.font.bold=true;
note(q,39,'Labour only, before VAT, platform fees, hosting, licences and non-developer functions.');
note(q,41,'Planned hours are estimates for confirmation. Existing-work remuneration is outside the new developer quotation.');q.freezePanes.freezeRows(6);
for(const range of ['B7:H12','B16:F19','B28:B30'])s.getRange(range).format.font.color=ink;
for(const range of ['B7:F11','B15:E18'])z.getRange(range).format.font.color=ink;
c.getRange('C7:D15').format.font.color=ink;
wb.recalculate();dev.recalculate();
const n=(sheet,cell)=>sheet.getRange(cell).values[0][0];
assert.equal(n(c,'B15'),172);assert.equal(n(s,'B7'),640);
assert(n(s,'G7')>=n(s,'E7')*1.15);assert(n(s,'G7')>n(s,'F7')*.7);
assert(Math.abs(n(d,'D35')-n(d,'D36')-n(d,'D37'))<.001);
assert(Math.abs(n(q,'E33')-640*40*45.6008/60.7909)<.001);
const before=n(q,'E33');v(q,'E7',8);dev.recalculate();assert(n(q,'E33')<before);v(q,'E7',0);
const old=n(d,'D35');v(c,'B7',53);wb.recalculate();assert(n(d,'D35')>old);v(c,'B7',52);
const fee=n(z,'B7');v(e,'C7','Dmytro');wb.recalculate();assert(n(z,'B7')<fee);v(e,'C7','Alex');
const oldProfit=n(s,'E16');v(a,'B23',4);wb.recalculate();assert(n(s,'E7')>44215.6843);v(a,'B23',3);
const revenue=n(s,'B28');v(a,'B28',1);wb.recalculate();assert(n(s,'B28')>revenue);v(a,'B28',0);
wb.recalculate();dev.recalculate();
for(const [book,prefix]of [[wb,'internal'],[dev,'developer']]){
 const errors=await book.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:20},maxChars:2000});console.log(errors.ndjson);
 const views=prefix==='internal'?names.map(name=>[name,name==='Comparison'?'A1:H37':name==='Assumptions'?'A1:D30':name==='Development'?'A1:H39':name==='Executors'?'A1:G34':name==='Current Development'?'A1:D24':name==='Repository Review'?'A1:D22':name==='Internal Settlement'?'A1:F27':'A1:F30']):[['Development Estimate','A1:H36'],['Rates and Scope','A1:D21']];
 for(const [name,range]of views){const image=await book.render({sheetName:name,range,scale:1.1,format:'png'});await fs.writeFile(tmp+'/'+prefix+'-'+name.replaceAll(' ','-')+'.png',new Uint8Array(await image.arrayBuffer()));}
 await(await SpreadsheetFile.exportXlsx(book)).save(out+'/'+(prefix==='internal'?'ISRM_Partner_Pricing_Review.xlsx':'ISRM_Developer_Estimate_EN.xlsx'));
}
const results={currentHours:n(c,'B15'),existingWorkValue:n(c,'C15'),coreFutureHours:n(s,'B7'),coreDevelopmentAllocation:n(d,'D35'),remainingDevelopmentAllocation:n(d,'D37'),coreFullCost:n(s,'E7'),coreUKBudget:n(s,'F7'),coreProposedBudget:n(s,'G7'),coreDiscount:n(s,'H7'),coreProfit:n(s,'E16'),developerMedianCost:n(q,'E33'),workflowBudgets:[n(s,'G8'),n(s,'G9'),n(s,'G10')],workflowProfits:[n(s,'E17'),n(s,'E18'),n(s,'E19')]};
await fs.writeFile(out+'/verification.json',JSON.stringify(results,null,2)+'\n');await fs.writeFile(tmp+'/developer-data.json',JSON.stringify({wbs,scopes,results},null,2));console.log(JSON.stringify(results));
