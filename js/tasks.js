// Task Management System

// Task class to represent a task
class Task {
    constructor(id, title, description, priority, dueDate, completed = false, createdAt = new Date()) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed;
        this.createdAt = createdAt;
    }
}

// TaskManager class to handle task operations
class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date-asc';
    }

    // Load tasks from localStorage
    loadTasks() {
        const tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON) {
            const tasksData = JSON.parse(tasksJSON);
            this.tasks = tasksData.map(task => {
                return new Task(
                    task.id,
                    task.title,
                    task.description,
                    task.priority,
                    task.dueDate ? new Date(task.dueDate) : null,
                    task.completed,
                    new Date(task.createdAt)
                );
            });
        }
        this.updateTaskCounter();
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateTaskCounter();
    }

    // Add a new task
    addTask(title, description, priority, dueDate) {
        const id = 'task_' + Date.now();
        const task = new Task(id, title, description, priority, dueDate);
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        return task;
    }

    // Delete a task by ID
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    // Toggle task completion status
    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Update an existing task
    updateTask(id, title, description, priority, dueDate) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.title = title;
            task.description = description;
            task.priority = priority;
            task.dueDate = dueDate;
            this.saveTasks();
            this.renderTasks();
        }
    }

    // Clear all completed tasks
    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
    }

    // Filter tasks based on status
    filterTasks(filter) {
        this.currentFilter = filter;
        this.renderTasks();
    }

    // Sort tasks based on criteria
    sortTasks(sortCriteria) {
        this.currentSort = sortCriteria;
        this.renderTasks();
    }

    // Get filtered and sorted tasks
    getFilteredAndSortedTasks() {
        // First filter
        let filteredTasks = [...this.tasks];
        if (this.currentFilter === 'pending') {
            filteredTasks = filteredTasks.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed);
        }

        // Then sort
        switch (this.currentSort) {
            case 'date-asc':
                filteredTasks.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'date-desc':
                filteredTasks.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(b.dueDate) - new Date(a.dueDate);
                });
                break;
            case 'priority-desc':
                const priorityValues = { 'high': 3, 'medium': 2, 'low': 1 };
                filteredTasks.sort((a, b) => priorityValues[b.priority] - priorityValues[a.priority]);
                break;
            case 'priority-asc':
                const priorityValuesAsc = { 'high': 3, 'medium': 2, 'low': 1 };
                filteredTasks.sort((a, b) => priorityValuesAsc[a.priority] - priorityValuesAsc[b.priority]);
                break;
        }

        return filteredTasks;
    }

    // Update task counter
    updateTaskCounter() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const counterElement = document.getElementById('taskCounter');
        if (counterElement) {
            counterElement.textContent = `${totalTasks} tasks (${completedTasks} completed)`;
        }
    }

    // Format date for display
    formatDate(date) {
        if (!date) return 'No due date';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    // Calculate time ago for display
    getTimeAgo(date) {
        const now = new Date();
        const taskDate = new Date(date);
        const diffInSeconds = Math.floor((now - taskDate) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return this.formatDate(date);
    }

    // Render tasks to the DOM
    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyTaskMessage = document.getElementById('emptyTaskMessage');
        const filteredTasks = this.getFilteredAndSortedTasks();
        
        // Clear current tasks
        taskList.innerHTML = '';
        
        // Show empty message if no tasks
        if (filteredTasks.length === 0) {
            if (emptyTaskMessage) {
                emptyTaskMessage.classList.remove('d-none');
                taskList.appendChild(emptyTaskMessage);
            }
            return;
        }
        
        // Hide empty message
        if (emptyTaskMessage) {
            emptyTaskMessage.classList.add('d-none');
        }
        
        // Create task elements
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    // Create a task element
    createTaskElement(task) {
        const template = document.getElementById('taskTemplate');
        const taskElement = document.importNode(template.content, true).querySelector('.task-item');
        
        // Set task data
        taskElement.dataset.id = task.id;
        
        // Set task content
        const checkbox = taskElement.querySelector('.task-check');
        const title = taskElement.querySelector('.task-title');
        const description = taskElement.querySelector('.task-description');
        const priorityBadge = taskElement.querySelector('.task-priority');
        const dateElement = taskElement.querySelector('.task-date');
        const timeAgoElement = taskElement.querySelector('.task-time-ago');
        
        checkbox.checked = task.completed;
        title.textContent = task.title;
        description.textContent = task.description || 'No description';
        
        // Set priority badge
        priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
        priorityBadge.classList.add(`bg-${task.priority === 'high' ? 'danger' : (task.priority === 'medium' ? 'warning' : 'info')}`);
        
        // Set date
        dateElement.textContent = task.dueDate ? this.formatDate(task.dueDate) : 'No due date';
        
        // Set time ago
        timeAgoElement.textContent = `Created ${this.getTimeAgo(task.createdAt)}`;
        
        // Apply completed style
        if (task.completed) {
            title.classList.add('text-decoration-line-through');
            taskElement.classList.add('bg-light');
        }
        
        // Add event listeners
        checkbox.addEventListener('change', () => {
            const wasCompleted = task.completed;
            this.toggleTaskCompletion(task.id);
            const nowCompleted = !wasCompleted;
            if (nowCompleted && typeof Gamify !== 'undefined') {
                Gamify.award('task_completed');
            }
        });
        
        const editBtn = taskElement.querySelector('.edit-task-btn');
        editBtn.addEventListener('click', () => {
            this.openEditModal(task);
        });
        
        const deleteBtn = taskElement.querySelector('.delete-task-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                this.deleteTask(task.id);
            }
        });
        
        return taskElement;
    }

    // Open edit modal with task data
    openEditModal(task) {
        const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        
        // Set form values
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskPriority').value = task.priority;
        
        // Format date for input
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            document.getElementById('editTaskDueDate').value = `${year}-${month}-${day}`;
        } else {
            document.getElementById('editTaskDueDate').value = '';
        }
        
        modal.show();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create task manager instance
    const taskManager = new TaskManager();
    
    // Get DOM elements
    const taskForm = document.getElementById('taskForm');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterButtons = document.querySelectorAll('[data-filter]');
    const sortOptions = document.querySelectorAll('[data-sort]');
    const saveTaskChangesBtn = document.getElementById('saveTaskChanges');
    
    // Render initial tasks
    taskManager.renderTasks();
    
    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const priority = taskPriority.value;
        const dueDate = taskDueDate.value ? new Date(taskDueDate.value) : null;
        
        // Add task
        if (title) {
            taskManager.addTask(title, description, priority, dueDate);
            
            // Reset form
            taskForm.reset();
        }
    });
    
    // Handle clear completed button
    clearCompletedBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            taskManager.clearCompletedTasks();
        }
    });
    
    // Handle filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Apply filter
            const filter = button.dataset.filter;
            taskManager.filterTasks(filter);
        });
    });
    
    // Handle sort options
    sortOptions.forEach(option => {
        option.addEventListener('click', () => {
            const sort = option.dataset.sort;
            document.getElementById('sortDropdown').textContent = option.textContent;
            taskManager.sortTasks(sort);
        });
    });
    
    // Handle save changes button in edit modal
    saveTaskChangesBtn.addEventListener('click', () => {
        const id = document.getElementById('editTaskId').value;
        const title = document.getElementById('editTaskTitle').value.trim();
        const description = document.getElementById('editTaskDescription').value.trim();
        const priority = document.getElementById('editTaskPriority').value;
        const dueDate = document.getElementById('editTaskDueDate').value ? new Date(document.getElementById('editTaskDueDate').value) : null;
        
        if (title) {
            taskManager.updateTask(id, title, description, priority, dueDate);
            bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
        }
    });
});
