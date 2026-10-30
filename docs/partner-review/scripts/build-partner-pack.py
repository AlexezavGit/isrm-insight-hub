"""Private, print-ready partner pack. Does not alter the financial workbook."""
from pathlib import Path
from collections import Counter
import json, math, sys
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Flowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4

ROOT=Path(__file__).resolve().parents[3]
FIN=json.loads((ROOT/'docs/partner-review/ISRM_Partner_Pack_Finance_20261031.json').read_text())
RAW=json.loads((ROOT/'src/data/experts.json').read_text())
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT.parent/'outputs/isrm-partner-pack-20261031/ISRM_Partner_Discussion_Pack_EN.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
INK=colors.HexColor('#163d49'); GOLD=colors.HexColor('#9d8952'); LINE=colors.HexColor('#bdc9c9'); PALE=colors.HexColor('#f3f0e8')
W,H=A4; USABLE=W-38*mm
styles=getSampleStyleSheet()
for name in ['Normal','BodyText']: styles[name].fontName='Helvetica';styles[name].fontSize=10.5;styles[name].leading=15;styles[name].textColor=INK
styles.add(ParagraphStyle(name='Title2',fontName='Helvetica-Bold',fontSize=24,leading=28,textColor=INK,spaceAfter=12))
styles.add(ParagraphStyle(name='Head',fontName='Helvetica-Bold',fontSize=15,leading=19,textColor=INK,spaceBefore=8,spaceAfter=8))
styles.add(ParagraphStyle(name='Sub',fontName='Helvetica-Bold',fontSize=11.5,leading=15,textColor=INK,spaceBefore=8,spaceAfter=5))
styles.add(ParagraphStyle(name='Small2',fontName='Helvetica',fontSize=8.4,leading=11.5,textColor=INK,spaceAfter=6))
styles.add(ParagraphStyle(name='Cell2',fontName='Helvetica',fontSize=9.2,leading=12.3,textColor=INK))
styles.add(ParagraphStyle(name='CellHead2',fontName='Helvetica-Bold',fontSize=9.2,leading=12.3,textColor=colors.white))
story=[]
def clean(s):
 return str(s).replace('—','-').replace('–','-').replace('‑','-').replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('→',' > ').replace('×',' x ').replace('\u00a0',' ')
def p(s,style='BodyText'):
 return Paragraph(escape(clean(s)),styles[style])
def add(s,style='BodyText'):
 story.append(p(s,style));story.append(Spacer(1,5))
def heading(k,title,lead=None):
 if story:story.append(PageBreak())
 add(k.upper(),'Small2');add(title,'Title2')
 if lead:add(lead)
def sub(s):add(s,'Sub')
def money(x,dp=0):return '£'+format(x,',.'+str(dp)+'f')
def table(headers,rows,widths):
 data=[[p(h,'CellHead2') for h in headers]]+[[p(x,'Cell2') for x in row] for row in rows]
 t=Table(data,colWidths=[USABLE*x for x in widths],repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),INK),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,1),(-1,-1),.4,LINE),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,PALE])]))
 story.append(t);story.append(Spacer(1,9))

