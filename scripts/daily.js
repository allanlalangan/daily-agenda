const tasksSection = document.querySelector('.tasks-section');
const listsSection = document.querySelector('.lists-section');

const lists_ul = document.querySelector('.lists');
const tasks_ul = document.querySelector('.tasks');

const remainingTasks = document.querySelector('.task-count');

const listForm = document.querySelector('.list-form');
const taskForm = document.querySelector('.task-form');

const listInput = document.querySelector('.list-input');
const taskInput = document.querySelector('.task-input');

const newListBtn = document.querySelector('.create-list-btn');
const newTaskBtn = document.querySelector('.create-task-btn');

const deleteListBtn = document.querySelector('.delete-list-btn');
const clearTasksBtn = document.querySelector('.clear-tasks-btn');

let savedLists = JSON.parse(localStorage.getItem('daily.lists')) || [];
let activeListId = localStorage.getItem('daily.activeListId');

const taskTemplate = document.getElementById('task-template');

renderLists();

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

lists_ul.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    activeListId = e.target.id;
    const activeList = savedLists.find(list => list.id === activeListId);
    console.log(activeList);
    renderTaskCount(activeList);
    renderTasks(activeListId);
    saveStorage();
  }
})

tasks_ul.addEventListener('click', e => {
  const activeList = savedLists.find(list => list.id === activeListId);
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedTask = activeList.tasks.find(task => task.id === e.target.id);
    selectedTask.complete = e.target.checked;
    renderTaskCount(activeList);
    saveStorage();
  }
})

renderTasks(activeListId);

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

function renderTasks(activeListId) {
  const activeList = savedLists.find(list => list.id === activeListId);
  if (activeListId === null || activeList.tasks.length === 0) {
    clearList(tasks_ul);
    clearTasksBtn.style.display = 'none';
    deleteListBtn.style.display = 'none';
  } else {
    const activeList = savedLists.find(list => list.id === activeListId);
    deleteListBtn.style.display = '';
    renderTaskCount(activeList);
    clearList(tasks_ul);
    activeList.tasks.forEach((task) => {
      const newTaskElement = document.importNode(taskTemplate.content, true);
      const checkbox = newTaskElement.querySelector('input');
      const label = newTaskElement.querySelector('label');
      checkbox.id = task.id;
      checkbox.classList.add('task-checkbox');
      checkbox.checked = task.complete;
      label.htmlFor = task.id;
      label.innerText = task.name;
      tasks_ul.appendChild(newTaskElement);
    });
  }
}

function renderTaskCount(activeList) {
  if (activeList.tasks.length === 0) {
    remainingTasks.innerText = 'No tasks';
    clearTasksBtn.style.display = 'none';
  } else {
    clearTasksBtn.style.display = '';
    const incompleteTaskCount = activeList.tasks.filter(task => !task.complete).length;
    const taskOrTasks = incompleteTaskCount === 1 ? 'task' : 'tasks';
    const taskCountString = `${incompleteTaskCount} ${taskOrTasks} remaining`;
		remainingTasks.innerText = taskCountString;
	}
}

function clearList(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
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
  const activeList = savedLists.find(list => list.id === activeListId);
  const newTask = new TaskObject(taskInput.value);
  activeList.tasks.push(newTask);
  taskInput.value = null;
  renderTasks(activeListId);
  saveStorage();
})