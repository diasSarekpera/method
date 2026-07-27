// banniere.js — comportement JS de la section Bannière + identité.
//
// Effet "machine à écrire" sur l'adresse : "Comè, Bénin" est déjà affiché
// en dur dans le HTML (visible immédiatement, y compris sans JS). Le reste
// de l'adresse (attribut data-suite sur .profil-lieu-suite, ex.
// ", Rue Amoussouvi") est ajouté lettre par lettre au chargement de la
// page, avec un curseur clignotant qui disparaît une fois le texte complet.
//
// Encapsulé dans une IIFE : ce fichier est chargé comme script classique,
// au même titre que les autres scripts de la page (voir motion.js pour le
// détail), donc toute variable top-level non protégée finirait dans le
// même espace global qu'eux.
(function () {
  'use strict';

  var suiteLieu = document.querySelector('.profil-lieu-suite');
  if (!suiteLieu) return;

  var texteAEcrire = suiteLieu.dataset.suite || '';
  var curseurLieu = document.querySelector('.profil-lieu-curseur');

  // Réutilise le test déjà fait par motion.js (chargé avant ce script) ;
  // se rabat sur son propre test si, pour une raison ou une autre,
  // motion.js n'a pas encore posé window.MethodMotion.
  var prefersReducedMotion = window.MethodMotion
    ? window.MethodMotion.prefersReducedMotion
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!texteAEcrire) {
    // Rien à écrire : on masque simplement le curseur.
    if (curseurLieu) curseurLieu.classList.add('est-termine');
    return;
  }

  if (prefersReducedMotion) {
    // Pas d'animation : le texte complet est affiché directement.
    suiteLieu.textContent = texteAEcrire;
    if (curseurLieu) curseurLieu.classList.add('est-termine');
    return;
  }

  var delaiParLettre = 120; // ms entre chaque caractère
  var delaiDepart = 2100; // laisse le temps à la cascade d'identité (motion.js) de s'afficher
  var index = 0;

  function ecrireLettreSuivante() {
    index += 1;
    suiteLieu.textContent = texteAEcrire.slice(0, index);

    if (index < texteAEcrire.length) {
      setTimeout(ecrireLettreSuivante, delaiParLettre);
    } else if (curseurLieu) {
      curseurLieu.classList.add('est-termine');
    }
  }

  setTimeout(ecrireLettreSuivante, delaiDepart);
})();
