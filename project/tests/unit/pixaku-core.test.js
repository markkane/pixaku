/* Pixaku: Zufall, Farben, Motive und der Rätselgenerator */
const test=require('node:test'),assert=require('node:assert/strict');
const {P,sha,golden}=require('./helpers.js');
test('Zufallsgenerator liefert bei gleichem Startwert die gleiche Folge im Bereich 0 bis 1',()=>{const a=P.mulberry32(42),b=P.mulberry32(42),c=P.mulberry32(43);let diff=false;for(let i=0;i<50;i++){const x=a(),y=b();assert.equal(x,y);assert.ok(x>=0&&x<1);if(c()!==x)diff=true}assert.ok(diff)});
test('Text-Hash ist stabil',()=>{assert.equal(P.hashStr('pixaku'),P.hashStr('pixaku'));assert.notEqual(P.hashStr('a'),P.hashStr('b'))});
test('Jedes Motiv ergibt ein Bild mit gültigen Farbnummern',()=>{assert.ok(P.SPRITES.length>=20);for(const s of P.SPRITES){const img=P.spriteImage(s);assert.ok(img.W>=6&&img.H>=6);assert.equal(img.cells.length,img.W*img.H);for(const c of img.cells)assert.ok(c>=0&&c<img.colors.length)}});
test('Rätsel: Rechtecke decken das Bild lückenlos und ohne Überlappung, jedes ist einfarbig und enthält sein Zahlenfeld',async()=>{for(const k of [0,5,11,17]){for(const max of [6,12]){const img=P.spriteImage(P.SPRITES[k]),p=await P.buildPuzzle(img,max,P.mulberry32(7+k)),seen=new Uint8Array(p.W*p.H);
      for(const r of p.rects){assert.ok(r.w*r.h<=max,'zu groß');assert.ok(r.cx>=r.x&&r.cx<r.x+r.w&&r.cy>=r.y&&r.cy<r.y+r.h);const col=p.cells[r.y*p.W+r.x];for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){const i=y*p.W+x;assert.equal(seen[i],0);seen[i]=1;assert.equal(p.cells[i],col)}}
      assert.ok(seen.every(v=>v===1))}}});
test('Rätselgenerator entspricht dem festgehaltenen Stand',async()=>{const now={};for(const k of [0,3,8,14,20]){const p=await P.buildPuzzle(P.spriteImage(P.SPRITES[k]),10,P.mulberry32(100+k));now[k]=sha(p.rects.map(r=>[r.x,r.y,r.w,r.h,r.cx,r.cy]))}assert.deepEqual(now,golden('pixaku-puzzles',now))});
test('Szenenbilder lassen sich erzeugen',()=>{for(const f of ['sceneSunset','scenePlanet','sceneSkyline','sceneMandala']){const img=P[f](16,P.mulberry32(3));assert.ok(img.W>0&&img.cells.length===img.W*img.H,f)}});
