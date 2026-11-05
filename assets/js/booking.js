/* Prise de rendez-vous avec Cal.com
   Le calendrier s'ouvre dans une fenêtre par-dessus le site. Si le script Cal.com
   n'est pas encore chargé (ou bloqué), le lien ouvre simplement la page Cal.com. */
(function () {
  var NS = "15min";
  var BRAND = "#A84309";
  var ready = false;

  function load() {
    if (window.Cal && window.Cal.loaded) return;
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          var s = d.createElement("script");
          s.src = A;
          s.addEventListener("load", function () { ready = true; });
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", NS, { origin: "https://cal.com" });
    window.Cal.ns[NS]("ui", {
      cssVarsPerTheme: { light: { "cal-brand": BRAND }, dark: { "cal-brand": "#C8561A" } },
      hideEventTypeDetails: false,
      layout: "month_view"
    });
  }

  // Chargement discret quand le navigateur est libre, ou dès qu'on approche du bouton
  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 4000 });
  else setTimeout(load, 2500);
  document.addEventListener("pointerover", function (e) {
    if (e.target.closest && e.target.closest("[data-cal-link]")) load();
  }, { passive: true });

  // Tant que Cal.com est prêt, on garde le visiteur sur le site et la fenêtre s'ouvre
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-cal-link]");
    if (a && ready) e.preventDefault();
  }, true);
})();
