/* =========================================================================
   MOTION.JS — reveal au scroll (Intersection Observer)
   =========================================================================

   Progressive enhancement : ce script n'active l'état "masqué puis révélé"
   (classe .motion-armed sur <html>) que si IntersectionObserver est
   supporté ET si l'utilisateur n'a pas demandé de réduire les animations.
   Dans tous les autres cas, on ne touche à rien : le contenu reste visible
   par défaut (voir motion.css). Aucune section ne peut donc rester
   invisible si ce script échoue ou n'est pas exécuté.

   POURQUOI UN SCRIPT CLASSIQUE (pas de <script type="module">) :
   Un script chargé en module ES qui importe d'autres fichiers via des
   chemins relatifs est bloqué par la politique CORS des navigateurs dès
   que la page est ouverte en local (double-clic sur index.html, chemin
   file://...) — sans erreur visible à l'écran, juste plus aucun script
   qui s'exécute nulle part sur la page : ni reveal, ni effet machine à
   écrire. C'est ce qui causait la différence de comportement avec le
   projet Ryan Reynolds, qui charge ses scripts en balises <script defer>
   classiques, insensibles à ce problème (et qui fonctionnent à l'identique
   en local et une fois déployés). Chaque script de la page est encapsulé
   dans sa propre IIFE pour ne rien fuiter dans l'espace global partagé.

   window.MethodMotion expose `prefersReducedMotion`, réutilisé par les
   autres scripts (ex. l'effet machine à écrire de la bannière) pour éviter
   de refaire le même test et rester cohérent partout.
   ========================================================================= */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Petit espace de noms partagé, lu par les autres scripts de la page.
  window.MethodMotion = { prefersReducedMotion: prefersReducedMotion };

  if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
    // Pas d'animation : on ne pose même pas .motion-armed, le contenu
    // reste visible par défaut (voir la garde correspondante dans
    // motion.css). Rien d'autre à faire.
    return;
  }

  var SELECTEUR_CIBLES =
    '.profil-apropos, .profil-projets-phares, .profil-experience, .profil-formation, .profil-langues, .profil-references';

  document.documentElement.classList.add('motion-armed');

  function armerBanniere() {
    // --- Bannière (identité) : animation garantie au chargement de la page ---
    // Cette section est presque toujours déjà dans le viewport au
    // chargement, donc l'IntersectionObserver la déclencherait quasi
    // instantanément — sans transition perceptible ("tout apparaît en même
    // temps, de façon statique"). On la sort du scroll-reveal et on force
    // nous-mêmes son apparition, avec un double rAF pour laisser le
    // navigateur peindre l'état masqué avant de basculer vers l'état
    // visible : la transition (fade + cascade) est ainsi garantie à CHAQUE
    // rechargement complet de la page, quelle que soit la position de
    // scroll restaurée par le navigateur.
    var banniere = document.querySelector('.profil-banniere');
    if (!banniere) return;

    banniere.classList.remove('is-visible');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banniere.classList.add('is-visible');
      });
    });
  }

  function armerReveal() {
    // --- Autres sections : reveal classique au scroll ---
    var cibles = document.querySelectorAll(SELECTEUR_CIBLES);
    if (!cibles.length) return;

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

    cibles.forEach(function (cible) {
      observateur.observe(cible);
    });
  }

  armerBanniere();
  armerReveal();

  // --- Reprise au retour depuis le bfcache ---
  // Sur un retour arrière/avant (ou reprise d'onglet sur mobile), certains
  // navigateurs restaurent la page telle qu'elle était figée SANS ré-
  // exécuter ce script : les classes .is-visible posées précédemment
  // restent en l'état, rien ne se relance. L'évènement "pageshow" avec
  // persisted=true signale ce cas précis (il ne se déclenche PAS sur un
  // rechargement classique F5, qui ré-exécute déjà tout naturellement) ;
  // on y réinitialise le reveal comme au premier chargement, sans toucher
  // à la position de scroll de l'utilisateur.
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;

    document
      .querySelectorAll('.is-visible')
      .forEach(function (el) {
        el.classList.remove('is-visible');
      });

    armerBanniere();
    armerReveal();
  });
})();
