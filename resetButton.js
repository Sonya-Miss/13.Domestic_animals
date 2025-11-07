// cancelAnswer.js

export function addCancelButtonToWord(wordElement, originalDraggableContainer) {
    // Перевіряємо, чи кнопка вже додана
    if (wordElement.querySelector('.cancel-button')) return;

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '✖';
    cancelBtn.className = 'cancel-button ml-2 text-red-500 font-bold hover:text-red-700';
    cancelBtn.style.fontSize = '16px';
    cancelBtn.style.lineHeight = '1';
    cancelBtn.style.cursor = 'pointer';

    cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        const parentSlot = wordElement.parentElement;
        if (parentSlot && parentSlot.classList.contains('word-drop-slot')) {
            // Скидаємо стилі слова та слота
            wordElement.classList.remove('correct-word-box', 'incorrect-word-box', 'opacity-50');
            wordElement.classList.add('bg-blue-300', 'text-blue-700', 'hover:scale-105');
            wordElement.draggable = true;
            wordElement.style.cursor = 'grab';

            cancelBtn.remove(); // Видаляємо кнопку перед поверненням

            originalDraggableContainer.appendChild(wordElement);

            // Скидання повідомлень і кнопки "перевірити"
            const puzzleWrapper = wordElement.closest('.puzzle-wrapper');
            if (puzzleWrapper) {
                const messageElement = puzzleWrapper.querySelector('[id^="message-element-"]');
                if (messageElement) messageElement.textContent = '';

                const checkButton = puzzleWrapper.querySelector('[id^="check-button-"]');
                if (checkButton) checkButton.disabled = false;

                const dropZoneGroup = puzzleWrapper.querySelector('.word-drop-zone-group');
                if (dropZoneGroup) {
                    dropZoneGroup.querySelectorAll('.word-drop-slot').forEach(slot =>
                        slot.classList.remove('correct', 'incorrect')
                    );
                }
            }
        }
    });

    wordElement.appendChild(cancelBtn);
}
