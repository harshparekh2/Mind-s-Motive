// Authentication functionality for StudyFocus

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

// Function to check authentication status
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userDropdown = document.getElementById('userDropdown');
    const usernameElement = document.getElementById('username');
    
    if (currentUser) {
        // User is logged in
        const userData = JSON.parse(currentUser);
        
        // Hide login/signup buttons and show user dropdown
        if (loginBtn && signupBtn && userDropdown) {
            loginBtn.classList.add('d-none');
            signupBtn.classList.add('d-none');
            userDropdown.classList.remove('d-none');
            
            // Set username in dropdown
            if (usernameElement) {
                usernameElement.textContent = userData.name || userData.email;
            }
        }
        
        // Redirect if on login/signup page
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('signup.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // User is not logged in
        if (loginBtn && signupBtn && userDropdown) {
            loginBtn.classList.remove('d-none');
            signupBtn.classList.remove('d-none');
            userDropdown.classList.add('d-none');
        }
        
        // Redirect if on protected pages
        const protectedPages = ['dashboard.html', 'profile.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
}

// Handle login form submission
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorMsg = document.getElementById('loginErrorMsg');
        
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user in local storage (excluding password)
            const currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error message
            errorMsg.textContent = 'Invalid email or password';
            errorMsg.classList.remove('d-none');
        }
    });
}

// Handle signup form submission
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const errorMsg = document.getElementById('signupErrorMsg');
        
        // Validate passwords match
        if (password !== confirmPassword) {
            errorMsg.textContent = 'Passwords do not match';
            errorMsg.classList.remove('d-none');
            return;
        }
        
        // Get existing users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            errorMsg.textContent = 'Email already in use';
            errorMsg.classList.remove('d-none');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString(),
            tasks: [],
            studySessions: [],
            xp: 0,
            level: 1,
            badges: []
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save updated users array to local storage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Store current user in local storage (excluding password)
        const currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });
}

// Handle logout
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logoutBtn') {
        e.preventDefault();
        
        // Remove current user from local storage
        localStorage.removeItem('currentUser');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
});
