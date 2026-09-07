/* =====================================================
   HABIT-2026 CONTENT CONFIGURATION
   Edit the values below to update links and key dates
   without touching the rest of the site.
   ===================================================== */
const CONFIG = {
  // External form / document links
  abstractSubmissionURL: "https://forms.gle/k6S19ZRK3JgbDZzz9",
  registrationURL: "https://forms.gle/CFTZGeXaDW5XVcAD7",
  guidelinesURL: "#", // [CONTENT TO BE UPDATED] — guidelines link not yet published
  brochureURL: "documents/brochure.pdf",

  // Countdown target: conference start date/time (local to venue, IST)
  // Format: "YYYY-MM-DDTHH:mm:ss+05:30"
  conferenceStartDate: "2026-10-30T09:00:00+05:30"
};

/* ===============================
   NAVIGATION: sticky shadow + mobile menu
   =============================== */
(function initNavigation() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    menu.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close mobile menu after a link is chosen
  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

/* ===============================
   CONFIGURABLE LINKS: wire up CONFIG values
   =============================== */
(function applyConfigLinks() {
  const map = {
    heroSubmit: CONFIG.abstractSubmissionURL,
    submitAbstractBtn: CONFIG.abstractSubmissionURL,
    downloadGuidelinesBtn: CONFIG.guidelinesURL,
    registerNowBtn: CONFIG.registrationURL,
    footerSubmit: CONFIG.abstractSubmissionURL,
    footerRegister: CONFIG.registrationURL,
    footerGuidelines: CONFIG.guidelinesURL
  };

  Object.entries(map).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el && url) {
      el.setAttribute("href", url);
      if (url.startsWith("http")) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    }
  });

  // Register Now buttons in nav bar also point to registration section by default,
  // but the primary "Register Now" CTA should go straight to the form once available.
})();

/* ===============================
   COUNTDOWN TIMER
   =============================== */
(function initCountdown() {
  const target = new Date(CONFIG.conferenceStartDate).getTime();
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minsEl = document.getElementById("cdMinutes");
  const secsEl = document.getElementById("cdSeconds");
  const wrapper = document.getElementById("countdown");

  if (!daysEl || isNaN(target)) return;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      wrapper.querySelector(".countdown-label").textContent = "HABIT-2026 is underway";
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minsEl.textContent = pad(minutes);
    secsEl.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
})();

/* ===============================
   SCROLL REVEAL ANIMATIONS
   =============================== */
(function initScrollReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const targets = document.querySelectorAll(
    ".theme-card, .benefit-item, .speaker-card, .timeline-item, .award-card, .contact-card, .stat-row"
  );

  targets.forEach((el) => el.classList.add("reveal"));

  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ===============================
   GLIMPSES GALLERY SLIDER
   =============================== */
(function initGlimpseSlider() {
  const track = document.getElementById("glimpseTrack");
  const prevBtn = document.getElementById("glimpsePrev");
  const nextBtn = document.getElementById("glimpseNext");
  const dotsWrap = document.getElementById("glimpseDots");

  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const slides = Array.from(track.children);
  if (!slides.length) return;

  // Build one dot per slide
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Go to photo " + (i + 1));
    dot.addEventListener("click", () => {
      slides[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function updateActiveDot() {
    const trackRect = track.getBoundingClientRect();
    let closestIndex = 0;
    let closestDistance = Infinity;
    slides.forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs(rect.left - trackRect.left);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === closestIndex));
  }

  function scrollByAmount(direction) {
    const slideWidth = slides[0].getBoundingClientRect().width + 24; // approx gap
    track.scrollBy({ left: direction * slideWidth, behavior: "smooth" });
  }

  prevBtn.addEventListener("click", () => scrollByAmount(-1));
  nextBtn.addEventListener("click", () => scrollByAmount(1));
  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActiveDot);
  }, { passive: true });

  updateActiveDot();
})();

/* ===============================
   SCROLL TO TOP BUTTON
   =============================== */
(function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ===============================
   ACTIVE NAV LINK ON SCROLL
   =============================== */
(function initActiveNavLink() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const linkFor = (id) =>
    document.querySelector(`.nav-link[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();
(function initVisitorCounter() {
    const el = document.getElementById("visitorCount");
    if (!el) return;

    const NAMESPACE = "habit2026-mnnit-biotechnology";
    const KEY = "site-visits";

    fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
        .then((res) => res.json())
        .then((data) => {
            if (data && typeof data.value === "number") {
                el.textContent = data.value.toLocaleString();
            } else {
                el.textContent = "—";
            }
        })
        .catch(() => {
            el.textContent = "—";
        });
})();