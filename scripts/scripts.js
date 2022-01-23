const listsContainer = document.querySelector('[data-lists]'); //<ul> elements will be used as containers
const createListForm = document.querySelector('.create-list-form');
const createListInput = document.querySelector('.create-list-input');

//LOCAL STORAGE KEYS
const storageListsKey = "todo.lists";
const storageActiveListKey = "todo.activeListId";

// Our lists will each have a unique ID
// a name that will be displayed
// and a corresponding array of tasks that will be displayed in the tasks section
// here's an example:
// let lists = [
//   { id: 1, name: 'Home', tasks: [] },
//   { id: 2, name: 'Code', tasks: [] },
// ];

let lists = [];

// Adds logic to list form
// Prevent page refresh when form is submitted
// takes value of input field and stores it as a newListName variable
// creates a new list, passing the name value into the createList function
// the new list is then pushed onto the lists array
createListForm.addEventListener('submit', e => {
  e.preventDefault();
  const newListName = createListInput.value;
  if (newListName == null || newListName === '') { return } //if input field is empty, do nothing
  const newList = createList(newListName); //the createList function will return an object to be stored in the lists variable
  createListInput.value = null; //clears input field after submit
  lists.push(newList);
  render();
})

// the createList function accepts the name of the list the user submitted as a parameter
// then returns an object
// each new list will have its own unique id
// the id must be converted to a string because it will be saved to localStorage
// DOM string map key values must be strings
function createList(name) {
  return (
    {
      id: Date.now().toString(),
      name: name,
      tasks: []
    }
  )
}

//the function below will clear the entire lists container first
//then re-populate the container with the current lists
function render() {
  clearElement(listsContainer);

  lists.forEach(list => {
    const newListElement = document.createElement('li');
    newListElement.classList.add('list-name');
    newListElement.innerText = list.name;
    listsContainer.appendChild(newListElement)

  })
}

//the function below will check to see if an element (a ul in this case) has any existing children, if so delete them
function clearElement(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render();

