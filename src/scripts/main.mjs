const CONDITIONAL_FIELDS = ["captacao", "reposicionamento"];

export function maskPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : "";
  }

  if (digits.length <= 7) {
    return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  }

  return digits
    .replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3")
    .replace(/-$/, "");
}

export function getValidationMessage(validity, minLength) {
  if (validity.valueMissing) {
    return "Este campo é obrigatório.";
  }

  if (validity.typeMismatch) {
    return "Informe um valor válido.";
  }

  if (validity.tooShort) {
    return `Preencha pelo menos ${minLength} caracteres.`;
  }

  return "";
}

export function getNextCarouselIndex(currentIndex, step, totalItems) {
  if (totalItems <= 0) {
    return 0;
  }

  return (currentIndex + step + totalItems) % totalItems;
}

export function getVisibleConditionalFields(currentValue) {
  return CONDITIONAL_FIELDS.filter((field) => field === currentValue);
}

function validateField(field) {
  const group = field.closest(".field-group");

  if (!group) {
    return true;
  }

  const message = group.querySelector(".field-message");
  const error = getValidationMessage(field.validity, field.minLength);
  const hasValue = field.value.trim().length > 0;

  group.classList.toggle("is-invalid", Boolean(error));
  group.classList.toggle("is-valid", !error && hasValue);
  field.setAttribute("aria-invalid", String(Boolean(error)));

  if (message) {
    message.textContent = error;
  }

  return !error;
}

function updateMenuState(menuToggle, menu, isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fechar navegação principal" : "Abrir navegação principal");
  menu.hidden = !isOpen && window.innerWidth <= 760;
}

function setupHeader(header) {
  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupMenu(menuToggle, menu) {
  if (!menuToggle || !menu) {
    return;
  }

  let isOpen = false;

  const syncMenu = () => {
    if (window.innerWidth > 760) {
      isOpen = false;
      menu.hidden = false;
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir navegação principal");
      return;
    }

    updateMenuState(menuToggle, menu, isOpen);
  };

  menuToggle.addEventListener("click", () => {
    isOpen = !isOpen;
    updateMenuState(menuToggle, menu, isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      isOpen = false;
      updateMenuState(menuToggle, menu, false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      isOpen = false;
      updateMenuState(menuToggle, menu, false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 760 || !isOpen) {
      return;
    }

    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
      isOpen = false;
      updateMenuState(menuToggle, menu, false);
    }
  });

  window.addEventListener("resize", syncMenu);
  syncMenu();
}

function setupReveal(reveals, prefersReducedMotion) {
  if (prefersReducedMotion.matches) {
    reveals.forEach((item) => item.classList.add("is-visible"));
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
    { threshold: 0.18 }
  );

  reveals.forEach((item) => observer.observe(item));
}

function setupParallax(parallaxTarget, prefersReducedMotion) {
  if (!parallaxTarget || prefersReducedMotion.matches) {
    return;
  }

  window.addEventListener(
    "scroll",
    () => {
      const offset = Math.min(window.scrollY * -0.04, 0);
      parallaxTarget.style.transform = `translate3d(0, ${offset}px, 0)`;
    },
    { passive: true }
  );
}

function animateCounter(element) {
  const target = Number(element.dataset.counter || 0);
  const duration = 1600;
  const start = performance.now();

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function setupCounters(counters, prefersReducedMotion) {
  if (!counters.length) {
    return;
  }

  if (prefersReducedMotion.matches) {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.counter || "0";
    });
    return;
  }

  const seen = new WeakSet();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupCarousel(carousel, prevButton, nextButton) {
  if (!carousel) {
    return;
  }

  const cards = Array.from(carousel.querySelectorAll(".testimonial-card"));

  if (!cards.length) {
    return;
  }

  let currentIndex = 0;

  function render() {
    cards.forEach((card, index) => {
      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);
      const active = offset === 0;

      card.style.opacity = active ? "1" : String(Math.max(0.18, 0.64 - absOffset * 0.2));
      card.style.transform = `translateX(${offset * 14}%) rotateY(${offset * -14}deg) scale(${active ? 1 : 0.92}) translateZ(${active ? 0 : -60}px)`;
      card.style.filter = active ? "none" : "blur(1px)";
      card.style.zIndex = String(cards.length - absOffset);
      card.setAttribute("aria-hidden", String(!active));
    });
  }

  function update(step) {
    currentIndex = getNextCarouselIndex(currentIndex, step, cards.length);
    render();
  }

  prevButton?.addEventListener("click", () => update(-1));
  nextButton?.addEventListener("click", () => update(1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      update(-1);
    }

    if (event.key === "ArrowRight") {
      update(1);
    }
  });

  render();
}