class Diagram(Flowable):
 def __init__(self,kind,height=122):Flowable.__init__(self);self.kind=kind;self.width=USABLE;self.height=height
 def draw(self):
  c=self.canv;w=self.width;h=self.height;c.setStrokeColor(LINE);c.setFillColor(INK)
  def text(x,y,s,size=9,bold=False):c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.setFillColor(INK);c.drawCentredString(x,y,clean(s))
  def box(x,y,bw,bh,s):c.setFillColor(PALE);c.setStrokeColor(LINE);c.roundRect(x,y,bw,bh,5,fill=1,stroke=1);text(x+bw/2,y+bh/2-3,s,9,True)
  if self.kind=='flow':
   labels=['Research','Evidence','Selection','Next action'];bw=(w-36)/4
   for i,label in enumerate(labels):
    x=i*(bw+12);box(x,h/2-17,bw,34,label)
    if i<3:c.line(x+bw+2,h/2,x+bw+10,h/2)
   text(w/2,12,'Information has value when it supports an appropriate action.',8)
  elif self.kind=='expertise':
   groups=Counter(r['sector'] for r in RAW); top=groups.most_common(5);other=len(RAW)-sum(n for _,n in top)
   if other:top.append(('Other recorded sectors',other))
   cx=w/2;cy=h/2+4
   for i,(label,n) in enumerate(top):
    a=i/len(top)*math.pi*2; x=cx+math.cos(a)*w*.33;y=cy+math.sin(a)*h*.33;c.setStrokeColor(LINE);c.line(cx,cy,x,y);c.setFillColor(GOLD);c.circle(x,y,5+math.sqrt(n)*.5,fill=1,stroke=0)
    short=label if len(label)<29 else label[:27]+'...';text(x,y-17,short,7.8);text(x,y+16,str(n),8.5,True)
   c.setFillColor(PALE);c.circle(cx,cy,24,fill=1,stroke=0);text(cx,cy+2,'178',13,True);text(cx,cy-11,'records',8)
  elif self.kind=='services':
   labels=['Search','Working lists','Research','Review','Evidence','Introductions','Integrations'];cx=w/2;cy=h/2
   pts=[]
   for i,label in enumerate(labels):
    a=i/len(labels)*math.pi*2-math.pi/2;x=cx+math.cos(a)*w*.32;y=cy+math.sin(a)*h*.31;pts.append((x,y));c.setStrokeColor(LINE);c.line(cx,cy,x,y)
   c.setStrokeColor(GOLD)
   for a,b in zip(pts,pts[1:]):c.line(a[0],a[1],b[0],b[1])
   for (x,y),label in zip(pts,labels):box(x-42,y-12,84,25,label)
   c.setFillColor(colors.white);c.circle(cx,cy,31,fill=1,stroke=0);text(cx,cy+8,'People',10,True);text(cx,cy-5,'needs and',8.5);text(cx,cy-17,'opportunities',8.5)
  elif self.kind=='chapters':
   cx=w/2;cy=h/2
   for i in range(35):
    a=i/35*math.pi*2;x=cx+math.cos(a)*w*.34;y=cy+math.sin(a)*h*.37;c.setStrokeColor(LINE);c.line(cx,cy,x,y);c.setFillColor(GOLD);c.circle(x,y,3,fill=1,stroke=0)
   c.setFillColor(colors.white);c.circle(cx,cy,32,fill=1,stroke=0);text(cx,cy+10,'35 chapters',10,True);text(cx,cy-4,'shared rules',8.5);text(cx,cy-17,'local judgement',8.5)
  elif self.kind=='cycle':
   labels=['Learning and connections','Useful interaction','Participation','Belonging and expertise'];cx=w/2;cy=h/2;c.setStrokeColor(GOLD);c.ellipse(cx-w*.33,cy-h*.32,cx+w*.33,cy+h*.32)
   for i,label in enumerate(labels):
    a=i/4*math.pi*2-math.pi/2;x=cx+math.cos(a)*w*.33;y=cy+math.sin(a)*h*.32;box(x-69,y-12,138,24,label)
   c.setFillColor(colors.white);c.circle(cx,cy,29,fill=1,stroke=0);text(cx,cy+4,'Audience needs',9,True);text(cx,cy-10,'and opportunities',8)
  else:
   labels=['Try the tool','Choose support','Agree next step'];bw=(w-24)/3
   for i,label in enumerate(labels):box(i*(bw+12),h/2-18,bw,36,label)

def mini(n,title,question,copy,kind,caption):
 add(f'{n:02d}  {title}','Head');add(question,'Sub');add(copy);story.append(Diagram(kind,136));add(caption,'Small2');story.append(Spacer(1,10))

