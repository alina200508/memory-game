// 1. Данные и утилиты (images, deck, shuffle)
// 2. Состояние (state, updateStats)
// 3. Элементы (header, main, board_wrapper, statsWrapper)
// 4. Функции логики (onCardClick, checkMatch, ...)
// 5. Функции рендера (createCard, renderBoard)
// 6. Модалки (modal_leaders, showWinModal)
// 7. Кнопки (New game → newGame, Table leaders → открыть модалку)
// 8. Сборка DOM (document.body.prepend(header, main))
// 9. Первый запуск (newGame())

const state = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    matchedPairs: 0,
    totalPairs: 8
};

const header = document.createElement('header');

const label_box = document.createElement('div');

const label = document.createElement('p');
label.className = 'label';
label.textContent = 'Memory Game';

function createButton ({text, className, onClick}) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
}

const modal_leaders = document.createElement('dialog');
modal_leaders.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
});

const modal_title = document.createElement('h2');
modal_title.textContent = 'List of best results';



const close_modal_btn = document.createElement('button');
close_modal_btn.type = 'button';
close_modal_btn.textContent = 'Close';
close_modal_btn.addEventListener ('click', () => {
    if (modal_leaders.open) modal_leaders.close()})

modal_leaders.append(modal_title, close_modal_btn);

label_box.append(label);

header.append (
    label_box,
    modal_leaders,
    createButton({
        text: 'New game',
        className: 'btn_new_game',
        onClick: newGame
    }),
    createButton({
        text: 'Table leaders',
        className: 'btn_table_leaders',
        onClick: () => {
            document.body.classList.add('modal-open');
            modal_leaders.showModal()}
    })
);

const main = document.createElement('main');

const main_wrapper = document.createElement('div');

const values_wrapper = document.createElement('div');
values_wrapper.className = 'values';

const movesEl = document.createElement('span');
movesEl.className = 'moves';

const pairsEl = document.createElement('span');
pairsEl.className = 'pairs';

values_wrapper.append(movesEl, pairsEl);

const images = [
    'images/1.jpg',
    'images/2.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg',
    'images/7.jpg',
    'images/8.jpg'
];

const deck = [...images, ...images];

function shuffle(array) {
    const result = array.slice();
    let m = result.length;
    let t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = result[m];
        result[m] = result[i];
        result[i] = t;
    }
    return result;
}


function createCard(src) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.src = src;

    const inner = document.createElement('div');
    inner.className = 'card_inner';

    const back = document.createElement('div');
    back.className = 'card_back';

    const front = document.createElement('div');
    front.className = 'card_front';

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.width = 100;
    img.height = 100;

    front.append(img);
    inner.append(back, front);
    card.append(inner);
    return card;
}

function onCardClick (card) {
    if (state.lockBoard) return;
    if (card.classList.contains('is-flipped')) return;
    if (card.classList.contains('is-matched')) return;

    card.classList.add('is-flipped');

    if (!state.firstCard) {
        state.firstCard = card;
        return;
    }

    state.secondCard = card;
    state.moves++;
    updateStats();
    checkMatch();
}

function checkMatch() {
    const { firstCard, secondCard } = state;

    const isMatch = firstCard.dataset.src === secondCard.dataset.src;

    if (isMatch) {
        firstCard.classList.add('is-matched');
        secondCard.classList.add('is-matched');
        resetTurn();
        state.matchedPairs++;
        updateStats();
        checkWin();
    } else {
        state.lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('is-flipped');
            secondCard.classList.remove('is-flipped');
            resetTurn();
        }, 800);
    }
}

function resetTurn () {
    state.firstCard = null;
    state.secondCard = null;
    state.lockBoard = false;
}

function updateStats() {
  movesEl.textContent = `Moves: ${state.moves}`;
  pairsEl.textContent = `Pairs: ${state.matchedPairs} / ${state.totalPairs}`;
}

function checkWin () {
    if (state.matchedPairs === state.totalPairs) {
        setTimeout(() => {
            const msg = `Win! Moves: ${state.moves}`;
            showWinModal(state.moves);
        }, 400);
    }
}

function showWinModal (moves) {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';

    const h = document.createElement('h2');
    h.textContent = 'Win!';

    const p = document.createElement('p');
    p.textContent = `You did it in ${moves} moves.`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'New game';
    btn.addEventListener('click', () => {
        dialog.close();
        newGame();
    });

    dialog.append(h, p, btn);
    document.body.append(dialog);
    dialog.showModal();

    dialog.addEventListener('close', () => dialog.remove(), { once: true });
}

function newGame() {
  state.firstCard = null;
  state.secondCard = null;
  state.lockBoard = false;
  state.moves = 0;
  state.matchedPairs = 0;
  updateStats();
  renderBoard();
}

const board_wrapper = document.createElement('div');
board_wrapper.className = 'board_wrapper';

function renderBoard () {
    const shuffled = shuffle(deck);

    const fragment = document.createDocumentFragment();

    shuffled.forEach((src) => {
        const card = createCard(src);
        card.addEventListener('click', () => onCardClick(card));
        fragment.append(card);
    });

    board_wrapper.replaceChildren(fragment);
}

renderBoard();

main.append(values_wrapper, board_wrapper);

document.body.prepend(header, main);



