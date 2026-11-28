/* ---------- Sieg ---------- */
function win(){G.won=true;G.winAt=performance.now();G.wSpan=A?420:Math.min(1500,520+(G.W+G.H)*26);G.wJit=A?90:170;G.wHop=A?340:440;G.winDur=G.wSpan+G.wJit+G.wHop*1.9;const fx=reduce?200:G.wSpan+260;R3.winFx();sfx.win();buzz([20,40,20]);$('#bubble').classList.remove('on');
  if(TUT){requestDraw();celebrate(G.puz.colors,3,fx);setTimeout(tutFinish,reduce?200:G.winDur+500);return}
  if(G.W*V.s>cw||G.H*V.s>ch-INS.top-INS.bot)tweenTo(fitTarget(),700);requestDraw();
  if(A){const z=G.W,bonus=6+z;A.score+=G.N*10+Math.round(A.time);A.time=Math.min(99,A.time+bonus);A.coll.push({W:G.W,H:G.H,colors:G.puz.colors,cells:G.puz.cells});
    showBonus(bonus);hud();celebrate(G.puz.colors,2,fx-150);setTimeout(()=>{if(A)arcadeNext()},reduce?500:G.winDur+350);return}
  dropSave(G.meta.sid);clearTimeout(saveT);recordWin();dailyWin();if(G.meta.mode!=='week'&&G.meta.mode!=='sprint')addGallery();celebrate(G.puz.colors,3,fx);setTimeout(showWin,reduce?200:G.winDur+550)}
function addGallery(){const p=G.puz,g=store.get('gal',[]),it={id:G.meta.id||('w'+Date.now()),name:G.meta.name,W:p.W,H:p.H,colors:p.colors,data:enc(p.cells),time:Math.round(G.time),hints:G.hints,diff:G.meta.diff,date:today()};
  const i=g.findIndex(x=>x.id===it.id);if(i>=0)g.splice(i,1);g.unshift(it);while(g.length>60)g.pop();while(!store.set('gal',g)&&g.length>1)g.pop()}
function exportBtn(img,name){if(!downloads)return'';setTimeout(()=>{const b=$('#bSave');if(b)b.onclick=async()=>{const k=Math.max(1,Math.floor(1200/Math.max(img.W,img.H))),cv=document.createElement('canvas');cv.width=img.W*k;cv.height=img.H*k;
    const c=cv.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(paintImg(document.createElement('canvas'),img),0,0,cv.width,cv.height);
    cv.toBlob(async bl=>{try{await downloads.save({filename:`pixaku-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.png`,data:bl});toast('Bild gesichert.')}catch(e){if(e&&e.code!=='declined')toast('Das Sichern hat hier nicht geklappt.')}},'image/png')}},0);
  return'<button class="ghost" id="bSave">Bild sichern</button>'}
function showWin(){if(!G||!G.won)return;if(G.meta.lv){showCampWin();return}if(G.meta.mode==='week'||G.meta.mode==='sprint'){showDayWin();return}const p=G.puz,blocks=p.rects.filter(r=>r.w*r.h>1).length;
  const s=openSheet(`<div class="sh-head"><h2>${G.meta.name} ist fertig</h2></div><canvas class="px art" id="winArt"></canvas>
  <div class="stats"><div><b>${fmt(G.time)}</b><span>Zeit</span></div><div><b>${blocks}</b><span>Blöcke</span></div><div><b>${G.hints}</b><span>Tipps</span></div></div>
  <p style="text-align:center">Das Bild hängt jetzt in deiner Galerie.</p>
  <div class="btns">${exportBtn(p,G.meta.name)}<button class="ghost" id="wHome">Zur Übersicht</button><button class="primary" id="wNext">Nächstes Bild</button></div>`,true);
  paintImg(s.querySelector('#winArt'),p).style.aspectRatio=p.W+'/'+p.H;
  s.querySelector('#wHome').onclick=()=>{closeSheet();G=null;show('home')};
  s.querySelector('#wNext').onclick=()=>{closeSheet();G=null;show('home');seed=(Math.random()*2**32)>>>0;openSetup(true)}}
function celebrate(cols,n,delay){if(reduce)return;setTimeout(()=>{const f=$('#flash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');fireworks(cols,n)},delay)}
function fireworks(cols,n){
  const cv=$('#fx'),c=cv.getContext('2d'),d=Math.min(2,devicePixelRatio||1),w=innerWidth,h=innerHeight,P=[],t0=performance.now();cv.width=w*d;cv.height=h*d;
  const br=cols.filter(x=>lumOf(x)>95),pal=br.length>=2?br:['#ffc857','#4fe3c1','#ff7a59','#ffffff'];
  const bursts=[...Array(n)].map((_,i)=>({t:i*240+(i?Math.random()*90:0),x:w*(.2+.6*((i+Math.random()*.6)/n)),y:h*(.2+.2*Math.random()),col:pal[(Math.random()*pal.length)|0],done:false}));
  let last=t0;(function step(now){const el=now-t0,dt=Math.min(.04,(now-last)/1000);last=now;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);c.globalCompositeOperation='lighter';c.lineCap='round';
    for(const b of bursts)if(!b.done&&el>=b.t){b.done=true;sfx.spark();const m=38;
      for(let i=0;i<m;i++){const a=i/m*6.283+Math.random()*.25,sp=80+Math.random()*170;P.push({x:b.x,y:b.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,t:0,life:.9+Math.random()*.6,col:i%4?b.col:'#ffffff',r:1.5+Math.random()*1.7})}
      P.push({x:b.x,y:b.y,t:0,life:.45,r:80,glow:1})}
    for(let i=P.length-1;i>=0;i--){const p=P[i];p.t+=dt;if(p.t>=p.life){P.splice(i,1);continue}const u=p.t/p.life;
      if(p.glow){const R=p.r*(.4+u),g=c.createRadialGradient(p.x,p.y,0,p.x,p.y,R);g.addColorStop(0,`rgba(255,255,255,${.55*(1-u)})`);g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=1;c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,R,0,7);c.fill();continue}
      p.vx*=1-2.1*dt;p.vy=p.vy*(1-2.1*dt)+120*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      c.globalAlpha=(1-u)*(u>.6?.5+.5*Math.sin(now/28+i):1);c.strokeStyle=p.col;c.lineWidth=p.r;c.beginPath();c.moveTo(p.x-p.vx*.045,p.y-p.vy*.045);c.lineTo(p.x,p.y);c.stroke()}
    c.globalAlpha=1;c.globalCompositeOperation='source-over';
    if(P.length||bursts.some(b=>!b.done))requestAnimationFrame(step);else c.clearRect(0,0,w,h)})(t0)}