heading('Private partner discussion | 31 October 2026','Professional communications and network expertise','Discussion material for Alex Frishberg, Dmytro and Oleksii to assess the opportunity and their interest. No approval of rates, budget or delivery commitments is requested at this stage.')
sub('What we propose to ISRM')
add('A project to improve the security and reliability of internal and external professional communications, strengthen connections between colleagues and develop network expertise. The application supports that organisational development alongside policies, responsibilities and incentives.')
add('The graph helps make sense of it. OSINT helps prepare the information. Professional review provides a considered, accountable judgement. Subsequent interaction creates the result.','Sub')
sub('Why this follows from the original enquiry')
add('Research on approximately 11,000 people still leaves an operating task: finding useful expertise, inspecting evidence, forming a shortlist, approaching people appropriately and retaining the outcome. Individual research remains an option; a large delivery of dossiers does not itself create participation, referrals or client mandates.')
sub('For your consideration at this stage')
for s in ['Is this response to the original enquiry useful and commercially interesting?','Which capabilities and possible paid functions would interest you?','What would you wish to clarify before considering participation?']:add('- '+s)
add('All rates, hours, function allocations and income figures are indicative calculation scenarios. They are provided to help you assess whether the opportunity and potential remuneration are of interest. Your rates and the final allocation of work will be agreed when we prepare and jointly confirm the final proposal, not now.','Sub')
add('The existing prototype and preparation are completed work. Their remuneration belongs in the agreed development allocation; it is not charged again as partner profit. Production reuse requires the architect\'s acceptance. No current-development remuneration is itemised in this pack.','Small2')

heading('Presentation explained | 1 of 3','From an enquiry to a usable result')
mini(1,'Asset, not bottleneck','Why suggest this in response to the research enquiry?','Treat the audience as a starting resource. Show how delivered information can be searched, reviewed, selected and used again. No zero-yield claim, conversion forecast or automatic return is assumed.','flow','One enquiry remains the narrative thread; the scale of a contact base is not a revenue forecast.')
mini(2,'Amplifier, not replacement','Will it help the Board and members do useful work?','The supplied sample has 178 records, of which 45 carry the source confirmation flag. Search, dossiers and a local shortlist are demonstrated. Operational AI research and shared authenticated work are not yet connected.','expertise','Actual sector counts from the supplied sample. A source flag does not certify every expertise claim, membership or willingness to participate.')

heading('Presentation explained | 2 of 3','Services first; processes where useful')
mini(3,'Choose support around people','What would an organisation such as ISRM find useful?','Describe services in terms of the member\'s job and outcome. The client can select capabilities and change their composition. Workflow links explain possible combinations, not compulsory packages or recorded service use.','services','Illustrative service architecture. The simplified diagram does not infer that particular members use or want these services.')
mini(4,'Shared rules at scale','How does this support organisational development?','Technology supports interaction; ISRM\'s policies define acceptable evidence, responsibilities and expected results. Chapters provide a plausible place to test this coordination. Contribution and operating capacity must be established.','chapters','35 chapters is the planning context in the brief, not a verified measure of active participation or network value.')

heading('Presentation explained | 3 of 3','A bounded pilot and a clear choice')
mini(5,'Flywheel: a hypothesis to test','What would sustain value after the first search?','Keep audience needs at the centre. Learning, useful interaction, participation and accumulated expertise can form a feedback cycle. Test freshness, willingness to respond, completed next actions and repeat use before expanding.','cycle','The main uncertainty is current information and meaningful participation. Network growth and revenue are not guaranteed.')
mini(6,'Your next step','What is the client being asked to agree?','Try the prototype; continue individual research; tailor a core; consider additional capabilities; or choose a simpler fallback. The selected scope informs a detailed proposal. Feedback is welcome without requiring a purchase.','choice','The four website sections have different jobs: briefing, operational prototype, capability configuration and scope/budget discussion.')

