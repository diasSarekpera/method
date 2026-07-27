// motion.js — reveal au scroll (Intersection Observer).
//
// Progressive enhancement : ce script n'active l'état "masqué puis révélé"
// (classe .motion-armed sur <html>) que si IntersectionObserver est
// supporté ET si l'utilisateur n'a pas demandé de réduire les animations.
// Dans tous les autres cas, on ne touche à rien : le contenu reste visible
// par défaut (voir motion.css). Aucune section ne peut donc rester
// invisible si ce script échoue ou n'est pas exécuté.

// --- Fix reload : neutraliser la restauration automatique du scroll ---
// Par défaut, le navigateur restaure la position de scroll qu'on avait
// avant un reload, avant même l'exécution de ce script. Si on était scrollé
// en milieu de page, les sections concernées sont donc déjà dans le
// viewport dès le premier instant : l'IntersectionObserver les révèle
// alors quasi instantanément, sans transition perceptible (l'animation
// "ne se voit pas"). On reprend nous-mêmes le contrôle du scroll pour
// garantir un point de départ identique à chaque chargement.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Sélecteurs des sections en reveal au scroll (réutilisés au chargement
// initial et lors d'une restauration depuis le bfcache, voir plus bas).
const SELECTEUR_CIBLES =
  '.profil-apropos, .profil-projets-phares, .profil-experience, .profil-formation, .profil-langues, .profil-references';

let observateur = null;

function armerBanniere() {
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
    banniere.classList.remove('is-visible');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banniere.classList.add('is-visible');
      });
    });
  }
}

function armerReveal() {
  // --- Autres sections : reveal classique au scroll ---
  const cibles = document.querySelectorAll(SELECTEUR_CIBLES);

  observateur = new IntersectionObserver(
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

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-armed');

  armerBanniere();
  armerReveal();

  // --- Fix bfcache : relancer le reveal au retour arrière/avant ---
  // Quand la page est restaurée depuis le back-forward cache (navigation
  // arrière/avant, retour d'onglet sur mobile), le navigateur remet en
  // place la page telle qu'elle était figée, SANS réexécuter ce script :
  // les classes .is-visible posées précédemment restent donc en l'état,
  // et rien ne se relance. L'évènement "pageshow" avec persisted=true
  // signale ce cas ; on y réinitialise tout comme au premier chargement.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;

    window.scrollTo(0, 0);

    document
      .querySelectorAll('.is-visible')
      .forEach((el) => el.classList.remove('is-visible'));

    armerBanniere();
    armerReveal();
  });
}
