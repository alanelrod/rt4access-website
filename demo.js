(function () {
  var frame = document.getElementById("live3-frame");
  var buttons = document.querySelectorAll("[data-live]");
  if (!frame) return;
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var src = button.getAttribute("data-src");
      if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
      var kind = button.getAttribute("data-live");
      buttons.forEach(function (item) {
        if (item.getAttribute("data-live") !== kind) return;
        item.classList.toggle("is-on", item === button);
      });
      if (kind === "company") {
        buttons.forEach(function (item) {
          if (item.getAttribute("data-live") === "view") {
            item.classList.toggle("is-on", item.textContent === "Company");
          }
        });
      }
      if (kind === "view" && button.textContent !== "Company") {
        buttons.forEach(function (item) {
          if (item.getAttribute("data-live") === "company") item.classList.remove("is-on");
        });
      }
    });
  });
})();
