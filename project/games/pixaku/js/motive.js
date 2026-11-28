/* ---------- Motive ---------- */
const sizeOf=()=>SIZES[cfg.size];
function uploadPixels(W,H){const sw=uploadSrc.width,sh=uploadSrc.height,src=uploadSrc.data,out=new Uint8ClampedArray(W*H*4);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const x0=Math.floor(x*sw/W),x1=Math.max(x0+1,Math.floor((x+1)*sw/W)),y0=Math.floor(y*sh/H),y1=Math.max(y0+1,Math.floor((y+1)*sh/H));let r=0,g=0,b=0,n=0;
    for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const i=(yy*sw+xx)*4;r+=src[i];g+=src[i+1];b+=src[i+2];n++}
    const o=(y*W+x)*4;out[o]=r/n;out[o+1]=g/n;out[o+2]=b/n;out[o+3]=255}
  return out}
function baseImage(){
  const sp=SPRITES.find(s=>s.id===cfg.motif);if(sp)return spriteImage(sp);
  if(cfg.motif==='upload'&&uploadSrc){const Z=sizeOf(),a=uploadSrc.width/uploadSrc.height,W=Math.max(4,Math.round(a>=1?Z:Z*a)),H=Math.max(4,Math.round(a>=1?Z/a:Z));
    return quantize(uploadPixels(W,H),W,H,cfg.pal==='orig'?10:12)}
  const sc=SCENES.find(s=>s.id===cfg.motif)||SCENES[0];return compact(sc.gen(sizeOf(),mulberry32(seed)));
}
const motifName=()=>cfg.motif==='upload'?'Eigenes Bild':(SPRITES.find(s=>s.id===cfg.motif)||SCENES.find(s=>s.id===cfg.motif)||SCENES[0]).name;
const finalImage=()=>applyPalette(baseImage(),(RAMPS.find(r=>r.id===cfg.pal)||RAMPS[0]).ramp);
const isFixed=()=>!!SPRITES.find(s=>s.id===cfg.motif);

