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

function saveStorage() {
	localStorage.setItem('daily.lists', JSON.stringify(savedLists));
	localStorage.setItem('daily.activeListId', activeListId);
}

function ListObject(name) { 
  this.id = Date.now().toString(), 
  this.name = name,
  this.tasks = [],
  this.selected = false
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

  const label = document.createElement('label');
  label.htmlFor = listObj.id;
  label.innerText = listObj.name;

  activeListId === listObj.id &&
  newLi.classList.toggle('active-list');
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
})

