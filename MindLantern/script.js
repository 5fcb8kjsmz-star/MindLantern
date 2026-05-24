// =========================
// AUTH SYSTEM (FIXED)
// =========================

function signup() {
    const user = document.getElementById("suUser")?.value.trim();
    const pass = document.getElementById("suPass")?.value.trim();

    if (!user || !pass) {
        alert("Please fill all fields.");
        return;
    }

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);
    localStorage.setItem("loggedIn", "true");

    window.location.replace("index.html");
}

function login() {
    const user = document.getElementById("liUser")?.value.trim();
    const pass = document.getElementById("liPass")?.value.trim();

    const savedUser = localStorage.getItem("user");
    const savedPass = localStorage.getItem("pass");

    if (!savedUser || !savedPass) {
        alert("No account found. Please sign up.");
        return;
    }

    if (user === savedUser && pass === savedPass) {
        localStorage.setItem("loggedIn", "true");
        window.location.replace("index.html");
    } else {
        alert("Wrong username or password.");
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.replace("login.html");
}

function protect() {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.replace("login.html");
    }
}

// =========================
// WRITE SYSTEM (FIXED)
// =========================

let selectedEmoji = "";

function formatText(cmd) {
    document.execCommand(cmd, false, null);
}

function changeEditorBg(color) {
    const editor = document.getElementById("editor");
    if (editor) editor.style.backgroundColor = color;
}

function selectEmoji(emoji, el) {
    selectedEmoji = emoji;

    document.querySelectorAll(".emoji-square").forEach(x => {
        x.classList.remove("selected");
    });

    if (el) el.classList.add("selected");
}

function saveEntry() {
    const editor = document.getElementById("editor");
    if (!editor) return;

    const content = editor.innerHTML.trim();

    if (!content || content === "<br>") {
        alert("Cannot save empty entry.");
        return;
    }

    let entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

    entries.push({
        id: Date.now(),
        content,
        bgColor: editor.style.backgroundColor || "#fff",
        emoji: selectedEmoji,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("diaryEntries", JSON.stringify(entries));

    editor.innerHTML = "";
    editor.style.backgroundColor = "#fff";
    selectedEmoji = "";

    document.querySelectorAll(".emoji-square").forEach(x => {
        x.classList.remove("selected");
    });

    alert("Entry saved!");
}

// =========================
// HISTORY
// =========================

function loadEntries() {
    const container = document.getElementById("historyContainer");
    if (!container) return;

    let entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

    container.innerHTML = "";

    if (entries.length === 0) {
        container.innerHTML = "<p>No entries yet.</p>";
        return;
    }

    const reversed = [...entries].reverse();

    reversed.forEach((entry, i) => {
        const realIndex = entries.length - 1 - i;

        const div = document.createElement("div");
        div.className = "entry-card";
        div.style.background = entry.bgColor || "#fff";

        div.innerHTML = `
            <div>
                <strong>${entry.emoji || "📝"}</strong>
                <small>${entry.date}</small>
            </div>

            <div>${entry.content}</div>

            <button onclick="deleteEntry(${realIndex})">Delete</button>
        `;

        container.appendChild(div);
    });
}

function deleteEntry(index) {
    let entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

    if (index < 0 || index >= entries.length) return;

    entries.splice(index, 1);

    localStorage.setItem("diaryEntries", JSON.stringify(entries));

    loadEntries();
}

// =========================
// STATS
// =========================

function updateStats() {
    const entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]");

    const totalEntries = document.getElementById("totalEntries");
    if (totalEntries) totalEntries.innerText = entries.length;

    let words = 0;

    entries.forEach(e => {
        const text = e.content.replace(/<[^>]*>/g, "");
        words += text.split(/\s+/).filter(Boolean).length;
    });

    const totalWords = document.getElementById("totalWords");
    if (totalWords) totalWords.innerText = words;
}

// =========================
// MUSIC (FIXED - WORKING YOUTUBE)
// =========================

function setMusic() {
    const input = document.getElementById("musicUrl");
    if (!input) return;

    const url = input.value.trim();
    if (!url) return;

    localStorage.setItem("musicUrl", url);
    loadMusic();

    input.value = "";
}

function loadMusic() {
    const box = document.getElementById("musicBox");
    if (!box) return;

    let url = localStorage.getItem("musicUrl");
    if (!url) return;

    let id = "";

    if (url.includes("youtu.be/")) {
        id = url.split("youtu.be/")[1].split("?")[0];
    }

    if (url.includes("watch?v=")) {
        id = url.split("v=")[1].split("&")[0];
    }

    if (url.includes("embed/")) {
        id = url.split("embed/")[1].split("?")[0];
    }

    if (id) {
        box.innerHTML = `
            <iframe width="100%" height="220"
                src="https://www.youtube.com/embed/${id}"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen>
            </iframe>
        `;
    } else {
        // fallback link
        box.innerHTML = `
            <a href="${url}" target="_blank">
                ▶ Open Music Link
            </a>
        `;
    }
}
