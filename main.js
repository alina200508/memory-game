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
label_box.append(label);
header.append (
    label_box,
    createButton({
        text: 'New game',
        className: 'btn_new_game',
        onClick: () => console.log('New game')
    }),
    createButton({
        text: 'Table leaders',
        className: 'btn_table_leaders',
        onClick: () => console.log('Table leaders')
    })
);

const main = document.createElement('main');

document.body.prepend(header, main);



