export default class Logic {
  constructor(gui) {
    this.gui = gui;
    this.activeUl = null;
    this.activeLi = null;
    this.liClone = null;
  }

  init() {
    this.gui.drawUI();
    // чтение из сторадж
    this.gui.tasksListFromLS();
    this.gui.buttons.forEach((but) => {
      but.addEventListener('click', (e) => this.addTask(e));
    });
    // по клику адд кард - событие самбит
    this.gui.addcardDiv.addEventListener('submit', (e) => this.addCard(e));
    // при наведении на карточку появляется иконка крестик ("\E951")
    this.gui.widget.addEventListener('mouseover', (e) => this.showDelCardDiv(e));
    // которая и удаляет карточку
    this.gui.delCardDiv.addEventListener('click', (e) => this.delCard(e));
    // 4. Перемещение карточки
    this.gui.widget.addEventListener('mousedown', (e) => this.pullCard(e));
    this.gui.widget.addEventListener('mouseup', (e) => this.dropCard(e));
  }

  dropCard(e) {
    if (![...this.gui.ulAll].includes(e.target.parentElement)) return;
    const ul = e.target.parentElement;
    ul.insertBefore(this.activeLi, e.target);
    [...ul.children].forEach((li) => {
      li.classList.remove('dragged');
    });
    document.body.removeChild(this.liClone);
    this.activeLi = null;
  }

  pullCard(e) {
    // только для ul и их потомков li и отмена выделения мышкой текста
    if (![...this.gui.ulAll].includes(e.target.parentElement)) return;
    e.preventDefault();

    const li = e.target;
    if (li.lastChild === this.gui.delCardDiv) {
      li.removeChild(this.gui.delCardDiv);
    }
    const liClone = li.cloneNode(true);

    document.body.appendChild(liClone);
    liClone.classList.add('dragged');
    liClone.style.cursor = 'grabbing';
    this.activeLi = li;

    this.gui.widget.addEventListener('mousemove', (event) => {
      liClone.style.top = `${event.clientY - 5}px`;
      liClone.style.left = `${event.clientX - 5}px`;
    });
    this.liClone = liClone;
  }

  delCard(e) {
    const li = e.target.closest('li');
    const ul = li.parentElement;
    ul.removeChild(li);
    localStorage.trelloTasks = JSON.stringify(this.gui.getTasksListObjFromDom());
  }

  showDelCardDiv(e) {
    const li = e.target;
    if (this.activeLi) return;
    if ([...this.gui.ulAll].includes(li.parentElement)) {
      // добавить крестик
      li.appendChild(this.gui.delCardDiv);
    }
  }

  addCard(e) {
    e.preventDefault();
    this.activeUl.innerHTML += `<li class="items-item">${this.gui.addcardInput.value}</li>`;
    localStorage.trelloTasks = JSON.stringify(this.gui.getTasksListObjFromDom());
  }

  addTask(e) {
    // в какой ul столбик добавлять
    this.activeUl = e.target.previousElementSibling;
    // отобразить поле для ввода
    this.gui.addcardDiv.classList.remove('hidden');
  }
}
