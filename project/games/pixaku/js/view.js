/* ---------- Ansicht ---------- */
function resize(){const sa=getComputedStyle($('#sa'));INS.top=88+(parseFloat(sa.paddingTop)||0);INS.bot=104+(parseFloat(sa.paddingBottom)||0)+(TUT&&!$('#coach').hidden?$('#coach').offsetHeight+12:0);dpr=Math.min(3,window.devicePixelRatio||1);if(!bcv.clientWidth)return;cw=bcv.clientWidth;ch=bcv.clientHeight;bcv.width=Math.round(cw*dpr);bcv.height=Math.round(ch*dpr);if(G){barFit();if(G.fixed)V=fitTarget();else clampView();requestDraw()}}
function barFit(){$('.bar').style.maxWidth=Math.round(Math.max(250,Math.min(cw-24,G.W*fitScale()+16)))+'px'}
addEventListener('resize',resize);
const SIDE=()=>matchMedia('(pointer:coarse)').matches?36:14;
const fitScale=()=>Math.max(1,Math.min((cw-2*SIDE())/G.W,(ch-INS.top-INS.bot-20)/G.H));
function fitTarget(){const s=fitScale();return{s,ox:(cw-G.W*s)/2,oy:INS.top+(ch-INS.top-INS.bot-G.H*s)/2}}
const limits=()=>{const f=fitScale();return[Math.max(1,f*.7),Math.max(64,f)]};
function clampView(){const[a,b]=limits();V.s=Math.max(a,Math.min(b,V.s));V.ox=Math.min(cw-70,Math.max(70-G.W*V.s,V.ox));V.oy=Math.min(ch-INS.bot-70,Math.max(INS.top+70-G.H*V.s,V.oy))}
function zoomAt(px,py,f){if(G.fixed)return;const[a,b]=limits(),ns=Math.max(a,Math.min(b,V.s*f)),wx=(px-V.ox)/V.s,wy=(py-V.oy)/V.s;V.s=ns;V.ox=px-wx*ns;V.oy=py-wy*ns;clampView();requestDraw()}
function tweenTo(t,ms=450){tween={a:{...V},b:t,t0:performance.now(),ms};requestDraw()}
const cellAt=(px,py)=>use3D()?R3.cell(px,py):({x:Math.floor((px-V.ox)/V.s),y:Math.floor((py-V.oy)/V.s)});
function requestDraw(){if(rafOn)return;rafOn=true;requestAnimationFrame(now=>{rafOn=false;if(!G)return;let again=false;
  if(tween){const t=Math.min(1,(now-tween.t0)/tween.ms),e=1-Math.pow(1-t,3);V.s=tween.a.s+(tween.b.s-tween.a.s)*e;V.ox=tween.a.ox+(tween.b.ox-tween.a.ox)*e;V.oy=tween.a.oy+(tween.b.oy-tween.a.oy)*e;if(t>=1)tween=null;else again=true}
  if(drag&&lastPtr){let dx=0,dy=0;const m=30,bw=G.W*V.s,bh=G.H*V.s;
    if(lastPtr.x<m&&V.ox<10)dx=7;else if(lastPtr.x>cw-m&&V.ox+bw>cw-10)dx=-7;
    if(lastPtr.y<INS.top+m&&V.oy<INS.top)dy=7;else if(lastPtr.y>ch-INS.bot-m&&V.oy+bh>ch-INS.bot)dy=-7;
    if(dx||dy){V.ox+=dx;V.oy+=dy;moveDrag(lastPtr);again=true}}
  if(G.won&&G.winT<1){G.winT=Math.min(1,(now-G.winAt)/(reduce?1:G.winDur));again=true}
  if(now<G.animUntil||(use3D()&&R3.busy(now))||(TUT&&TUT.step<4&&!G.won))again=true;
  draw(now);if(again)requestDraw()})}

