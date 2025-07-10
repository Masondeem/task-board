window.onload = () => {
  initializeSortables();
  loadBoard();
};

const columns = ['todo', 'inprogress', 'done'];

function initializeSortables() {
  columns.forEach(id => {
    const el = document.getElementById(id);
    new Sortable(el, {
      group: 'shared',
      animation: 150,
      onEnd: saveBoard
    });
  });
}

const modal = document.getElementById("taskModal");
document.getElementById("openTaskForm").onclick = () => modal.classList.remove("hidden");
document.getElementById("cancelTask").onclick = () => {
  modal.classList.add("hidden");
  clearForm();
};
document.getElementById("createTask").onclick = () => {
  const title = document.getElementById("taskTitle").value.trim();
  const desc = document.getElementById("taskDesc").value.trim();
  const label = document.getElementById("taskLabel").value;
  const column = document.getElementById("taskColumn").value;

  if (!title) return;

  const card = buildTaskCard(title, desc, label);
  document.getElementById(column).appendChild(card);

  modal.classList.add("hidden");
  clearForm();
  saveBoard();
};

function buildTaskCard(title, desc, label) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.setAttribute("contenteditable", "true");

  const labelHTML = label
    ? `<div class="task-label label-${label}">${label}</div>`
    : "";

  card.innerHTML = `
    ${labelHTML}
    <strong>${title}</strong><br>
    <small>${desc}</small>
  `;

  card.addEventListener('blur', saveBoard);
  return card;
}

function clearForm() {
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("taskLabel").value = '';
  document.getElementById("taskColumn").value = 'todo';
}

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
