// portfolio.js

// Mobile nav toggle
const burger = document.getElementById("burger");
const navMenu = document.querySelector(".nav-menu");

if (burger && navMenu) {
  burger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    burger.setAttribute(
      "aria-expanded",
      navMenu.classList.contains("active") ? "true" : "false"
    );
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      navMenu.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navMenu.classList.remove("active");
      burger.setAttribute("aria-expanded", "false");
    }
  });
}

// Contact form (contact.html)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const messageDisplay = document.getElementById("formMessage");

  if (!form || !messageDisplay) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector("textarea");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !message) {
      messageDisplay.textContent = "Veuillez remplir tous les champs.";
      messageDisplay.style.color = "red";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      messageDisplay.textContent = "Veuillez entrer une adresse email valide.";
      messageDisplay.style.color = "red";
      return;
    }

    messageDisplay.textContent = "Message envoye avec succes.";
    messageDisplay.style.color = "green";
    form.reset();
  });
});

// Rotating hero image on index page
const imagesBienvenue = [
  "img/Compétence.png",
  "img/ampoul.png",
  "img/Ecodesign.png",
];
let indexBienvenue = 0;
const heroImage = document.getElementById("heroImage");

if (heroImage) {
  setInterval(() => {
    indexBienvenue = (indexBienvenue + 1) % imagesBienvenue.length;
    heroImage.src = imagesBienvenue[indexBienvenue];
  }, 4000);
}

// Rotating profile image
const imagesProfil = ["img/MethoH.jpg", "img/Metho.jpg", "img/Method.jpg"];
let indexProfil = 0;
const profilePic = document.querySelector(".about-image img.hero");

if (profilePic) {
  setInterval(() => {
    indexProfil = (indexProfil + 1) % imagesProfil.length;
    profilePic.src = imagesProfil[indexProfil];
  }, 3000);
}

// Optional dynamic projects container
const projets = [
  {
    description:
      "Creation d affiches et visuels professionnels pour communication digitale et print.",
    tags: "#Canva, #Photoshop",
    lien: "https://drive.google.com/drive/folders/xxxx",
  },
  {
    description: "Maquettes d un site vitrine moderne concu avec WordPress.",
    tags: "#WordPress, #UI/UX",
    lien: "https://exemple.com/maquettes",
  },
  {
    description: "Mini-jeu JavaScript interactif utilisant les evenements DOM.",
    tags: "#HTML, #CSS, #JS",
    lien: "https://exemple.com/mini-jeu",
  },
];

const projetsContainer = document.getElementById("projetsContainer");

if (projetsContainer) {
  projets.forEach((projet) => {
    const card = document.createElement("div");
    card.className = "projet-carte";
    card.innerHTML = `
      <p>${projet.description}</p>
      <p class="tags">${projet.tags}</p>
      <a href="${projet.lien}" class="btn-projet" target="_blank" rel="noopener noreferrer">Voir</a>
    `;
    projetsContainer.appendChild(card);
  });
}

// Progress bars (if data-level is used)
document.addEventListener("DOMContentLoaded", () => {
  const progressBars = document.querySelectorAll(".skills-section .progress[data-level]");
  progressBars.forEach((bar) => {
    const level = Number(bar.getAttribute("data-level"));
    if (!Number.isNaN(level)) {
      setTimeout(() => {
        bar.style.width = `${level}%`;
      }, 100);
    }
  });
});

// Contact form message on index page
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formMessage = document.getElementById("form-message");
    if (formMessage) {
      formMessage.classList.remove("hidden");
    }
    this.reset();
  });
}

// Mini game
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function toggleGame() {
  const gameDiv = document.getElementById("miniJeu");
  if (gameDiv) {
    gameDiv.style.display = gameDiv.style.display === "none" ? "block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const checkBtn = document.getElementById("checkBtn");

  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      const userGuess = parseInt(document.getElementById("userGuess")?.value, 10);
      const message = document.getElementById("message");
      const attemptsDisplay = document.getElementById("attempts");

      if (!message || !attemptsDisplay) {
        return;
      }

      if (!userGuess || userGuess < 1 || userGuess > 100) {
        message.textContent = "Entre un nombre valide entre 1 et 100.";
        message.style.color = "red";
        return;
      }

      attempts += 1;

      if (userGuess === secretNumber) {
        message.textContent = `Bravo ! Le nombre etait ${secretNumber}.`;
        message.style.color = "green";
      } else if (userGuess < secretNumber) {
        message.textContent = "Trop petit ! Essaye encore.";
        message.style.color = "orange";
      } else {
        message.textContent = "Trop grand ! Reessaie.";
        message.style.color = "orange";
      }

      attemptsDisplay.textContent = `Nombre d'essais : ${attempts}`;
    });
  }
});
