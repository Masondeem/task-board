const columns = ['todo', 'inprogress', 'done'];

// Initialize drag and drop
columns.forEach(id => {
  new Sortable(document.getElementById(id), {
    group: 'shared',
    animation: 150
  });
});

// Task modal logic
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
  const column = document.getElementById("taskColumn").value;

  if (!title) return;

  const card = document.createElement("div");
  card.className = "task-card";
  card.innerHTML = `<strong>${title}</strong><br><small>${desc}</small>`;

  document.getElementById(column).appendChild(card);
  modal.classList.add("hidden");
  clearForm();
};

function clearForm() {
  document.getElementById("taskTitle").value = '';
  document.getElementById("taskDesc").value = '';
  document.getElementById("taskColumn").value = 'todo';
}
