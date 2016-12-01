$("nav select").change(function() {
  window.location = $(this).find("option:selected").val();
});

$(".open-drawer").on("click", function() {
  $(".global-header nav").toggleClass("open");
  return false;
});