// update navbar cart count from localStorage
const _cart = JSON.parse(localStorage.getItem('cart')) || [];
document.querySelector('.cart-count').textContent = _cart.length;

// toggle between login and register forms
function showRegister() {
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'block';
    clearErrors();
}

function showLogin() {
    document.getElementById('register-card').style.display = 'none';
    document.getElementById('login-card').style.display = 'block';
    clearErrors();
}

// show error message under a specific field
function showError(id, message) {
    document.getElementById(id).textContent = message;
}

// clear all error messages
function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
}

// show/hide password when eye icon is clicked
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

// check password strength and update the strength bar
function checkStrength(password) {
    const fill = document.getElementById('strength-fill');
    const text = document.getElementById('strength-text');

    if (password.length === 0) {
        fill.style.width = '0%';
        text.textContent = '';
        return;
    }

    // calculate strength score
    let score = 0;
    if (password.length >= 6) score++;          // at least 6 chars
    if (password.length >= 10) score++;         // at least 10 chars
    if (/[0-9]/.test(password)) score++;       // has a number
    if (/[!@#$%^&*]/.test(password)) score++; // has special character

    if (score <= 1) {
        fill.style.width = '33%';
        fill.style.background = '#ff4757';
        text.textContent = 'Weak';
        text.style.color = '#ff4757';
    } else if (score <= 2) {
        fill.style.width = '66%';
        fill.style.background = '#ffa502';
        text.textContent = 'Medium';
        text.style.color = '#ffa502';
    } else {
        fill.style.width = '100%';
        fill.style.background = '#2ed573';
        text.textContent = 'Strong 💪';
        text.style.color = '#2ed573';
    }
}

// LOGIN - sends email + password to backend /login route, checks MongoDB
async function login() {
    clearErrors();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // validate fields before sending to server
    if (!email) { showError('login-email-error', 'Email is required'); return; }
    if (!email.includes('@')) { showError('login-email-error', 'Enter a valid email'); return; }
    if (!password) { showError('login-pass-error', 'Password is required'); return; }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // 401 means wrong credentials
            showError('login-pass-error', data.message || 'Invalid email or password');
            return;
        }

        // save logged in user info to localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(data.user));
        alert(`Welcome back, ${data.user.name}! 🎉`);
        window.location.href = 'index.html';

    } catch (error) {
        showError('login-pass-error', 'Something went wrong. Try again.');
    }
}

// REGISTER - validates then saves new user to MongoDB via /adduser route
async function register() {
    clearErrors();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    // validate all fields one by one
    let valid = true;
    if (!name) { showError('reg-name-error', 'Name is required'); valid = false; }
    if (!email) { showError('reg-email-error', 'Email is required'); valid = false; }
    if (email && !email.includes('@')) { showError('reg-email-error', 'Enter a valid email'); valid = false; }
    if (!phone) { showError('reg-phone-error', 'Phone number is required'); valid = false; }
    if (phone && phone.length < 10) { showError('reg-phone-error', 'Enter a valid 10-digit number'); valid = false; }
    if (!password) { showError('reg-pass-error', 'Password is required'); valid = false; }
    if (password && password.length < 6) { showError('reg-pass-error', 'Minimum 6 characters required'); valid = false; }
    if (password && confirm !== password) { showError('reg-confirm-error', 'Passwords do not match'); valid = false; }
    if (!valid) return;

    try {
        await fetch('http://localhost:3000/adduser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: Date.now(),  // unique id using current timestamp
                name,
                email,
                phone,
                password
            })
        });

        alert('Account created successfully! Please login. 🎉');
        showLogin();

    } catch (error) {
        showError('reg-email-error', 'Registration failed. Try again.');
    }
}
