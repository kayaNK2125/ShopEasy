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

// update navbar based on login state — runs on every page
function updateAuthNav() {
    const btn = document.querySelector('.login-nav-btn');
    if (!btn) return;

    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (user) {
        // logged in — show first name + turn button into Logout
        const firstName = (user.name || 'User').split(' ')[0];
        btn.textContent = 'Hi, ' + firstName + ' • Logout';
        btn.onclick = function (e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        };
        // stop the surrounding <a href="login.html"> from navigating
        const link = btn.closest('a');
        if (link) link.removeAttribute('href');
    }
}

updateAuthNav();