function updateConditionalFields(form, objectiveField) {
  const currentValue = objectiveField?.value || "";
  const visibleFields = new Set(getVisibleConditionalFields(currentValue));

  form.querySelectorAll("[data-conditional-for]").forEach((field) => {
    const isVisible = visibleFields.has(field.dataset.conditionalFor);
    field.hidden = !isVisible;

    field.querySelectorAll("select, input, textarea").forEach((input) => {
      input.disabled = !isVisible;
    });
  });
}

function setupForm(form, objectiveField, phoneField, formStatus) {
  if (!form) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
    field.addEventListener("blur", () => validateField(field));
  });

  objectiveField?.addEventListener("change", () => {
    updateConditionalFields(form, objectiveField);
  });

  phoneField?.addEventListener("input", () => {
    phoneField.value = maskPhone(phoneField.value);
  });

  updateConditionalFields(form, objectiveField);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter((field) => !field.disabled);
    const allValid = fields.every((field) => validateField(field));

    if (!allValid) {
      formStatus.textContent = "Revise os campos destacados para continuar.";
      formStatus.className = "form-status is-error";
      return;
    }

    formStatus.textContent = "Analisando contexto do projeto...";
    formStatus.className = "form-status";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Analisando...";
    }

    window.setTimeout(() => {
      formStatus.textContent = "Solicitação recebida. Em um cenário real, este contato seguiria para seu CRM.";
      formStatus.className = "form-status is-success";
      form.reset();
      updateConditionalFields(form, objectiveField);

      form.querySelectorAll(".field-group").forEach((group) => {
        group.classList.remove("is-valid", "is-invalid");

        const field = group.querySelector("input, select, textarea");
        const message = group.querySelector(".field-message");

        if (field) {
          field.setAttribute("aria-invalid", "false");
        }

        if (message) {
          message.textContent = "";
        }
      });

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Receber direção inicial";
      }
    }, 1100);
  });
}

function setupScrollSpy(navLinks) {
  if (!navLinks.length) {
    return;
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const targetId = link.getAttribute("href");
          link.classList.toggle("is-active", targetId === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: 0.2,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function initSite() {
  if (typeof document === "undefined") {
    return;
  }

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const counters = Array.from(document.querySelectorAll("[data-counter]"));
  const carousel = document.querySelector("[data-carousel]");
  const prevButton = document.querySelector("[data-carousel-prev]");
  const nextButton = document.querySelector("[data-carousel-next]");
  const form = document.querySelector("[data-contact-form]");
  const objectiveField = document.querySelector("#objetivo");
  const phoneField = document.querySelector("#telefone");
  const formStatus = document.querySelector("[data-form-status]");
  const parallaxTarget = document.querySelector("[data-parallax]");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  setupHeader(header);
  setupMenu(menuToggle, menu);
  setupReveal(reveals, prefersReducedMotion);
  setupParallax(parallaxTarget, prefersReducedMotion);
  setupCounters(counters, prefersReducedMotion);
  setupCarousel(carousel, prevButton, nextButton);
  setupForm(form, objectiveField, phoneField, formStatus);
  setupScrollSpy(navLinks);
}

initSite();
