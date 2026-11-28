/* ---------- 3D-Ansicht (three.js, wird erst beim Einschalten geladen) ---------- */
const R3={on:store.get('view','3d')==='3d',ready:false,failed:!(()=>{try{const c=document.createElement('canvas');return c.getContext('webgl2')||c.getContext('webgl')}catch(e){return null}})(),p:null,tilt:12*Math.PI/180,hT:.46,parts:[],light:{t0:-1e9,i:0},last:0,rgb:{}};
const use3D=()=>R3.on&&R3.ready&&!R3.failed&&!R3.lost;
function load3D(){
  if(R3.p)return R3.p;
  R3.p=new Promise((res,rej)=>{if(window.THREE)return res();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';s.onload=()=>res();s.onerror=()=>rej(new Error('load'));document.head.append(s)})
    .then(init3D).catch(e=>{R3.p=null;throw e});
  return R3.p;
}
function init3D(){
  const T=THREE;let r;
  try{r=new T.WebGLRenderer({canvas:$('#gl'),alpha:true,antialias:true})}catch(e){R3.failed=true;throw e}
  r.setClearColor(0,0);R3.r=r;R3.scene=new T.Scene();R3.cam=new T.PerspectiveCamera(26,1,.1,4000);
  const inst=(src)=>{const g=new T.InstancedBufferGeometry();g.index=src.index;g.setAttribute('position',src.attributes.position);g.setAttribute('normal',src.attributes.normal);g.setAttribute('uv',src.attributes.uv);return g};
  /* Grundplatte mit Raster */
  R3.baseMat=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uWH:{value:new T.Vector2()},uGrid:{value:1},uPx:{value:.03}},
    vertexShader:`varying vec2 vP;void main(){vec4 w=modelMatrix*vec4(position,1.);vP=vec2(w.x,-w.y);gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform vec2 uWH;uniform float uGrid;uniform float uPx;varying vec2 vP;
     void main(){vec2 p=vP;float inside=step(0.,p.x)*step(p.x,uWH.x)*step(0.,p.y)*step(p.y,uWH.y);
      vec2 f=abs(fract(p+.5)-.5);float line=1.-smoothstep(uPx*.5,uPx*1.6,min(f.x,f.y));
      vec3 col=vec3(.02,.065,.09)+line*uGrid*.16;float a=.66;
      if(inside<.5){vec2 e=max(vec2(-p.x,-p.y),p-uWH);float m=max(e.x,e.y);col=vec3(.62,.78,.82);a=.34*(1.-smoothstep(.12,.3,m))+.1;}
      gl_FragColor=vec4(col,a);}`});
  R3.base=new T.Mesh(new T.PlaneGeometry(1,1),R3.baseMat);R3.base.renderOrder=0;R3.scene.add(R3.base);
  /* Glasquader */
  R3.tg=inst(new T.BoxGeometry(1,1,1));
  R3.tileMat=new T.ShaderMaterial({transparent:true,uniforms:{uLight:{value:new T.Vector3()},uLightCol:{value:new T.Vector3(1,1,1)},uLightI:{value:0},uWave:{value:-1e4}},
    vertexShader:`attribute vec3 aPos;attribute vec3 aSize;attribute vec3 aCol;attribute vec2 aFx;uniform float uWave;
     varying vec3 vN;varying vec3 vL;varying vec3 vS;varying vec3 vCol;varying vec2 vFx;varying vec3 vW;
     void main(){vec3 p=position*aSize+aPos;float d=(aPos.x-aPos.y)-uWave;float bump=exp(-d*d*.06)*step(aFx.y,.5);p.z+=bump*.55;
      vN=normal;vL=position*aSize;vS=aSize;vCol=aCol;vFx=vec2(aFx.x+bump*.45,aFx.y);vW=p;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}`,
    fragmentShader:`uniform vec3 uLight;uniform vec3 uLightCol;uniform float uLightI;
     varying vec3 vN;varying vec3 vL;varying vec3 vS;varying vec3 vCol;varying vec2 vFx;varying vec3 vW;
     void main(){vec3 n=normalize(vN);vec3 hs=vS*.5;float top=step(.5,n.z);float kind=vFx.y;
      float dT=min(hs.x-abs(vL.x),hs.y-abs(vL.y));float rim=1.-smoothstep(0.,.075,dT);float hg=vL.z/vS.z+.5;float ny=vL.y/vS.y+.5;
      vec3 col;float a=1.;
      if(top>.5){col=vCol*(.9+.14*ny)+rim*.2+.07*smoothstep(.5,1.,ny);
        float gl=1.-smoothstep(0.,.13,length(vec2(vL.x+hs.x-.2,hs.y-vL.y-.2)));col+=gl*.28;}
      else{float sh=n.y<-.5?.66:(abs(n.x)>.5?.5:.42);col=vCol*sh*(.62+.5*hg)+.16*pow(hg,5.);}
      vec3 Vd=normalize(cameraPosition-vW);vec3 Ld=uLight-vW;float dist=length(Ld);vec3 L=Ld/dist;float att=uLightI/(1.+dist*dist*.3);
      col+=uLightCol*att*(.2+.8*max(dot(n,L),0.));col+=att*pow(max(dot(n,normalize(L+Vd)),0.),28.)*.9;
      col=mix(col,vec3(1.),clamp(vFx.x,0.,1.)*.7);
      if(kind>.5){vec3 c2=kind<1.5?vec3(1.):(kind<2.5?vec3(1.,.36,.56):vCol);
        if(kind>2.5){col=c2*(top>.5?1.:.6)+rim*.5;a=.5+rim*.5;}else{col=c2*(top>.5?1.:.7);a=(top>.5?.16:.3)+rim*.6;}}
      gl_FragColor=vec4(col,a);}`});
  R3.tiles=new T.Mesh(R3.tg,R3.tileMat);R3.tiles.frustumCulled=false;R3.tiles.renderOrder=1;R3.scene.add(R3.tiles);
  /* Zahlen */
  const ac=document.createElement('canvas');ac.width=2048;ac.height=1024;const ax=ac.getContext('2d');ax.fillStyle='#fff';ax.textAlign='center';ax.textBaseline='middle';
  R3.numAtlas=()=>{ax.clearRect(0,0,2048,1024);for(let n=1;n<128;n++){ax.font=`700 ${n>9?84:98}px PixNum,Figtree,system-ui,sans-serif`;ax.fillText(n,(n%16)*128+64,Math.floor(n/16)*128+68)}if(R3.atlas)R3.atlas.needsUpdate=true};R3.numAtlas();
  R3.atlas=new T.CanvasTexture(ac);R3.atlas.anisotropy=4;
  R3.cg=inst(new T.PlaneGeometry(1,1));
  R3.clueMat=new T.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,uniforms:{uTex:{value:R3.atlas}},
    vertexShader:`attribute vec3 aPos;attribute vec3 aCol;attribute vec4 aP;varying vec2 vUv;varying vec3 vCol;varying vec4 vP;
     void main(){vUv=uv;vCol=aCol;vP=aP;gl_Position=projectionMatrix*viewMatrix*vec4(vec3(position.xy*.8,0.)+aPos,1.);}`,
    fragmentShader:`uniform sampler2D uTex;varying vec2 vUv;varying vec3 vCol;varying vec4 vP;
     void main(){vec2 q=vUv-.5;vec2 d=abs(q)-vec2(.34);float sd=length(max(d,0.))-.16;float chip=(1.-smoothstep(-.03,.02,sd))*vP.y;
      float n=vP.x;vec2 cell=vec2(mod(n,16.),floor(n/16.));vec2 tuv=vec2((cell.x+.5+q.x*.95)/16.,1.-(cell.y+.5-q.y*.95)/8.);
      float g=texture2D(uTex,tuv).a;vec3 ink=mix(vec3(.04,.1,.14),vec3(1.),vP.z);
      vec3 col=mix(vCol*(.92+.3*smoothstep(-.1,.5,q.y)),ink,g);float a=max(chip,g)*vP.w;if(a<.01)discard;gl_FragColor=vec4(col,a);}`});
  R3.clues=new T.Mesh(R3.cg,R3.clueMat);R3.clues.frustumCulled=false;R3.clues.renderOrder=2;R3.scene.add(R3.clues);
  /* Partikel und Glow */
  const PN=900,pg=new T.BufferGeometry();
  for(const[n,z]of[['position',3],['aC',3],['aS',2]]){const a=new T.BufferAttribute(new Float32Array(PN*z),z);a.setUsage(T.DynamicDrawUsage);pg.setAttribute(n,a)}
  R3.pg=pg;R3.PN=PN;
  R3.partMat=new T.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending,uniforms:{uPx:{value:30}},
    vertexShader:`attribute vec3 aC;attribute vec2 aS;uniform float uPx;varying vec3 vC;varying float vA;void main(){vC=aC;vA=aS.y;gl_Position=projectionMatrix*viewMatrix*vec4(position,1.);gl_PointSize=aS.x*uPx;}`,
    fragmentShader:`varying vec3 vC;varying float vA;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(vC,a*a*vA);}`});
  R3.points=new T.Points(pg,R3.partMat);R3.points.frustumCulled=false;R3.points.renderOrder=3;R3.scene.add(R3.points);
  R3.capT=0;R3.capC=0;R3.ready=true;
}
R3.alloc=(geo,specs,n)=>{delete geo._maxInstanceCount;for(const[name,z]of specs){const a=new THREE.InstancedBufferAttribute(new Float32Array(n*z),z);a.setUsage(THREE.DynamicDrawUsage);geo.setAttribute(name,a)}};
R3.col=h=>R3.rgb[h]||(R3.rgb[h]=hex2rgb(h).map(v=>v/255));
R3.syncCam=()=>{const s=V.s,c=R3.cam,tx=(cw/2-V.ox)/s,ty=(ch/2-V.oy)/s,d=(ch/s)/(2*Math.tan(c.fov*Math.PI/360)),t=R3.tilt;
  c.aspect=cw/ch;c.near=d*.05;c.far=d*5+60;c.position.set(tx,-ty-d*Math.sin(t),d*Math.cos(t));c.up.set(0,1,0);c.lookAt(tx,-ty,0);c.updateProjectionMatrix();c.updateMatrixWorld(true)};