heading('Market alternatives and annual subscriptions','Compare operators, records and total cost')
table(['Product','What the name means','Decision relevance'],[
 ['Glue Up','Membership, events, CRM/email and community operations. Multi-chapter management is in Enterprise.','Avoid rebuilding standard association operations without a demonstrable gap.'],
 ['Affinity','Relationship intelligence: shared-network context and routes to introductions.','Price is per paid user, not automatically per person stored in the directory.'],
 ['Neo4j Bloom','A visual application for exploring data held in the Neo4j graph database.','A graph viewer can be an alternative component; it is not the complete ISRM enquiry/review process.'],
 ['Linkurious','A graph exploration and investigation platform with collaboration and access controls.','Evaluate an existing platform against the same workflow and permission requirements.']
],[.18,.43,.39])
add('Published references checked in the review: Glue Up entry packages US$3,000-US$6,500/year, Advanced US$8,000-US$18,500/year, Enterprise custom. Affinity Essential US$2,000/user/year; higher tiers and enterprise terms differ. These are starting references, not quotations for ISRM.','Small2')
table(['Paid operator seats','Affinity Essential arithmetic / year','Meaning'],[[str(n),'US$'+format(n*2000,','),('Only if all 178 require paid accounts' if n==178 else 'Illustrative seat scenario; not a supplier quote')] for n in [3,10,35,178]],[.2,.35,.45])
add('178 x US$2,000 = US$356,000/year is correct only for 178 paid accounts. A 178-person dataset does not establish that requirement. Confirm operator numbers, seat types, minimums, discounts, privacy requirements and licence scope. Compare three-year setup, subscription, integration, hosting, data/research, support and exit costs in consistent currencies.')

heading('Pilot, demand and promotion','A repeatable job is the route to demand')
sub('Pilot purpose')
add('Test whether network expertise can support a managed process: source, date, digital check, professional judgement, appropriate contact, willingness to contribute and an outcome. Start with an agreed real enquiry, permitted sample, accountable ISRM sponsor and reviewer, baseline and decision date.')
add('The association is a plausible pilot setting because it has chapters, professional activities and potential process owners. Membership alone does not guarantee engagement. People need a useful reason to contribute and a manageable way to keep information current.')
table(['Plausible buyer','Repeated useful job','Evidence needed'],[['Associations and chapter networks','Respond to enquiries and support appropriate introductions','Owner, recurring demand and member benefit'],['Specialist advisory networks','Assemble suitable expertise and record referrals','Confidentiality, recommendation responsibility and contribution incentives'],['Research and cross-sector consortia','Find collaborators for a defined question','Common fields, availability and contribution rights']],[.28,.37,.35])
sub('Three promotion steps')
for s in ['1. Demonstrate one familiar enquiry with ordinary search, evidence and a saved shortlist; use graph exploration as an additional route.','2. Run a bounded paid pilot with baseline and decision criteria. Publish only authorised case material and measured results.','3. Repeat the same job with comparable organisations. Standardise the genuinely reusable core and connectors after evidence; assess a subscription model later.']:add(s)
sub('Why consider bespoke delivery?')
add('The process concerns client and colleague relationships, evidence, sensitive information and the use of network expertise. Those needs justify a careful build/adapt/buy assessment; they do not alone prove custom software is safer or cheaper. Preserve existing systems and price the specific gap. The result should remain useful with or without AI.')
add('ISRM has announced a partnership with The OSINT Group. Ask what it contains and whether its research support could be integrated into this organisational-development approach. No API access, partner commitment or commercial arrangement is presumed.','Small2')

