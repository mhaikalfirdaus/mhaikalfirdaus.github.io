(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (q, c) { return (c || document).querySelector(q); };
  var $$ = function (q, c) { return Array.prototype.slice.call((c || document).querySelectorAll(q)); };

  /* Menu samping untuk layar kecil */
  var header = $("#header"), toggle = $(".header-toggle");
  function setMenu(open) {
    header.classList.toggle("header-show", open);
    toggle.classList.toggle("bi-list", !open);
    toggle.classList.toggle("bi-x", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
  }
  toggle.addEventListener("click", function () { setMenu(!header.classList.contains("header-show")); });
  $$("#navmenu a").forEach(function (a) { a.addEventListener("click", function () { if (header.classList.contains("header-show")) setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("header-show")) { setMenu(false); toggle.focus(); } });

  /* Tombol kembali ke atas */
  var top = $("#scroll-top");
  function onScroll() { top.classList.toggle("active", window.scrollY > 100); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  top.addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* Menu aktif sesuai bagian yang terlihat */
  var links = $$("#navmenu a").filter(function (a) { return a.hash; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("active", a.hash === "#" + en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$("section[id]").forEach(function (sec) { io.observe(sec); });
  }

  /* Animasi dan efek (dimatikan bila pengguna meminta gerak minimal) */
  if (window.AOS) AOS.init({ duration: 600, easing: "ease-in-out", once: true, mirror: false, disable: function () { return reduce; } });
  var typed = $(".typed");
  if (typed && window.Typed && !reduce) {
    new Typed(".typed", { strings: typed.getAttribute("data-typed-items").split(","), loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000 });
  }
  if (window.PureCounter) new PureCounter();
  if (window.GLightbox) GLightbox({ selector: ".glightbox" });

  /* Filter proyek */
  var chips = $$(".chip"), cards = $$("#proyek [data-cat]");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-f");
      chips.forEach(function (x) { var on = x === c; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); });
      cards.forEach(function (el) { el.hidden = !(f === "all" || el.getAttribute("data-cat").split(" ").indexOf(f) > -1); });
    });
  });

  /* Formulir kontak: membuka aplikasi email */
  var form = $("#msgform");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = $("#fn").value.trim(), t = $("#fs").value.trim(), m = $("#fm").value.trim();
    window.location.href = "mailto:mhaikalfirdaus011@gmail.com?subject=" + encodeURIComponent(t) + "&body=" + encodeURIComponent("Nama: " + n + "\n\n" + m);
  });
})();
