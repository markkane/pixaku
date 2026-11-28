import os as _os;_os.chdir(_os.path.abspath(_os.path.join(_os.path.dirname(__file__),"..")))
import os,shutil,json,zipfile
from PIL import Image,ImageDraw
out='dist/pwa';shutil.rmtree(out,ignore_errors=True)
for d in('fonts','vendor','icons','splash'):os.makedirs(f'{out}/{d}')
h=open('dist/index.html').read()
def rep(a,b):
    global h
    assert a in h,a[:60]; h=h.replace(a,b,1)
# Schriften und three.js lokal
fonts=[('Figtree',w,f'figtree-latin-{w}-normal.woff2','figtree') for w in(400,500,600,700,800)]+[('Pixelify Sans',w,f'pixelify-sans-latin-{w}-normal.woff2','pixelify-sans') for w in(500,700)]
css=''
for fam,w,f,pk in fonts:
    shutil.copy(f'node_modules/@fontsource/{pk}/files/{f}',f'{out}/fonts/{f}')
    css+=f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:normal;font-display:swap;src:url(fonts/{f}) format('woff2')}}\n"
shutil.copy('node_modules/three/build/three.min.js',f'{out}/vendor/three.min.js')
rep("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js","vendor/three.min.js")
# Icons
BG=(6,19,27);COL=[(255,122,89),(255,200,87),(79,227,193),(13,36,48),(255,93,143)]
CELLS=[0,0,1,1,1,0,0,2,2,4,3,3,2,2,4,1,1,1,0,0,2,2,4,0,0]
def icon(size,pad,rounded=True):
    S=size*4;im=Image.new('RGB',(S,S),BG);d=ImageDraw.Draw(im,'RGBA');m=S*pad;c=(S-2*m)/5;g=c*.07
    for i,k in enumerate(CELLS):
        x=m+(i%5)*c;y=m+(i//5)*c;col=COL[k]
        if k==3:col=(22,52,66)
        d.rounded_rectangle([x+g,y+g,x+c-g,y+c-g],radius=c*.2,fill=col)
        d.rounded_rectangle([x+g,y+g,x+c-g,y+c*.45],radius=c*.2,fill=(255,255,255,46))
        d.rounded_rectangle([x+g,y+c*.72,x+c-g,y+c-g],radius=c*.2,fill=(0,0,0,30))
    return im.resize((size,size),Image.LANCZOS)
icon(512,.14).save(f'{out}/icons/icon-512.png');icon(192,.14).save(f'{out}/icons/icon-192.png')
icon(512,.24).save(f'{out}/icons/maskable-512.png');icon(180,.12).save(f'{out}/icons/apple-touch-icon.png');icon(32,.06).save(f'{out}/icons/favicon-32.png')
# iOS-Startbilder
SP=[(440,956,3),(430,932,3),(402,874,3),(393,852,3),(390,844,3),(428,926,3),(375,812,3),(414,896,3),(414,896,2),(375,667,2),(820,1180,2),(834,1194,2),(1024,1366,2),(768,1024,2)]
links=''
big=icon(512,.14)
for w,hh,r in SP:
    W,H=w*r,hh*r;im=Image.new('RGB',(W,H),BG);s=int(min(W,H)*.34);ic=big.resize((s,s),Image.LANCZOS);im.paste(ic,((W-s)//2,(H-s)//2-int(H*.04)))
    fn=f'splash/launch-{W}x{H}.png';im.save(f'{out}/{fn}',optimize=True)
    links+=f'<link rel="apple-touch-startup-image" media="(device-width:{w}px) and (device-height:{hh}px) and (-webkit-device-pixel-ratio:{r}) and (orientation:portrait)" href="{fn}">\n'
json.dump({"name":"Pixaku","short_name":"Pixaku","description":"Shikaku trifft Pixel-Art: Rechtecke setzen, Bild enthüllen.","lang":"de","start_url":"./","scope":"./","display":"fullscreen","display_override":["fullscreen","standalone"],"orientation":"any","background_color":"#06131b","theme_color":"#06131b","categories":["games","puzzle"],
 "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icons/maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},open(f'{out}/manifest.webmanifest','w'),ensure_ascii=False,indent=1)
# Kopf
rep('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">','<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">')
rep('<link rel="preconnect" href="https://fonts.googleapis.com">\n','')
rep('<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Pixelify+Sans:wght@500;700&display=swap" rel="stylesheet">',
 '<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#06131b">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="apple-mobile-web-app-title" content="Pixaku">\n<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'+links+
 '<style>\n'+css+'#splash{position:fixed;inset:0;z-index:99;background:#06131b;display:grid;place-items:center;transition:opacity .45s}\n#splash.off{opacity:0;pointer-events:none}\n#splash.noanim div{animation:none}\n#splash div{display:flex;flex-direction:column;align-items:center;gap:18px;font:700 34px \'Pixelify Sans\',monospace;letter-spacing:.08em;color:#f1f7f5;animation:spl .7s cubic-bezier(.2,1.4,.4,1)}\n#splash img{width:132px;height:132px;border-radius:30px;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 80px rgba(255,160,90,.25)}\n@keyframes spl{from{transform:scale(.7);opacity:0}}\n</style>')
rep('<div id="bg">','<div id="splash"><div><img src="icons/icon-512.png" alt="">PIXAKU</div></div>\n<div id="bg">')
# Sichern/Teilen ohne Claude, Splash, Service Worker
rep('<script>\n/* ================= CORE','''<script>
window.claude={use:async n=>n!=='downloads'?null:{save:async({filename,data})=>{const f=new File([data],filename,{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'Pixaku'});return{status:'saved'}}catch(e){throw{code:'declined'}}}
  const a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);return{status:'saved'}}}};
window.PX_VER='__VER__';
(()=>{let fresh=false;try{fresh=!!sessionStorage.getItem('pxr');sessionStorage.removeItem('pxr')}catch(e){}
  const t0=performance.now(),hide=()=>{const s=document.getElementById('splash');if(!s)return;setTimeout(()=>{s.classList.add('off');setTimeout(()=>s.remove(),600)},Math.max(0,(fresh?350:900)-(performance.now()-t0)))};
  const reload=()=>{try{sessionStorage.setItem('pxr','1')}catch(e){}location.reload()};
  if(fresh)document.addEventListener('DOMContentLoaded',()=>{const s=document.getElementById('splash');if(s)s.classList.add('noanim')});
  if(!('serviceWorker'in navigator)){addEventListener('load',hide);return}
  let reg=null,had=!!navigator.serviceWorker.controller,changed=false,booted=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had){had=true;return}changed=true;if(booted)window.PX_UPD=1});
  window.PX_CHECK=()=>{if(reg)reg.update().catch(()=>{})};
  addEventListener('load',()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));
    navigator.serviceWorker.register('sw.js').then(async r=>{reg=r;document.addEventListener('visibilitychange',()=>{if(!document.hidden)r.update().catch(()=>{})});
      if(!fresh&&had){await Promise.race([r.update().catch(()=>{}),wait(1800)]);
        if(r.installing||r.waiting||changed){const end=performance.now()+4000;while(!changed&&performance.now()<end)await wait(100)}
        if(changed){reload();return}}
      booted=true;hide()}).catch(()=>{booted=true;hide()})});
  setInterval(()=>{if(window.PX_UPD&&(document.getElementById('home').classList.contains('on')||document.getElementById('lcamp').classList.contains('on'))&&!document.getElementById('sheet').classList.contains('on')){window.PX_UPD=0;reload()}else if(window.PX_UPD===1&&typeof toast==='function'){window.PX_UPD=2;toast('Neue Version geladen. Sie startet, sobald du zur Startseite oder zur Karte gehst.',4200)}},1500)})();
</script>
<script>
/* ================= CORE''')
import datetime,hashlib as _h
h=h.replace('__VER__',datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=1))).strftime('%d.%m.%Y %H:%M')+' · '+_h.md5(h.encode()).hexdigest()[:5])
open(f'{out}/index.html','w').write(h)
files=['./','index.html','manifest.webmanifest','vendor/three.min.js']+[f'fonts/{f[2]}' for f in fonts]+[f'icons/{f}' for f in sorted(os.listdir(f'{out}/icons'))]
import hashlib;ver=hashlib.md5(h.encode()).hexdigest()[:8]
open(f'{out}/sw.js','w').write(f"""const C='pixaku-{ver}',FILES={json.dumps(files)};
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{{ignoreSearch:true}}).then(r=>r||fetch(e.request)))}});
""")
open(f'{out}/LIESMICH.txt','w').write("""Pixaku als Web-App

Der Ordner ist eine fertige, statische Website. Er braucht eine HTTPS-Adresse, damit Handys ihn als App installieren.

1. Den Inhalt dieses Ordners bei einem statischen Hoster hochladen, zum Beispiel GitHub Pages, Netlify oder Cloudflare Pages.
2. Die Adresse auf dem Handy öffnen.
   Android (Chrome): Menü, "App installieren" oder "Zum Startbildschirm hinzufügen".
   iPhone (Safari): Teilen, "Zum Home-Bildschirm".
3. Ab dann startet Pixaku über die Kachel im Vollbild und läuft auch ohne Netz.

Zum Ausprobieren am Rechner: im Ordner "python3 -m http.server 8080" starten und http://localhost:8080 öffnen.
Nach einem Update genügt es, die Dateien zu ersetzen; die App holt sich die neue Version beim nächsten Start.
""")
z=zipfile.ZipFile('pixaku-webapp.zip','w',zipfile.ZIP_DEFLATED)
for root,_,fs in os.walk(out):
    for f in fs:p=os.path.join(root,f);z.write(p,os.path.join('pixaku',os.path.relpath(p,out)))
z.close();print('files',len(files),'zip kB',os.path.getsize('pixaku-webapp.zip')//1024)
