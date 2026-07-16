// assistant.js — Assistant virtuel EtaChop (clients + vendeurs)
// Inclus sur explore.html, store.html et dashboard.html

(function(){
  const FAQ = {
    client: [
      { q: "Comment passer une commande ?", a: "Choisis un produit sur une boutique, touche « Acheter maintenant », remplis ton nom et ton numéro. Le vendeur te contactera pour finaliser le paiement et la livraison." },
      { q: "Comment suivre ma commande ?", a: "Va sur la page « Suivre ma commande », entre le numéro de téléphone utilisé pour commander — tu verras toutes tes commandes et leur statut." },
      { q: "Quels moyens de paiement ?", a: "Chaque vendeur indique ses moyens de paiement (MTN Mobile Money, Airtel Money) au moment de la commande." },
      { q: "Comment contacter un vendeur ?", a: "Sur la page de sa boutique, touche le bouton WhatsApp 💬 en bas à droite, ou passe commande et il te recontactera." },
    ],
    vendeur: [
      { q: "Comment créer ma boutique ?", a: "Va sur etachop.com/dashboard/dashboard/, crée un compte, puis suis les étapes pour créer ta boutique en 2 minutes." },
      { q: "Combien coûte l'abonnement ?", a: "7 jours d'essai gratuit, puis 5 000 FCFA/mois. Le paiement se fait depuis Menu → Mon abonnement dans ton tableau de bord." },
      { q: "Comment ajouter un produit ?", a: "Depuis ton tableau de bord, onglet « Produits », remplis le formulaire « Ajouter un produit » avec au moins une photo." },
      { q: "Comment gérer mes commandes ?", a: "Onglet « Ventes » de ton tableau de bord — tu peux changer le statut de chaque commande (Confirmée, En préparation, Expédiée, Livrée)." },
    ],
  };

  function buildWidget(mode){
    // mode: 'client' ou 'vendeur' ou 'both' (les deux catégories affichées)
    const wrap = document.createElement('div');
    wrap.id = 'eta-assistant';
    wrap.innerHTML = `
      <style>
        #eta-assistant-btn{
          position:fixed; bottom:20px; left:20px; background:#1D1D1D; color:#fff; width:56px; height:56px;
          border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 16px rgba(0,0,0,0.25);
          cursor:pointer; font-size:1.5rem; z-index:75; border:none;
        }
        #eta-assistant-panel{
          position:fixed; bottom:86px; left:20px; width:min(320px, calc(100vw - 40px)); max-height:70vh;
          background:#fff; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.2); z-index:75;
          display:none; flex-direction:column; overflow:hidden; font-family:'Poppins',sans-serif;
        }
        #eta-assistant-panel.open{ display:flex; }
        #eta-assistant-header{ background:#1D1D1D; color:#fff; padding:14px 16px; font-weight:700; font-size:0.92rem; display:flex; justify-content:space-between; align-items:center; }
        #eta-assistant-header span.close{ cursor:pointer; opacity:0.7; }
        #eta-assistant-body{ padding:14px; overflow-y:auto; flex:1; }
        .eta-a-msg{ background:#F3F3F3; border-radius:10px; padding:10px 12px; font-size:0.85rem; margin-bottom:12px; line-height:1.5; }
        .eta-a-cat{ font-size:0.72rem; text-transform:uppercase; opacity:0.5; font-weight:700; margin:10px 0 6px; }
        .eta-a-q{ display:block; width:100%; text-align:left; background:#fff; border:1.5px solid rgba(0,0,0,0.1); border-radius:10px; padding:9px 12px; font-size:0.82rem; margin-bottom:6px; cursor:pointer; font-family:'Poppins',sans-serif; }
        .eta-a-q:hover{ border-color:#E63946; }
        .eta-a-answer{ background:#FDEDEE; border-left:3px solid #E63946; border-radius:8px; padding:10px 12px; font-size:0.83rem; margin-bottom:10px; line-height:1.5; }
        .eta-a-back{ font-size:0.78rem; color:#E63946; cursor:pointer; font-weight:600; margin-bottom:10px; display:inline-block; }
      </style>
      <button id="eta-assistant-btn">💡</button>
      <div id="eta-assistant-panel">
        <div id="eta-assistant-header">
          <span>Assistant EtaChop</span>
          <span class="close">✕</span>
        </div>
        <div id="eta-assistant-body"></div>
      </div>
    `;
    document.body.appendChild(wrap);

    const panel = wrap.querySelector('#eta-assistant-panel');
    const btn = wrap.querySelector('#eta-assistant-btn');
    const closeBtn = wrap.querySelector('.close');
    const body = wrap.querySelector('#eta-assistant-body');

    btn.onclick = () => { panel.classList.toggle('open'); if(panel.classList.contains('open')) renderMenu(); };
    closeBtn.onclick = () => panel.classList.remove('open');

    function renderMenu(){
      let html = `<div class="eta-a-msg">👋 Bonjour ! Je peux t'aider avec quelques questions fréquentes.</div>`;
      const categories = mode === 'both' ? ['client','vendeur'] : [mode];
      categories.forEach(cat => {
        html += `<div class="eta-a-cat">${cat === 'client' ? 'Questions clients' : 'Questions vendeurs'}</div>`;
        FAQ[cat].forEach((item, i) => {
          html += `<button class="eta-a-q" onclick="window.__etaAssistantAnswer('${cat}', ${i})">${item.q}</button>`;
        });
      });
      html += `<div class="eta-a-cat">Toujours besoin d'aide ?</div><div class="eta-a-msg">Écris-nous directement sur <a href="mailto:support@etachop.com">support@etachop.com</a></div>`;
      body.innerHTML = html;
    }

    window.__etaAssistantAnswer = function(cat, i){
      const item = FAQ[cat][i];
      body.innerHTML = `
        <span class="eta-a-back" onclick="window.__etaAssistantBack()">← Retour</span>
        <div class="eta-a-msg">${item.q}</div>
        <div class="eta-a-answer">${item.a}</div>
      `;
    };
    window.__etaAssistantBack = renderMenu;
  }

  window.initEtaAssistant = buildWidget;
})();
