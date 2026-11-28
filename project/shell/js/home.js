/* ---------- Startseite: Aufteilung, Schriftzug und Vorschau. Die Inhalte liefert das gewählte Spiel. ---------- */
function refreshHome(){$('#bAch').innerHTML=I.trophy;$('#bSet').innerHTML=I.gear;Shell.each('onHome');layoutHome();heroStart()}
const HOME={col:340,hh:340};
function layoutHome(){const hm=$('.hm');if(!hm.clientWidth)return;const k3=document.documentElement.classList.contains('k3'),cs=getComputedStyle(hm),zs=getComputedStyle($('.z2')),
    zx=k3?parseFloat(zs.paddingLeft)*2:0,zy=k3?parseFloat(zs.paddingTop)*2:0,iw=hm.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight)-zx,ih=hm.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom),z1=$('.z1'),z3=$('.z3'),lg=$('#logo'),cv=$('#hero');
  hm.style.transform='';HOME.col=Math.floor(Math.min(iw,440));hm.style.setProperty('--colw',HOME.col+'px');lg.style.width=HOME.col+'px';lg.style.height=HOME.col*5/28+'px';
  const rest=ih-z1.offsetHeight-z3.offsetHeight-zy-(k3?0:16),put=h=>{HOME.hh=Math.floor(Math.max(110,Math.min(HOME.col,h)));cv.style.width=HOME.col+'px';cv.style.height=HOME.hh+'px';hm.style.setProperty('--heroh',HOME.hh+'px');
    hm.style.setProperty('--hi',$('.z2').offsetHeight+'px');hm.style.setProperty('--hm',z3.offsetHeight+'px')};
  HOME.px=zx/2;put(rest);
  if(k3){const pt=parseFloat(cs.paddingTop),pb=parseFloat(cs.paddingBottom),gaps=()=>{const a=$('#bSet').getBoundingClientRect().top-pt,b=innerHeight-pb-[...z3.querySelectorAll('.gbtn')].filter(e=>e.offsetParent).pop().getBoundingClientRect().bottom-(SKIN==='arc'&&getComputedStyle(z3,'::after').content!=='none'?26:0);return[a,b]};
    let[a,b]=gaps();if(a+b>10){put(HOME.hh+(a+b)*.85);[a,b]=gaps()}
    hm.style.transform=`translateY(${Math.round((b-a)/2)}px)`}
  if(!k3)return;const sv=$('#strip'),W=innerWidth,H=innerHeight,r2=$('.z2').getBoundingClientRect(),r3=z3.getBoundingClientRect(),cx=(r2.left+r2.right)/2,c=HOME.col/2+HOME.px+6,y1=r2.top,y2=r3.top,yB=H+70,yT=-70,
    wB=c*1.85,w2=c*.93,w1=c*1.17,wT=c*.7,P=(a,ya,b,yb)=>`${cx-a},${ya} ${cx+a},${ya} ${cx+b},${yb} ${cx-b},${yb}`,
    G=(id,a,b,ya,yb)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${ya}" y2="${yb}"><stop offset="0" style="stop-color:var(${a})"/><stop offset="1" style="stop-color:var(${b})"/></linearGradient>`,
    E=sg=>`${cx+sg*wT},${yT} ${cx+sg*w1},${y1} ${cx+sg*w2},${y2} ${cx+sg*wB},${yB}`;
  let gl='';for(const[a,ya,b,yb]of[[wT,yT,w1,y1],[w1,y1,w2,y2],[w2,y2,wB,yB]]){for(let i=1;i<8;i++){const f=i/4-1;gl+=`<line x1="${cx+a*f}" y1="${ya}" x2="${cx+b*f}" y2="${yb}"/>`}
    const m=Math.max(2,Math.round(Math.abs(yb-ya)/46));for(let q=1;q<m;q++){const u=q/m,yy=ya+(yb-ya)*u,ww=a+(b-a)*u;gl+=`<line x1="${cx-ww}" y1="${yy}" x2="${cx+ww}" y2="${yy}"/>`}}
  sv.setAttribute('viewBox',`0 0 ${W} ${H}`);
  sv.innerHTML=`<defs>${G('sg1','--s1a','--s1b',Math.max(0,yT),y1)}${G('sg2','--s2a','--s2b',y1,y2)}${G('sg3','--s3a','--s3b',y2,H)}</defs>
   <polygon points="${P(wT,yT,w1,y1)}" fill="url(#sg1)"/><polygon points="${P(w1,y1,w2,y2)}" fill="url(#sg2)"/><polygon points="${P(w2,y2,wB,yB)}" fill="url(#sg3)"/>
   <g class="grid">${gl}</g><polyline class="cheek" points="${E(-1)}"/><polyline class="cheek" points="${E(1)}"/><polyline class="edge" points="${E(-1)}"/><polyline class="edge" points="${E(1)}"/>
   <line class="fold" x1="${cx-w1}" x2="${cx+w1}" y1="${y1}" y2="${y1}"/><line class="fold" x1="${cx-w2}" x2="${cx+w2}" y1="${y2}" y2="${y2}"/>`}
let logoRun=0;
function drawLogo(anim){layoutHome();const run=++logoRun;return Shell.game.logo(anim,run)}
let heroRun=0;
function heroStart(){return Shell.game.hero()}
