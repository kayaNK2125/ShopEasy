// apply saved theme on every page load
function applyTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('theme-btn');
        if (btn) btn.textContent = '☀️';
    }
}

// toggle dark / light mode and save preference
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

applyTheme();
