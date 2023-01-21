// elements
const taskInputEl = document.getElementById("todo-inputs");
const taskOutputEl = document.getElementById("tasks");
const filters = document.querySelectorAll(".edit-options p");
const clearEl = document.getElementById("btn-clear");

// global variables
let todos = JSON.parse(localStorage.getItem("todo-list"));
let editId;
let isEditing = false;

// filtering tasks (all,pending,completed)
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = document.querySelector(".options.active");
    filter.classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

// functions
// display lists
function showTodo(filter) {
  // filter - it will all list elements
  // adding list elements
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      // if todo status is completed , set the iscompleted value to checked
      let isCompleted = todo.status === "completed" ? "checked" : "";
      if (filter === todo.status || filter === "all") {
        // li += means appending lists
        li += `<li class="task-items">
        <div class="input-task">
             <label class="container">
               <input onclick='updateStatus(this)' type="checkbox" id='${id}' ${isCompleted} />
               <div class="checkmark"></div>
             </label>
             <label for="${id}" class="todo ${isCompleted}"
               >${todo.name}</label>
        </div>
        <div class="setting">
          <i onclick='showMenu(this)' class="fa-solid fa-ellipsis-vertical del-icon"></i>
          <ul class="task-menu">
            <li id="task-del" onclick="editTask(${id},'${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
            <li id="task-edit" onclick='deleteTask(${id})'><i class="fa-solid fa-trash"></i>Delete</li>
          </ul>
        </div>
        </li>`;
      }
    });
  }

  // if any list was empty it will show this msg
  taskOutputEl.innerHTML = li || `<span>You don't have any task here...</span>`;
}
showTodo("all"); //passing all list to display

// for completed task - line through
function updateStatus(selectedTask) {
  // getting task element that contains task name
  let taskName = selectedTask.parentElement.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// edit & delete icon
function showMenu(selectedMenu) {
  // getting task element that contains task name
  let taskMenu = selectedMenu.parentElement.lastElementChild;
  // showing edit & delete btns
  taskMenu.classList.add("show");
  // removing show class from the task menu on the document click
  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I" || e.target !== selectedMenu) {
      taskMenu.classList.remove("show");
    }
  });
}

// delete task
function deleteTask(deleteId) {
  // removing selected task from array/todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));

  // when we delete todo it will remain active page
  filters.forEach((filter) => {
    let active = filter.classList.contains("active");
    if (active) {
      showTodo(filter.id);
    }
  });
}

// edit task
function editTask(taskId, taskName) {
  editId = taskId;
  taskInputEl.value = taskName;
  isEditing = true;
}

// event listneres
// adding tasks
taskInputEl.addEventListener("keyup", (e) => {
  let userTaskInput = taskInputEl.value.trim();
  if (e.key === "Enter" && userTaskInput) {
    //if isediting isn't true
    if (!isEditing) {
      if (!todos) {
        //if todo's isn't exist,pass an empty array to todos
        todos = [];
      }
      let taskInfo = {
        name: userTaskInput,
        status: "pending",
      };

      // when we add new todo it will show ALL lists
      // it remove active class from pending/completed
      filters.forEach((btn) => {
        btn.classList.remove("active");
        document.getElementById("all").classList.add("active");
      });
      //adding new task to todos
      todos.push(taskInfo);
      showTodo("all");
    } else {
      isEditing = false;
      todos[editId].name = userTaskInput;

      filters.forEach((filter) => {
        let active = filter.classList.contains("active");
        if (active) {
          showTodo(filter.id);
        }
      });
    }
    taskInputEl.value = "";

    // local storage
    localStorage.setItem("todo-list", JSON.stringify(todos));
  }
});

// clear btn
clearEl.addEventListener("click", () => {
  // removing all items of todos
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  filters.forEach((btn) => {
    btn.classList.remove("active");
    document.getElementById("all").classList.add("active");
  });
  showTodo("all");
});
