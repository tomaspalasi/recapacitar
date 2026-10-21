const panels=[...document.querySelectorAll('.panel')];
    const tabs=[...document.querySelectorAll('.tab')];
    const socialButtons=[...document.querySelectorAll('.social')];
    const viewRecap=document.getElementById('viewRecap');
    const toast=document.getElementById('toast');
    const analysisLoader=document.getElementById('analysisLoader');
    const loaderStatus=document.getElementById('loaderStatus');
    const loaderProgressBar=document.getElementById('loaderProgressBar');
    const loaderPercent=document.getElementById('loaderPercent');
    let isAnalyzing=false;
    let loggedIn=false;
    let connected=new Set();
    let current=1;

    function say(message){
      toast.textContent=message;toast.classList.add('show');
      clearTimeout(window.__toast);window.__toast=setTimeout(()=>toast.classList.remove('show'),2200);
    }
    function unlock(){
      tabs.forEach(t=>{if(+t.dataset.go>1)t.classList.remove('locked')});
    }
    function goTo(n,force=false){
      n=Number(n);
      if(n>1&&!loggedIn&&!force){say('Conectá al menos una red para continuar.');return;}
      current=n;
      panels.forEach(p=>p.classList.toggle('active',+p.dataset.screen===n));
      tabs.forEach(t=>t.classList.toggle('active',+t.dataset.go===n));
      history.replaceState(null,'','#'+['','conectar','actividad','recap','accion'][n]);
      window.scrollTo({top:0,behavior:'smooth'});
    }
    document.addEventListener('click',e=>{
      const g=e.target.closest('[data-go]');
      if(g) goTo(g.dataset.go);
    });
    socialButtons.forEach(btn=>btn.addEventListener('click',()=>{
      const social=btn.dataset.social;
      if(connected.has(social)){connected.delete(social);btn.classList.remove('connected');btn.querySelector('.service').textContent='Conectar '+social;btn.querySelector('.handle').textContent='@usuario';}
      else{connected.add(social);btn.classList.add('connected');btn.querySelector('.service').textContent='Conectado a '+social;btn.querySelector('.handle').textContent='@JuanPerez';}
      loggedIn=connected.size>0;
      viewRecap.disabled=!loggedIn;
      if(loggedIn) unlock();
      if(connected.size) say((connected.size===1?'Red conectada':'Redes conectadas'));
    }));
    function startAccountAnalysis(){
      if(!loggedIn||isAnalyzing)return;
      isAnalyzing=true;
      viewRecap.disabled=true;
      document.body.classList.add('is-analyzing');
      analysisLoader.classList.add('active');
      analysisLoader.setAttribute('aria-hidden','false');
      loaderProgressBar.style.width='0%';
      loaderPercent.textContent='0%';
      loaderStatus.textContent='Conectando tus cuentas…';

      const stages=[
        {at:0,text:'Conectando tus cuentas…'},
        {at:24,text:'Leyendo publicaciones e interacciones…'},
        {at:52,text:'Analizando lenguaje y patrones…'},
        {at:78,text:'Ordenando tu actividad del año…'},
        {at:96,text:'Finalizando análisis…'}
      ];
      const duration=3200;
      const started=performance.now();
      let stageIndex=0;

      function frame(now){
        const elapsed=Math.min(now-started,duration);
        const linear=elapsed/duration;
        const progress=Math.min(100,Math.round((1-Math.pow(1-linear,1.22))*100));
        loaderProgressBar.style.width=progress+'%';
        loaderPercent.textContent=progress+'%';
        while(stageIndex+1<stages.length&&progress>=stages[stageIndex+1].at){
          stageIndex++;
          loaderStatus.textContent=stages[stageIndex].text;
        }
        if(elapsed<duration){
          requestAnimationFrame(frame);
        }else{
          loaderProgressBar.style.width='100%';
          loaderPercent.textContent='100%';
          loaderStatus.textContent='Actividad analizada';
          setTimeout(()=>{
            analysisLoader.classList.remove('active');
            analysisLoader.setAttribute('aria-hidden','true');
            document.body.classList.remove('is-analyzing');
            isAnalyzing=false;
            viewRecap.disabled=!loggedIn;
            goTo(2);
          },420);
        }
      }
      requestAnimationFrame(frame);
    }
    viewRecap.addEventListener('click',startAccountAnalysis);

    document.addEventListener('keydown',e=>{
      if(document.getElementById('shareModal').classList.contains('open')) return;
      if(e.key==='ArrowRight'&&current<4)goTo(current+1);
      if(e.key==='ArrowLeft'&&current>1)goTo(current-1);
    });

    // Story canvas — version 9:16 of screen 3
    const canvas = document.getElementById('storyCanvas');
const ctx = canvas.getContext('2d');

const STORY_FONT = "'ArgentumNovusRegular', 'Argentum Novus', Arial, sans-serif";

