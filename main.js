// 1. Данные и утилиты (images, deck, shuffle)
// 2. Состояние (state, updateStats)
// 3. Элементы (header, main, board_wrapper, statsWrapper)
// 4. Функции логики (onCardClick, checkMatch, ...)
// 5. Функции рендера (createCard, renderBoard)
// 6. Модалки (modal_leaders, showWinModal)
// 7. Кнопки (New game → newGame, Table leaders → открыть модалку)
// 8. Сборка DOM (document.body.prepend(header, main))
// 9. Первый запуск (newGame())

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

const state = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    moves: 0,
    matchedPairs: 0,
    totalPairs: 8
};

const STORAGE_KEY = 'memoryGame:leaders';
const MAX_RESULTS = 10;

function loadResults() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter (
            (r) => r && typeof r.moves === 'number' && typeof r.date === 'number'
        );
    } catch (e) {
        console.warn(e);
        return [];
    }
}

function saveResults (results) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (e) {
        console.warn(e);
    }
}

function sortResults(results) {
  return results.slice().sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.date - b.date;
  });
}

function trimResults(results) {
  return sortResults(results).slice(0, MAX_RESULTS);
}

function addResult(moves) {
  const results = loadResults();
  results.push({ moves, date: Date.now() });
  saveResults(trimResults(results));
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const header = document.createElement('header');

const label_box = document.createElement('div');
label_box.className = label_box

const label = document.createElement('p');
label.className = 'label';
label.textContent = 'Memory Game';

label_box.append(label);

const header_buttons = document.createElement('div');
header_buttons.className = 'header_buttons';

header_buttons.append(
    createButton({
        text: 'New game',
        className: 'btn',
        onClick: newGame
    }),
    createButton({
        text: 'Table leaders',
            className: 'btn',
            onClick: () => {
                document.body.classList.add('modal-open');
                renderLeaders();   
                modal_leaders.showModal()}
    })
)
function createButton ({text, className, onClick}) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    return btn;
}

function renderLeaders () {
    leadersBody.replaceChildren();

    const results = trimResults(loadResults());

    if (results.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'leaders_empty';
        empty.textContent = 'No results';
        leadersBody.append(empty);
        return;
    }

    const table = document.createElement('table');
    table.className = 'leaders_table'

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['number', 'Moves', 'Date'].forEach((text) => {
        const th = document.createElement('th');
        th.textContent = text;
        headRow.append(th);
    });
    thead.append(headRow);

    const tbody = document.createElement('tbody');
    results.forEach((result, index) => {
        const tr = document.createElement('tr');

        const number = document.createElement('td');
        number.textContent = index + 1;

        const moves = document.createElement('td');
        moves.textContent = result.moves;

        const date = document.createElement('td');
        date.textContent = formatDate(result.date);

        tr.append(number, moves, date);
        tbody.append(tr);
    });

    table.append(thead, tbody);
    leadersBody.append(table);
}

const modal_leaders = document.createElement('dialog');
modal_leaders.className = 'modal';
modal_leaders.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
});
modal_leaders.addEventListener('click', (e) => {
  const rect = modal_leaders.getBoundingClientRect();
  const isInDialog =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!isInDialog) {
    modal_leaders.close();
  }
});

const modal_title = document.createElement('h2');
modal_title.textContent = 'List of best results';

const leadersBody = document.createElement('div');
leadersBody.className = 'leaders_body';

const close_modal_btn = document.createElement('button');
close_modal_btn.className = 'btn';
close_modal_btn.type = 'button';
close_modal_btn.textContent = 'Close';
close_modal_btn.addEventListener ('click', () => {
    if (modal_leaders.open) modal_leaders.close()})

modal_leaders.append(modal_title, leadersBody, close_modal_btn);

header.append (
    label_box,
    modal_leaders,
    header_buttons
);

const main = document.createElement('main');

const main_wrapper = document.createElement('div');
main_wrapper.className = 'main_wrapper';

const values_wrapper = document.createElement('div');
values_wrapper.className = 'values';

const movesEl = document.createElement('span');
movesEl.className = 'moves';

const pairsEl = document.createElement('span');
pairsEl.className = 'pairs';

values_wrapper.append(movesEl, pairsEl);



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
    img.className = 'img';
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
        addResult(state.moves);
        setTimeout(() => {
            showWinModal(state.moves);
        }, 400);
    }
}

function showWinModal (moves) {
    const dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (!isInDialog) {
        dialog.close();
    }
});

    const h = document.createElement('h2');
    h.textContent = 'Win!';

    const p = document.createElement('p');
    p.textContent = `You did it in ${moves} moves.`;

    const btn = document.createElement('button');
    btn. className = 'btn';
    btn.type = 'btn';
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
  resultSaved = false;
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

main_wrapper.append(values_wrapper, board_wrapper);

main.append(main_wrapper);

document.body.prepend(header, main);



