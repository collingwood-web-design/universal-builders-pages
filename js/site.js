(function () {
  var page = document.body.getAttribute("data-page");
  if (page) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-nav]"), function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initCarousel(root) {
    var track = root.querySelector(".carousel-track") || root.querySelector(".hero-track");
    if (!track) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll("img"));
    if (!slides.length) return;

    var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-carousel-thumbs] button, .hero-thumbs button"));
    var pause = root.querySelector("[data-carousel-pause], .hero-pause, .carousel-pause");
    var isHero = root.classList.contains("hero");
    var interval = parseInt(root.getAttribute("data-interval"), 10) || (isHero ? 4000 : 4500);
    var index = 0;
    var timer = null;
    var inView = true;
    var manualPause = false;

    slides.forEach(function (img) {
      img.removeAttribute("hidden");
      img.classList.remove("is-active");
    });

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (img, i) {
        img.classList.toggle("is-active", i === index);
        img.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      thumbs.forEach(function (thumb, i) {
        thumb.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function stop() {
      clearInterval(timer);
      timer = null;
    }

    function restart() {
      stop();
      if (manualPause || !inView || slides.length < 2) return;
      timer = setInterval(function () { show(index + 1); }, interval);
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    if (pause) {
      pause.addEventListener("click", function () {
        manualPause = pause.getAttribute("aria-pressed") !== "true";
        pause.setAttribute("aria-pressed", manualPause ? "true" : "false");
        pause.textContent = manualPause ? "Play" : "Pause";
        restart();
      });
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          inView = entry.isIntersecting && entry.intersectionRatio > 0.2;
          restart();
        });
      }, { threshold: [0, 0.2, 0.5] });
      observer.observe(root);
    }

    show(0);
    restart();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".js-carousel, .hero"), function (root) {
    initCarousel(root);
  });

  function scrollToHash() {
    var id = location.hash.replace(/^#/, "");
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    window.requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (location.hash) {
    window.addEventListener("load", function () {
      setTimeout(scrollToHash, 50);
    });
  }
  window.addEventListener("hashchange", scrollToHash);

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var year = document.getElementById("copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());

  var a11yBtn = document.querySelector(".a11y-toggle");
  var panel = document.getElementById("a11y-tools");
  var flags = ["a11y-larger", "a11y-smaller", "a11y-gray", "a11y-contrast", "a11y-negative", "a11y-light", "a11y-links", "a11y-readable"];

  if (a11yBtn && panel) {
    a11yBtn.addEventListener("click", function () {
      var open = panel.hasAttribute("hidden");
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
      a11yBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    panel.addEventListener("click", function (event) {
      var action = event.target.getAttribute("data-a11y");
      if (!action) return;
      if (action === "reset") {
        flags.forEach(function (flag) { document.body.classList.remove(flag); });
        return;
      }
      if (action === "larger") {
        document.body.classList.remove("a11y-smaller");
        document.body.classList.toggle("a11y-larger");
        return;
      }
      if (action === "smaller") {
        document.body.classList.remove("a11y-larger");
        document.body.classList.toggle("a11y-smaller");
        return;
      }
      var map = {
        gray: "a11y-gray",
        contrast: "a11y-contrast",
        negative: "a11y-negative",
        light: "a11y-light",
        links: "a11y-links",
        readable: "a11y-readable"
      };
      document.body.classList.toggle(map[action]);
    });
  }
})();
