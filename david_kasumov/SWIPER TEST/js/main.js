var journalSlider;

journalSlider = new Swiper(".js-journal", {
    slidesPerView: 5, //Когда 5, боковые слайды вылазят, поэтому написал 4.5
    centeredSlides: 1,
    loop: true,
    spaceBetween: false,
    navigation: {
        nextEl: ".swiper-button-next",
        nextEl: ".swiper-button-prev"
    }
});