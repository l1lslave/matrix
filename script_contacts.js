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