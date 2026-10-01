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
        onClick: renderBoard
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

const moves_wrapper = document.createElement('div');
const pairs_wrapper = document.createElement('div');

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

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';

    card.append(img);
    return card;
}

const board_wrapper = document.createElement('div');
board_wrapper.className = 'board_wrapper';

function renderBoard () {
    const shuffled = shuffle(deck);

    const fragment = document.createDocumentFragment();

    shuffled.forEach((src) => fragment.append(createCard(src)));

    board_wrapper.replaceChildren(fragment);
}

renderBoard();

main.append(board_wrapper);

document.body.prepend(header, main);



