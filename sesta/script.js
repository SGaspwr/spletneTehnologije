document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    alert("Prijava je bila uspešno poslana!");
    form.reset(); // Po želji počisti obrazec
  });
});
