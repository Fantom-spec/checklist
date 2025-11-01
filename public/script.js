const API_URL = "http://localhost:5000";
const openModalBtn = document.getElementById("openModalBtn");
const taskModal = document.getElementById("taskModal");
const addTaskBtn = document.getElementById("addTaskBtn");
const cancelBtn = document.getElementById("cancelBtn");
const taskTableBody = document.getElementById("taskTableBody");

openModalBtn.addEventListener("click", () => (taskModal.style.display = "flex"));
cancelBtn.addEventListener("click", () => (taskModal.style.display = "none"));

async function loadTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  const tasks = await res.json();
  taskTableBody.innerHTML = "";
  tasks.forEach(addTaskToTable);
}

function addTaskToTable(task) {
  const urgencyClass =
    task.urgency === "High" ? "high" :
    task.urgency === "Medium" ? "medium" : "low";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${task.name}</td>
    <td class="${urgencyClass}">${task.urgency}</td>
    <td>${task.date_added}</td>
    <td>${task.due_date || "-"}</td>
    <td><button class="action-btn complete-btn">✔</button></td>
  `;

  row.querySelector(".complete-btn").addEventListener("click", async () => {
    await fetch(`${API_URL}/tasks/${task.id}/done`, { method: "PUT" });
    row.remove(); // remove from UI but stay in DB
  });

  taskTableBody.appendChild(row);
}

addTaskBtn.addEventListener("click", async () => {
  const name = document.getElementById("taskName").value.trim();
  const urgency = document.getElementById("urgency").value;
  const due_date = document.getElementById("dueDate").value;
  const date_added = new Date().toLocaleDateString();

  if (!name) return alert("Enter a task name!");

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, urgency, date_added, due_date })
  });

  const newTask = await res.json();
  addTaskToTable({ id: newTask.id, name, urgency, date_added, due_date });
  taskModal.style.display = "none";

  document.getElementById("taskName").value = "";
  document.getElementById("dueDate").value = "";
});

loadTasks();
