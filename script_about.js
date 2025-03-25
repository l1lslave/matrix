// Matrix background
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();
window.addEventListener('resize', setCanvasSize);

const fontSize = 14;
let columns = Math.ceil(canvas.width / fontSize) + 1;
let drops = new Array(columns).fill(1);

function getRandomChar() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    return characters[Math.floor(Math.random() * characters.length)];
}

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px 'Courier New'`;

    for (let i = 0; i < drops.length; i++) {
        const text = getRandomChar();
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i] += 0.5;
    }
}

setInterval(draw, 33);

// Gallery functionality
document.addEventListener('DOMContentLoaded', () => {
    const media = {
        photo: [
            'img/club_photo_1.jpg',
            'img/club_photo_2.jpg',
            'img/club_photo_3.jpg',
            'img/club_photo_5.jpg',
            'img/club_photo_6.jpg',
            'img/club_photo_7.jpg',
            'img/club_photo_8.jpg'
        ],
        video: [
            'img/club_video_1.mp4',
            'img/club_video_2.mp4'
        ]
    };

    const modal = document.getElementById('mediaModal');
    const modalImage = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    let currentType = null;
    let currentIndex = 0;

    document.querySelectorAll('.gallery-section').forEach(section => {
        const type = section.dataset.type;
        const wrapper = section.querySelector('.gallery-wrapper');
        const galleryPrev = section.querySelector('.gallery-prev');
        const galleryNext = section.querySelector('.gallery-next');
        let galleryIndex = 0;

        function loadGallery() {
            wrapper.innerHTML = '';
            media[type].forEach((src, index) => {
                const item = type === 'photo' ? document.createElement('img') : document.createElement('video');
                item.src = src;
                item.classList.add('gallery-item');
                if (type === 'video') item.muted = true;
                item.addEventListener('click', () => openModal(type, index));
                wrapper.appendChild(item);
            });
        }

        function updateGallery() {
            wrapper.style.transform = `translateX(-${galleryIndex * 100}%)`;
        }

        galleryPrev.addEventListener('click', () => {
            galleryIndex = (galleryIndex - 1 + media[type].length) % media[type].length;
            updateGallery();
        });

        galleryNext.addEventListener('click', () => {
            galleryIndex = (galleryIndex + 1) % media[type].length;
            updateGallery();
        });

        loadGallery();
    });

    function openModal(type, index) {
        currentType = type;
        currentIndex = index;
        modal.style.display = 'block';

        if (type === 'photo') {
            modalImage.src = media[type][index];
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
            modalVideo.pause();
        } else {
            modalVideo.querySelector('source').src = media[type][index];
            modalVideo.load();
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
            modalVideo.play();
        }
    }

    function updateModal() {
        if (!currentType) return;
        if (currentType === 'photo') {
            modalImage.src = media[currentType][currentIndex];
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
        } else {
            modalVideo.querySelector('source').src = media[currentType][currentIndex];
            modalVideo.load();
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
            modalVideo.play();
        }
    }

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modalVideo.pause();
        modalVideo.currentTime = 0; // Сбрасываем видео
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
    });

    prevBtn.addEventListener('click', () => {
        if (!currentType) return;
        currentIndex = (currentIndex - 1 + media[currentType].length) % media[currentType].length;
        updateModal();
    });

    nextBtn.addEventListener('click', () => {
        if (!currentType) return;
        currentIndex = (currentIndex + 1) % media[currentType].length;
        updateModal();
    });

    document.addEventListener('keydown', e => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'Escape') closeBtn.click();
        }
    });
});