core=FIN['workstreams'][0]
heading('Financial position | internal only','Core: an indicative financial scenario')
table(['Core planning item','GBP','Treatment'],[['Illustrative client revenue',money(core['revenue']),'A calculation scenario, not an agreed price or contracted income'],['Development allocation',money(core['development'],2),'Includes existing-work recognition and future development; no double charge'],['Paid delivery functions',money(sum(x['fee'] for x in FIN['functions'] if x['stream']=='core'),2),'Indicative fees for whoever performs the function'],['Initial operating allowances',money(FIN['coreOperatingAllowance'],2),'Provisional, separately monitored'],['Full estimated delivery cost',money(core['cost'],2),'Development + functions + allowances'],['Contribution before tax',money(core['contribution'],2),'Provisional revenue less full delivery cost']],[.38,.2,.42])
add('Model rule: the working price is the greater of the desired discount target and full estimated cost plus a 15% cost mark-up, rounded up. The 15% is an editable planning assumption, not an agreed profit right. All amounts are before tax; timing, tax treatment, collection and actual cost remain to be agreed.')
sub('What will be agreed when finalising the proposal')
add('The website retains an earlier core planning reference of £33,600-£34,944. The internal full-cost scenario is '+money(core['cost'],2)+' with illustrative revenue of '+money(core['revenue'])+'. At this stage, these figures show the opportunity and its cost structure. Scope, reuse, executors, their rates and the final client price will be reconciled together when preparing the final proposal. No decision on these figures is requested now.')
add('The modelled UK same-scope budget is £55,411.67; the illustrative revenue is approximately 8.23% below that model, not 30%. This is a model comparison, not a UK agency quotation. No published price has been changed by this document.','Small2')
sub('What is excluded from a margin promise')
add('Paid source/research volumes beyond allowances, ongoing operational review, provider quotations, taxes and unforeseen changes are not automatically funded by the contribution. No separate referral commission is assumed. Any referral or additional delivery fee needs its own agreement and must not be counted twice.')

heading('Paid functions and potential income','Indicative fees for the functions performed')
table(['Proposed executor','Core work','Hours','Function fee'],[
 ['Alex / appointed provider','Client liaison and approvals; contract, privacy and rights','40 + 16',money(FIN['people'][0]['coreFees'],2)],
 ['Dmytro / appointed provider','OSINT protocol and test sample','48',money(FIN['people'][1]['coreFees'],2)],
 ['Oleksii / appointed provider','Strategy/product definition; ownership and acceptance','40 + 56',money(FIN['people'][2]['coreFees'],2)]
],[.23,.4,.13,.24])
add('A function could be performed by an interested partner or an appropriately qualified provider. The allocations below are scenarios, not appointments. Your rates and allocation of work will be agreed when finalising the proposal; no approval is needed now.')
sub('How the retained function rates were calculated')
add('Client services: £394/day / 8 = £49.25/hour. Communications: £418/day / 8 = £52.25/hour. Strategy: £518/day / 8 = £64.75/hour. Product management: £521/day / 8 = £65.125/hour. These are UK discipline averages, not lower-market rates. OSINT: £649/day / 8 = £81.125/hour, a median. Legal: UAH3,000/hour / 60.7909 UAH/GBP = approximately £49.35/hour, a Ukrainian provider proxy. These dated model inputs are not agreed personal rates.','Small2')
sub('Illustrative core income if the named partners perform the work')
table(['Person','Function fee','Profit share','Core total'],[[x['name'],money(x['coreFees'],2),money(x['coreProfit'],2),money(x['coreIncome'],2)] for x in FIN['people']],[.22,.26,.26,.26])
add('Equal thirds apply only to positive contribution after delivery costs, if agreed. Function fees are already costs; profit is not gross revenue. Actual overruns or a lower agreed client price reduce contribution. Minor displayed rounding may affect a penny. Existing-development remuneration is handled only within development and is not included in this table.','Small2')

heading('Optional work | no current client commitment','Further paid work and income potential')
table(['Additional direction','Revenue','Full cost','Contribution'],[[x['name'],money(x['revenue']),money(x['cost'],2),money(x['contribution'],2)] for x in FIN['workstreams'][1:]],[.36,.2,.23,.21])
add('All three optional directions together: revenue £73,085; estimated contribution £9,534.06. Core plus all three: revenue £123,934; full estimated delivery cost £107,766.63; contribution £16,167.37. These are conditional scenarios, not contracted revenue.')
sub('If all three additional directions are commissioned')
table(['Person','Additional function fees','Additional profit share','Core + all optional income'],[[x['name'],money(x['optionalFees'],2),money(x['optionalProfit'],2),money(x['potentialTotal'],2)] for x in FIN['people']],[.18,.28,.26,.28])
sub('Work that can be performed or procured')
add('Alex / legal-client function: client decisions, communication terms, authorship/reuse rights and source licences. Dmytro / research-communications function: audience segmentation, campaign/content/follow-up, evidence protocols and monitoring editorial work. Oleksii / strategy-product function: acquisition or expertise-product strategy, use-case definition, product ownership and acceptance.')
add('The fee moves with the work. Campaign/media budgets, researcher usage and ongoing services must be defined separately where the present allowance does not cover them. No referral rate or automatic downstream commission has been added. Distribution assumes all fees and invoices are collected and all modelled costs are met.','Small2')

