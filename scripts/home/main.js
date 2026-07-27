// main.js — CONSERVÉ POUR HISTORIQUE, NON CHARGÉ PAR index.html.
//
// Ce fichier utilisait `import`/`export` (type="module") pour assembler les
// scripts de la page Home. Problème : un <script type="module"> qui importe
// d'autres fichiers via des chemins relatifs est bloqué par la politique CORS
// des navigateurs dès que la page est ouverte en local (double-clic sur
// index.html, chemin file://...) — aucune erreur visible à l'écran, mais la
// console affiche "Cross origin requests are only supported for HTTP" et
// AUCUN script de la page ne s'exécute. Résultat concret : plus aucune
// animation de reveal, plus d'effet machine à écrire, rien.
//
// C'est exactement le bug qui empêchait les animations de se comporter comme
// sur le projet Ryan Reynolds, qui charge ses scripts en balises <script
// defer> classiques, insensibles à ce problème.
//
// Correctif appliqué : index.html charge maintenant chaque script section
// par section avec de simples balises <script src="..." defer></script>,
// dans l'ordre de dépendance (base/commun.js, base/motion.js, puis les
// scripts de chaque section). Chaque fichier est encapsulé dans sa propre
// IIFE pour ne rien fuiter dans l'espace global. Ce fichier main.js n'est
// donc plus référencé nulle part — conservé uniquement pour garder une trace
// de l'ancienne architecture et de la raison du changement.
