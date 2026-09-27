const projects = [
    { name: "OpenContract", category: "C++", description: "Open-source engine en moddingtoolkit voor eigen kopieën van Hitman: Blood Money.", url: "https://github.com/JustKurayy/OpenContract" },
    { name: "OpenMusic", category: "Web", description: "Self-hosted open-source alternatief voor Spotify.", url: "https://github.com/JustKurayy/OpenMusic" },
];

const card = (title, text, url, label) => {
    const item = document.createElement("div");
    const heading = document.createElement("h2");
    const description = document.createElement("p");
    heading.textContent = title;
    description.textContent = text;
    item.className = "card";
    item.append(heading, description);
    if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;
        item.append(link);
    }
    return item;
};

const renderProjects = category => {
    const list = document.querySelector("#project-list");
    const status = document.querySelector("#project-status");
    const visible = projects.filter(project => category === "all" || project.category === category);
    list.replaceChildren(...visible.map(project => card(project.name, project.description, project.url, "Bekijk op GitHub")));
    status.textContent = visible.length ? `${visible.length} projecten gevonden.` : "Geen projecten gevonden in deze categorie.";
};

const initProjects = () => {
    const filter = document.querySelector("#project-filter");
    if (!filter) return;
    renderProjects(filter.value);
    filter.addEventListener("change", event => renderProjects(event.target.value));
};

const loadGames = async () => {
    const list = document.querySelector("#game-list");
    const status = document.querySelector("#game-status");
    if (!list || !status) return;
    try {
        const response = await fetch("https://www.freetogame.com/api/games");
        if (!response.ok) throw new Error("API request failed");
        const games = await response.json();
        list.replaceChildren(...games.slice(0, 4).map(game => card(game.title, game.short_description, game.game_url, "Lees meer op FreeToGame")));
        status.textContent = "Vier actuele game-artikelen van FreeToGame.";
    } catch {
        status.textContent = "Artikelen kunnen momenteel niet worden geladen. Probeer het later opnieuw.";
    }
};

const showError = (field, message) => {
    document.querySelector(`#${field}-error`).textContent = message;
    document.querySelector(`#${field}`).setAttribute("aria-invalid", String(Boolean(message)));
};

const validateForm = event => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    showError("name", name ? "" : "Vul je naam in.");
    showError("email", validEmail ? "" : "Vul een geldig e-mailadres in.");
    showError("message", message.length >= 10 ? "" : "Het bericht moet minimaal 10 tekens bevatten.");
    const valid = name && validEmail && message.length >= 10;
    document.querySelector("#form-status").textContent = valid ? "Bedankt. Je bericht is geldig ontvangen." : "Controleer de gemarkeerde velden.";
    if (valid) form.reset();
};

const initForm = () => {
    const form = document.querySelector("#contact-form");
    if (form) form.addEventListener("submit", validateForm);
};

initProjects();
loadGames();
initForm();
