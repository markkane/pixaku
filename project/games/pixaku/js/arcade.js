/* ---------- Arcade ---------- */
function showBonus(n){const e=$('#bonus'),g=$('#gNum');e.querySelector('b').textContent='+'+n+' Sekunden';e.hidden=false;e.classList.remove('go');void e.offsetWidth;e.classList.add('go');g.classList.remove('gain');void g.offsetWidth;g.classList.add('gain');
  tone(660,.1,'triangle',.06);tone(880,.1,'triangle',.06,.09);tone(1320,.2,'triangle',.06,.18);clearTimeout(showBonus.t);showBonus.t=setTimeout(()=>{e.hidden=true;g.classList.remove('gain')},2100)}
async function arcadeStart(){A={time:75,score:0,level:0,coll:[],hold:true};const a=A;await arcadeNext();if(A===a)arcadeCount()}
function arcadeCount(){const a=A,e=$('#cdn'),b=e.firstElementChild;let n=3;e.hidden=false;const step=()=>{if(A!==a||!$('#game').classList.contains('on')){e.hidden=true;if(A===a)a.hold=false;return}
    b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');if(n>0){b.textContent=n;tone(440,.13,'square',.06);n--;setTimeout(step,850)}else{b.textContent='Los!';tone(880,.34,'square',.07);a.hold=false;setTimeout(()=>{e.hidden=true},520)}};step()}
async function arcadeNext(){A.level++;const z=Math.min(10,6+((A.level-1)>>1)),rng=mulberry32((Math.random()*2**32)>>>0),img=A.level%4===0?mosaic(z,z,rng):pixling(z,z,rng);
  const puz=await buildPuzzle(compact(img),8,rng);if(A)newGame(puz,{mode:'arcade',name:'Arcade',diff:'normal'})}
function endArcade(quit){const a=A;if(!a)return;A=null;{const st=ST();if(a.coll.length>st.arcBoards){st.arcBoards=a.coll.length;store.set('stats',st)}setTimeout(checkAch,900)}if(G)G.won=true;const best=store.get('best',0),rec=a.score>best;if(rec)store.set('best',a.score);
  if(quit&&!a.score){G=null;show('home');return}
  const s=openSheet(`<div class="sh-head"><h2>${quit?'Runde beendet':'Zeit abgelaufen'}</h2></div><div class="big">${a.score}</div>
  <p style="text-align:center">${rec?'Neuer Bestwert.':'Bestwert '+best+' Punkte.'} ${a.coll.length} ${a.coll.length===1?'Brett':'Bretter'} gelöst.</p>
  <div class="coll" id="coll"></div><div class="btns"><button class="ghost" id="aHome">Zur Übersicht</button><button class="primary" id="aAgain">Noch eine Runde</button></div>`,true);
  a.coll.forEach(im=>{const cv=document.createElement('canvas');cv.className='px';paintImg(cv,im);s.querySelector('#coll').append(cv)});
  s.querySelector('#aHome').onclick=()=>{closeSheet();G=null;show('home')};s.querySelector('#aAgain').onclick=()=>{closeSheet();arcadeStart()}}
let lastTick=performance.now();
setInterval(()=>{const now=performance.now(),dt=Math.min(1,(now-lastTick)/1000);lastTick=now;
  if(!G||G.won||document.hidden||sheetOpen||!$('#game').classList.contains('on'))return;
  if(A){if(!A.hold)A.time-=dt;if(A.time<=0){A.time=0;hud();endArcade(false);return}}else{G.time+=dt;if(G.limit&&G.time>=G.limit){G.time=0;clearBoard();toast('Die Zeit ist abgelaufen. Das Brett ist geleert, die Uhr läuft neu.',3200)}}hud()},200);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow()});

