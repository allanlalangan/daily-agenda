// Select lists section elements
const listsContainer = document.querySelector('.lists'); //<ul> elements will be used as containers
const createListForm = document.querySelector('.create-list-form');
const createListInput = document.querySelector('.create-list-input');

// Select tasks section elements
const tasksContainer = document.querySelector('.tasks');
const tasksHeading = document.querySelector('.tasks-heading');
const remainingTasks = document.querySelector('.task-count');
const createTaskForm = document.querySelector('.create-task-form');

// Select delete button elements
const deleteListButton = document.querySelector('.delete-list-btn');
const clearCompletedTasksButton = document.querySelector('.clear-tasks-btn');

//LOCAL STORAGE KEYS
const storageListsKey = "todo.lists";
const storageActiveListIdKey = "todo.activeListId";

let savedLists = JSON.parse(localStorage.getItem(storageListsKey)) || [];
let activeListId = localStorage.getItem(storageActiveListIdKey);

// Our lists will each have a unique ID
// a name that will be displayed
// and a corresponding array of tasks that will be displayed in the tasks section
// here's an example:
// let lists = [
//   { id: 1, name: 'Home', tasks: [] },
//   { id: 2, name: 'Code', tasks: [] },
// ];

// Adds event listener to lists container
// if clicked target is an li element, that list will be saved as the activeList
listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    activeListId = e.target.dataset.listId;
  }
  saveAndRender();
})

// Adds logic to list form
// Prevent page refresh when form is submitted
// takes value of input field and stores it as a newListName variable
// creates a new list, passing the name value into the createList function
// the new list is then pushed onto the lists array
createListForm.addEventListener('submit', e => {
  e.preventDefault();
  const newListName = createListInput.value;
  if (newListName == null || newListName === '') { return } //if input field is empty, do nothing
  const newList = createListObject(newListName); //the createList function will return an object to be stored in the lists variable
  createListInput.value = null; //clears input field after submit
  savedLists.push(newList);
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

