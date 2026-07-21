// install-banner.js — Bannière "Installer l'application" pour EtaChop
// Gère Android/Chrome (installation directe) et iPhone/Safari (instructions manuelles)

(function(){
  // Ne rien montrer si déjà installée (mode standalone)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if(isStandalone) return;

  // Ne pas ré-embêter quelqu'un qui a déjà fermé la bannière
  if(localStorage.getItem('etachop_install_dismissed') === 'true') return;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  let deferredPrompt = null;

  const wrap = document.createElement('div');
  wrap.id = 'eta-install-banner';
  wrap.innerHTML = `
    <style>
      #eta-install-banner{
        position:fixed; top:0; left:0; right:0; background:#1D1D1D; color:#fff;
        display:none; align-items:center; justify-content:space-between; gap:10px;
        padding:10px 14px; z-index:100; font-family:'Poppins',sans-serif; box-shadow:0 2px 10px rgba(0,0,0,0.15);
      }
      #eta-install-banner.show{ display:flex; }
      #eta-install-banner .eta-ib-text{ font-size:0.8rem; font-weight:600; flex:1; }
      #eta-install-banner .eta-ib-btn{ background:#E63946; color:#fff; border:none; padding:8px 14px; border-radius:100px; font-size:0.78rem; font-weight:700; cursor:pointer; white-space:nowrap; font-family:'Poppins',sans-serif; }
      #eta-install-banner .eta-ib-close{ background:none; border:none; color:#fff; opacity:0.6; font-size:1rem; cursor:pointer; padding:4px; }
      #eta-ios-instructions{
        display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:101;
        align-items:center; justify-content:center; padding:20px;
      }
      #eta-ios-instructions.show{ display:flex; }
      #eta-ios-instructions .box{ background:#fff; border-radius:16px; padding:24px; max-width:340px; text-align:center; font-family:'Poppins',sans-serif; color:#1D1D1D; }
      #eta-ios-instructions .box h3{ font-family:'Montserrat',sans-serif; font-size:1.1rem; margin-bottom:14px; }
      #eta-ios-instructions .box p{ font-size:0.88rem; line-height:1.6; margin-bottom:16px; }
      #eta-ios-instructions .box button{ background:#E63946; color:#fff; border:none; padding:10px 20px; border-radius:100px; font-weight:700; cursor:pointer; font-family:'Poppins',sans-serif; }
    </style>
    <span class="eta-ib-text">📲 Installe EtaChop comme une application</span>
    <button class="eta-ib-btn" id="eta-ib-install-btn">Installer</button>
    <button class="eta-ib-close" id="eta-ib-close-btn">✕</button>
  `;
  document.body.appendChild(wrap);

  const iosModal = document.createElement('div');
  iosModal.id = 'eta-ios-instructions';
  iosModal.innerHTML = `
    <div class="box">
      <h3>Installer EtaChop</h3>
      <p>Touche le bouton <strong>Partager</strong> 📤 en bas de Safari, puis choisis <strong>« Sur l'écran d'accueil »</strong>.</p>
      <button id="eta-ios-ok">Compris</button>
    </div>
  `;
  document.body.appendChild(iosModal);

  document.getElementById('eta-ib-close-btn').onclick = () => {
    wrap.classList.remove('show');
    localStorage.setItem('etachop_install_dismissed', 'true');
  };
  document.getElementById('eta-ios-ok').onclick = () => iosModal.classList.remove('show');

  if(isIOS){
    wrap.classList.add('show');
    document.body.style.paddingTop = '46px';
    document.getElementById('eta-ib-install-btn').onclick = () => iosModal.classList.add('show');
  } else {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      wrap.classList.add('show');
      document.body.style.paddingTop = '46px';
    });
    document.getElementById('eta-ib-install-btn').onclick = async () => {
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      wrap.classList.remove('show');
      document.body.style.paddingTop = '';
    };
  }

  document.getElementById('eta-ib-close-btn').addEventListener('click', () => {
    document.body.style.paddingTop = '';
  });

  window.addEventListener('appinstalled', () => { wrap.classList.remove('show'); document.body.style.paddingTop = ''; });
})();
