

const gameData = [
    { 
        correctEnglishPhrase: "It is a horse",
        draggableEnglishWords: ["It", "is", "a", "horse"],
        audioPath: "./Audio/10.1.mp3" 
    },
    { 
        correctEnglishPhrase: "It is a sheep",
        draggableEnglishWords: ["It", "is", "a", "sheep"],
        audioPath: "./Audio/10.2.mp3"
    },
    {
        correctEnglishPhrase: "It is Sunday",
        draggableEnglishWords: ["It", "is", "Sunday"],
        audioPath: "./Audio/10.3.mp3"
    },
    { 
        correctEnglishPhrase: "It is Saturday",
        draggableEnglishWords: ["It", "is", "Saturday"],
        audioPath: "./Audio/10.4.mp3"
    }
];

// Глобальна змінна для відстеження перетягуваного елемента для цієї гри
let currentDraggedItem = null;

// --- ДОПОМІЖНІ ФУНКЦІЇ ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- ФУНКЦІЇ ДЛЯ ГРИ (Вставити слово з аудіо) ---

/** Створює одну головоломку (українська фраза + зони для англ. перекладу + власний банк слів) */
function createGamePuzzle(puzzleData, index) {
    const puzzleId = `game-puzzle-${index}`;
    const correctEnglishText = puzzleData.correctEnglishPhrase;
    const englishWords = puzzleData.draggableEnglishWords;
    const audioPath = puzzleData.audioPath; // Отримуємо шлях до аудіо

    const gamePuzzlesContainer = document.getElementById('game-puzzles-container');
    if (!gamePuzzlesContainer) {
        console.error('Контейнер для пазлів (game-puzzles-container) не знайдено.');
        return;
    }

    const puzzleWrapper = document.createElement('div');
    puzzleWrapper.id = puzzleId;
    puzzleWrapper.className = "puzzle-wrapper bg-white p-4 rounded-lg shadow-md flex flex-col items-center relative mb-6";
    puzzleWrapper.innerHTML = `

        <button id="play-audio-button-${index}" class="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197 2.132A1 1 0 0110 13.132V9.868a1 1 0 011.555-.832l3.197 2.132a1 1 0 010 1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Прослухати
        </button>
        <audio id="audio-player-${index}" src="${audioPath}" preload="auto"></audio>

       <div id="word-drop-zone-group-${index}" class="word-drop-zone-group4 flex flex-wrap justify-center items-center gap-2 mb-4 min-h-[60px] p-2 border-2 border-dashed border-gray-200 rounded-md">
            </div>

        <div id="draggable-words-for-puzzle-${index}" class="draggable-words-individual-container4 w-full bg-blue-50 bg-opacity-95 backdrop-blur-sm p-4 rounded-md shadow-inner flex flex-wrap justify-center gap-2">
            </div>

        <div class="mt-3 w-full">
            <div class="flex justify-center mt-3 w-full">
          <button id="check-button-${index}" class="min-w-[180px] py-3 px-6 bg-sky-500 text-white text-base font-bold rounded-lg hover:bg-sky-600 transition-colors duration-300 disabled:bg-slate-300">
              Перевірити
           </button>
        </div>

            <p id="message-element-${index}" class="mt-1 h-4 text-center text-xs font-medium"></p>
        </div>
    `;
    gamePuzzlesContainer.appendChild(puzzleWrapper);


    const wordDropZoneGroup = document.getElementById(`word-drop-zone-group-${index}`);
    const checkButton = document.getElementById(`check-button-${index}`);
    const messageElement = document.getElementById(`message-element-${index}`);
    const individualDraggableWordsContainer = document.getElementById(`draggable-words-for-puzzle-${index}`);
    const playAudioButton = document.getElementById(`play-audio-button-${index}`);
    const audioPlayer = document.getElementById(`audio-player-${index}`);

    // Додаємо обробник подій для кнопки відтворення аудіо
    playAudioButton.addEventListener('click', () => {
        audioPlayer.play().catch(e => console.error("Помилка відтворення аудіо:", e));
    });

    englishWords.forEach((wordPart, wordPartIndex) => {
        const dropZone = document.createElement('div');
        dropZone.className = 'word-drop-slot w-auto min-w-[70px] h-14 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-500 overflow-hidden';
        dropZone.dataset.expectedWord = wordPart;
        addWordDropZoneListeners(dropZone, individualDraggableWordsContainer);
        wordDropZoneGroup.appendChild(dropZone);

        if (wordPartIndex < englishWords.length - 1 && !wordPart.endsWith('-')) {
            const spaceDiv = document.createElement('div');
            spaceDiv.className = 'w-2 h-10';
            wordDropZoneGroup.appendChild(spaceDiv);
        }
    });

    createIndividualDraggableWords(englishWords, individualDraggableWordsContainer);

    checkButton.addEventListener('click', () => checkGameResult(correctEnglishText, wordDropZoneGroup, messageElement, checkButton, individualDraggableWordsContainer));
}