heading('Simplified TRD | core','A bounded operational release to quote')
add('Operational user path: agreed input > search/filter > inspect source/status > retain a working shortlist > request scoped research > professional review > permitted export/next action. The graph is a supplementary exploration interface, not a requirement to use a graph database. The capability configurator is a separate proposal-shaping tool.')
table(['Package','Indicative hours','Development allocation'],[[x['description'],str(x['hours']),money(x['cost'])] for x in FIN['technicalPackages'] if x['stream']=='core']+[['Future core development total','640',money(FIN['coreFutureDevelopment'],2)]],[.6,.16,.24])
add('These are development-only planning allocations before accepted reuse, not client section prices, hours caps or a supplier quotation. They exclude the separate paid delivery functions and operating allowances shown earlier. Rounded rows may not add exactly to the precise total. Detailed rate benchmarks remain in the workbook, not this TRD.','Small2')
sub('Minimum acceptance definition to agree')
add('On an authorised sample, find relevant profiles, inspect evidence and statuses, keep a named selection while continuing the search, and export only permitted fields. Demonstrate access boundaries, correction and review trail, the named researcher adapter, backup/restore and handover where included. Define volume, concurrency and response targets before committing to performance.')

heading('Simplified TRD | dependencies','Connect what completes the agreed job')
table(['Possible connection','Boundary to agree'],[['CSV / XLSX / JSON import','Owner, permitted fields, duplicate handling, provenance and refresh'],['Existing AI OSINT researcher','Server-side request/status/results contract, sources, costs, limitations and human review'],['ISRM membership / CRM','Actual product, API, authentication, fields, direction and test environment'],['Communications / learning / knowledge resources','Actual provider, rights, audience, distribution and operational owner'],['World Monitor or another signal source','Optional named source/topic, permitted feed, review and briefing audience']],[.4,.6])
table(['Optional technical direction','Hours','Development allocation'],[[x['name'],str(x['hours']),money(sum(p['cost'] for p in FIN['technicalPackages'] if p['stream']==stream),2)] for x,stream in zip(FIN['workstreams'][1:],['engagement','expertise','monitoring'])],[.58,.16,.26])
add('These technical subtotals are components of, not additions to, the optional commercial budgets. No unrestricted LinkedIn extraction, paid-data entitlement, model training, native mobile application or unlimited monitoring is implied. A connector logo is not a confirmed integration. Data sensitivity is a control requirement across both the core and connectors.','Small2')

heading('Architect addendum','Return a comparable, evidence-based quotation')
for title,copy in [
 ('Build, adapt or buy','Compare configuration of an existing product, adaptation of the accepted interface and bespoke gaps against the same operational enquiry. Include three-year ownership costs and exit. A graph viewer does not by itself supply ISRM\'s operating process.'),
 ('Reuse and remaining work','Identify what can be reused, adapted or must be replaced, with reason and remaining hours by work package. Existing-work remuneration is not an automatic production credit. Do not duplicate shared code, OSINT adapter work or QA.'),
 ('Data and process ownership','Name who authorises use, maintains records, reviews findings, corrects errors and handles access/retention. Establish participation incentives. Source confirmation, AI findings, recommendations and compliance decisions need distinct states.'),
 ('Scope and budget control','Return included capabilities, data volumes, actual connectors, assumptions, exclusions and pricing basis. Assess changes before approval; distinguish defects from new requirements. Agree escalation and treatment of dependent work awaiting a decision.'),
 ('Acceptance, warranty and support','Agree evidence, reviewers, review period and acceptance record per delivery stage. Keep acceptance separate from any later warranty. Quote support hours, severity and response/restoration targets rather than assuming free round-the-clock cover.'),
 ('Commercial handover','State team availability, dependencies, calendar, licences, usage charges, tax treatment, code/licence rights, documentation and maintenance. No universal 30-day warranty or 320-hour cap is prescribed here.')]:sub(title);add(copy)
