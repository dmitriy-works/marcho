$(function () {
  $('.top-slider__inner').slick({
    arrows: false,
    dots: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 2000,
  })

  $(".star").rateYo({    
    starWidth: "17px",
    normalFill: "#ccccce", /*цвет не закрашеной звездочки */
    ratedFill: "#ffc35b",/*цвет закрашеной звездочки */
    readOnly: true, /*при наводе мышки цвет звездочки не меняется */
  });
});