// Select lists section elements
const listsContainer = document.querySelector('.lists'); //<ul> elements will be used as containers
const createListForm = document.querySelector('.create-list-form');
const createListInput = document.querySelector('.create-list-input');

// Select tasks section elements
const tasksSection = document.querySelector('.tasks-section');
const tasksContainer = document.querySelector('.tasks');
const tasksHeading = document.querySelector('.tasks-heading');
const remainingTasks = document.querySelector('.task-count');
const createTaskForm = document.querySelector('.create-task-form');
const createTaskInput = document.querySelector('.create-task-input');

// Select delete button elements
const deleteListButton = document.querySelector('.delete-list-btn');
const clearCompletedTasksButton = document.querySelector('.clear-tasks-btn');

// html template for tasks
const taskTemplate = document.getElementById('task-template');

//LOCAL STORAGE KEYS
const storageListsKey = "todo.lists";
const storageActiveListIdKey = "todo.activeListId";

let savedLists = JSON.parse(localStorage.getItem(storageListsKey)) || [];
let activeListId = localStorage.getItem(storageActiveListIdKey);

// Adds event listener to lists container
// if clicked target is an li element, that list will be saved as the activeList
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    activeListId = e.target.dataset.listId;
    saveAndRender();    
  }
})

// Adds event listener to tasks container
// checks if the clicked target is an input element
// if any of our task object's id property matches the targeted input element id, it will be set as our selected task
// if a checkbox is checked, the task's complete property will be set true
// if not, it will remain false (incomplete)
// then it will be saved and the task count is re-rendered
tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
  const activeList = savedLists.find(list => list.id === activeListId);
  const selectedTask = activeList.tasks.find(task => task.id === e.target.id);
  selectedTask.complete = e.target.checked;
  saveStorage();
  renderTaskCount(activeList);
  }
})

// Adds logic to list form
// Prevent page refresh when form is submitted
// takes value of input field and stores it as a newListName variable
// creates a new list, passing the name value into the createList function
// the new list is then pushed onto the lists array
createListForm.addEventListener('submit', e => {
  e.preventDefault();
  const newListName = createListInput.value;
  if (newListName == null || newListName === '') return; //if input field is empty, do nothing
  const newList = createListObject(newListName); //the createList function will return an object to be stored in the lists variable
  createListInput.value = null; //clears input field after submit
  savedLists.push(newList);
  saveAndRender();
})

createTaskForm.addEventListener('submit', e => {
  e.preventDefault();
  const activeList = savedLists.find(list => list.id === activeListId);
  const newTaskName = createTaskInput.value;
  if (newTaskName == null || newTaskName === '') return;
  const newTask = createTaskObject(newTaskName);
  createTaskInput.value = null;
  activeList.tasks.push(newTask);
  saveAndRender();
})

// Adds event listener to delete list button
// when clicked we are going to delete the active list by filtering any lists that are not active
// said lists will then be reassiged as the savedLists in storage
// the activeListId will be set to null, the list container is then re-rendered
deleteListButton.addEventListener('click', e => {
  savedLists = savedLists.filter(list => list.id !== activeListId);
  activeListId = null;
  saveAndRender();
})

// the createListObject function accepts the name of the list the user submitted as a parameter
// then returns an object
// each new list will have its own unique id
// the id must be converted to a string because it will be saved to localStorage
function createListObject(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

// the createTaskObject function accepts the name of the list the user submitted as a parameter
// then returns an object
// each new task will have its own unique id
// the id must be converted to a string because it will be saved to localStorage
function createTaskObject(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

// saveAndRender() will update the localStorage before it re-renders the page
function saveAndRender() {
  saveStorage();
  renderElements();
  
}

// saveStorage() updates storage items
function saveStorage() {
  localStorage.setItem(storageListsKey, JSON.stringify(savedLists));
  localStorage.setItem(storageActiveListIdKey, activeListId);
}

//the function below will clear the entire lists container first
//then re-render the container with the updated lists
//a listId data attribute will be added to each list so it can be referenced when we set an li element as the active list
function renderElements() {
  clearElement(listsContainer);
  renderLists();

  const activeList = savedLists.find(list => list.id === activeListId);
  if (activeList == null) {
    tasksSection.style.display = 'none';
  } else {
    tasksSection.style.display = '';
    tasksHeading.innerText = activeList.name;
    clearElement(tasksContainer);
    renderTaskCount(activeList);
    renderTasks(activeList);
  }
}

function renderTaskCount(activeList) {
  const incompleteTaskCount = activeList.tasks.filter(task => !task.complete).length;
  const taskOrTasks = incompleteTaskCount === 1 ? 'task' : 'tasks';
  const taskCountString = `${incompleteTaskCount} ${taskOrTasks} remaining`;
  remainingTasks.innerText = taskCountString;
}

function renderTasks(activeList) {
  activeList.tasks.forEach(task => {
    const newTaskElement = document.importNode(taskTemplate.content, true)
    const checkbox = newTaskElement.querySelector('input');
    const label = newTaskElement.querySelector('label')
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    label.htmlFor = task.id;
    label.innerText = task.name;
    tasksContainer.appendChild(newTaskElement)
  })
}

function renderLists() {
  savedLists.forEach(list => {
    const newListElement = document.createElement('li');
    newListElement.dataset.listId = list.id; 
    newListElement.classList.add('list-name');
    newListElement.innerText = list.name;
    if (list.id === activeListId) {
      newListElement.classList.add('active-list')
    }
    listsContainer.appendChild(newListElement)
  })
}


//the function below will check to see if an element has any existing children, if so delete them
function clearElement(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

//renders elements to the page
renderElements()

