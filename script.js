const columns = ['todo', 'inprogress', 'done'];

// === Initialize SortableJS on each column ===
columns.forEach(id => {
  new Sortable(document.getElementById(id), {
    group: 'shared',
    animation: 150,
    onSort: saveBoard
  });
});

// === Modal and Task Creation ===
const modal = document.getElementById("taskModal");
const openBtn = document.getElementById("openTaskForm");
const cancelBtn = document.getElementById("cancelTask");
const createBtn = document.getElementById("createTask");

openBtn.onclick = () => modal.classList.remove("hidden");
cancelBtn.onclick = () => {
  modal.classList.add("hidden");
  clearForm();
};

createBtn.onclick = () => {
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const label = document.getElementById("taskLabel").value;
  const column = document.getElementById("taskColumn").value;

  if (!title) return;

  const card = buildTaskCard(title, desc, label);
  const list = document.getElementById(column);
  list.appendChild(card);

  modal.classList.add("hidden");
  clearForm();
  saveBoard();
};

// === Clear the Form After Submission ===
function clearForm() {
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("taskLabel").value = '';
  document.getElementById("taskColumn").value = 'todo';
}

// === Create a Task Card Element ===
function buildTaskCard(title, desc, label) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("contenteditable", "true");

  let labelHTML = "";
  if (label) {
    labelHTML = `<div class="task-label label-${label}">${label}</div>`;
  }

  card.innerHTML = `
    ${labelHTML}
    <strong>${title}</strong><br>
    <small>${desc}</small>
  `;

  // Update on edit
  card.addEventListener('blur', saveBoard);
  return card;
}

// === Save Task Board State to localStorage ===
function saveBoard() {
  const boardData = {};
  columns.forEach(col => {
    const cards = document.getElementById(col).querySelectorAll('.task-card');
    boardData[col] = [];
    cards.forEach(card => {
      const labelEl = card.querySelector('.task-label');
      const label = labelEl ? labelEl.innerText : "";
      const title = card.querySelector('strong')?.innerText || "";
      const desc = card.querySelector('small')?.innerText || "";
      boardData[col].push({ title, desc, label });
    });
  });
  localStorage.setItem('taskBoard', JSON.stringify(boardData));
}

// === Load Tasks From Storage When Page Loads ===
function loadBoard() {
  const saved = localStorage.getItem('taskBoard');
  if (!saved) return;

  const boardData = JSON.parse(saved);
  columns.forEach(col => {
    const columnEl = document.getElementById(col);
    columnEl.innerHTML = '';
    boardData[col].forEach(task => {
      const card = buildTaskCard(task.title, task.desc, task.label);
      columnEl.appendChild(card);
    });
  });
}

window.onload = loadBoard;
