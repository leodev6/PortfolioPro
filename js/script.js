// DOM Elements
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const aboutSection = document.querySelector(".about-text");
const projectCards = document.querySelectorAll(".project-card");
const rotatingElement = document.querySelector(".rotating-element");

// Navigation Toggle
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
      // Close mobile menu if open
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

// Observe about section
observer.observe(aboutSection);

// 3D Card Tilt Effect
projectCards.forEach((card) => {
  card.addEventListener("mousemove", handleTilt);
  card.addEventListener("mouseleave", resetTilt);
});

function handleTilt(e) {
  const card = this;
  const cardRect = card.getBoundingClientRect();
  const cardCenterX = cardRect.left + cardRect.width / 2;
  const cardCenterY = cardRect.top + cardRect.height / 2;
  const angleX = (e.clientY - cardCenterY) * 0.1;
  const angleY = (cardCenterX - e.clientX) * 0.1;

  card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
}

function resetTilt() {
  this.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
}

// Create rotating cube using Three.js
function initRotatingCube() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(100, 100);
  rotatingElement.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: 0x4a4063,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);
  camera.position.z = 2;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}

// Initialize rotating cube if Three.js is loaded
if (typeof THREE !== "undefined") {
  initRotatingCube();
}

// EmailJS Configuration
(function () {
  // Vérifier que EmailJS est chargé
  if (typeof emailjs === "undefined") {
    console.error("EmailJS n'est pas chargé");
    return;
  }

  const PUBLIC_KEY = "2cMHlv3Kv3Lvr0LJP";
  const SERVICE_ID = "service_kqpxj5p";
  const TEMPLATE_ID = "template_7852urg";

  // Vérification des IDs
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    console.error("EmailJS: Les IDs ne sont pas correctement configurés");
    return;
  }

  emailjs.init(PUBLIC_KEY);

  const contactForm = document.getElementById("contact-form");
  if (!contactForm) {
    console.error("Le formulaire de contact n'a pas été trouvé");
    return;
  }

  const submitBtn = contactForm.querySelector(".submit-btn");
  const originalBtnText = submitBtn.innerHTML;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Vérification des champs requis
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    // Désactiver le bouton et montrer le chargement
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

    // Préparer les données
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      to_name: "Djouab Abdellah",
    };

    // Envoyer l'email
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(function (response) {
        console.log("SUCCESS!", response.status, response.text);
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Envoyé!';
        submitBtn.style.backgroundColor = "#22c55e";
        contactForm.reset();
      })
      .catch(function (error) {
        console.error("FAILED...", error);
        submitBtn.innerHTML =
          '<i class="fas fa-exclamation-triangle"></i> Erreur d\'envoi';
        submitBtn.style.backgroundColor = "#ef4444";
        // Afficher l'erreur spécifique
        alert(
          `Erreur lors de l'envoi : ${
            error.text || "Veuillez vérifier votre configuration EmailJS"
          }`
        );
      })
      .finally(function () {
        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitBtn.style.backgroundColor = "";
        }, 3000);
      });
  });
})();

// Scroll Progress Indicator
const scrollProgress = () => {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.pageYOffset / totalHeight) * 100;

  // Update some UI element to show progress (optional)
  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${progress}%`
  );
};

window.addEventListener("scroll", scrollProgress);

// Lazy Loading Images
const images = document.querySelectorAll("img[data-src]");
const imageOptions = {
  threshold: 0,
  rootMargin: "0px 0px 50px 0px",
};

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add("loaded");
      observer.unobserve(img);
    }
  });
}, imageOptions);

images.forEach((image) => imageObserver.observe(image));
