// ─── Mobile Menu State ───
let menuOpen = false;

function closeMenu() {
  menuOpen = false;
  document.querySelector(".hamburger")?.classList.remove("active");
  document.querySelector("nav ul")?.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function toggleMenu() {
  menuOpen = !menuOpen;
  document.querySelector(".hamburger")?.classList.toggle("active");
  document.querySelector("nav ul")?.classList.toggle("open");
  document.body.classList.toggle("no-scroll");
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");

      const counter = entry.target.querySelector("[data-target]");
      if (counter) {
        animateCounter(counter);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".animate-scroll").forEach((el) => observer.observe(el));

function animateCounter(element) {
  if (element.classList.contains("counted")) return;
  element.classList.add("counted");

  const target = parseInt(element.dataset.target);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    element.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(update);
    else element.textContent = target;
  }
  requestAnimationFrame(update);
}

const nav = document.querySelector("nav");

function updateNav() {
  if (window.pageYOffset > 80) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
}

updateNav();

window.addEventListener("scroll", () => {
  updateNav();

  const heroSection = document.querySelector(".hero, .hero-compact");
  if (!heroSection) return;
  const heroContent = heroSection.querySelector(".hero-content");
  if (!heroContent) return;
  const scrolled = window.pageYOffset;
  const vh = heroSection.offsetHeight;

  if (scrolled < vh) {
    heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
    heroContent.style.opacity = 1 - (scrolled / vh) * 0.4;
  }
});

// ─── Hamburger Menu ───
document.querySelector(".hamburger")?.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMenu();
});

document.addEventListener("click", (e) => {
  if (menuOpen && !document.querySelector("nav").contains(e.target)) {
    closeMenu();
  }
});

document.querySelector("nav ul")?.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && menuOpen) {
    setTimeout(closeMenu, 300);
  }
});

// ─── Mobile dropdown toggle ───
document.querySelectorAll(".dropdown > a").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      toggle.parentElement.classList.toggle("dropdown-open");
    }
  });
});

document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
  if (anchor.closest(".dropdown") && anchor.getAttribute("href") === "#") return;
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    window.scrollTo({
      top: target.offsetTop - nav.offsetHeight,
      behavior: "smooth",
    });
  });
});

document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
  const section = document.querySelector("#kingdoms, #characters, #about");
  if (!section) return;
  window.scrollTo({
    top: section.offsetTop - nav.offsetHeight,
    behavior: "smooth",
  });
});

const form = document.getElementById("bestMomentForm");
const feedback = document.getElementById("formFeedback");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("characterName").value.trim();
  const season = document.getElementById("season").value.trim();
  const episode = document.getElementById("episode").value.trim();
  const moment = document.getElementById("moment").value.trim();

  if (!name || !season || !episode || !moment) {
    feedback.className = "form-feedback error";
    feedback.textContent = "Todos los campos son obligatorios.";
    return;
  }

  feedback.className = "form-feedback success";
  feedback.textContent = "¡Gracias por compartir! Tu momento ha sido registrado.";
  form.reset();
});
