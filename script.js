const taskInput = document.getElementById('task-input');
const difficultyInput = document.getElementById('difficulty-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const filterBtns = document.querySelectorAll('.filter-btn');

const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const customizerPanel = document.getElementById('customizer-panel');
const bgCanvasPicker = document.getElementById('bg-canvas-picker');
const bgCardPicker = document.getElementById('bg-card-picker');
const accentPicker = document.getElementById('accent-picker');
const textMainPicker = document.getElementById('text-main-picker');
const bgItemPicker = document.getElementById('bg-item-picker');
const opacitySlider = document.getElementById('opacity-slider');
const resetThemeBtn = document.getElementById('reset-theme-btn');

let quests = JSON.parse(localStorage.getItem('quests')) || [];
let currentFilter = 'all';

const babyPinkTheme = {
    canvas: '#fff0f5',
    card: '#ffffff',
    accent: '#ffb6c1',
    text: '#4a3b32',
    item: '#fff5f6',
    opacity: 75
};
let activeTheme = JSON.parse(localStorage.getItem('user-sectional-theme')) || { ...babyPinkTheme };

function applySectionalTheme() {
    document.documentElement.style.setProperty('--bg-canvas', activeTheme.canvas);
    document.documentElement.style.setProperty('--bg-card', activeTheme.card);
    document.documentElement.style.setProperty('--accent-color', activeTheme.accent);
    document.documentElement.style.setProperty('--text-main', activeTheme.text);
    document.documentElement.style.setProperty('--bg-item', activeTheme.item);
    document.documentElement.style.setProperty('--card-opacity', activeTheme.opacity / 100);

    bgCanvasPicker.value = activeTheme.canvas;
    bgCardPicker.value = activeTheme.card;
    accentPicker.value = activeTheme.accent;
    textMainPicker.value = activeTheme.text;
    bgItemPicker.value = activeTheme.item;
    opacitySlider.value = activeTheme.opacity;

    localStorage.setItem('user-sectional-theme', JSON.stringify(activeTheme));
}

bgCanvasPicker.addEventListener('input', (e) => { activeTheme.canvas = e.target.value; applySectionalTheme(); });
bgCardPicker.addEventListener('input', (e) => { activeTheme.card = e.target.value; applySectionalTheme(); });
accentPicker.addEventListener('input', (e) => { activeTheme.accent = e.target.value; applySectionalTheme(); });
textMainPicker.addEventListener('input', (e) => { activeTheme.text = e.target.value; applySectionalTheme(); });
bgItemPicker.addEventListener('input', (e) => { activeTheme.item = e.target.value; applySectionalTheme(); });
opacitySlider.addEventListener('input', (e) => { activeTheme.opacity = e.target.value; applySectionalTheme(); });

toggleSettingsBtn.addEventListener('click', () => {
    customizerPanel.classList.toggle('hidden');
    toggleSettingsBtn.innerText = customizerPanel.classList.contains('hidden') ? '⚙️ Open Theme Editor Suite' : '❌ Close Theme Editor Suite';
});

resetThemeBtn.addEventListener('click', () => {
    activeTheme = { ...babyPinkTheme };
    applySectionalTheme();
});

addTaskBtn.addEventListener('click', addQuest);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addQuest(); });
filterBtns.forEach(btn => btn.addEventListener('click', filterQuests));

function addQuest() {
    const text = taskInput.value.trim();
    if (!text) return;

    quests.push({
        id: Date.now(),
        text: text,
        difficulty: difficultyInput.value,
        completed: false
    });

    saveAndRender();
    taskInput.value = '';
}

function renderQuests() {
    taskList.innerHTML = '';
    
    const filtered = quests.filter(q => {
        if (currentFilter === 'active') return !q.completed;
        if (currentFilter === 'completed') return q.completed;
        return true;
    });

    filtered.forEach(q => {
        const li = document.createElement('li');
        li.className = `task-item ${q.difficulty} ${q.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div style="display:flex; align-items:center; width: 85%;">
                <input type="checkbox" class="task-checkbox" ${q.completed ? 'checked' : ''} onchange="toggleComplete(${q.id})">
                <span>${q.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteQuest(${q.id})">&times;</button>
        `;
        taskList.appendChild(li);
    });
    updateProgress();
}

window.toggleComplete = (id) => {
    quests = quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q);
    saveAndRender();
};

window.deleteQuest = (id) => {
    quests = quests.filter(q => q.id !== id);
    saveAndRender();
};

function filterQuests(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.getAttribute('data-filter');
    renderQuests();
}

function updateProgress() {
    const total = quests.length;
    const completed = quests.filter(q => q.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressText.innerText = `🧸 ${completed}/${total} Adventures Logged`;
    progressFill.style.width = `${percent}%`;
}

function saveAndRender() {
    localStorage.setItem('quests', JSON.stringify(quests));
    renderQuests();
}

applySectionalTheme();
renderQuests();