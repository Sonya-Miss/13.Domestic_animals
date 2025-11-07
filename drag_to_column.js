const columnDragDropGameData = {
    columns: [
        { id: "Am", title: "Am", correctWords: ["I"] },
        { id: "Is", title: "Is", correctWords: ["He", "She", "It"] },
        { id: "Are", title: "Are", correctWords: ["You", "We", "They"] }
    ],
    // Всі слова, які будуть доступні для перетягування
    allDraggableWords: [
        "I", "He", "She", "It", "You", "We", "They"
    ]
};

// Глобальна змінна для відстеження перетягуваного елемента
let currentColumnDraggedItem = null; // Змінено назву

// --- ДОПОМІЖНІ ФУНКЦІЇ ---
// Функція shuffleArray залишається без змін, оскільки вона загального призначення
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- ОСНОВНІ ФУНКЦІЇ ГРИ ---

/**
 * Ініціалізує гру: створює зони скидання та перетягувані слова.
 */
function initializeColumnDragDropGame() { // Змінено назву
    const columnDropZonesContainer = document.getElementById('column-drop-zones-container'); // Змінено ID
    const columnWordsBank = document.getElementById('column-words-bank'); // Змінено ID
    const columnCheckButton = document.getElementById('column-check-game-button'); // Змінено ID
    const columnGameMessageElement = document.getElementById('column-game-message'); // Змінено ID

    if (!columnDropZonesContainer || !columnWordsBank || !columnCheckButton || !columnGameMessageElement) {
        console.error('Не знайдено один або кілька основних елементів гри "Перетягни Слова в Колонки".');
        return;
    }

    // Очищаємо контейнери перед додаванням елементів (для повторної ініціалізації)
    columnDropZonesContainer.innerHTML = '';
    // Очищаємо тільки слова, заголовок залишаємо
    const wordsBankContent = columnWordsBank.querySelector('.flex.flex-wrap.justify-center.gap-3');
    if (wordsBankContent) {
        wordsBankContent.innerHTML = '';
    } else {
        columnWordsBank.innerHTML = ''; // Якщо структура змінилась, просто очищаємо весь банк
    }

    // 1. Створюємо зони скидання (колонки)
    columnDragDropGameData.columns.forEach(column => { // Змінено назву gameData
        const dropZoneWrapper = document.createElement('div');
        dropZoneWrapper.className = "flex flex-col bg-white p-6 rounded-lg shadow-md";
        dropZoneWrapper.innerHTML = `
            <h3 class="text-xl font-bold text-slate-700 mb-4 text-center">${column.title}</h3>
            <div id="column-drop-zone-${column.id}" class="column-drag-drop-zone flex-grow p-3 rounded-md space-y-2">
                </div>
        `;
        columnDropZonesContainer.appendChild(dropZoneWrapper);

        const dropZoneElement = document.getElementById(`column-drop-zone-${column.id}`); // Змінено ID
        addColumnDropZoneListeners(dropZoneElement); // Змінено назву функції
    });

    // 2. Створюємо перетягувані слова
    const shuffledWords = shuffleArray([...columnDragDropGameData.allDraggableWords]); // Змінено назву gameData
    shuffledWords.forEach(word => {
        const wordItem = document.createElement('div');
        wordItem.id = `column-draggable-${word.toLowerCase().replace(/\s/g, '-')}`; // Змінено ID
        wordItem.className = 'column-draggable-item bg-blue-300 text-blue-800 py-3 px-4 rounded-md shadow font-semibold text-lg hover:bg-blue-400'; // Змінено назву класу
        wordItem.textContent = word;
        wordItem.draggable = true;
        addColumnDraggableItemListeners(wordItem); // Змінено назву функції
        columnWordsBank.appendChild(wordItem);
    });

    // 3. Додаємо слухача до кнопки перевірки
    columnCheckButton.addEventListener('click', checkColumnDragDropGameResult); // Змінено назву функції
}

/**
 * Додає слухачів подій для перетягуваного елемента.
 * @param {HTMLElement} element Елемент, який можна перетягувати.
 */
function addColumnDraggableItemListeners(element) { // Змінено назву
    element.addEventListener('dragstart', (e) => {
        currentColumnDraggedItem = e.target; // Змінено назву
        e.dataTransfer.setData('text/plain', e.target.textContent);
        // Додаємо невелику затримку, щоб opacity-50 застосувався після захоплення елемента
        setTimeout(() => {
            e.target.classList.add('opacity-50');
        }, 0);
    });

    element.addEventListener('dragend', (e) => {
        // Прибираємо клас opacity-50 після завершення перетягування
        setTimeout(() => {
            if (currentColumnDraggedItem) { // Змінено назву
                currentColumnDraggedItem.classList.remove('opacity-50'); // Змінено назву
            }
            currentColumnDraggedItem = null; // Змінено назву
        }, 0);
    });
}

/**
 * Додає слухачів подій для зони скидання.
 * @param {HTMLElement} zone Елемент, який є зоною скидання.
 */
