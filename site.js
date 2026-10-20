window.rt4Track = function (name, params) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params || {});
};

(function () {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const slides = [...root.querySelectorAll("[data-slide]")];
    const dots = [...root.querySelectorAll("[data-dot]")];
    if (slides.length < 2) return;
    let index = 0;
    let timer = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => {
        const on = i === index;
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };
    const stop = () => { window.clearInterval(timer); timer = 0; };
    const start = () => {
      if (reduce) return;
      stop();
      timer = window.setInterval(() => show(index + 1), 4500);
    };
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        show(i);
        start();
        window.rt4Track("demo_click", { demo_name: dot.getAttribute("data-demo") || "company_map" });
      });
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => observer.observe(el));
})();

document.addEventListener("click", (event) => {
  const shot = event.target.closest("[data-company]");
  if (shot) window.rt4Track("company_map_interaction", { map_name: shot.getAttribute("data-company"), interaction: "orbit" });
  const link = event.target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  const label = (link.textContent || "").replace(/\s+/g, " ").trim();
  const planPick = link.getAttribute("data-plan");
  if (planPick && href === "#pilot") {
    const radio = document.querySelector(`#pilot input[name="plan"][value="${planPick}"]`);
    if (radio) radio.checked = true;
    window.rt4Track("contact_request", { method: "pricing", plan: planPick });
    return;
  }
  if (label === "Request a 30-Day Pilot") {
    window.rt4Track("contact_request", { method: "pricing", plan: "pilot" });
    return;
  }
  if (label === "Explore Company Maps") {
    window.rt4Track("demo_click", { demo_name: "explore_company_maps" });
    return;
  }
  if (href === "#company") window.rt4Track("demo_click", { demo_name: "open_company_map" });
  else if (href === "#region") window.rt4Track("demo_click", { demo_name: "open_region_map" });
});

(function () {
  const form = document.querySelector("#pilot");
  if (!form) return;
  const steps = [...form.querySelectorAll("[data-pilot-step]")];
  const marks = [...form.querySelectorAll("[data-pilot-progress] li")];
  const back = form.querySelector("[data-pilot-back]");
  const next = form.querySelector("[data-pilot-next]");
  const send = form.querySelector("[data-pilot-send]");
  const error = form.querySelector("[data-pilot-error]");
  const done = form.querySelector("[data-pilot-done]");
  let step = 1;

  const showError = (message) => {
    error.hidden = !message;
    error.textContent = message || "";
  };
  const show = (nextStep) => {
    step = nextStep;
    steps.forEach((panel) => { panel.hidden = Number(panel.getAttribute("data-pilot-step")) !== step; });
    marks.forEach((mark, i) => mark.classList.toggle("on", i < step));
    back.hidden = step === 1;
    next.hidden = step === steps.length;
    send.hidden = step !== steps.length;
    showError("");
  };
  const fieldOk = (selector, message) => {
    const field = form.querySelector(selector);
    if (field.checkValidity()) return true;
    showError(message);
    field.focus();
    return false;
  };

  next.addEventListener("click", () => {
    if (step === 1) {
      if (!fieldOk("[name=name]", "Add your name.")) return;
      if (!fieldOk("[name=email]", "Add a valid email.")) return;
      if (!fieldOk("[name=organization]", "Add your organization.")) return;
    }
    if (step === 2 && !form.querySelector("[name=plan]:checked")) {
      showError("Choose a pilot plan.");
      return;
    }
    show(step + 1);
  });
  back.addEventListener("click", () => show(step - 1));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const companies = [...form.querySelectorAll("[name=companies]:checked")].map((input) => input.value);
    const other = form.other_companies.value.trim();
    if (!companies.length && other.length < 2) {
      showError("Choose the companies for this pilot.");
      return;
    }
    const endpoint = form.getAttribute("data-endpoint");
    if (!endpoint) {
      showError("The request form is not connected yet.");
      return;
    }
    send.disabled = true;
    showError("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          organization: form.organization.value.trim(),
          plan: (form.querySelector("[name=plan]:checked") || {}).value || "",
          companies,
          other_companies: other,
          website: form.website.value,
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Could not save that request.");
      form.querySelectorAll(".pilot-step, .pilot-progress, .pilot-actions").forEach((el) => { el.hidden = true; });
      done.hidden = false;
      window.rt4Track("contact_request", {
        method: "form",
        plan: (form.querySelector("[name=plan]:checked") || {}).value || "pilot",
      });
    } catch (err) {
      showError(err.message || "Could not save that request.");
      send.disabled = false;
    }
  });
})();
