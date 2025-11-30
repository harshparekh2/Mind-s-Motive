// Dashboard functionality

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginRequiredMessage = document.getElementById('loginRequiredMessage');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (!currentUser) {
        // Show login required message
        loginRequiredMessage.classList.remove('d-none');
        return;
    } else {
        // Show dashboard content
        dashboardContent.classList.remove('d-none');
        
        // Display user name
        document.getElementById('userNameDisplay').textContent = currentUser.fullName || currentUser.email.split('@')[0];
        
        // Load and display dashboard data
        loadDashboardData();
    }
    
    // Load motivational quote
    loadRandomQuote();

    updateGamification();
});

// Load all dashboard data
function loadDashboardData() {
    // Load study sessions data
    const studySessions = JSON.parse(localStorage.getItem('studySessions')) || [];
    
    // Load tasks data
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Update stats
    updateStudyTimeStats(studySessions);
    updateTaskStats(tasks);
    updateStudyStreak(studySessions);
    
    // Update charts
    createStudyTimeChart(studySessions);
    createTaskCompletionChart(tasks);
    
    // Update recent activity
    updateRecentActivity(studySessions, tasks);
    updateGamification();
}

// Update study time statistics
function updateStudyTimeStats(studySessions) {
    const totalMinutes = studySessions.reduce((total, session) => total + session.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    document.getElementById('totalStudyTime').textContent = `${hours}h ${minutes}m`;
}

// Update task statistics
function updateTaskStats(tasks) {
    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    
    document.getElementById('completedTasksCount').textContent = completedTasks.length;
    document.getElementById('pendingTasksCount').textContent = pendingTasks.length;
}

function updateGamification() {
    const cu = JSON.parse(localStorage.getItem('currentUser'));
    if (!cu) return;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === cu.id);
    if (!user) return;
    const xpEl = document.getElementById('userXP');
    const lvlEl = document.getElementById('userLevel');
    const badgesEl = document.getElementById('badgesList');
    if (xpEl) xpEl.textContent = user.xp || 0;
    if (lvlEl) lvlEl.textContent = user.level || 1;
    if (badgesEl) {
        badgesEl.innerHTML = '';
        (user.badges || []).forEach(b => {
            const span = document.createElement('span');
            span.className = 'badge bg-secondary';
            span.textContent = b;
            badgesEl.appendChild(span);
        });
        if ((user.badges || []).length === 0) {
            const small = document.createElement('small');
            small.className = 'text-muted';
            small.textContent = 'No badges yet — complete tasks or sessions!';
            badgesEl.appendChild(small);
        }
    }
}

// Update study streak
function updateStudyStreak(studySessions) {
    if (studySessions.length === 0) {
        document.getElementById('studyStreak').textContent = '0';
        return;
    }
    
    // Sort sessions by date
    const sortedSessions = [...studySessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Get unique dates (in YYYY-MM-DD format)
    const uniqueDates = [...new Set(sortedSessions.map(session => {
        const date = new Date(session.date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }))];
    
    // Calculate streak
    let streak = 0;
    const today = new Date();
    const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Check if studied today
    const studiedToday = uniqueDates[0] === todayFormatted;
    
    // Start from today or yesterday
    let currentDate = studiedToday ? today : new Date(today);
    if (!studiedToday) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Count consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
        const dateToCheck = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        if (uniqueDates.includes(dateToCheck)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    document.getElementById('studyStreak').textContent = streak;
}

// Create study time chart
function createStudyTimeChart(studySessions) {
    // Get last 7 days
    const last7Days = [];
    const dayLabels = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        last7Days.push(formattedDate);
        
        // Format day label (e.g., "Mon", "Tue")
        const options = { weekday: 'short' };
        dayLabels.push(date.toLocaleDateString(undefined, options));
    }
    
    // Calculate study minutes for each day
    const dailyStudyMinutes = last7Days.map(day => {
        const dayStudySessions = studySessions.filter(session => {
            const sessionDate = new Date(session.date);
            const sessionFormatted = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
            return sessionFormatted === day;
        });
        
        return dayStudySessions.reduce((total, session) => total + session.duration, 0);
    });
    
    // Create chart
    const ctx = document.getElementById('studyTimeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dayLabels,
            datasets: [{
                label: 'Study Minutes',
                data: dailyStudyMinutes,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minutes'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Create task completion chart
function createTaskCompletionChart(tasks) {
    // Count completed and pending tasks
    const completedCount = tasks.filter(task => task.completed).length;
    const pendingCount = tasks.filter(task => !task.completed).length;
    
    // Create chart
    const ctx = document.getElementById('taskCompletionChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completedCount, pendingCount],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update recent activity
function updateRecentActivity(studySessions, tasks) {
    const recentActivityList = document.getElementById('recentActivityList');
    const noActivityMessage = document.getElementById('noActivityMessage');
    
    // Combine study sessions and tasks into activities
    const activities = [
        ...studySessions.map(session => ({
            type: 'study',
            date: new Date(session.date),
            duration: session.duration,
            description: `Studied for ${session.duration} minutes`
        })),
        ...tasks.map(task => ({
            type: 'task',
            date: new Date(task.createdAt),
            completed: task.completed,
            title: task.title,
            description: task.completed ? `Completed task: ${task.title}` : `Created task: ${task.title}`
        }))
    ];
    
    // Sort by date (newest first)
    activities.sort((a, b) => b.date - a.date);
    
    // Limit to 10 most recent activities
    const recentActivities = activities.slice(0, 10);
    
    // Check if there are activities
    if (recentActivities.length === 0) {
        noActivityMessage.classList.remove('d-none');
        return;
    } else {
        noActivityMessage.classList.add('d-none');
    }
    
    // Clear current list
    recentActivityList.innerHTML = '';
    
    // Add activity items
    recentActivities.forEach(activity => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Create icon based on activity type
        const icon = document.createElement('i');
        if (activity.type === 'study') {
            icon.className = 'fas fa-clock text-primary me-2';
        } else {
            icon.className = activity.completed ? 
                'fas fa-check-circle text-success me-2' : 
                'fas fa-list text-warning me-2';
        }
        
        // Create description
        const description = document.createElement('span');
        description.textContent = activity.description;
        
        // Create left side container
        const leftSide = document.createElement('div');
        leftSide.appendChild(icon);
        leftSide.appendChild(description);
        
        // Create date display
        const dateDisplay = document.createElement('small');
        dateDisplay.className = 'text-muted';
        dateDisplay.textContent = formatDate(activity.date);
        
        // Add elements to list item
        listItem.appendChild(leftSide);
        listItem.appendChild(dateDisplay);
        
        // Add to list
        recentActivityList.appendChild(listItem);
    });
}

// Format date for display
function formatDate(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Load random motivational quote
function loadRandomQuote() {
    const quotes = [
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" }
    ];
    
    // Get random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    // Update quote display
    document.getElementById('motivationalQuote').textContent = quote.text;
    document.getElementById('quoteAuthor').textContent = `- ${quote.author}`;
}
