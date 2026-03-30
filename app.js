(function () {
  const STORAGE_KEY = "todo-app-items";

  const form = document.getElementById("add-form");
  const input = document.getElementById("task-input");
  const list = document.getElementById("todo-list");
  const emptyHint = document.getElementById("empty-hint");
  const clearDoneBtn = document.getElementById("clear-done");

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  let items = load();

  function updateEmptyState() {
    emptyHint.classList.toggle("hidden", items.length > 0);
  }

  function render() {
    list.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (item.done ? " done" : "");
      li.dataset.id = item.id;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = item.done;
      cb.setAttribute("aria-label", item.done ? "标记为未完成" : "标记为完成");
      cb.addEventListener("change", () => {
        item.done = cb.checked;
        li.classList.toggle("done", item.done);
        cb.setAttribute("aria-label", item.done ? "标记为未完成" : "标记为完成");
        save(items);
      });

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = item.text;

      const del = document.createElement("button");
      del.type = "button";
      del.className = "todo-delete";
      del.textContent = "删除";
      del.addEventListener("click", () => {
        items = items.filter((i) => i.id !== item.id);
        save(items);
        render();
      });

      li.append(cb, span, del);
      list.appendChild(li);
    });
    updateEmptyState();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    items.push({
      id: crypto.randomUUID(),
      text,
      done: false,
    });
    input.value = "";
    save(items);
    render();
    input.focus();
  });

  clearDoneBtn.addEventListener("click", () => {
    items = items.filter((i) => !i.done);
    save(items);
    render();
  });

  render();
})();