function draw(now=performance.now()){
  const{W,H,puz}=G,c=bctx,s=V.s,ox=V.ox,oy=V.oy,bw=W*s,bh=H*s,wt=G.winT,k=1-wt*wt*(3-2*wt);
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,cw,ch);tutDraw(now);
  if(use3D()){R3.render(now);drawMini();return}
  c.fillStyle='rgba(5,16,23,.6)';rr(c,ox-8,oy-8,bw+16,bh+16,16);c.fill();c.strokeStyle=`rgba(255,255,255,${.22+.3*wt})`;c.lineWidth=1;c.stroke();
  const x0=Math.max(0,Math.floor(-ox/s)),x1=Math.min(W,Math.ceil((cw-ox)/s)),y0=Math.max(0,Math.floor(-oy/s)),y1=Math.min(H,Math.ceil((ch-oy)/s));
  if(s>=7&&k>0){c.strokeStyle=`rgba(255,255,255,${.1*k})`;c.lineWidth=1;c.beginPath();
    for(let x=x0;x<=x1;x++){const p=Math.round(ox+x*s)+.5;c.moveTo(p,oy+y0*s);c.lineTo(p,oy+y1*s)}
    for(let y=y0;y<=y1;y++){const p=Math.round(oy+y*s)+.5;c.moveTo(ox+x0*s,p);c.lineTo(ox+x1*s,p)}c.stroke()}
  const detail=s>=9&&k>0;
  if(!detail){c.imageSmoothingEnabled=false;c.drawImage(G.paint,ox,oy,bw,bh)}
  const hops=[];
  for(const r of G.rects.values()){
    if(r.x>=x1||r.y>=y1||r.x+r.w<=x0||r.y+r.h<=y0)continue;
    let x=ox+r.x*s,y=oy+r.y*s,w=r.w*s,h=r.h*s;
    if(r.valid){if(!detail)continue;const age=now-r.t0,[hop,kl]=wv(r,now);
      if(hop>0){hops.push(r,hop);continue}
      if(age<240){const t=age/240,sc=.82+.18*(1+2.2*Math.pow(t-1,3)+1.2*Math.pow(t-1,2));c.save();c.translate(x+w/2,y+h/2);c.scale(sc,sc);tile(c,-w/2,-h/2,w,h,r.col,s,kl);c.restore()}
      else tile(c,x,y,w,h,r.col,s,kl);
      if(r.lock&&r.w*r.h===1&&s>=12){c.globalAlpha=.3*kl;c.fillStyle=inkOn(r.col);c.beginPath();c.arc(x+w/2,y+h/2,s*.09,0,7);c.fill();c.globalAlpha=1}}
    else if(k>0){c.fillStyle=r.wrong?'rgba(255,93,143,.25)':'rgba(255,255,255,.13)';rr(c,x+1.5,y+1.5,w-3,h-3,Math.min(s*.2,8));c.fill();
      if(s>=6){c.setLineDash([5,4]);c.strokeStyle=r.wrong?'#ff5d8f':'rgba(255,255,255,.65)';c.lineWidth=1.5;c.stroke();c.setLineDash([])}}
  }
  for(let i=0;i<hops.length;i+=2){const r=hops[i],hop=hops[i+1],w=r.w*s,h=r.h*s,sc=1+.17*hop;c.save();c.translate(ox+r.x*s+w/2,oy+r.y*s+h/2-hop*s*.34);c.scale(sc,sc);
    c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=s*.5*hop;c.shadowOffsetY=s*.34*hop;tile(c,-w/2,-h/2,w,h,r.col,s,1);c.shadowColor='transparent';c.fillStyle=`rgba(255,255,255,${.24*hop})`;c.fillRect(-w/2,-h/2,w,h);c.restore()}
  if(s>=5&&k>0){c.textAlign='center';c.textBaseline='middle';const colr=G.diff.color;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=y*W+x,q=G.clueAt[i];if(q<0)continue;const sr=puz.rects[q],n=sr.w*sr.h;if(n===1)continue;
      const id=G.cellR[i],r=id>=0?G.rects.get(id):null,on=r&&r.valid,col=puz.colors[puz.cells[i]],px=ox+x*s,py=oy+y*s;
      if(s<14){if(!on){c.fillStyle=colr?col:'rgba(255,255,255,.75)';c.fillRect(px+s*.3,py+s*.3,s*.4,s*.4)}continue}
      c.globalAlpha=on?.78*wv(r,now)[1]:k;
      if(!on&&colr){c.fillStyle=col;rr(c,px+s*.13,py+s*.13,s*.74,s*.74,s*.2);c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.stroke()}
      c.fillStyle=on?inkOn(r.col):(colr?inkOn(col):'#fff');c.font=`700 ${Math.min(26,s*(n>9?.42:.5))}px PixNum,Figtree,system-ui,sans-serif`;c.fillText(n,px+s/2,py+s/2+1);c.globalAlpha=1}}
  if(drag){const d=dragRect(),e=evalRect(d.x,d.y,d.w,d.h),x=ox+d.x*s,y=oy+d.y*s;const bl=blockedAt(d.x,d.y,d.w,d.h);c.fillStyle=bl?'rgba(255,93,143,.3)':e.valid?e.col:'rgba(255,255,255,.16)';c.globalAlpha=e.valid&&!bl?.6:1;rr(c,x,y,d.w*s,d.h*s,Math.min(s*.24,9));c.fill();c.globalAlpha=1;c.strokeStyle=bl?'#ff5d8f':'#fff';c.lineWidth=2.5;c.stroke()}
  drawMini()}
function drawMini(){const{W,H}=G,s=V.s,ox=V.ox,oy=V.oy,bw=W*s,bh=H*s;
  const mini=$('#mini'),over=bw>cw+4||bh>ch-INS.top-INS.bot+4;
  if(mini.hidden===over)mini.hidden=!over;
  if(over){const m=$('#miniCv'),mw=168,mh=Math.max(20,Math.round(168*H/W));if(m.width!==mw||m.height!==mh){m.width=mw;m.height=mh}const mc=m.getContext('2d');mc.imageSmoothingEnabled=false;mc.clearRect(0,0,mw,mh);mc.drawImage(G.paint,0,0,mw,mh);
    const f=mw/W;mc.strokeStyle='#ffc857';mc.lineWidth=3;mc.strokeRect(Math.max(1.5,-ox/s*f),Math.max(1.5,(INS.top-oy)/s*f),Math.min(mw-3,cw/s*f),Math.min(mh-3,(ch-INS.top-INS.bot)/s*f))}
}

