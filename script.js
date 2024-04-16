document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
});

var taskIdCounter = 0;

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var prioritySelect = document.getElementById("prioritySelect");
    var taskList = document.getElementById("taskList");

    var taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    var taskId = "task_" + taskIdCounter++;

    var li = document.createElement("li");
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    li.appendChild(checkbox);

    var priority = prioritySelect.value;
    li.className = priority;
    li.textContent = taskText;
    li.id = taskId;

    var editDeleteContainer = document.createElement("div");
    editDeleteContainer.classList.add("edit-delete-container");

    var editButton = document.createElement("button");
    editButton.innerHTML = '<i class="far fa-edit"></i>';
    editButton.className = "edit-button";
    editButton.onclick = function() {
        editTask(li);
    };
    editDeleteContainer.appendChild(editButton);

    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.className = "delete-button";
    deleteButton.onclick = function() {
        deleteTask(li);
    };
    editDeleteContainer.appendChild(deleteButton);

    li.appendChild(editDeleteContainer);

    taskList.appendChild(li);

    taskInput.value = "";

    checkbox.addEventListener("change", function() {
        updateTaskStatus(li, this.checked);
    });

    saveTask(taskText, priority, false);
}

function editTask(taskItem) {
    var newText = prompt("Edit task:", taskItem.textContent);
    if (newText === null || newText.trim() === "") {
        return;
    }
    taskItem.textContent = newText.trim();
    updateLocalStorage();
}

function deleteTask(taskItem) {
    if (confirm("Are you sure you want to delete this task?")) {
        taskItem.remove();
        updateLocalStorage();
    }
}

function updateTaskStatus(taskItem, completed) {
    taskItem.classList.toggle("completed", completed);
    if (completed) {
        taskItem.textContent += " - Complete";
    } else {
        taskItem.textContent = taskItem.textContent.replace(" - Complete", "");
    }
    updateLocalStorage();
}

function saveTask(taskText, priority, completed) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, priority: priority, completed: completed });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var taskList = document.getElementById("taskList");
    tasks.forEach(function(task) {
        var li = document.createElement("li");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        li.appendChild(checkbox);

        li.className = task.priority;
        li.textContent = task.text;
        li.id = task.id;
        if (task.completed) {
            li.textContent += " - Complete";
        }

        var editDeleteContainer = document.createElement("div");
        editDeleteContainer.classList.add("edit-delete-container");

        var editButton = document.createElement("button");
        editButton.innerHTML = '<i class="far fa-edit"></i>';
        editButton.className = "edit-button";
        editButton.onclick = function() {
            editTask(li);
        };
        editDeleteContainer.appendChild(editButton);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.className = "delete-button";
        deleteButton.onclick = function() {
            deleteTask(li);
        };
        editDeleteContainer.appendChild(deleteButton);

        li.appendChild(editDeleteContainer);

        taskList.appendChild(li);

        checkbox.addEventListener("change", function() {
            updateTaskStatus(li, this.checked);
        });
    });
}

function updateLocalStorage() {
    var taskItems = document.querySelectorAll("#taskList li");
    var tasks = [];
    taskItems.forEach(function(taskItem) {
        var taskId = taskItem.id;
        var taskText = taskItem.textContent.split(" - ")[0];
        var priority = taskItem.className;
        var completed = taskItem.querySelector("input[type='checkbox']").checked;
        tasks.push({ text: taskText, priority: priority, completed: completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
