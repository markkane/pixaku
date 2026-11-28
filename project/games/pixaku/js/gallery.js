/* ---------- Galerie ---------- */
const galImg=g=>({W:g.W,H:g.H,colors:g.colors,cells:dec(g.data)});
function renderGallery(){const g=store.get('gal',[]),grid=$('#galGrid');grid.innerHTML='';
  if(!g.length){grid.innerHTML='<div class="glass empty" style="grid-column:1/-1">Noch hängt hier nichts. Dein erstes fertiges Bild landet automatisch an dieser Wand.</div>';return}
  g.forEach(it=>{const b=document.createElement('div');b.setAttribute('role','button');b.tabIndex=0;b.className='glass gi';const cv=document.createElement('canvas');cv.className='px';paintImg(cv,galImg(it));
    b.append(cv);b.insertAdjacentHTML('beforeend',`<b>${it.name}</b><span>${it.W} × ${it.H}, ${fmt(it.time)}</span>`);b.onclick=()=>openWork(it);grid.append(b)})}
function openWork(it){const img=galImg(it),d=DIFFS.find(x=>x.id===it.diff);
  const s=openSheet(`<div class="sh-head"><h2>${it.name}</h2><button class="ib" data-x aria-label="Schließen">${I.x}</button></div><canvas class="px art" id="wArt"></canvas>
  <div class="stats"><div><b>${it.W} × ${it.H}</b><span>Felder</span></div><div><b>${fmt(it.time)}</b><span>Zeit</span></div><div><b>${d?d.name:''}</b><span>${it.date}</span></div></div>
  <div class="btns">${exportBtn(img,it.name)}<button class="ghost" id="wDel">Löschen</button></div>`);
  paintImg(s.querySelector('#wArt'),img).style.aspectRatio=it.W+'/'+it.H;let armed=false;
  s.querySelector('#wDel').onclick=e=>{if(!armed){armed=true;e.target.textContent='Wirklich löschen?';return}store.set('gal',store.get('gal',[]).filter(x=>x.id!==it.id));closeSheet();renderGallery()}}