function addColumnDropZoneListeners(zone) { // Змінено назву
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Дозволяє скидання
        // Перевіряємо, чи перетягується елемент і чи він є допустимим для цієї зони
        if (currentColumnDraggedItem && currentColumnDraggedItem.classList.contains('column-draggable-item')) { // Змінено назву
            zone.classList.add('drag-over');
        }
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');

        if (currentColumnDraggedItem) { // Змінено назву
            // Видаляємо слово з попереднього місця (якщо воно було в іншій зоні скидання)
            const parentOfDragged = currentColumnDraggedItem.parentElement; // Змінено назву
            if (parentOfDragged && parentOfDragged.classList.contains('column-drag-drop-zone')) { // Змінено назву
                parentOfDragged.removeChild(currentColumnDraggedItem); // Змінено назву
            }
            // Додаємо слово до нової зони
            zone.appendChild(currentColumnDraggedItem); // Змінено назву
            // Скидаємо будь-які статусні класи після переміщення
            currentColumnDraggedItem.classList.remove('column-correct-item', 'column-incorrect-item'); // Змінено назву
            resetColumnDragDropGameUI(); // Змінено назву функції // Скидаємо візуальні результати після будь-якого перетягування
        }
    });

    // Додаємо обробник кліку на саму зону, щоб повернути слово в банк
    zone.addEventListener('click', (e) => {
        const clickedItem = e.target;
        // Якщо клік був на перетягнутому елементі всередині зони
        if (clickedItem.classList.contains('column-draggable-item')) { // Змінено назву
            const columnWordsBank = document.getElementById('column-words-bank'); // Змінено ID
            columnWordsBank.appendChild(clickedItem); // Повертаємо слово в банк
            clickedItem.classList.remove('column-correct-item', 'column-incorrect-item'); // Змінено назву // Прибираємо статусні класи
            resetColumnDragDropGameUI(); // Змінено назву функції // Скидаємо візуальні результати після повернення слова
        }
    });
}

/**
 * Перевіряє результат гри та оновлює інтерфейс.
 */
function checkColumnDragDropGameResult() { // Змінено назву
    let allCorrect = true;
    const columnGameMessageElement = document.getElementById('column-game-message'); // Змінено ID
    columnGameMessageElement.textContent = ''; // Очищаємо попередні повідомлення

    columnDragDropGameData.columns.forEach(column => { // Змінено назву gameData
        const dropZoneElement = document.getElementById(`column-drop-zone-${column.id}`); // Змінено ID
        const droppedItems = Array.from(dropZoneElement.querySelectorAll('.column-draggable-item')); // Змінено назву класу
        
        // Очищаємо попередні класи результатів для зони
        dropZoneElement.classList.remove('column-correct-drop', 'column-incorrect-drop'); // Змінено назву класу

        // Перевіряємо, чи всі слова в зоні правильні для цієї колонки
        let zoneCorrect = true;
        // Перевіряємо, чи кожне слово в зоні скидання є правильним для цієї колонки
        droppedItems.forEach(item => {
            item.classList.remove('column-correct-item', 'column-incorrect-item'); // Змінено назву класу // Очищаємо попередні класи
            if (column.correctWords.includes(item.textContent)) {
                item.classList.add('column-correct-item'); // Змінено назву класу
            } else {
                item.classList.add('column-incorrect-item'); // Змінено назву класу
                zoneCorrect = false; // Якщо хоч одне слово неправильне, вся зона неправильна
            }
        });

        // Перевіряємо, чи всі правильні слова для цієї колонки знаходяться в ній
        const missingWords = column.correctWords.filter(word => 
            !droppedItems.some(item => item.textContent === word)
        );

        // Додаткова перевірка: чи кількість скинутих слів відповідає кількості очікуваних
        const extraWords = droppedItems.filter(item => 
            !column.correctWords.includes(item.textContent)
        );


        if (zoneCorrect && missingWords.length === 0 && extraWords.length === 0) {
            dropZoneElement.classList.add('column-correct-drop'); // Змінено назву класу
        } else {
            dropZoneElement.classList.add('column-incorrect-drop'); // Змінено назву класу
            allCorrect = false;
        }
    });

    if (allCorrect) {
        columnGameMessageElement.textContent = 'Вітаємо! Все правильно!';
        columnGameMessageElement.className = 'mt-4 text-lg font-semibold text-center text-green-700';
    } else {
        columnGameMessageElement.textContent = 'Є помилки. Спробуйте ще раз!';
        columnGameMessageElement.className = 'mt-4 text-lg font-semibold text-center text-red-700';
    }
}

/**
 * Скидає візуальні індикатори результатів.
 */
function resetColumnDragDropGameUI() { // Змінено назву
    const columnGameMessageElement = document.getElementById('column-game-message'); // Змінено ID
    columnGameMessageElement.textContent = '';
    columnGameMessageElement.className = 'mt-4 text-lg font-semibold text-center h-8'; // Повертаємо початкові класи

    columnDragDropGameData.columns.forEach(column => { // Змінено назву gameData
        const dropZoneElement = document.getElementById(`column-drop-zone-${column.id}`); // Змінено ID
        dropZoneElement.classList.remove('column-correct-drop', 'column-incorrect-drop'); // Змінено назву класу
        
        // Прибираємо індикатори з окремих слів, які знаходяться в зонах скидання
        const droppedItems = dropZoneElement.querySelectorAll('.column-draggable-item'); // Змінено назву класу
        droppedItems.forEach(item => {
            item.classList.remove('column-correct-item', 'column-incorrect-item'); // Змінено назву класу
        });
    });
    // Прибираємо індикатори з слів, що залишилися в банку
    const columnWordsBank = document.getElementById('column-words-bank'); // Змінено ID
    const bankItems = columnWordsBank.querySelectorAll('.column-draggable-item'); // Змінено назву класу
    bankItems.forEach(item => {
        item.classList.remove('column-correct-item', 'column-incorrect-item'); // Змінено назву класу
    });
}


// --- ІНІЦІАЛІЗАЦІЯ ГРИ ПІСЛЯ ЗАВАНТАЖЕННЯ DOM ---
document.addEventListener('DOMContentLoaded', initializeColumnDragDropGame); // Змінено назву функції