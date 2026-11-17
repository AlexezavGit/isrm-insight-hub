import json, os, html
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont("ArialISRM", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialISRMBold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
data=json.loads(Path('/tmp/isrm-pricing-en/developer-data.json').read_text())
output=Path('/Users/alexzvo/Documents/ChatGPT/isrm/outputs/isrm-pricing-en-20261028/ISRM_Developer_Brief_EN.pdf')
navy=colors.HexColor('#143343'); gold=colors.HexColor('#B59B55'); ink=colors.HexColor('#173342')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleISRM',fontName='ArialISRMBold',fontSize=23,leading=28,textColor=navy,spaceAfter=18))
styles.add(ParagraphStyle(name='SectionISRM',fontName='ArialISRMBold',fontSize=14,leading=18,textColor=navy,spaceBefore=12,spaceAfter=9))
styles.add(ParagraphStyle(name='BodyISRM',fontName='ArialISRM',fontSize=10,leading=14,textColor=ink,spaceAfter=8))
styles.add(ParagraphStyle(name='SmallISRM',fontName='ArialISRM',fontSize=8.5,leading=11,textColor=ink,spaceAfter=5))
styles.add(ParagraphStyle(name='WhiteISRM',fontName='ArialISRMBold',fontSize=9,leading=12,textColor=colors.white))
story=[]
def p(text,style='BodyISRM'):
 story.append(Paragraph(html.escape(text),styles[style]))
def heading(text): p(text,'SectionISRM')
def bullet(text): p('• '+text)
def table(rows,widths):
 prepared=[[Paragraph(html.escape(str(x)),styles['WhiteISRM' if i==0 else 'SmallISRM']) for x in row] for i,row in enumerate(rows)]
 t=Table(prepared,colWidths=widths,repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),navy),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,0),.8,gold),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#CFD5D5'))]))
 story.append(t);story.append(Spacer(1,10))
def page(title):
 story.append(PageBreak());heading(title)
