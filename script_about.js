const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Устанавливаем размер canvas равным размеру окна
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Вызываем функцию при загрузке и изменении размера окна
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Задаем размер шрифта (теперь он будет фиксированным)
const fontSize = 14;

// Рассчитываем количество колонок с небольшим запасом
function calculateColumns() {
    return Math.ceil(canvas.width / fontSize) + 1; // Добавляем +1 для компенсации
}

let columns = calculateColumns();
let drops = new Array(columns).fill(1);

// Функция для получения случайного символа
function getRandomChar() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    return characters[Math.floor(Math.random() * characters.length)];
}

// Функция отрисовки
function draw() {
    // Полупрозрачный черный фон для создания эффекта затухания
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Задаем цвет и шрифт для символов
    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px 'Courier New'`;

    // Отрисовка символов
    for (let i = 0; i < drops.length; i++) {
        const text = getRandomChar();
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Проверяем, находится ли символ в пределах canvas
        if (x <= canvas.width) {
            ctx.fillText(text, x, y);
        }

        // Сброс позиции символа, когда он достигает низа
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += 0.5;
    }
}

// Обновление размеров и позиций при изменении размера окна
window.addEventListener('resize', () => {
    setCanvasSize();
    // Пересчитываем количество колонок
    columns = calculateColumns();
    // Обновляем массив drops
    const newDrops = new Array(columns).fill(1);
    // Сохраняем существующие значения
    for (let i = 0; i < drops.length; i++) {
        if (i < newDrops.length) {
            newDrops[i] = drops[i];
        }
    }
    drops = newDrops;
});

// Запускаем анимацию
setInterval(draw, 33);
// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    
    // Array of actual image paths
    const images = [
        'img/club_photo_1.jpg',
        'img/club_photo_2.jpg',
        'img/club_photo_3.jpg'
    ];

    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval;

    // Load images
    function loadImages() {
        galleryWrapper.innerHTML = '';
        images.forEach(imagePath => {
            const img = document.createElement('img');
            img.src = imagePath;
            img.classList.add('gallery-image');
            img.addEventListener('click', () => openModal(imagePath));
            galleryWrapper.appendChild(img);
        });
    }

    // Navigation functions
    function showSlide(index, isModal = false) {
        if (isTransitioning && !isModal) return; // Prevent rapid sliding
        isTransitioning = true;
        
        if (index >= images.length) index = 0;
        if (index < 0) index = images.length - 1;
        currentIndex = index;

        if (isModal) {
            modalImg.src = images[currentIndex];
        } else {
            galleryWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        // Reset transition lock after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 500); // Match this with CSS transition duration
    }

    function nextSlide(isModal = false) {
        showSlide(currentIndex + 1, isModal);
    }

    function prevSlide(isModal = false) {
        showSlide(currentIndex - 1, isModal);
    }

    // Modal functions
    function openModal(imagePath) {
        modal.style.display = 'block';
        modalImg.src = imagePath;
        // Find index of opened image
        currentIndex = images.findIndex(img => img === imagePath);
        stopAutoSlide();
        
        // Add modal navigation buttons if they don't exist
        if (!modal.querySelector('.modal-nav')) {
            const modalNav = document.createElement('div');
            modalNav.className = 'modal-nav';
            
            const modalPrev = document.createElement('button');
            modalPrev.className = 'modal-prev';
            modalPrev.innerHTML = '&#10094;';
            modalPrev.onclick = (e) => {
                e.stopPropagation();
                prevSlide(true);
            };
            
            const modalNext = document.createElement('button');
            modalNext.className = 'modal-next';
            modalNext.innerHTML = '&#10095;';
            modalNext.onclick = (e) => {
                e.stopPropagation();
                nextSlide(true);
            };
            
            modalNav.appendChild(modalPrev);
            modalNav.appendChild(modalNext);
            modal.appendChild(modalNav);
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        startAutoSlide();
    }

    // Auto slide functions
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            if (!isTransitioning) { // Only advance if not currently transitioning
                nextSlide();
            }
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') prevSlide(true);
            if (e.key === 'ArrowRight') nextSlide(true);
            if (e.key === 'Escape') closeModal();
        }
    });

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }

    function handleSwipe() {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    galleryWrapper.addEventListener('touchstart', handleTouchStart);
    galleryWrapper.addEventListener('touchend', handleTouchEnd);

    // Initialize gallery
    loadImages();
    startAutoSlide();

    // Pause auto-slide when hovering over gallery
    galleryWrapper.addEventListener('mouseenter', stopAutoSlide);
    galleryWrapper.addEventListener('mouseleave', startAutoSlide);
});