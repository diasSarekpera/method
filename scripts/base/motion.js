// motion.js — reveal au scroll (Intersection Observer).
//
// Progressive enhancement : ce script n'active l'état "masqué puis révélé"
// (classe .motion-armed sur <html>) que si IntersectionObserver est
// supporté ET si l'utilisateur n'a pas demandé de réduire les animations.
// Dans tous les autres cas, on ne touche à rien : le contenu reste visible
// par défaut (voir motion.css). Aucune section ne peut donc rester
// invisible si ce script échoue ou n'est pas exécuté.

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-armed');

  // --- Bannière (identité) : animation garantie au chargement de la page ---
  // Cette section est presque toujours déjà dans le viewport au chargement,
  // donc l'IntersectionObserver la déclencherait quasi instantanément — sans
  // transition perceptible ("tout apparaît en même temps, de façon statique").
  // On la sort du scroll-reveal et on force nous-mêmes son apparition, avec
  // un double rAF pour laisser le navigateur peindre l'état masqué avant de
  // basculer vers l'état visible : la transition (fade + cascade) est ainsi
  // garantie à chaque rechargement, quelle que soit la position de scroll.
  const banniere = document.querySelector('.profil-banniere');
  if (banniere) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banniere.classList.add('is-visible');
      });
    });
  }

  // --- Autres sections : reveal classique au scroll ---
  const cibles = document.querySelectorAll(
    '.profil-apropos, .profil-projets-phares, .profil-experience, .profil-formation, .profil-langues, .profil-references'
  );

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
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

  cibles.forEach((cible) => observateur.observe(cible));
}
