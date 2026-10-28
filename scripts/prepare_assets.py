"""Prepare the supplied school photos and original reports for a static website."""
from pathlib import Path
from PIL import Image, ImageOps
import json, shutil, subprocess, urllib.request, re
ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/home/rylen/Downloads/OneDrive_2026-10-28/SUPERVISION VISION')
selections = {
 'mun': ['image-000','image-002','image-004','image-006','image-007','image-009','image-010','image-011','image-012','image-014','image-016','image-017','image-018','image-019','image-020','image-021','image-022','image-023','image-024','image-025','image-026','image-027','image-028'],
 'pivotal':['image5','image6','image7','image8','image9','image10','image12','image13','image14','image15'],
 'spark':['image2','image5','image6','image7','image8','image9','imagea'],
 'avenues':['image7','image8','image10','image11','image12','image13','image14','image15','image16','image17','image18','image19','image20'],
 'internships':['image11','image12','image13'],
 'phenobl':['image1','image2','image7','image9','image10','image12','image13','image14','image16'],
 'artist':['image-005','image-006','image-007'],
 'dialogues':['image2','image3','image5','image6'],
 'karma':['image9'],
 'cyber':['image-004','image-005','image-012','image-013','image-014'],
 'mpowered':['image5','image6','image7','image3','image4'],
}
manifest=[]
index=json.loads((ROOT/'research/media-index.json').read_text())
for key,names in selections.items():
 for stem in names:
  p=next((ROOT/'research/extracted'/key).glob(stem+'.*'))
  name=f'{key}-{stem}'
  im=ImageOps.exif_transpose(Image.open(p)).convert('RGB')
  for size,suffix in [(1400,''),(640,'-small')]:
   copy=im.copy();copy.thumbnail((size,size));copy.save(ROOT/f'assets/photos/{name}{suffix}.webp',quality=84,method=6)
  record=next(x for x in index if x['file']==str(p.relative_to(ROOT)))
  manifest.append({'asset':f'assets/photos/{name}.webp','origin':record['source'],'original_media':p.name,'transform':'EXIF orientation, resized to 1400px maximum, WebP; 640px thumbnail'})
logo=ROOT/'research/extracted/avenues/image2.png'
if not logo.exists():logo=next((ROOT/'research/extracted/avenues').glob('image2.*'))
im=Image.open(logo).convert('RGBA');im.thumbnail((180,180));im.save(ROOT/'assets/school-crest.webp')
manifest.append({'asset':'assets/photos/rylen-anil.webp','origin':'https://img.onmanorama.com/content/dam/mm/en/archive/kerala/top-news/images/2026/6/5/rylen.jpg','credit':'Special Arrangement / Onmanorama','context':'https://www.onmanorama.com/news/kerala/2026/06/05/dubai-based-kerala-teen-who-flagged-neet-jee-flaws-inspired-by-matrix.html'})
(ROOT/'assets/photo-credits.json').write_text(json.dumps(manifest,indent=2))
# Self-host fonts so the published site does not depend on a font service.
fonts=[('Manrope:wght@400;500;600;700;800','manrope'),('DM+Serif+Display:ital@0;1','dm-serif')]
for family,prefix in fonts:
 req=urllib.request.Request('https://fonts.googleapis.com/css2?family='+family+'&display=swap',headers={'User-Agent':'Mozilla/5.0'})
 css=urllib.request.urlopen(req).read().decode()
 blocks=re.findall(r'/\* latin \*/\s*(@font-face\s*\{.*?\})',css,re.S)
 if not blocks:blocks=re.findall(r'(@font-face\s*\{.*?\})',css,re.S)
 result=[]
 for i,block in enumerate(blocks):
  url=re.search(r'url\(([^)]+)\)',block).group(1)
  ext='.woff2' if 'woff2' in block else '.ttf'
  fname=f'{prefix}-{i}{ext}'
  (ROOT/'assets/fonts'/fname).write_bytes(urllib.request.urlopen(url).read())
  result.append(block.replace(url,'./'+fname))
 (ROOT/'assets/fonts'/f'{prefix}.css').write_text('\n'.join(result))
print(f'Prepared {len(manifest)-1} school photos, portrait, crest, fonts. Reports are never published.')