/** Створює та додає перетягувані слова (окремі) до ІНДИВІДУАЛЬНОГО контейнера */
function createIndividualDraggableWords(wordsArray, targetContainer) {
    targetContainer.innerHTML = '';
    const wordsToDrag = shuffleArray(wordsArray);

    wordsToDrag.forEach((word, index) => {
        const wordBox = document.createElement('div');
        wordBox.id = `draggable-word-${targetContainer.id}-${index}`;
        wordBox.className = 'draggable-word-slot bg-blue-300 text-blue-700 py-3 rounded-lg shadow-md cursor-grab text-xl md:text-2xl font-semibold transition-transform duration-200 hover:scale-105';
        wordBox.textContent = word;
        wordBox.draggable = true;
        addDraggableWordListeners(wordBox);

        // ДОДАЄМО СЛУХАЧ ПОДІЙ КЛІКУ
        wordBox.addEventListener('click', () => handleWordClick(wordBox, targetContainer));

        targetContainer.appendChild(wordBox);
    });
}

/** Додавання слухачів подій до елементів, що перетягуються (окремі слова) */
function addDraggableWordListeners(element) {
    element.addEventListener('dragstart', (e) => {
        currentDraggedItem = e.target;
        e.dataTransfer.setData('text/plain', element.textContent);
        setTimeout(() => {
            e.target.classList.add('opacity-50');
        }, 0);
    });

    element.addEventListener('dragend', (e) => {
        setTimeout(() => {
            if (currentDraggedItem) {
                currentDraggedItem.classList.remove('opacity-50');
            }
            currentDraggedItem = null;
        }, 0);
    });
}

/** * Обробник кліку на слово.
 * Переміщує слово в першу доступну комірку.
 */
function handleWordClick(wordElement, originalDraggableContainer) {
    // Знаходимо батьківську групу слотів для цього речення
    const puzzleWrapper = wordElement.closest('.puzzle-wrapper');
    if (!puzzleWrapper) return;

    const wordDropZoneGroup = puzzleWrapper.querySelector('.word-drop-zone-group');
    if (!wordDropZoneGroup) return;

    // Знаходимо всі пусті слоти в цій групі
    const emptySlots = Array.from(wordDropZoneGroup.querySelectorAll('.word-drop-slot'))
        .filter(slot => !slot.querySelector('.draggable-word-slot'));

    if (emptySlots.length > 0) {
        const targetSlot = emptySlots[0]; // Вибираємо першу порожню комірку

        // Якщо в цільовому слоті вже є слово (хоча ми фільтруємо порожні, це для безпеки)
        const existingWord = targetSlot.querySelector('.draggable-word-slot');
        if (existingWord) {
            originalDraggableContainer.appendChild(existingWord); // Повертаємо в банк слів
            existingWord.classList.remove('correct-word-box', 'incorrect-word-box');
            existingWord.draggable = true;
            existingWord.style.cursor = 'grab';
        }

        // Переміщуємо натиснуте слово в цільовий слот
        targetSlot.appendChild(wordElement);

        // Очищаємо повідомлення про результат при зміні слова
        const messageElement = puzzleWrapper.querySelector('[id^="message-element-"]');
        if (messageElement) {
            messageElement.textContent = '';
            wordDropZoneGroup.querySelectorAll('.word-drop-slot').forEach(slot => {
                slot.classList.remove('correct', 'incorrect');
            });
        }
        const checkButton = puzzleWrapper.querySelector('[id^="check-button-"]');
        if (checkButton) {
            checkButton.disabled = false;
        }

        // Видаляємо клас opacity-50, якщо він залишився від drag-and-drop
        wordElement.classList.remove('opacity-50');

    } else {
        // Опціонально: Показати повідомлення, що немає вільних слотів
        const messageElement = puzzleWrapper.querySelector('[id^="message-element-"]');
        if (messageElement) {
            messageElement.textContent = 'Усі комірки заповнено.';
            messageElement.className = 'mt-1 h-4 text-center text-xs font-medium text-amber-600';
        }
    }
}


