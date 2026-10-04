// Initialization State Variables
const taskInput = document.getElementById('task-input');
const difficultyInput = document.getElementById('difficulty-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const filterBtns = document.querySelectorAll('.filter-btn');
const hueSlider = document.getElementById('hue-slider');

let quests = JSON.parse(localStorage.getItem('quests')) || [];
let currentFilter = 'all';

// Theme Slider Controller Event Engine
hueSlider.addEventListener('input', (e) => {
    document.documentElement.style.setProperty('--theme-hue', e.target.value);
});

// App Interactivity Events
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
            <div style="display:flex; align-items:center;">
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

// Initial Boot Load
renderQuests();