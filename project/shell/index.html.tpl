<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>Pixaku</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Pixelify+Sans:wght@500;700&display=swap" rel="stylesheet">
<style>
@font-face{font-family:'PixNum';font-weight:400 800;font-display:block;src:url(data:font/woff2;base64,__PIXNUM__) format('woff2');unicode-range:U+30-39}
%%INCLUDE shell/css/base.css%%
%%INCLUDE games/pixaku/css/arcade.css%%
%%INCLUDE shell/css/skins.css%%
%%INCLUDE games/quest/css/level.css%%
%%INCLUDE shell/css/selector.css%%
%%INCLUDE games/quest/css/screens.css%%
%%INCLUDE shell/css/shared.css%%
</style>
</head>
<body>
<div id="bg"><i></i><i></i><i></i></div>
<i id="sa" style="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)"></i>

%%INCLUDE shell/html/home.html%%
%%INCLUDE games/pixaku/html/game.html%%
%%INCLUDE games/quest/html/screens.html%%
%%INCLUDE games/pixaku/html/screens.html%%
<div id="scrim"></div>
<div id="sheet" class="glass" role="dialog" aria-modal="true"></div>
<div id="loader"><div class="glass"><s><u></u><u></u><u></u></s><span id="loadTxt">Rätsel wird gebaut</span></div></div>
<div id="toast" role="status"></div>
%%INCLUDE games/pixaku/html/overlays.html%%
<div id="flash"></div>
<canvas id="fx"></canvas>

<script>
/*__CORE__*/
</script>
<script>
%%INCLUDE shell/js/app.js%%
%%INCLUDE shell/js/games.js%%
%%INCLUDE games/pixaku/js/motive.js%%
%%INCLUDE games/pixaku/js/setup.js%%
/*__R3__*/
%%INCLUDE games/pixaku/js/state.js%%
%%INCLUDE games/pixaku/js/view.js%%
%%INCLUDE games/pixaku/js/input.js%%
%%INCLUDE games/pixaku/js/campaign.js%%
%%INCLUDE games/pixaku/js/records.js%%
%%INCLUDE games/pixaku/js/tutorial.js%%
%%INCLUDE games/pixaku/js/win.js%%
%%INCLUDE games/pixaku/js/arcade.js%%
%%INCLUDE games/pixaku/js/gallery.js%%
%%INCLUDE shell/js/home.js%%
%%INCLUDE games/pixaku/js/home.js%%
/*__GSAP__*/
/*__LAB__*/
%%INCLUDE shell/js/boot.js%%
</script>
</body>
</html>