/** Додавання слухачів подій до зон скидання (окремі слоти) */
function addWordDropZoneListeners(zone, originalDraggableContainer) {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (currentDraggedItem && currentDraggedItem.classList.contains('draggable-word-slot') && !zone.querySelector('.draggable-word-slot')) {
            zone.classList.add('drag-over');
        }
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');

        if (currentDraggedItem && currentDraggedItem.classList.contains('draggable-word-slot') && !zone.querySelector('.draggable-word-slot')) {
            const existingWord = zone.querySelector('.draggable-word-slot');
            if (existingWord) {
                originalDraggableContainer.appendChild(existingWord);
                existingWord.classList.remove('correct-word-box', 'incorrect-word-box');
                existingWord.draggable = true;
                existingWord.style.cursor = 'grab';
            }

            zone.appendChild(currentDraggedItem);

            const messageElement = zone.closest('.puzzle-wrapper') ? zone.closest('.puzzle-wrapper').querySelector('[id^="message-element-"]') : null;
            if (messageElement) {
                messageElement.textContent = '';
                const dropZoneGroup = zone.closest('.word-drop-zone-group');
                if (dropZoneGroup) {
                    dropZoneGroup.querySelectorAll('.word-drop-slot').forEach(slot => {
                        slot.classList.remove('correct', 'incorrect');
                    });
                }
            }
            const checkButton = zone.closest('.puzzle-wrapper') ? zone.closest('.puzzle-wrapper').querySelector('[id^="check-button-"]') : null;
            if (checkButton) {
                checkButton.disabled = false;
            }
        }
    });

    // ДОДАЄМО ОБРОБНИК КЛІКУ НА САМУ ЗОНУ (ЩОБ ПОВЕРНУТИ СЛОВО НАЗАД)
    zone.addEventListener('click', (e) => {
        const droppedWordElement = zone.querySelector('.draggable-word-slot');
        if (droppedWordElement) {
            // Переміщуємо слово назад у його оригінальний банк слів
            originalDraggableContainer.appendChild(droppedWordElement);
            droppedWordElement.classList.remove('correct-word-box', 'incorrect-word-box'); // Прибираємо класи результату
            droppedWordElement.classList.add('bg-blue-300', 'text-blue-700', 'hover:scale-105'); // Повертаємо початкові стилі
            droppedWordElement.draggable = true;
            droppedWordElement.style.cursor = 'grab';

            // Очищуємо повідомлення та класи результату для цієї групи
            const puzzleWrapper = zone.closest('.puzzle-wrapper');
            if (puzzleWrapper) {
                const messageElement = puzzleWrapper.querySelector('[id^="message-element-"]');
                if (messageElement) {
                    messageElement.textContent = '';
                }
                const dropZoneGroup = puzzleWrapper.querySelector('.word-drop-zone-group');
                if (dropZoneGroup) {
                    dropZoneGroup.querySelectorAll('.word-drop-slot').forEach(slot => {
                        slot.classList.remove('correct', 'incorrect');
                    });
                }
                const checkButton = puzzleWrapper.querySelector('[id^="check-button-"]');
                if (checkButton) {
                    checkButton.disabled = false;
                }
            }
        }
    });
}

