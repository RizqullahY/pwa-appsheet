const grid = document.getElementById("appGrid");
const searchInput = document.getElementById("searchInput");
const viewer = document.getElementById("viewer");
const appFrame = document.getElementById("appFrame");
const viewerTitle = document.getElementById("viewerTitle");
const directLink = document.getElementById("directLink");
const backBtn = document.getElementById("backBtn");

function renderApps(list) {
  grid.innerHTML = "";
  list.forEach((app) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <h2>${app.name}</h2>
        ${app.badge ? `<span class="badge">${app.badge}</span>` : ""}
      </div>
      <p>${app.detail}</p>
    `;
    card.addEventListener("click", () => openApp(app));
    grid.appendChild(card);
  });
}

function openApp(app) {
  if (app.mode === "direct") {
    window.location.href = app.url;
    return;
  }
  viewerTitle.textContent = app.name;
  directLink.href = app.url;
  appFrame.src = app.url;
  viewer.classList.remove("hidden");
  history.pushState({ viewing: true }, "");
}

function closeApp() {
  viewer.classList.add("hidden");
  appFrame.src = "";
}

backBtn.addEventListener("click", () => {
  if (history.state?.viewing) history.back();
  else closeApp();
});

window.addEventListener("popstate", () => {
  if (!viewer.classList.contains("hidden")) closeApp();
});

searchInput.addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = APPS_DATA.filter(
    (app) =>
      app.name.toLowerCase().includes(q) ||
      app.detail.toLowerCase().includes(q) ||
      (app.badge && app.badge.toLowerCase().includes(q))
  );
  renderApps(filtered);
});

renderApps(APPS_DATA);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(console.error);
}