const STORAGE_KEY = "shocktag-suggestions";
const form = document.querySelector("#suggestions-form");
const suggestionsList = document.querySelector("#suggestions-list");
const emptyState = document.querySelector("#suggestions-empty");

function loadSuggestions() {
    try {
        const savedSuggestions = localStorage.getItem(STORAGE_KEY);
        return savedSuggestions ? JSON.parse(savedSuggestions) : [];
    } catch (error) {
        console.error("Could not load suggestions:", error);
        return [];
    }
}

function saveSuggestions(suggestions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
}

function renderSuggestions() {
    const suggestions = loadSuggestions();

    if (!suggestions.length) {
        suggestionsList.innerHTML = "";
        emptyState.hidden = false;
        return;
    }

    emptyState.hidden = true;
    suggestionsList.innerHTML = suggestions
        .map((item) => `
            <li class="suggestion-item">
                <strong>${item.username}</strong>
                <p>${item.suggestion}</p>
            </li>
        `)
        .join("");
}

if (form && suggestionsList && emptyState) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = form.elements.discordUsername.value.trim();
        const suggestion = form.elements.suggestion.value.trim();

        if (!username || !suggestion) {
            return;
        }

        const newSuggestion = {
            id: Date.now(),
            username,
            suggestion
        };

        const updatedSuggestions = [newSuggestion, ...loadSuggestions()].slice(0, 50);
        saveSuggestions(updatedSuggestions);
        form.reset();
        renderSuggestions();
    });
}

renderSuggestions();