p('ISRM Insight Hub','TitleISRM')
p('Core application. Developer specification and quotation request','SectionISRM')
p('28 October 2026')
heading('1. Purpose and delivery boundary')
p('Develop a production application that helps authorised ISRM users find relevant expertise, inspect source evidence, form working lists and groups, and commission or review AI-assisted OSINT research. The existing interface is a demonstration and a source of reusable work, subject to technical review.')
p('The core is the horizontal foundation for later audience-engagement, expertise-product and situational-monitoring workflows. Those workflows are separately priced options, not part of the core instruction.')
heading('Existing material')
bullet('Current application: interactive graph, search, dossiers, shortlist, workflow exploration, six-slide briefing, scope configuration and local document exports.')
bullet('Current demonstration estimate: 172 replacement hours. This is not a timesheet, an all-branch estimate or accepted production completion.')
bullet('Private server-side profile disclosure and browser-local demonstration state exist. They do not establish production identity management, shared storage, role authorisation or operational audit.')
bullet('Repository: https://github.com/AlexezavGit/isrm-insight-hub . Public source branch for review: codex/network-workflow-batch at commit a9123d0ce4456bba8361f3166c799afcc09b1dbc. Follow repository guidance and preserve published Git history.')
heading('Quotation basis')
p('The initial future-production schedule is 640 hours before an accepted-reuse review. Please inspect the repository, identify reusable outputs by work-package ID, and return revised future hours. Do not subtract all 172 demonstration hours automatically.')
page('2. Functional scope and acceptance')
requirements=[
 ['ID','Required outcome and acceptance evidence'],
 ['C01','Architecture: agree the data model, environments, source ownership, OSINT API contract and implementation sequence. Supply a written architecture and dependency register.'],
 ['C02','Interface: retain the agreed filing-card design, readable British English and responsive graph panels. Verify keyboard operation, contrast and 390px mobile layout without unwanted document overflow.'],
 ['C03','Data: import approved CSV/XLSX/JSON records with field mapping, validation, duplicate-review and an error report. Produce summary profiles and full dossiers with source and date. Import must not grant rights to publish personal data.'],
 ['C04','Working records: search and filter approved fields, define custom fields, add supported relationships, create longlists/shortlists and groups, and export authorised selections. Record who changed a shared record.'],
 ['C05','Graph: show people, organisations and service/category concentrators. Preserve ISRM as a fixed reference in live mode. Hover highlights recorded neighbours; zoom reveals names progressively. Inspecting a node must not move the camera. Recentring is explicit.'],
 ['C06','Access: implement an agreed identity provider, roles and server-side field-level permissions. Demonstrate that guest/member/reviewer/administrator test accounts receive only permitted data. Include change and access audit.'],
 ['C07','OSINT: connect the existing researcher service through a server-side adapter, preserve source citations and request status, and require human review before accepting conclusions. Return failures, timeouts and corrections explicitly.'],
 ['C08','Testing: supply functional, access-boundary, import-validation and security checks. Reproduce an agreed representative data-volume test. Resolve critical findings before acceptance.'],
 ['C09','Handover: provide reproducible deployment, environment instructions without secret values, backup/restore and rollback procedures, source code, dependency/licence inventory and an operating guide.'],
]
table(requirements,[39,464])
page('3. Data, OSINT and control requirements')
heading('Data model')
p('Minimum entities: person, organisation, source/evidence, recorded relationship, service, workflow, saved selection/group, research request, review decision and audit event. Agree optional fields, country/sector vocabularies, provenance, corrections and retention before implementation.')
p('Recorded source review, association membership, personal recommendation, AI review and compliance decisions must remain distinct states. Do not infer membership, endorsement, trust scores or personal acquaintance from a graph edge.')
heading('OSINT adapter')
bullet('Agree the provider, API, credentials, permitted data, processing location, rate limits, request price and failure behaviour during feasibility.')
bullet('Submit an authorised scoped research request; receive a request ID, status, timestamp, cited findings and limitations. Record the reviewer and outcome separately from the automated response.')
bullet('No automated adverse decision, unverified compliance label, model training or consultant agent is included in this core integration.')
bullet('The 96 integration hours include the adapter and review flow. They exclude provider development, paid data access, usage fees and 11,000 individual investigations.')
heading('Security and data use')
p('Use server-side authorisation for every read, export and change. Keep credentials out of client bundles and repositories. Agree retention, deletion/correction requests, encryption, logging and backup access with the data owner and legal function. A shared password used by the demonstration is not the production authorisation design.')
heading('Scale and performance')
p('Use synthetic or expressly authorised records for an agreed 11,000-record import/search test. Agree the staging environment, search response target and graph rendering limit at feasibility. The graph may display a bounded relevant subset rather than 11,000 labels at once. The current sample is not proof of production-scale performance.')
page('4. Delivery sequence and responsibilities')
table([
 ['Stage','Self-contained result','Acceptance'],
 ['1. Feasibility','Repository/reuse audit, agreed specification, API contracts and deployable first core slice.','Signed work-package estimate, named dependencies, test data and an agreed acceptance plan.'],
 ['2. Test deployment','Core functions connected to the approved test storage and researcher service for nominated users.','Recorded user feedback, verified access boundaries, import/search/review tests and a resolved-issues register.'],
 ['3. Handover','Agreed refinements, production release and documented transfer.','Acceptance record, source/licences, operating guide, backup/restore and rollback evidence.'],
],[110,195,198])
heading('Responsibilities')
p('Developer: technical architecture, implementation, tests, deployment and handover. Product Owner: priorities, user scenarios and acceptance. Legal/data function: rights, privacy, permissions and terms. OSINT function: provider contract, research/review protocol and test cases. Client liaison: decisions and nominated users.')
p('The technical architect’s work must not be charged again as product strategy or delivery management. Non-developer functions and ongoing operations are not hidden inside the developer hourly benchmark.')
heading('Dependencies to confirm')
bullet('Approved source data, record permissions and vocabulary; nominated users and acceptance authority.')
bullet('Provider API documentation and test access; hosting/storage choice; credentials supplied through an agreed secure channel.')
bullet('Agreed integrations and available APIs. Paid learning, project-management and knowledge systems belong to separately commissioned extensions.')
heading('Excluded unless separately commissioned')
p('Live survey dispatch and response storage; campaign creative/media spend and campaign operations; expertise publishing operations; World Monitor or another live monitoring source; 24/7 service; public SaaS launch; consultant-model training; unlimited OSINT use or support.')
page('5. Work-package estimate and supplier response')
table([['ID','Core work package','Hours']]+[[x[0],x[2],x[3]] for x in data['wbs'] if x[1]=='core']+[['','Core future schedule before accepted reuse',640]],[40,416,47])
p('Labour reference: Ukraine senior median $40/hour. At the retained 28 October 2026 FX, this is approximately £30.01/hour and £19,203 for 640 future hours before accepted reuse. This is a directional developer-pay benchmark, not an agency offer, fixed-price instruction or invoice.')
p('The existing author’s remuneration is handled by the commissioning parties within the overall development allocation. It is not an additional item to be invoiced by the new developer and is not included in the £19,203 reference.')
heading('Please return')
bullet('Hours by work-package ID, accepted reuse with evidence, proposed roles and rates, VAT/tax/platform-fee treatment, and a total labour quotation.')
bullet('Calendar duration, staffing, dependencies, exclusions, paid licences, support period and change-request procedure.')
bullet('Acceptance evidence, code/IP or licence terms, access to source, handover, warranty and payment milestones for agreement.')
heading('Sources and reference material')
p('Lemon.io Ukraine rate calculator, Q3 2026: senior median $40/hour. https://lemon.io/rate-calculator/ukraine/','SmallISRM')
p('NBU exchange-rate reference: https://bank.gov.ua/en/markets/exchangerates . USD 45.6008 UAH and GBP 60.7909 UAH are retained prior-model values reproduced on 28 October 2026. Refresh and verify at agreement.','SmallISRM')
p('Application: https://isrm.pages.dev/?view=map . Approved project description: https://isrm.pages.dev/ISRM_Project_Description.md . Questionnaire preview: https://isrm.pages.dev/ISRM_Community_Member_Survey_Draft.md .','SmallISRM')
def decorate(canv,doc):
 canv.saveState()
 canv.setFont('ArialISRMBold',9);canv.setFillColor(navy);canv.drawString(46,806,'ISRM  INSIGHT HUB')
 canv.setFont('ArialISRM',8);canv.drawRightString(549,806,'Developer quotation request')
 canv.setStrokeColor(gold);canv.setLineWidth(.6);canv.line(46,797,549,797)
 canv.setFillColor(ink);canv.setFont('ArialISRM',8);canv.drawString(46,27,'28 October 2026  |  Scope for confirmation');canv.drawRightString(549,27,str(doc.page));canv.restoreState()
doc=SimpleDocTemplate(str(output),pagesize=A4,rightMargin=46,leftMargin=46,topMargin=66,bottomMargin=48,title='ISRM Developer Specification and Quotation Request',author='ISRM project team')
doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
print(output)

