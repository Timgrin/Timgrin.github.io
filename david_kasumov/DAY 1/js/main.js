var journalSlider;

journalSlider = new Swiper(".js-journal", {
    slidesPerView: 4.5, //Когда 5, боковые слайды вылазят, поэтому написал 4.5
    centeredSlides: 1,
    loop: 1,
    spaceBetween: -40,
    navigation: {
        nextEl: ".swiper-button-next"
    }
});