function fitText(
  text,
  maxWidth,
  startSize,
  minSize = 28,
  font = STORY_FONT,
  weight = 700
) {
  let size = startSize;

  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${font}`;

    if (ctx.measureText(text).width <= maxWidth) break;

    size -= 2;
  }

  return size;
}

function drawCentered(
  text,
  y,
  size,
  color = '#fff',
  weight = 700,
  font = STORY_FONT
) {
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, 540, y);
}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawStory() {
  ctx.clearRect(0, 0, 1080, 1920);

  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, '#050505');
  grad.addColorStop(.55, '#0d0d0d');
  grad.addColorStop(1, '#181818');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  // Textura sutil
  ctx.globalAlpha = .08;

  for (let i = 0; i < 1600; i++) {
    const x = Math.random() * 1080;
    const y = Math.random() * 1920;
    const s = Math.random() * 1.8 + .4;

    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, s, s);
  }

  ctx.globalAlpha = 1;

  /* =========================
     FIN DE DAÑO
  ========================= */

  ctx.font = `900 116px ${STORY_FONT}`;
  ctx.textAlign = 'left';
  ctx.letterSpacing = '-.10em';
  ctx.textBaseline = 'alphabetic';

  const wD = ctx.measureText('RECAP').width;
  const wRest = ctx.measureText('ACITAR').width;

  const total = wD + wRest;

  let sx = 540 - total / 2;


  ctx.fillStyle = '#fff200';
  ctx.fillText('RECAP', sx, 170);

  sx += wD;

  ctx.fillStyle = '#fff';
  ctx.fillText('ACITAR', sx, 170);


  /* =========================
     2026
  ========================= */

  roundedRect(
    355,
    215,
    370,
    96,
    0,
    '#fff200'
  );

  drawCentered(
    '2026',
    290,
    72,
    '#050505',
    750
  );


  /* =========================
     NIVEL DE CRUELDAD
  ========================= */

  drawCentered(
    'TU NIVEL DE CRUELDAD:',
    410,
    54,
    '#fff',
    700
  );

  drawCentered(
    '1 de cada 51',
    560,
    128,
    '#fff200',
    750
  );


  /* =========================
     PUBLICACIONES CONTIENEN ODIO
  ========================= */

  const s = fitText(
    'PUBLICACIONES CONTIENEN ODIO',
    930,
    66,
    46,
    STORY_FONT,
    700
  );

  drawCentered(
    'PUBLICACIONES CONTIENEN ODIO',
    650,
    s,
    '#fff',
    700
  );


  /* =========================
     5 INSULTOS POR DÍA
  ========================= */

  roundedRect(
    220,
    705,
    640,
    98,
    0,
    '#f5f5f5'
  );

  drawCentered(
    '5 INSULTOS POR DÍA',
    778,
    58,
    '#050505',
    750
  );


  /* =========================
     INSULTOS FAVORITOS
  ========================= */

  ctx.textAlign = 'left';

  ctx.fillStyle = '#fff';
  ctx.font = `750 52px ${STORY_FONT}`;

  ctx.fillText(
    'TUS INSULTOS FAVORITOS:',
    110,
    920
  );

  ctx.fillStyle = '#fff200';
  ctx.font = `700 50px ${STORY_FONT}`;

  [
    '1.  IMBÉCIL',
    '2.  PELOTUDO',
    '3.  MIERDA',
    '4.  INFRADOTADO',
    '5.  IDIOTA'
  ].forEach((t, i) => {
    ctx.fillText(
      t,
      120,
      1000 + i * 72
    );
  });


  /* =========================
     VÍCTIMAS PREFERIDAS
  ========================= */

  ctx.fillStyle = '#fff';
  ctx.font = `750 52px ${STORY_FONT}`;

  ctx.fillText(
    'VÍCTIMAS PREFERIDAS:',
    110,
    1420
  );

  ctx.fillStyle = '#fff200';
  ctx.font = `700 48px ${STORY_FONT}`;

  [
    '1.  @luna_12',
    '2.  @toto_mock',
    '3.  @ana_bts',
    '4.  @pato_cabj',
    '5.  @nico_fortin'
  ].forEach((t, i) => {
    ctx.fillText(
      t,
      120,
      1500 + i * 67
    );
  });


  /* =========================
     FOOTER
  ========================= */

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = `500 30px ${STORY_FONT}`;

  ctx.fillText(
    '@JuanPerez · RECAPACITAR 2026',
    540,
    1860
  );
}


// Espera a que Argentum Novus termine de cargar
// antes de renderizar el canvas.

if (document.fonts) {
  document.fonts.ready.then(() => {
    drawStory();
  });
} else {
  drawStory();
}

    const modal=document.getElementById('shareModal');
    document.getElementById('shareRecap').addEventListener('click',()=>{drawStory();modal.classList.add('open')});
    document.getElementById('closeModal').addEventListener('click',()=>modal.classList.remove('open'));
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')});

    function downloadStory(){
      canvas.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='fin-de-dano-2026-juanperez.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},'image/png');
    }
    document.querySelectorAll('[data-share]').forEach(b=>b.addEventListener('click',async()=>{
      const kind=b.dataset.share;const page=location.href.split('#')[0]+'#recap';const text='Mi RECAPACITAR 2026: 1 de cada 51 publicaciones contienen odio.';
      if(kind==='copy'){try{await navigator.clipboard.writeText(page);say('Link copiado.')}catch{say('No se pudo copiar automáticamente.')}}
      if(kind==='download'){downloadStory();say('Descargando historia 1080×1920.')}
      if(kind==='instagram'){downloadStory();say('Historia descargada: abrila en Instagram para compartirla.')}
      if(kind==='x'){window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(text+' '+page),'_blank')}
      if(kind==='whatsapp'){window.open('https://wa.me/?text='+encodeURIComponent(text+' '+page),'_blank')}
    }));

    // For direct prototype review, hashes route only after login. Start at 1 deliberately.
    goTo(1,true);
