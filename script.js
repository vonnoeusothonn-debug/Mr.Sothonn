/* === Navigation Scroll Effect === */
const navbar = document.getElementById("navbar");

function handleNav() {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", handleNav);

/* === Mobile Menu Logic === */
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (mobileMenu) {
  mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    navLinks.classList.toggle("active");
    mobileMenu.setAttribute("aria-expanded", mobileMenu.classList.contains("active") ? "true" : "false");
  });
}

function closeMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove("active");
    navLinks.classList.remove("active");
    mobileMenu.setAttribute("aria-expanded", "false");
  }
}

/* === Scroll Animations (IntersectionObserver) === */
const revealEls = document.querySelectorAll(".animate-in");
const progressEls = document.querySelectorAll(".circular-progress");

const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    
    // Animate standard elements
    entry.target.classList.add("is-visible");
    
    // Animate Progress Bars if found
    const progressEl = entry.target.querySelector(".circular-progress");
    if (progressEl) {
      animateCircle(progressEl);
    } else if (entry.target.classList.contains("circular-progress")) {
        animateCircle(entry.target);
    }
    
    observer.unobserve(entry.target);
  });
}, observerOptions);

revealEls.forEach((el) => observer.observe(el));

/* === Active Nav Link === */
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const pageSections = document.querySelectorAll("section[id]");

function setActiveNavLink() {
  const scrollPos = window.scrollY + 140;
  pageSections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const target = section.getAttribute("id");
    const matchingLink = document.querySelector(`.nav-links a[href="#${target}"]`);

    if (!matchingLink) return;
    if (scrollPos >= top && scrollPos < bottom) {
      navAnchors.forEach((link) => link.classList.remove("active-link"));
      matchingLink.classList.add("active-link");
    }
  });
}

window.addEventListener("scroll", setActiveNavLink);
setActiveNavLink();

/* === Hero Parallax Animation === */
const heroVisual = document.querySelector(".hero-visual");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

if (heroVisual && hasFinePointer) {
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((event.clientX - centerX) / rect.width) * 14;
    const rotateX = ((centerY - event.clientY) / rect.height) * 10;

    heroVisual.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  heroVisual.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
}

/* === Dynamic Footer Year === */
const yearEl = document.getElementById("current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

/* === Passion Typewriter Loop === */
const typedPassion = document.getElementById("typed-passion");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typedPassion) {
  const phrases = ["Electrical Engineering", "Graphic Design"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  if (prefersReducedMotion) {
    typedPassion.textContent = phrases[0];
  } else {
    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }

      typedPassion.textContent = currentPhrase.slice(0, charIndex);

      let delay = isDeleting ? 45 : 90;
      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 1300;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 300;
      }

      setTimeout(typeLoop, delay);
    };

    typeLoop();
  }
}

/* === Progress Bar Animation Logic === */
function animateCircle(el) {
  const percent = Number(el.getAttribute("data-percent") || "0");
  const numberEl = el.querySelector(".percentage-value");
  
  let current = 0;
  const duration = 1500;
  const startTime = performance.now();

  function update(now) {
    const timeFraction = Math.min((now - startTime) / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - timeFraction, 3);
    
    current = Math.floor(eased * percent);
    el.style.setProperty("--deg", `${Math.round(current / 100 * 360)}deg`);
    if (numberEl) numberEl.innerText = `${current}%`;

    if (timeFraction < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
