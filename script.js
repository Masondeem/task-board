window.onload = () => {
  initializeSortables();
  loadBoard();
};

const columns = ['todo', 'inprogress', 'done'];

function initializeSortables() {
  // Enable drag-and-drop on each column
  columns.forEach(id => {
    new Sortable(document.getElementById(id), {
      group: 'shared',
      animation: 150,
      onEnd: saveBoard
    });
  });

  // Enable drop on Trash
  new Sortable(document.getElementById("trash"), {
    group: 'shared',
    animation: 150,
    onAdd: function (evt) {
      evt.item.remove();
      saveBoard();
    }
  });
}

// === Modal Logic ===
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

// === Build Task Card with Double-Click Editing ===
function buildTaskCard(title, desc, label) {
  const card = document.createElement("div");
  card.className = "task-card";

  const labelEl = label
    ? `<div class="task-label label-${label}">${label}</div>`
    : "";

  card.innerHTML = `
    ${labelEl}
    <div class="task-content">
      <strong class="task-title">${title}</strong><br>
      <small class="task-desc">${desc}</small>
    </div>
  `;

  const titleEl = card.querySelector(".task-title");
  const descEl = card.querySelector(".task-desc");

  // Enable editing on double-click
  titleEl.addEventListener("dblclick", () => {
    titleEl.contentEditable = "true";
    titleEl.focus();
  });

  descEl.addEventListener("dblclick", () => {
    descEl.contentEditable = "true";
    descEl.focus();
  });

  // Save on blur
  titleEl.addEventListener("blur", () => {
    titleEl.contentEditable = "false";
    saveBoard();
  });

  descEl.addEventListener("blur", () => {
    descEl.contentEditable = "false";
    saveBoard();
  });

  return card;
}

// === Save to localStorage ===
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

// === Load from localStorage ===
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
