const todoInput = document.querySelector(".todo-input");
const todoDateInput = document.querySelector(".todo-date");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", loadTasks);
todoButton.addEventListener("click", addTask);
filterOption.addEventListener("change", filterTasks);

function addTask(event) {
    event.preventDefault();

    const taskText = todoInput.value.trim();
    const taskDate = todoDateInput.value;

    if (!taskText) return;

    const tasks = getSortedTasks();
    tasks.push({ text: taskText, date: taskDate });
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    localStorage.setItem('tasks', JSON.stringify(tasks));

    todoInput.value = "";
    todoDateInput.value = "";

    loadTasks();
}

function loadTasks() {
    const tasks = getSortedTasks();
    todoList.innerHTML = "";

    tasks.forEach((task, index) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const taskItem = document.createElement("li");
        taskItem.innerHTML = `<strong>${task.text}</strong> - <normal>${task.date}</normal>`;
        taskItem.classList.add("todo-item");
        todoDiv.appendChild(taskItem);

        // Complete Button
        const completeButton = document.createElement("button");
        completeButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completeButton.classList.add("complete-btn");
        completeButton.addEventListener("click", () => toggleComplete(todoDiv));
        todoDiv.appendChild(completeButton);

        // Edit Button
        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", () => editTask(index));
        todoDiv.appendChild(editButton);

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("trash-btn");
        deleteButton.addEventListener("click", () => deleteTask(index));
        todoDiv.appendChild(deleteButton);

        todoList.appendChild(todoDiv);
    });
}

function toggleComplete(taskElement) {
    taskElement.classList.toggle("completed");
}

window.editTask = function(index) {
    const tasks = getSortedTasks();
    const newTaskText = prompt("Edit task:", tasks[index].text);
    const newTaskDate = prompt("Edit date (YYYY-MM-DD):", tasks[index].date);
    if (newTaskText && newTaskDate) {
        tasks[index] = { text: newTaskText, date: newTaskDate };
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
};

function deleteTask(index) {
    const tasks = getSortedTasks();
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function getSortedTasks() {
    const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    return tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function filterTasks(e) {
    const todos = todoList.childNodes;
    todos.forEach(todo => {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "incomplete":
                todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}
