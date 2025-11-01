// Elements
const addBtn = document.getElementById("addTaskBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const saveTask = document.getElementById("saveTask");

const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDesc");
const dueDateInput = document.getElementById("taskDueDate");
const categorySelect = document.getElementById("taskCategory");

const collegeCol = document.getElementById("college");
const personalCol = document.getElementById("personal");
const timepassCol = document.getElementById("timepass");

let openTask = null; // currently expanded task

// Open popup
addBtn.addEventListener("click", () => {
  popup.style.display = "flex";
  popup.setAttribute("aria-hidden", "false");
  // set focus to title
  setTimeout(() => titleInput.focus(), 80);
});

// Close popup & reset inputs
function closeAndResetPopup() {
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
  titleInput.value = "";
  descInput.value = "";
  dueDateInput.value = "";
  categorySelect.value = "college";
}
closePopup.addEventListener("click", closeAndResetPopup);

// close when clicking outside modal content
popup.addEventListener("click", (e) => {
  if (e.target === popup) closeAndResetPopup();
});

// Save new task
saveTask.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const dueDate = dueDateInput.value; // optional (string yyyy-mm-dd) or ""
  const category = categorySelect.value;

  if (!title) {
    alert("Please enter a title for the task.");
    titleInput.focus();
    return;
  }

  // create task element
  const task = document.createElement("div");
  task.className = "task";

  // Auto date added
  const dateAdded = new Date();
  const dateAddedStr = dateAdded.toLocaleString();

  // render visible header
  const header = document.createElement("div");
  header.className = "task-header";
  header.textContent = title;
  task.appendChild(header);

  // details area (hidden until expand)
  const details = document.createElement("div");
  details.className = "task-details";

  const descP = document.createElement("p");
  descP.textContent = desc || "No description provided.";
  details.appendChild(descP);

  // Due date line (if provided)
  if (dueDate) {
    const dueP = document.createElement("p");
    dueP.className = "meta";
    // show as friendly format
    const dueFriendly = new Date(dueDate + "T00:00:00");
    dueP.textContent = "🗓 Due: " + dueFriendly.toLocaleDateString();
    details.appendChild(dueP);
  } else {
    const noDue = document.createElement("p");
    noDue.className = "meta";
    noDue.textContent = "🗓 Due: (not set)";
    details.appendChild(noDue);
  }

  // Date added
  const addedP = document.createElement("p");
  addedP.className = "meta";
  addedP.textContent = "📌 Added: " + dateAddedStr;
  details.appendChild(addedP);

  // Complete button
  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Mark as Completed";
  details.appendChild(completeBtn);

  task.appendChild(details);

  // append to correct column and remove any "empty-msg"
  let columnEl;
  if (category === "college") columnEl = collegeCol;
  else if (category === "personal") columnEl = personalCol;
  else columnEl = timepassCol;

  const oldEmpty = columnEl.querySelector(".empty-msg");
  if (oldEmpty) oldEmpty.remove();
  columnEl.appendChild(task);

  // Expand/collapse logic (vertical slide)
  task.addEventListener("click", (e) => {
    // if clicked the complete button itself, ignore here
    if (e.target === completeBtn) return;

    // if some other task is open, close it
    if (openTask && openTask !== task) {
      openTask.classList.remove("expanded");
    }

    // toggle this task
    const opening = !task.classList.contains("expanded");
    if (opening) {
      task.classList.add("expanded");
      openTask = task;
      // scroll into view a bit for mobile if needed
      setTimeout(() => task.scrollIntoView({ behavior: "smooth", block: "center" }), 160);
    } else {
      task.classList.remove("expanded");
      openTask = null;
    }
  });

  // Complete action
  completeBtn.addEventListener("click", (ev) => {
    ev.stopPropagation(); // prevent toggling
    if (task.classList.contains("completed")) return;

    const completedDate = new Date().toLocaleString();
    task.classList.add("completed");

    // append completed line
    const doneP = document.createElement("p");
    doneP.className = "meta";
    doneP.textContent = `✅ Completed on ${completedDate}`;
    details.appendChild(doneP);

    // briefly keep it expanded then close
    setTimeout(() => {
      task.classList.remove("expanded");
      if (openTask === task) openTask = null;
    }, 450);
  });

  // reset & close popup
  closeAndResetPopup();
});
