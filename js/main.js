// Main JavaScript functionality for Minds Motive

document.addEventListener('DOMContentLoaded', function() {
    // Initialize motivational quotes
    initMotivationalQuotes();
    
    // Initialize any page-specific functionality
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'timer.html':
            initStudyTimer();
            break;
        case 'tasks.html':
            initTaskManager();
            break;
        case 'dashboard.html':
            initDashboard();
            break;
    }
});

// Motivational Quotes
function initMotivationalQuotes() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (!quoteElement) return;
    
    const quotes = [
        "The secret of getting ahead is getting started. – Mark Twain",
        "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
        "The expert in anything was once a beginner. – Helen Hayes",
        "Believe you can and you're halfway there. – Theodore Roosevelt",
        "It always seems impossible until it's done. – Nelson Mandela",
        "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
        "The future depends on what you do today. – Mahatma Gandhi",
        "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
        "The harder you work for something, the greater you'll feel when you achieve it.",
        "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
        "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
        "The more that you read, the more things you will know. The more that you learn, the more places you'll go. – Dr. Seuss"
    ];
    
    // Display random quote initially
    displayRandomQuote();
    
    // Change quote every 30 seconds
    setInterval(displayRandomQuote, 30000);
    
    function displayRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = quotes[randomIndex];
        quoteElement.classList.remove('quote-animation');
        // Trigger reflow
        void quoteElement.offsetWidth;
        quoteElement.classList.add('quote-animation');
    }
}