/** Перевірка результату гри (по словах) */
function checkGameResult(correctPhrase, wordDropZoneGroup, messageElement, checkButton, individualDraggableWordsContainer) {
    const dropSlots = wordDropZoneGroup.querySelectorAll('.word-drop-slot');
    let userAnswerWords = [];
    let allFilled = true;

    dropSlots.forEach(slot => {
        const droppedWordElement = slot.querySelector('.draggable-word-slot');
        if (droppedWordElement) {
            userAnswerWords.push(droppedWordElement.textContent.trim());
        } else {
            allFilled = false;
        }
    });

    if (!allFilled) {
        messageElement.textContent = 'Будь ласка, заповніть усі пробіли.';
        messageElement.className = 'mt-1 h-4 text-center text-xs font-medium text-amber-600';
        return;
    }

    const userAnswerJoined = userAnswerWords.join(' ');

    if (userAnswerJoined === correctPhrase) {
        messageElement.textContent = 'Чудово, правильно!';
        messageElement.className = 'mt-1 h-4 text-center text-xs font-medium text-green-600';
        checkButton.disabled = true;
        dropSlots.forEach(slot => {
            slot.classList.add('correct');
            slot.classList.remove('incorrect');
            const droppedWordElement = slot.querySelector('.draggable-word-slot');
            if (droppedWordElement) {
                droppedWordElement.classList.add('correct-word-box');
                droppedWordElement.classList.remove('incorrect-word-box');
                droppedWordElement.draggable = false;
                droppedWordElement.style.cursor = 'default';
            }
        });
    } else {
        messageElement.textContent = 'Спробуйте ще раз';
        messageElement.className = 'mt-1 h-4 text-center text-xs font-medium text-red-600';
        dropSlots.forEach(slot => {
            slot.classList.add('incorrect');
            slot.classList.remove('correct');
            const droppedWordElement = slot.querySelector('.draggable-word-slot');
            if (droppedWordElement) {
                droppedWordElement.classList.add('incorrect-word-box');
                droppedWordElement.classList.remove('correct-word-box');
            }
        });

        // Повертаємо неправильні слова назад у банк слів через 1 секунду
        setTimeout(() => {
            dropSlots.forEach(slot => {
                const droppedWordElement = slot.querySelector('.draggable-word-slot');
                if (droppedWordElement && droppedWordElement.classList.contains('incorrect-word-box')) {
                    droppedWordElement.classList.remove('incorrect-word-box', 'opacity-50');
                    droppedWordElement.classList.add('bg-blue-300', 'text-blue-700', 'hover:scale-105');

                    individualDraggableWordsContainer.appendChild(droppedWordElement);
                    droppedWordElement.draggable = true;
                    droppedWordElement.style.cursor = 'grab';

                    slot.classList.remove('incorrect'); // Прибираємо червоний фон з комірки
                }
            });
            messageElement.textContent = '';
        }, 1000);
    }
}


// --- ІНІЦІАЛІЗАЦІЯ ГРИ ПІСЛЯ ЗАВАНТАЖЕННЯ DOM ---
document.addEventListener('DOMContentLoaded', () => {
    const gamePuzzlesContainer = document.getElementById('game-puzzles-container');

    if (gamePuzzlesContainer && gameData.length > 0) {
        console.log('Ініціалізація Гри: Вставити слово з аудіо - Окремий банк для кожного речення');
        gameData.forEach((data, index) => {
            createGamePuzzle(data, index);
        });
    } else {
        console.warn('Контейнер для Гри або дані відсутні. Перевірте HTML ID або gameData.');
    }
});