R3.cell=(px,py)=>{R3.syncCam();const c=R3.cam,v=new THREE.Vector3(px/cw*2-1,1-py/ch*2,.5).unproject(c).sub(c.position);let o=null;
  for(const L of[R3.hT,R3.hT*.62,.1,0]){const t=(L-c.position.z)/v.z;o={x:Math.floor(c.position.x+v.x*t),y:Math.floor(-(c.position.y+v.y*t))};if(!L||o.x<0||o.y<0||o.x>=G.W||o.y>=G.H)continue;
    const r=G.rects.get(G.cellR[o.y*G.W+o.x]),h=r?(r.valid?(r.lock&&r.w*r.h===1?R3.hT*.62:R3.hT):.1):0;if(h>=L-1e-6)return o}
  return o};
R3.spawn=(x,y,z,vx,vy,vz,life,size,c,grav)=>{if(R3.parts.length<R3.PN)R3.parts.push({x,y,z,vx,vy,vz,t:0,life,size,c,grav})};
R3.busyUntil=0;
R3.burst=r=>{if(!use3D()||reduce)return;const c=R3.col(r.col),cx=r.x+r.w/2,cy=-(r.y+r.h/2),n=Math.min(46,12+r.w*r.h*3),hot=c.map(v=>v*.6+.4);
  for(let i=0;i<n;i++){const px=r.x+Math.random()*r.w,py=-(r.y+Math.random()*r.h),dx=px-cx,dy=py-cy,l=Math.hypot(dx,dy)||1,sp=.8+Math.random()*2.4;
    R3.spawn(px,py,.4,dx/l*sp,dy/l*sp,1.5+Math.random()*3.5,.5+Math.random()*.6,.14+Math.random()*.2,hot,5)}
  R3.spawn(cx,cy,.45,0,0,0,.55,Math.max(r.w,r.h)*2.6+1.2,c.map(v=>v*.5+.25),0);
  R3.light={t0:performance.now(),i:2.4,x:cx,y:cy,c:hot};R3.busyUntil=performance.now()+1300};