// Study Timer / Pomodoro
function initStudyTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    const workTimeInput = document.getElementById('workTime');
    const breakTimeInput = document.getElementById('breakTime');
    const sessionCountElement = document.getElementById('sessionCount');
    
    let timer;
    let timeLeft = parseInt(workTimeInput.value) * 60;
    let isRunning = false;
    let isWorkTime = true;
    let sessionCount = 0;
    
    // Update timer display initially
    updateTimerDisplay();
    
    // Start timer
    startBtn.addEventListener('click', function() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(updateTimer, 1000);
            startBtn.disabled = true;
            pauseBtn.disabled = false;
        }
    });
    
    // Pause timer
    pauseBtn.addEventListener('click', function() {
        if (isRunning) {
            isRunning = false;
            clearInterval(timer);
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    });
    
    // Reset timer
    resetBtn.addEventListener('click', function() {
        isRunning = false;
        clearInterval(timer);
        isWorkTime = true;
        timeLeft = parseInt(workTimeInput.value) * 60;
        updateTimerDisplay();
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    });
    
    // Update timer values when inputs change
    workTimeInput.addEventListener('change', function() {
        if (!isRunning && isWorkTime) {
            timeLeft = parseInt(workTimeInput.value) * 60;
            updateTimerDisplay();
        }
    });
    
    breakTimeInput.addEventListener('change', function() {
        if (!isRunning && !isWorkTime) {
            timeLeft = parseInt(breakTimeInput.value) * 60;
            updateTimerDisplay();
        }
    });
    
    // Timer update function
    function updateTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            // Timer finished
            clearInterval(timer);
            isRunning = false;
            
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
            audio.play();
            
            if (isWorkTime) {
                // Work session completed
                sessionCount++;
                sessionCountElement.textContent = sessionCount;
                
                // Save study session to local storage
                saveStudySession(parseInt(workTimeInput.value));
                if (typeof Gamify !== 'undefined') {
                    Gamify.award('study_session');
                }
                
                // Switch to break time
                isWorkTime = false;
                timeLeft = parseInt(breakTimeInput.value) * 60;
                document.body.classList.add('break-time');
                
                // Show notification
                showNotification('Work session completed! Time for a break.');
            } else {
                // Break completed, switch back to work time
                isWorkTime = true;
                timeLeft = parseInt(workTimeInput.value) * 60;
                document.body.classList.remove('break-time');
                
                // Show notification
                showNotification('Break time over! Ready to focus again?');
            }
            
            updateTimerDisplay();
            startBtn.disabled = false;
        }
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
        
        // Update title to show timer
        document.title = `${minutes}:${seconds} - ${isWorkTime ? 'Work' : 'Break'} - Minds Motive`;
        
        // Update timer status text
        const timerStatus = document.getElementById('timerStatus');
        if (timerStatus) {
            timerStatus.textContent = isWorkTime ? 'Focus Time' : 'Break Time';
            timerStatus.className = isWorkTime ? 'text-primary' : 'text-success';
        }
    }
    
    // Show browser notification
    function showNotification(message) {
        if (Notification.permission === 'granted') {
            new Notification('Minds Motive', {
                body: message,
                icon: 'favicon.ico'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Minds Motive', {
                        body: message,
                        icon: 'favicon.ico'
                    });
                }
            });
        }
    }
    
    // Save study session to local storage
    function saveStudySession(duration) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].studySessions) {
                users[userIndex].studySessions = [];
            }
            
            users[userIndex].studySessions.push({
                id: Date.now().toString(),
                duration: duration,
                date: new Date().toISOString()
            });
            
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Task Manager
function initTaskManager() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');
    
    // Load tasks on page load
    loadTasks();
    
    // Add new task
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const taskText = taskInput.value.trim();
            if (!taskText) return;
            
            const dueDate = dueDateInput.value;
            const priority = priorityInput.value;
            
            addTask(taskText, dueDate, priority);
            
            // Clear form
            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'medium';
        });
    }
    
    // Add task function
    function addTask(text, dueDate, priority) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].tasks) {
                users[userIndex].tasks = [];
            }
            
            const newTask = {
                id: Date.now().toString(),
                text: text,
                dueDate: dueDate,
                priority: priority,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            users[userIndex].tasks.push(newTask);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Refresh task list
            loadTasks();
        }
    }
    
    // Load tasks from local storage
    function loadTasks() {
        if (!taskList) return;
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === currentUser.id);
        
        if (user && user.tasks) {
            // Sort tasks by due date and completion status
            const sortedTasks = [...user.tasks].sort((a, b) => {
                // Completed tasks at the bottom
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                
                // Sort by due date
                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                }
                
                // Tasks without due date at the bottom
                if (a.dueDate && !b.dueDate) return -1;
                if (!a.dueDate && b.dueDate) return 1;
                
                // Sort by creation date
                return new Date(a.createdAt) - new Date(b.createdAt);
            });
            
            // Clear task list
            taskList.innerHTML = '';
            
            // Add tasks to list
            sortedTasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item p-3 mb-2 bg-white rounded shadow-sm ${task.completed ? 'completed' : ''} ${task.priority}-priority`;
                taskItem.dataset.id = task.id;
                
                // Format due date
                let dueDateText = '';
                if (task.dueDate) {
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    if (dueDate.toDateString() === today.toDateString()) {
                        dueDateText = 'Today';
                    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
                        dueDateText = 'Tomorrow';
                    } else {
                        dueDateText = dueDate.toLocaleDateString();
                    }
                }
                
                // Priority badge
                const priorityBadge = {
                    high: '<span class="badge bg-danger">High</span>',
                    medium: '<span class="badge bg-warning text-dark">Medium</span>',
                    low: '<span class="badge bg-info text-dark">Low</span>'
                };
                
                taskItem.innerHTML = `
                    <div class="d-flex align-items-center">
                        <div class="form-check">
                            <input class="form-check-input task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                        </div>
                        <div class="ms-3 flex-grow-1">
                            <p class="mb-0 ${task.completed ? 'text-decoration-line-through' : ''}">${task.text}</p>
                            <div class="d-flex align-items-center mt-1">
                                ${task.dueDate ? `<small class="text-muted me-2"><i class="far fa-calendar-alt me-1"></i>${dueDateText}</small>` : ''}
                                ${priorityBadge[task.priority] || ''}
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="btn btn-sm btn-outline-danger delete-task"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `;
                
                // Add event listeners
                const checkbox = taskItem.querySelector('.task-checkbox');
                checkbox.addEventListener('change', function() {
                    toggleTaskCompletion(task.id);
                });
                
                const deleteBtn = taskItem.querySelector('.delete-task');
                deleteBtn.addEventListener('click', function() {
                    deleteTask(task.id);
                });
                
                taskList.appendChild(taskItem);
            });
            
            // Show empty state if no tasks
            if (sortedTasks.length === 0) {
                taskList.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                        <p class="lead">No tasks yet. Add a task to get started!</p>
                    </div>
                `;
            }
        }
    }
    
    // Toggle task completion
    function toggleTaskCompletion(taskId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1 && users[userIndex].tasks) {
            const taskIndex = users[userIndex].tasks.findIndex(t => t.id === taskId);
            
            if (taskIndex !== -1) {
                users[userIndex].tasks[taskIndex].completed = !users[userIndex].tasks[taskIndex].completed;
                localStorage.setItem('users', JSON.stringify(users));
                
                // Refresh task list
                loadTasks();
            }
        }
    }
    
    // Delete task
    function deleteTask(taskId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1 && users[userIndex].tasks) {
            users[userIndex].tasks = users[userIndex].tasks.filter(t => t.id !== taskId);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Refresh task list
            loadTasks();
        }
    }
}

