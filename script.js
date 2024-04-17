document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');
  
    addTaskBtn.addEventListener('click', addTask);
  
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText !== '') {
        const taskPriority = prioritySelect.value;
        const taskItem = createTaskElement(taskText, taskPriority);
        taskList.appendChild(taskItem);
        taskInput.value = '';
        saveTasks();
      }
    }
  
    function createTaskElement(taskText, priority = 'low', status = 'pending') {
      const taskItem = document.createElement('li');
      taskItem.classList.add('task-item');
      taskItem.setAttribute('data-priority', priority);
      taskItem.setAttribute('data-status', status);
      taskItem.innerHTML = `
        <span>${taskText}</span>
        <div>
          <button class="edit-btn"><i class="fas fa-edit"></i></button>
          <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
          <button class="status-btn">${status === 'pending' ? '<i class="far fa-check-circle"></i>' : '<i class="fas fa-undo-alt"></i>'}</button>
        </div>
      `;
      setTaskListeners(taskItem);
      return taskItem;
    }
  
    function setTaskListeners(taskItem) {
      const editBtn = taskItem.querySelector('.edit-btn');
      const deleteBtn = taskItem.querySelector('.delete-btn');
      const statusBtn = taskItem.querySelector('.status-btn');
  
      editBtn.addEventListener('click', function () {
        const taskText = taskItem.querySelector('span').textContent;
        const newTaskText = prompt('Edit Task:', taskText);
        if (newTaskText !== null) {
          taskItem.querySelector('span').textContent = newTaskText;
          saveTasks();
        }
      });
  
      deleteBtn.addEventListener('click', function () {
        taskItem.classList.add('slide-out'); // Apply slide-out animation
        setTimeout(() => {
          taskItem.remove(); // Remove the task item after animation
          saveTasks();
        }, 300); // Wait for animation to finish (300 milliseconds)
      });
      
      statusBtn.addEventListener('click', function () {
        const currentStatus = taskItem.getAttribute('data-status');
        taskItem.setAttribute('data-status', currentStatus === 'pending' ? 'completed' : 'pending');
        statusBtn.innerHTML = currentStatus === 'pending' ? '<i class="far fa-check-circle"></i>' : '<i class="fas fa-undo-alt"></i>';
        taskItem.classList.toggle('completed');
        saveTasks();
      });
    }
  
    function saveTasks() {
      const tasks = [];
      document.querySelectorAll('.task-item').forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent;
        const priority = taskItem.getAttribute('data-priority');
        const status = taskItem.getAttribute('data-status');
        tasks.push({ text: taskText, priority: priority, status: status });
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function loadTasks() {
      if (localStorage.getItem('tasks')) {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        savedTasks.forEach(task => {
          const taskItem = createTaskElement(task.text, task.priority, task.status);
          taskList.appendChild(taskItem);
        });
      }
    }
  
    loadTasks();
  });
  