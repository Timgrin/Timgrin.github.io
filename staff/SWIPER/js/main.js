let mySwiper;
mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    slidesPerView: 3,
    spaceBetween: 15,
    loop:1,
  
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});