// Dashboard
function initDashboard() {
    // Load user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) return;
    
    // Update welcome message
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome back, ${user.name}!`;
    }
    
    // Update task stats
    updateTaskStats(user.tasks || []);
    
    // Update study session stats
    updateStudyStats(user.studySessions || []);
    
    // Update productivity chart
    updateProductivityChart(user.studySessions || []);
}

// Update task statistics
function updateTaskStats(tasks) {
    const totalTasksElement = document.getElementById('totalTasks');
    const completedTasksElement = document.getElementById('completedTasks');
    const upcomingTasksElement = document.getElementById('upcomingTasks');
    
    if (!totalTasksElement || !completedTasksElement || !upcomingTasksElement) return;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Count tasks due today or tomorrow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate < dayAfterTomorrow;
    }).length;
    
    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    upcomingTasksElement.textContent = upcomingTasks;
    
    // Update completion percentage
    const completionPercentElement = document.getElementById('completionPercent');
    if (completionPercentElement) {
        const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        completionPercentElement.textContent = `${completionPercent}%`;
        
        // Update progress bar
        const progressBar = document.getElementById('taskProgressBar');
        if (progressBar) {
            progressBar.style.width = `${completionPercent}%`;
            progressBar.setAttribute('aria-valuenow', completionPercent);
        }
    }
}

// Update study session statistics
function updateStudyStats(sessions) {
    const totalSessionsElement = document.getElementById('totalSessions');
    const totalTimeElement = document.getElementById('totalStudyTime');
    const avgSessionElement = document.getElementById('avgSessionTime');
    
    if (!totalSessionsElement || !totalTimeElement || !avgSessionElement) return;
    
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((total, session) => total + session.duration, 0);
    const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    
    totalSessionsElement.textContent = totalSessions;
    
    // Format total time
    if (totalMinutes < 60) {
        totalTimeElement.textContent = `${totalMinutes} min`;
    } else {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        totalTimeElement.textContent = `${hours}h ${minutes}m`;
    }
    
    avgSessionElement.textContent = `${avgMinutes} min`;
}

// Update productivity chart
function updateProductivityChart(sessions) {
    const chartCanvas = document.getElementById('productivityChart');
    if (!chartCanvas || !window.Chart) return;
    
    // Group sessions by day
    const last7Days = [];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        last7Days.push(date);
        
        // Format date label (e.g., "Mon", "Tue")
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(dayName);
    }
    
    // Calculate minutes studied per day
    const data = last7Days.map(day => {
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        
        return sessions
            .filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= day && sessionDate < nextDay;
            })
            .reduce((total, session) => total + session.duration, 0);
    });
    
    // Create chart
    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Minutes Studied',
                data: data,
                backgroundColor: 'rgba(78, 115, 223, 0.8)',
                borderColor: 'rgba(78, 115, 223, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            }
        }
    });
}
