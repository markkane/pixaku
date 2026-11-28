/* Gemeinsame Helfer für die Regeltests von Pias Quest */
const path=require('path'),crypto=require('crypto'),fs=require('fs');
const SRC=process.env.PX_SRC||path.join(__dirname,'..','..');
const Q=require(path.join(SRC,'games','quest','labcore.js')),P=require(path.join(SRC,'games','pixaku','core.js'));
const level=rows=>Q.labAscii(rows);
const at=(L,x,y)=>y*L.W+x, xy=(L,i)=>[i%L.W,(i/L.W)|0];
/* Alle Haltepunkte und überrollten Felder ab dem Start, ohne Schlösser */
function reach(L,from=L.start,mask=0){const stops=new Map([[from,0]]),pass=new Set([from]),q=[from],bumps=[];
  while(q.length){const p=q.shift();for(let d=0;d<4;d++){const s=Q.labSlide(L,p,d,mask,true);if(!s.cells.length)continue;if(s.dead){bumps.push({from:p,d,dead:true});continue}for(const c of s.cells)pass.add(c);
      const n=s.cells.length,pv=n>1?s.cells[n-2]:p;let dx=s.end%L.W-pv%L.W,dy=((s.end/L.W)|0)-((pv/L.W)|0);const a=L.arr[s.end];if(a>=0){dx=Q.LDIR[a][0];dy=Q.LDIR[a][1]}
      bumps.push({from:p,d,end:s.end,n,target:s.end+dx+dy*L.W,dep:stops.get(p)+1});if(!stops.has(s.end)){stops.set(s.end,stops.get(p)+1);q.push(s.end)}}}
  return{stops,pass,bumps}}
/* Lösung nachspielen: Anzahl nicht beleuchteter Felder, oder 'dead' */
function replay(L,moves){const N=L.W*L.H,p=new Uint8Array(N);let pos=L.start,mask=0,left=0;for(let i=0;i<N;i++)if(L.grid[i]===1)left++;p[pos]=1;left--;
  for(const d of moves){const s=Q.labSlide(L,pos,d,mask);if(s.dead||s.trap||s.bad)return'dead';for(const c of s.cells)if(!p[c]&&L.grid[c]===1){p[c]=1;left--}pos=s.end;mask|=s.keys}return left}
const sha=o=>crypto.createHash('sha1').update(typeof o==='string'?o:JSON.stringify(o)).digest('hex').slice(0,16);
const levelSig=L=>sha([L.W,L.H,L.start,Array.from(L.grid).join(''),Array.from(L.bmp).join(''),Array.from(L.arr).join(','),L.locks,L.ports,L.stars,L.shields||[],L.guards,L.sol.join('')]);
function golden(name,data){const f=path.join(__dirname,'..','golden',name+'.json');if(process.env.UPDATE_GOLDEN||!fs.existsSync(f)){fs.writeFileSync(f,JSON.stringify(data,null,1));return data}return JSON.parse(fs.readFileSync(f,'utf8'))}
module.exports={Q,P,SRC,level,at,xy,reach,replay,sha,levelSig,golden};
