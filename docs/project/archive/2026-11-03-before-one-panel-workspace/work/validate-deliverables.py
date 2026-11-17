from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote,quote
from urllib.request import urlopen
import json,hashlib,csv
from PIL import Image
base=Path('/Users/alexzvo/Documents/ChatGPT/isrm');root=base/'isrm-insight-hub';out=base/'work/isrm-deep-audit/deliverable'
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,tag,attrs):
  if tag in ('a','img'):
   a=dict(attrs);v=a.get('href' if tag=='a' else 'src');
   if v:self.links.append(v)
checked={}; errors=[]
for f in sorted(out.rglob('*.html')):
 parser=Links();parser.feed(f.read_text())
 for href in parser.links:
  url=urlparse(href)
  if url.scheme or not url.path:continue
  target=(f.parent/unquote(url.path)).resolve()
  if not target.is_file():errors.append({'page':str(f.relative_to(out)),'link':href,'status':'missing'});continue
  rel=str(target.relative_to(out))
  if rel not in checked:
   try:
    with urlopen('http://127.0.0.1:8768/'+quote(rel),timeout=8) as r:
     r.read(80);checked[rel]=r.status
   except Exception as e:errors.append({'page':str(f.relative_to(out)),'link':href,'error':str(e)})
images=[]
for folder in ['screens','prototype-screens','refinement-screens','implementation-screens','app-first-screens']:
 for f in sorted((out/folder).glob('*')):
  if f.suffix.lower() not in ['.jpg','.jpeg','.png']:continue
  with Image.open(f) as im: im.verify()
  with Image.open(f) as im:images.append({'file':str(f.relative_to(out)),'width':im.width,'height':im.height,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
manifest=json.loads((out/'project/evidence/reference-copy-manifest.json').read_text())
for item in manifest['copied']:
 if hashlib.sha256((out/item['file']).read_bytes()).hexdigest()!=item['sha256']: errors.append({'copy_mismatch':item['file']})
rows=list(csv.DictReader((root/'docs/project/REGISTRY.csv').open()))
assert len(rows)==len({r['code'] for r in rows})
for code in ['ISRM-OBS-DEFAULT','ISRM-OBS-UK-CASE','ISRM-OBS-UK-CATEGORY','ISRM-OBS-CASE-CATEGORY','ISRM-OBS-SHORTLIST','ISRM-OBS-UN-CASE','ISRM-OBS-GUIDE-COUNTRY','ISRM-OBS-SERVICE-COVERAGE','ISRM-DATA-GEOGRAPHY']:
 assert code in {r['code'] for r in rows}
result={'status':'done' if not errors else 'failed','local_http_links':checked,'images':images,'reference_snapshots_verified':manifest['copied'],'unresolved_historical_links':manifest['unresolved'],'errors':errors,'limitations':['Local output links and bytes checked; external web-page availability is not rechecked by this script','No financial calculation; direct row requirements registered and independently reviewed; local code built and checked separately; no deployment performed']}
p=root/'docs/project/evidence/app-first-deliverable-validation-2026-11-03.json';p.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':result['status'],'checked_local_http_targets':len(checked),'valid_images':len(images),'exact_reference_snapshots':len(manifest['copied']),'errors':errors},ensure_ascii=False))
assert not errors
