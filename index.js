const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    const errorMsg = document.getElementById("errorMsg");

    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      taskList.innerHTML = "";
      tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";
        taskDiv.innerHTML = `
          <strong>${task.title}</strong> - <small>${task.status}</small><br><br>
          ${task.description}<br><br>
          <small>📅 Due: ${task.dueDate}</small><br><br>
          <button onclick="editTask('${task.id}')">✏️ Edit</button>
          <button onclick="deleteTask('${task.id}')">🗑️ Delete</button>
        `;
        taskList.appendChild(taskDiv);
      });
    }

    function saveTask(e) {
      e.preventDefault();
      errorMsg.textContent = "";

      const id = document.getElementById("taskId").value || crypto.randomUUID();
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const status = document.getElementById("status").value;
      const dueDate = document.getElementById("dueDate").value;

      if (!title || !description || !dueDate) {
        errorMsg.textContent = "⚠️ All fields are required.";
        return;
      }

      if (isNaN(Date.parse(dueDate))) {
        errorMsg.textContent = "⚠️ Invalid date format.";
        return;
      }

      const task = { id, title, description, status, dueDate };
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      const index = tasks.findIndex(t => t.id === id);
      if (index >= 0) {
        tasks[index] = task;
      } else {
        tasks.push(task);
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
      taskForm.reset();
      document.getElementById("taskId").value = "";
      loadTasks();
    }

    function deleteTask(id) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = tasks.filter(t => t.id !== id);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      loadTasks();
    }

    function editTask(id) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const task = tasks.find(t => t.id === id);
      if (task) {
        document.getElementById("taskId").value = task.id;
        document.getElementById("title").value = task.title;
        document.getElementById("description").value = task.description;
        document.getElementById("status").value = task.status;
        document.getElementById("dueDate").value = task.dueDate;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    taskForm.addEventListener("submit", saveTask);
    window.addEventListener("load", loadTasks);