// show register form, hide login form
function showRegister() {
    document.getElementById('login-card').style.display = 'none';
    document.getElementById('register-card').style.display = 'block';
}

// show login form, hide register form
function showLogin() {
    document.getElementById('register-card').style.display = 'none';
    document.getElementById('login-card').style.display = 'block';
}

// register new user - sends to backend
async function register() {
    const name = document.getElementById('reg-name').value;
    const gender = document.getElementById('reg-gender').value;

    // check fields not empty
    if(!name || !gender) {
        alert('Please fill all fields!');
        return;
    }

    // generate simple id
    const newUser = {
        id: Date.now(),
        name: name,
        gender: gender
    };

    // POST to our Express backend
    await fetch('http://localhost:3000/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });

    // save user in localStorage so we know they're logged in
    localStorage.setItem('user', JSON.stringify(newUser));
    alert(`Welcome ${name}! Account created.`);
    window.location.href = 'index.html'; // go to homepage
}

// login existing user
async function login() {
    const name = document.getElementById('login-name').value;

    if(!name) {
        alert('Please enter your name!');
        return;
    }

    // fetch all users from backend
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    // find user with matching name
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());

    if(user) {
        localStorage.setItem('user', JSON.stringify(user));
        alert(`Welcome back ${user.name}!`);
        window.location.href = 'index.html';
    } else {
        alert('User not found! Please register first.');
    }
}