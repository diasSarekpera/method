/* =========================================================================
   MOTION.JS — reveal au scroll (Intersection Observer)
   =========================================================================

   Principe : CHAQUE élément [.motion-stagger-item] est observé
   individuellement et reçoit sa propre classe .is-visible au moment précis
   où il entre dans le viewport. Rien n'est déclenché "par section" : sur
   une section haute (Expérience, Formation...), les items apparaissent
   donc un par un, au fil du scroll, au lieu d'apparaître tous d'un coup
   dès que le haut de la section touche l'écran puis de laisser le reste
   du scroll "silencieux".

   Progressive enhancement : ce script n'active l'état "masqué puis révélé"
   (classe .motion-armed sur <html>) que si IntersectionObserver est
   supporté ET si l'utilisateur n'a pas demandé de réduire les animations.
   Dans tous les autres cas, on ne touche à rien : le contenu reste visible
   par défaut (voir motion.css). Aucun élément ne peut donc rester invisible
   si ce script échoue ou n'est pas exécuté.

   POURQUOI UN SCRIPT CLASSIQUE (pas de <script type="module">) : voir la
   note détaillée dans main.js — un module ES avec imports relatifs est
   bloqué par CORS dès que la page est ouverte en local (file://), sans
   erreur visible, ce qui coupait toutes les animations du site.

   window.MethodMotion expose `prefersReducedMotion`, réutilisé par les
   autres scripts (ex. l'effet machine à écrire de la bannière).
   ========================================================================= */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  window.MethodMotion = { prefersReducedMotion: prefersReducedMotion };

  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
    // Pas d'animation : on ne pose même pas .motion-armed, le contenu
    // reste visible par défaut (voir la garde correspondante dans
    // motion.css). Rien d'autre à faire.
    return;
  }

  document.documentElement.classList.add('motion-armed');

  var tousLesItems = Array.prototype.slice.call(
    document.querySelectorAll('.motion-stagger-item')
  );

  // La bannière (identité, presque toujours déjà dans le viewport au
  // chargement) est traitée à part : on force sa cascade nous-mêmes plutôt
  // que de la laisser à l'observer, sinon elle se déclencherait quasi
  // instantanément, sans transition perceptible.
  var itemsBanniere = tousLesItems.filter(function (el) {
    return el.closest('.profil-banniere');
  });
  var itemsAuScroll = tousLesItems.filter(function (el) {
    return !el.closest('.profil-banniere');
  });

  function armerBanniere() {
    if (!itemsBanniere.length) return;

    itemsBanniere.forEach(function (el) {
      el.classList.remove('is-visible');
    });

    // Double rAF : laisse le navigateur peindre l'état masqué avant de
    // basculer vers l'état visible, pour garantir la transition à CHAQUE
    // rechargement complet de la page.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        itemsBanniere.forEach(function (el) {
          el.classList.add('is-visible');
        });
      });
    });
  }

  function armerReveal() {
    if (!itemsAuScroll.length) return;

    var observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add('is-visible');
            observateur.unobserve(entree.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    itemsAuScroll.forEach(function (el) {
      observateur.observe(el);
    });
  }

  armerBanniere();
  armerReveal();

  // --- Reprise au retour depuis le bfcache ---
  // Sur un retour arrière/avant (ou reprise d'onglet sur mobile), certains
  // navigateurs restaurent la page telle qu'elle était figée SANS ré-
  // exécuter ce script. L'évènement "pageshow" avec persisted=true signale
  // ce cas précis (il ne se déclenche PAS sur un rechargement classique
  // F5, qui ré-exécute déjà tout naturellement) ; on y réinitialise le
  // reveal comme au premier chargement, sans toucher au scroll.
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;

    tousLesItems.forEach(function (el) {
      el.classList.remove('is-visible');
    });

    armerBanniere();
    armerReveal();
  });
})();