R3.puff=r=>{if(!use3D()||reduce)return;for(let i=0;i<10;i++)R3.spawn(r.x+Math.random()*r.w,-(r.y+Math.random()*r.h),.2,(Math.random()-.5)*1.5,(Math.random()-.5)*1.5,.6+Math.random()*1.4,.45,.12+Math.random()*.12,[.55,.62,.66],2);R3.busyUntil=performance.now()+600};
R3.winFx=()=>{if(!use3D()||reduce)return;const rs=[...G.rects.values()].filter(r=>r.valid).sort(()=>Math.random()-.5).slice(0,160);
  for(const r of rs){const c=R3.col(r.col).map(v=>v*.6+.4),dl=(r.x+r.w/2+r.y+r.h/2)/(G.W+G.H)*1.0;
    for(let i=0;i<3;i++)R3.parts.length<R3.PN&&R3.parts.push({x:r.x+Math.random()*r.w,y:-(r.y+Math.random()*r.h),z:.5,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,vz:2+Math.random()*4,t:-dl,life:.9+Math.random()*.6,size:.16+Math.random()*.22,c,grav:5})}
  R3.busyUntil=performance.now()+3000};
R3.render=now=>{
  const T=THREE,{W,H,puz}=G,s=V.s,dt=Math.min(.05,Math.max(0,(now-R3.last)/1000));R3.last=now;
  const pr=Math.min(2,dpr);if(R3.w!==cw||R3.h!==ch||R3.pr!==pr){R3.r.setPixelRatio(pr);R3.r.setSize(cw,ch,false);R3.w=cw;R3.h=ch;R3.pr=pr}
  R3.syncCam();
  const wt=G.winT,k=1-wt*wt*(3-2*wt);
  R3.base.scale.set(W+.7,H+.7,1);R3.base.position.set(W/2,-H/2,0);R3.baseMat.uniforms.uWH.value.set(W,H);R3.baseMat.uniforms.uPx.value=1/s;R3.baseMat.uniforms.uGrid.value=s>=7?k:0;
  /* Quader */
  const n=G.rects.size+1;if(n>R3.capT){R3.capT=Math.max(512,Math.ceil(n*1.5));R3.alloc(R3.tg,[['aPos',3],['aSize',3],['aCol',3],['aFx',2]],R3.capT)}
  const A=R3.tg.attributes,P=A.aPos.array,Z=A.aSize.array,C=A.aCol.array,F=A.aFx.array,gap=.075*k,hT=R3.hT;let i=0;
  const put=(x,y,w,h,z,dz,c,fl,kind)=>{P[i*3]=x+w/2;P[i*3+1]=-(y+h/2);P[i*3+2]=z/2+dz;Z[i*3+2]=z;C[i*3]=c[0];C[i*3+1]=c[1];C[i*3+2]=c[2];F[i*2]=fl;F[i*2+1]=kind;i++};
  const WHITE=[1,1,1];
  for(const r of G.rects.values()){
    if(!r.valid){Z[i*3]=r.w-.12;Z[i*3+1]=r.h-.12;put(r.x,r.y,r.w,r.h,.1,0,WHITE,0,r.wrong?2:1);continue}
    const age=now-r.t0,[hop,kl]=wv(r,now);let fl=.32*hop,dz=hop*1.05,sc=1+.17*hop;
    if(age<320){const t=age/320,u=1-t;fl=u*u;dz=u*u*.9;sc=.86+.14*(1-u*u*u)}
    const g2=.075*kl,hh=(r.lock&&r.w*r.h===1?hT*.62:hT)*(.22+.78*kl);r._h=hh+dz;r._k=kl;
    Z[i*3]=(r.w-g2)*sc;Z[i*3+1]=(r.h-g2)*sc;put(r.x,r.y,r.w,r.h,hh,dz,R3.col(r.col),fl,0)}
  if(drag){const d=dragRect(),e=evalRect(d.x,d.y,d.w,d.h);Z[i*3]=d.w-.04;Z[i*3+1]=d.h-.04;const bl=blockedAt(d.x,d.y,d.w,d.h);put(d.x,d.y,d.w,d.h,.56,0,e.valid&&!bl?R3.col(e.col):WHITE,0,bl?2:3)}
  R3.tg.instanceCount=i;A.aPos.needsUpdate=A.aSize.needsUpdate=A.aCol.needsUpdate=A.aFx.needsUpdate=true;
  /* Zahlen */
  R3.clues.visible=s>=5&&k>0;
  if(R3.clues.visible){const m=puz.rects.length;if(m>R3.capC){R3.capC=Math.ceil(m*1.1)+8;R3.alloc(R3.cg,[['aPos',3],['aCol',3],['aP',4]],R3.capC)}
    const B=R3.cg.attributes,p=B.aPos.array,c=B.aCol.array,q=B.aP.array,colr=G.diff.color;let j=0;
    for(const sr of puz.rects){const nn=sr.w*sr.h;if(nn===1)continue;const ci=sr.cy*W+sr.cx,id=G.cellR[ci],r=id>=0?G.rects.get(id):null,on=r&&r.valid,hex=puz.colors[puz.cells[ci]],cc=R3.col(hex);
      p[j*3]=sr.cx+.5;p[j*3+1]=-(sr.cy+.5);p[j*3+2]=on?(r._h||hT)+.02:(r?.13:.03);c[j*3]=cc[0];c[j*3+1]=cc[1];c[j*3+2]=cc[2];
      q[j*4]=Math.min(127,nn);q[j*4+1]=!on&&colr?1:0;q[j*4+2]=(on?inkOn(r.col):(colr?inkOn(hex):'#ffffff'))==='#ffffff'?1:0;q[j*4+3]=on?.8*(r._k===undefined?1:r._k):k;j++}
    R3.cg.instanceCount=j;B.aPos.needsUpdate=B.aCol.needsUpdate=B.aP.needsUpdate=true}
  /* Licht, Welle, Partikel */
  const U=R3.tileMat.uniforms,L=R3.light,li=L.i*Math.exp(-(now-L.t0)/380);U.uLightI.value=li>.01?li:0;
  if(li>.01){U.uLight.value.set(L.x,L.y,1.5);U.uLightCol.value.set(L.c[0],L.c[1],L.c[2])}
  U.uWave.value=-1e4;
  const pa=R3.pg.attributes,pp=pa.position.array,pc=pa.aC.array,ps=pa.aS.array;let m=0;
  for(let a=R3.parts.length-1;a>=0;a--){const o=R3.parts[a];o.t+=dt;if(o.t>=o.life){R3.parts.splice(a,1);continue}if(o.t<0)continue;
    o.vz-=o.grav*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;o.z+=o.vz*dt;const u=o.t/o.life;
    pp[m*3]=o.x;pp[m*3+1]=o.y;pp[m*3+2]=Math.max(.05,o.z);pc[m*3]=o.c[0];pc[m*3+1]=o.c[1];pc[m*3+2]=o.c[2];ps[m*2]=o.size*(o.grav?1-u*.5:.6+u*.6);ps[m*2+1]=o.grav?1-u*u:(1-u)*.55;m++}
  R3.pg.setDrawRange(0,m);pa.position.needsUpdate=pa.aC.needsUpdate=pa.aS.needsUpdate=true;R3.partMat.uniforms.uPx.value=s*pr;
  R3.r.render(R3.scene,R3.cam);
};
R3.busy=now=>R3.parts.length>0||now<R3.busyUntil;
function setView(on,user){
  const done=()=>{$('#gl').hidden=!use3D();if(G)requestDraw()};
  if(user)store.set('view',on?'3d':'2d');
  R3.on=on;done();if(!on||R3.failed)return Promise.resolve();
  return load3D().then(done).catch(()=>{R3.failed=true;done();if(!R3.told){R3.told=1;toast('Die 3D-Ansicht läuft auf diesem Gerät nicht. Das Brett bleibt in 2D.',3400)}});
}
