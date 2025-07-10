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

// === Modal Setup ===
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

function clearForm() {
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("taskLabel").value = '';
  document.getElementById("taskColumn").value = 'todo';
}

// === Build Task Card (with double-click editing) ===
function buildTaskCard(title, desc, label) {
  const card = document.createElement("div");
  card.className = "task-card";

  const labelHTML = label
    ? `<div class="task-label label-${label}">${label}</div>`
    : "";

  card.innerHTML = `
    ${labelHTML}
    <div class="task-content">
      <strong class="task-title">${title}</strong><br>
      <small class="task-desc">${desc}</small>
    </div>
  `;

  // Double-click to make editable
  card.addEventListener("dblclick", () => {
    const titleEl = card.querySelector(".task-title");
    const descEl = card.querySelector(".task-desc");

    titleEl.setAttribute("contenteditable", "true");
    descEl.setAttribute("contenteditable", "true");
    titleEl.focus();
  });

  // Save edits when focus is lost
  card.addEventListener("focusout", () => {
    const titleEl = card.querySelector(".task-title");
    const descEl = card.querySelector(".task-desc");

    if (titleEl.hasAttribute("contenteditable")) {
      titleEl.removeAttribute("contenteditable");
      descEl.removeAttribute("contenteditable");
      saveBoard();
    }
  });

  return card;
}

// === Save State to localStorage ===
function saveBoard() {
  const boardData = {};
  columns.forEach(col => {
    const cards = document.getElementById(col).querySelectorAll('.task-card');
    boardData[col] = [];
    cards.forEach(card => {
      const labelEl = card.querySelector('.task-label');
      const label = labelEl ? labelEl.innerText : "";
      const title = card.querySelector('.task-title')?.innerText || "";
      const desc = card.querySelector('.task-desc')?.innerText || "";
      boardData[col].push({ title, desc, label });
    });
  });
  localStorage.setItem('taskBoard', JSON.stringify(boardData));
}

// === Load Tasks from localStorage ===
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
