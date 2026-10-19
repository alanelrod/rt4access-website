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
        window.rt4Track("demo_click", { demo_name: i === 0 ? "company_map" : "region_map" });
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
  const link = event.target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href") || "";
  const label = (link.textContent || "").replace(/\s+/g, " ").trim();
  if (href.startsWith("mailto:access@rt4access.com")) {
    const subject = decodeURIComponent((href.match(/[?&]subject=([^&]+)/) || [])[1] || "");
    const plan = /starter/i.test(subject) ? "starter" : /growth/i.test(subject) ? "growth" : /scale/i.test(subject) ? "scale" : "pilot";
    window.rt4Track("contact_request", { method: "email", plan: plan });
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
