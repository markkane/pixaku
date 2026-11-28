/* ---------- Start der App: Spiele anmelden lassen, Startseite zeichnen, auf Größe und Pausen reagieren ---------- */
Shell.init();drawLogo(true);let rzT=0;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{Shell.each('onResize');if($('#home').classList.contains('on')){drawLogo(false);heroStart()}},200)});
/* Nach einer Pause wirft Android gezeichnete Flächen weg: beim Zurückkehren alles neu zeichnen */
function refreshVisuals(){
  try{Shell.each('onWake');
    if($('#home').classList.contains('on')){drawLogo(false);refreshHome()}
  }catch(e){}}
let rvT=0,hidAt=0;
const wake=()=>{if(document.hidden){hidAt=Date.now();return}if(!hidAt||performance.now()<5000||Date.now()-hidAt<1500)return;hidAt=0;clearTimeout(rvT);refreshVisuals();rvT=setTimeout(refreshVisuals,700)};
document.addEventListener('visibilitychange',wake);addEventListener('pageshow',e=>{if(e.persisted)wake()});
for(const id of['logo','hero'])document.getElementById(id).addEventListener('contextrestored',()=>{clearTimeout(rvT);rvT=setTimeout(refreshVisuals,60)});
refreshHome();
