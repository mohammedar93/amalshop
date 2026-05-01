/* ════════════════════════════════════════════
   BELLE FEMME — script.js
════════════════════════════════════════════ */

var PHONE = '212701115637';

var CAT_LABELS = {
  jeune:  '👗 Collection Femme Jeune (18-35 ans)',
  adulte: '✨ Collection Femme Adulte (35-55 ans)',
  senior: '🌸 Collection Femme Senior (55+ ans)',
};

/* ════════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════════ */

function openCategory(cat) {
  document.getElementById('page-accueil').classList.remove('active');
  document.getElementById('page-' + cat).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  animateCards(cat);
  /* Détecter les vidéos disponibles sur la page ouverte */
  detectVideos();
}

function goBack() {
  ['jeune', 'adulte', 'senior'].forEach(function(cat) {
    document.getElementById('page-' + cat).classList.remove('active');
  });
  document.getElementById('page-accueil').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════════
   ANIMATION ENTRÉE CARTES
════════════════════════════════════════════ */

function animateCards(cat) {
  var page = document.getElementById('page-' + cat);
  var cards = page.querySelectorAll('.product-card');

  cards.forEach(function(card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'none';

    setTimeout(function() {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 90);
  });
}

/* ════════════════════════════════════════════
   SÉLECTION TAILLE
════════════════════════════════════════════ */

document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('size-pill')) return;
  var container = e.target.closest('.size-pills');
  container.querySelectorAll('.size-pill').forEach(function(p) {
    p.classList.remove('selected');
  });
  e.target.classList.add('selected');
});

/* ════════════════════════════════════════════
   SÉLECTION COULEUR
════════════════════════════════════════════ */

document.addEventListener('click', function(e) {
  if (!e.target.classList.contains('color-pill')) return;
  var container = e.target.closest('.color-pills');
  container.querySelectorAll('.color-pill').forEach(function(p) {
    p.classList.remove('selected');
  });
  e.target.classList.add('selected');
});

/* ════════════════════════════════════════════
   DÉTECTION VIDÉO — cache le placeholder
   si un src est renseigné dans <source>
════════════════════════════════════════════ */

function detectVideos() {
  document.querySelectorAll('.video-panel').forEach(function(panel) {
    var source = panel.querySelector('source');
    if (source && source.getAttribute('src') && source.getAttribute('src').trim() !== '') {
      panel.classList.add('has-video');
      /* Mettre aussi le src sur la balise video elle-même pour certains navigateurs */
      var video = panel.querySelector('video');
      if (video) {
        video.src = source.getAttribute('src');
      }
    } else {
      panel.classList.remove('has-video');
    }
  });
}

/* Détecter dès le chargement de la page */
document.addEventListener('DOMContentLoaded', detectVideos);

/* ════════════════════════════════════════════
   BOUTON VIDÉO — déroule/roule le panneau
   Si une vidéo est présente, on la pause
   quand on ferme le panneau
════════════════════════════════════════════ */

function toggleVideo(btn) {
  var panel = btn.closest('.product-info').querySelector('.video-panel');
  var isOpen = panel.classList.contains('open');
  var video = panel.querySelector('video');

  /* Fermer tous les autres panels ouverts sur la page */
  document.querySelectorAll('.video-panel.open').forEach(function(p) {
    p.classList.remove('open');
    /* Pause la vidéo des autres panels */
    var v = p.querySelector('video');
    if (v) v.pause();
  });
  document.querySelectorAll('.video-btn.open').forEach(function(b) {
    b.classList.remove('open');
    b.textContent = '▶ Vidéo';
  });

  /* Basculer celui cliqué */
  if (!isOpen) {
    panel.classList.add('open');
    btn.classList.add('open');

    /* Texte du bouton selon si vidéo dispo ou non */
    if (panel.classList.contains('has-video')) {
      btn.textContent = '✕ Fermer';
    } else {
      btn.textContent = '✕ Fermer';
    }
  } else {
    /* On ferme : pause la vidéo */
    if (video) video.pause();
  }
}

/* ════════════════════════════════════════════
   COMMANDE WHATSAPP
════════════════════════════════════════════ */

function commander(btn, productName, price, cat) {
  var card = btn.closest('.product-card');
  var selectedSize = card.querySelector('.size-pill.selected');
  var selectedColor = card.querySelector('.color-pill.selected');

  if (!selectedSize) {
    shakeWarning(card.querySelector('.size-pills'), '👆 Choisissez une taille');
    return;
  }
  if (!selectedColor) {
    shakeWarning(card.querySelector('.color-pills'), '🎨 Choisissez une couleur');
    return;
  }

  var catLabel = CAT_LABELS[cat] || cat;
  var message =
    '🌸 *Bonjour Belle Femme !*\n\n' +
    'Je souhaite commander :\n\n' +
    '🗂️ *Collection :* ' + catLabel + '\n' +
    '👗 *Produit :* ' + productName + '\n' +
    '💰 *Prix :* ' + price + '\n' +
    '📏 *Taille :* ' + selectedSize.dataset.size + '\n' +
    '🎨 *Couleur :* ' + selectedColor.dataset.color + '\n\n' +
    'Merci de confirmer ma commande 🙏';

  window.open(
    'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(message),
    '_blank'
  );

  btnSuccess(btn);
}

/* ════════════════════════════════════════════
   UTILITAIRES UI
════════════════════════════════════════════ */

function shakeWarning(el, msg) {
  el.style.animation = 'shake 0.4s ease';
  setTimeout(function() { el.style.animation = ''; }, 420);

  if (el.querySelector('.warn-tip')) return;

  var tip = document.createElement('span');
  tip.className = 'warn-tip';
  tip.textContent = msg;
  tip.style.cssText =
    'display:inline-block;background:#c2185b;color:white;padding:4px 13px;' +
    'border-radius:99px;font-size:0.73rem;font-weight:600;margin-top:6px;' +
    'pointer-events:none;animation:fadeInUp 0.3s ease both;';

  el.insertAdjacentElement('afterend', tip);
  setTimeout(function() { tip.remove(); }, 2400);
}

/* ════════════════════════════════════════════
   ANIMATION BOUTON SUCCESS
════════════════════════════════════════════ */

function btnSuccess(btn) {
  var orig = btn.innerHTML;
  var origBg = btn.style.background;

  // 1. Appliquer le fond vert WhatsApp
  btn.style.background = "#25D366"; 

  // 2. Insérer le SVG complet de l'icône WhatsApp
  btn.innerHTML = '<svg class="wa-icon" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg>';

  // 3. Remettre le bouton à son état initial après 2 secondes
  setTimeout(function() {
    btn.innerHTML = orig;
    btn.style.background = origBg;
  }, 2000);
}