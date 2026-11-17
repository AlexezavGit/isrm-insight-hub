import re,html
from pathlib import Path
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,KeepTogether
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
root=Path('/Users/alexzvo/Documents/ChatGPT/isrm')
source=root/'isrm-insight-hub/docs/developer-review/ISRM_Architecture_Clarification_EN.md'
out=root/'outputs/isrm-architecture-20261029/ISRM_Developer_Brief_EN.pdf'
out.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('ISRMArial','/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('ISRMArialBold','/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
ink=colors.HexColor('#173342');navy=colors.HexColor('#143343');gold=colors.HexColor('#B59B55')
styles=getSampleStyleSheet()
for name,size,leading,bold in [('BodyISRM',9.5,13,False),('TitleISRM',22,27,True),('HeadingISRM',13,17,True),('SubISRM',10.5,14,True),('CellISRM',8.5,11,False),('WhiteISRM',8.5,11,True)]:
 styles.add(ParagraphStyle(name=name,fontName='ISRMArialBold' if bold else 'ISRMArial',fontSize=size,leading=leading,textColor=colors.white if name=='WhiteISRM' else ink,spaceAfter=7,keepWithNext=bold))
def text(s):
 s=s.replace('—','-').replace('–','-').replace('→','to').replace('£','GBP ')
 s=html.escape(s)
 return re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',s)
lines=source.read_text().splitlines();story=[];i=0
while i<len(lines):
 line=lines[i]
 if not line.strip():i+=1;continue
 if line.startswith('|'):
  block=[]
  while i<len(lines) and lines[i].startswith('|'):
   cells=[x.strip() for x in lines[i].strip('|').split('|')]
   if not all(re.fullmatch(r':?-+:?',x or '-') for x in cells):block.append(cells)
   i+=1
  count=len(block[0]);widths=([110,200,193] if count==3 else [88,138,145,132] if count==4 else [503/count]*count)
  if count==3 and block[0][0]=='Option':widths=[90,205,208]
  if count==3 and block[0][0]=='ID':widths=[38,410,55]
  data=[[Paragraph(text(c),styles['WhiteISRM' if r==0 else 'CellISRM']) for c in row] for r,row in enumerate(block)]
  table=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
  table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),navy),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,1),(-1,-1),.35,colors.HexColor('#CDD6D5'))]))
  story.extend([table,Spacer(1,8)]);continue
 style='TitleISRM' if line.startswith('# ') else 'HeadingISRM' if line.startswith('## ') else 'SubISRM' if line.startswith('### ') else 'BodyISRM'
 value=re.sub(r'^#{1,3}\s','',line)
 if value.startswith('- '):value='• '+value[2:]
 story.append(Paragraph(text(value),styles[style]));i+=1
def page(canv,doc):
 canv.saveState();canv.setFont('ISRMArialBold',9);canv.setFillColor(navy);canv.drawString(46,806,'ISRM INSIGHT HUB');canv.setFont('ISRMArial',8);canv.drawRightString(549,806,'Architecture and supplier quotation brief');canv.setStrokeColor(gold);canv.line(46,797,549,797);canv.drawString(46,27,'29 October 2026 | For scope and quotation agreement');canv.drawRightString(549,27,str(doc.page));canv.restoreState()
SimpleDocTemplate(str(out),pagesize=A4,leftMargin=46,rightMargin=46,topMargin=65,bottomMargin=48,title='ISRM Architecture and Quotation Brief',author='ISRM project team').build(story,onFirstPage=page,onLaterPages=page)
print(out)
