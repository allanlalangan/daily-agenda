const tasksSection = document.querySelector('.tasks-section');
const listsSection = document.querySelector('.lists-section');

const lists_ul = document.querySelector('.lists');
const tasks_ul = document.querySelector('.tasks');

const listForm = document.querySelector('.list-form');
const taskForm = document.querySelector('.task-form');

const listInput = document.querySelector('.list-input');
const taskInput = document.querySelector('.task-input');

const newListBtn = document.querySelector('.create-list-btn');
const newTaskBtn = document.querySelector('.create-task-btn');

const deleteListBtn = document.querySelector('.create-list-btn');
const deleteTaskBtn = document.querySelector('.create-Task-btn');

let savedLists = JSON.parse(localStorage.getItem('daily.lists')) || [];
let activeListId = localStorage.getItem('daily.activeListId');

renderLists();
renderTasks()

// Intially check radio that corresponds to activeListId
savedLists.forEach(listObj => {
  if (listObj.id === activeListId) {
    const selectedRadio = document.getElementById(`${activeListId}`);
    selectedRadio.checked = true;
  }
})

function saveStorage() {
	localStorage.setItem('daily.lists', JSON.stringify(savedLists));
	localStorage.setItem('daily.activeListId', activeListId);
}

function ListObject(name) { 
  this.id = Date.now().toString(), 
  this.name = name,
  this.tasks = []
}

function TaskObject(name) {
  this.id = Date.now().toString(),
  this.name = name,
  this.complete = false
}

function createListElement(listObj) {
  const newLi = document.createElement('li');
  newLi.classList.add('list-name');
  newLi.dataset.id = listObj.id;

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.classList.add('list-radio');
  radio.name = 'list';
  radio.id = listObj.id;
  radio.dataset.radioId = listObj.id;

  const label = document.createElement('label');
  label.htmlFor = listObj.id;
  label.innerText = listObj.name;

  newLi.appendChild(radio);
  newLi.appendChild(label);
  return newLi
}

function renderLists() {
  savedLists.forEach(list => {
    const newList = createListElement(list);
    lists_ul.insertAdjacentElement('beforeend', newList);
  })
}

function clearList(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function renderTasks() {
  const activeList = savedLists.find(list => list.id === activeListId);
  clearList(tasks_ul);
  activeList.tasks.forEach(task => {
    const newTask = createTaskElement(task);
    tasks_ul.insertAdjacentElement('beforeend', newTask);
  })
}

lists_ul.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    activeListId = e.target.id;
    console.log(activeListId);
    renderTasks();
    saveStorage();
  }
})

listForm.addEventListener('submit', e => {
  e.preventDefault();
  if (listInput.value === null || listInput.value === '') return;
  const newList = new ListObject(listInput.value);
  savedLists.push(newList);
  const list = savedLists.find(list => list.id === newList.id);
  const liElement = createListElement(list);
  listInput.value = null;
  lists_ul.appendChild(liElement);
  saveStorage();
})

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const activeList = savedLists.find(list => list.id === activeListId);
  const newTask = new TaskObject(taskInput.value);
  activeList.tasks.push(newTask);
  const taskElement = createTaskElement(newTask);
  taskInput.value = null;
  tasks_ul.appendChild(taskElement);
  saveStorage();
})

function createTaskElement(taskObj) {
  const newLi = document.createElement('li');
  newLi.classList.add('task-name');
  newLi.dataset.id = taskObj.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.name = 'task';
  checkbox.id = taskObj.id;
  checkbox.dataset.radioId = taskObj.id;

  const label = document.createElement('label');
  label.htmlFor = taskObj.id;
  label.innerText = taskObj.name;

  newLi.appendChild(checkbox);
  newLi.appendChild(label);
  return newLi
}