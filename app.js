// define UI vars

const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");
const filter = document.querySelector("#filter");
const taskInput = document.querySelector("#task");

// load all event listeners
loadEventListeners();

// load all event listeners
function loadEventListeners() {
  // DOM load event
  document.addEventListener("DOMContentLoaded", getTasks);
  // Add task event
  form.addEventListener("submit", addTask);
  // Remove task event
  taskList.addEventListener("click", removeTask);
  // Clear task event
  clearBtn.addEventListener("click", clearTasks);
  // Filter through the task
  filter.addEventListener("keyup", filterTasks);
  // Edit the task
  taskList.addEventListener("click", editTask);
  // Push edited task  
  form.addEventListener("submit", pushEditedTask);
}

// Get tasks
function getTasks() {
  let arr = JSON.parse(localStorage.getItem("tasks"));
  if (arr != null) {
    arr.forEach(function (item) {
      let li = document.createElement("li");
      li.className = "collection-item";
      li.appendChild(document.createTextNode(item));
      const link = document.createElement("a");
      link.className = "delete-item secondary-content";
      link.innerHTML = '<i class="fa fa-remove"></i>';
      const editBtn = document.createElement("a");
      editBtn.className = "edit-item secondary-content";
      editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
      li.appendChild(link);
      li.appendChild(editBtn);
      taskList.appendChild(li);
    })
  }
}

// Edit task
function editTask(e) {
  if (e.target.parentElement.classList.contains("edit-item")) {
    e.target.parentElement.parentElement.classList.add("isEdited");
    for (let item of taskList.querySelectorAll("li")) {
      item.children[1].style.display = "none";
    }
    form.firstChild.nextSibling.querySelector("label").classList.add("active");
    form.firstChild.nextSibling.querySelector("label").textContent = "Edit Task";
    form.querySelector("input.btn").value = "Edit Task";
    taskInput.value = e.target.parentElement.parentElement.textContent;
  }
}

// Push edited task
function pushEditedTask(e) {
  if(e.target.children[1].value == "Edit Task") {
    if (taskInput.value === "") {
      alert("You didn't edit the task");
      return;
    } else {
      taskList.querySelector(".isEdited").childNodes[0].remove();
      taskList.querySelector(".isEdited").appendChild(document.createTextNode(taskInput.value));
      taskList.querySelector(".isEdited").classList.remove("isEdited");
      localStorage.clear();
      for (let item of taskList.querySelectorAll("li")) {
        item.children[1].style.display = "block";
        storeTaskInLocalStorage(item.textContent);
      }
      taskInput.value = "";
      form.firstChild.nextSibling.querySelector("label").classList.remove("active");
      form.firstChild.nextSibling.querySelector("label").textContent = "New Task";
      form.querySelector("input.btn").value = "Add task";
    }
  }
    e.preventDefault();
}

// Add task
function addTask(e) {
  if (taskInput.value === "") {
    alert("Add the task");
    return;
  }
  if (e.target.children[1].value == "Add task") {
    // Create li elem
    const li = document.createElement("li");
    // Add class
    li.className = "collection-item";
    // Create text node and append to li
    li.appendChild(document.createTextNode(taskInput.value));
    // Create new link element
    const link = document.createElement("a");
    // Add class
    link.className = "delete-item secondary-content";
    // Add icon HTML
    link.innerHTML = '<i class="fa fa-remove"></i>';
    // Append the link to li
    li.appendChild(link);
    // Create edit button
    const editBtn = document.createElement("a");
    // Add class
    editBtn.className = "edit-item secondary-content";
    // Add icon HTML
    editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
    // Append the editBtn to li
    li.appendChild(editBtn);
    // Append li to ul
    taskList.appendChild(li);
    // Store in LC
    storeTaskInLocalStorage(taskInput.value);
    // Clear the input
    taskInput.value = "";
  }
  e.preventDefault();
}

// Store task
function storeTaskInLocalStorage(task) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Remove task
function removeTask(e) {
  if (e.target.parentElement.classList.contains("delete-item")) {
      e.target.parentElement.parentElement.remove();
      // Remove from LS
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
  }
}

// Remove from LS
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  if (localStorage.getItem("tasks") === null) {
    tasks = []
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  tasks.forEach(function (task, index) {
    if (taskItem.textContent === task) {
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Clear tasks
function clearTasks() {
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  // Clear from LS
  clearTasksFromLocalStorage();

}

// Clear tasks from LS
function clearTasksFromLocalStorage() {
  localStorage.clear()
}

// Filter tasks
function filterTasks(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll(".collection-item").forEach(function (task) {
    const item = task.firstChild.textContent;
    if (item.toLowerCase().indexOf(text) != -1) { // indexOf исчет подстроку и если не находит то возвращает -1
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  })
}