const cards = document.querySelectorAll(".carousel-card");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;
let autoSlide;

function clearCardClasses(card) {
    card.classList.remove("active", "prev", "next", "far-prev", "far-next");
}

function updateCarousel() {
    const total = cards.length;

    cards.forEach((card) => {
        clearCardClasses(card);
    });

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;
    const farPrevIndex = (currentIndex - 2 + total) % total;
    const farNextIndex = (currentIndex + 2) % total;

    cards[currentIndex].classList.add("active");
    cards[prevIndex].classList.add("prev");
    cards[nextIndex].classList.add("next");

    if (total > 3) {
        cards[farPrevIndex].classList.add("far-prev");
        cards[farNextIndex].classList.add("far-next");
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
}

function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}

nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
});

updateCarousel();
startAutoSlide();