add('The three core delivery/payment stages remain: specification and agreement 30%; initial deployment/integration 50%; refinement and handover 20%, subject to agreement. Optional workstreams require their own scope and decision. A website selection is not a signed commission.','Small2')

heading('Sources and evidence','What supports this discussion pack')
add('Financial source: ISRM_Partner_Pricing_Review.xlsx, Library version 2, 28 October 2026. Comparison, Executors, Internal Settlement, Development and Assumptions were read and key totals independently reconciled. This pack does not modify the workbook. Inputs remain dated planning assumptions, not fresh supplier quotes.')
for title,url in [
 ('Affinity public pricing - per user/year','https://www.affinity.co/product/affinity-pricing'),
 ('Glue Up public pricing - annual packages and Enterprise','https://www.glueup.com/pricing'),
 ('Neo4j Bloom overview and components','https://neo4j.com/docs/bloom-user-guide/current/about-bloom/'),
 ('Linkurious product and graph exploration','https://linkurious.com/'),
 ('ISRM announcement of The OSINT Group partnership','https://www.theisrm.org/1-day-osint-virtual-masterclass/'),
 ('UK function rate report retained in the model','https://www.yunojuno.com/freelancer-rates-report'),
 ('OSINT median source retained in the model','https://www.itjobswatch.co.uk/contracts/uk/osint.do'),
 ('Legal provider reference retained in the model','https://ajlawfirm.com.ua/price/'),
 ('Alex Zvolinskiy project record','https://www.linkedin.com/in/alexeyzvolinskiy/details/projects/')]:
 story.append(p(title,'Small2'))
 story.append(Paragraph('<link href="'+escape(url)+'" color="#163d49">'+escape(url)+'</link>',styles['Small2']))
 story.append(Spacer(1,5))
add('Consulting context: the project record supplied for the proposal includes institutional and human-capital development work, including coordination and HR expertise in a CIPE-supported strategic/operational development project for Ukraine\'s Chamber of Commerce and Industry. This is relevant experience, not evidence that ISRM has endorsed or commissioned this project.','Small2')
add('The supplied six-slide and five-limits drafts were used as editorial inputs. Their unsupported yield, revenue multipliers, trained-model claims, security claims, hours caps and warranty/SLA promises were not adopted. Asset framing, human accountability, a testable feedback cycle and explicit scope/change/acceptance arrangements were retained.','Small2')

def page(c,doc):
 c.saveState();c.setStrokeColor(LINE);c.line(19*mm,H-17*mm,W-19*mm,H-17*mm);c.setFont('Helvetica-Bold',8);c.setFillColor(INK);c.drawString(19*mm,H-13*mm,'ISRM | Partner discussion');c.setFont('Helvetica',8);c.drawRightString(W-19*mm,H-13*mm,'31 October 2026 | PRIVATE');c.line(19*mm,16*mm,W-19*mm,16*mm);c.setFont('Helvetica',7.5);c.drawString(19*mm,11*mm,'Indicative planning. Not a client quotation. Amounts before tax.');c.drawRightString(W-19*mm,11*mm,str(doc.page));c.restoreState()
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=19*mm,leftMargin=19*mm,topMargin=23*mm,bottomMargin=23*mm,title='ISRM - Partner Discussion Pack',author='ISRM project working team')
doc.build(story,onFirstPage=page,onLaterPages=page)
print(OUT)
