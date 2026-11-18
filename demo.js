(function () {
  var buttons = document.querySelectorAll("[data-wire]");
  var views = document.querySelectorAll("[data-wire-view]");
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var name = button.getAttribute("data-wire");
      buttons.forEach(function (item) {
        item.classList.toggle("is-on", item === button);
      });
      views.forEach(function (view) {
        view.classList.toggle("is-on", view.getAttribute("data-wire-view") === name);
      });
    });
  });
})();
