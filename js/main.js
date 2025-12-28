let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const input = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.isComposing) {
    addTask();
  }
});

const categorySelect = document.getElementById("category");

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text,
    priority: Number(prioritySelect.value),
    category: categorySelect.value,
    done: false,
    createdAt: new Date().toISOString()
  });

  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function sortTasks() {
  const tasks = Array.from(list.children);

  tasks.sort((a, b) => {
    // 完了タスクは下
    if (a.dataset.done !== b.dataset.done) {
      return a.dataset.done === "true" ? 1 : -1;
    }
    // 重要度（高→低）
    return b.dataset.priority - a.dataset.priority;
  });

  tasks.forEach(task => list.appendChild(task));
}

function renderTasks() {
  list.innerHTML = "";

  tasks.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return b.priority - a.priority;
  });

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.classList.add(
      task.priority === 3 ? "high" :
      task.priority === 2 ? "middle" : "low"
    );

    if (task.done) li.classList.add("done");

    /* チェックボックス */
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.onchange = () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    /* タスク文字 */
    const span = document.createElement("span");
    span.textContent = task.text;

    /* カテゴリ＋日時 */
    const meta = document.createElement("small");
    meta.textContent = `${task.category}・${formatDate(task.createdAt)}`;
    meta.className = "meta";

    /* 削除ボタン */
    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "delete";
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    /* ここでまとめて append */
    li.append(checkbox, span, meta, delBtn);
    list.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();