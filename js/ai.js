document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('generatePlanBtn');
    const planContainer = document.getElementById('aiPlan');
    if (!btn || !planContainer) return;

    btn.addEventListener('click', function() {
        const plan = generatePlan();
        renderPlan(plan);
    });

    function getUserTasks() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === currentUser.id);
        return (user && user.tasks) ? user.tasks : [];
    }

    function generatePlan() {
        const tasks = getUserTasks();
        const today = new Date();
        const upcoming = tasks.filter(t => !t.completed).sort((a,b) => {
            if (a.priority !== b.priority) {
                const p = { high: 3, medium: 2, low: 1 };
                return p[b.priority] - p[a.priority];
            }
            if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;
            return 0;
        }).slice(0, 7);

        const slots = [
            { name: 'Morning Focus (9:00–11:00)', type: 'deep' },
            { name: 'Noon Maintenance (12:00–13:00)', type: 'light' },
            { name: 'Afternoon Push (15:00–17:00)', type: 'deep' },
            { name: 'Evening Review (19:00–20:00)', type: 'light' }
        ];

        const plan = slots.map((slot, i) => {
            const pick = upcoming[i] || upcoming[upcoming.length - 1];
            if (!pick) return { slot: slot.name, suggestion: 'Add tasks to generate a plan.' };
            const title = pick.title || pick.text;
            const due = pick.dueDate ? new Date(pick.dueDate).toLocaleDateString() : 'No due date';
            const action = slot.type === 'deep' ? 'Work in 40/10 blocks' : 'Do a 20-min review';
            return { slot: slot.name, suggestion: `${action} on “${title}” (Due: ${due}, Priority: ${pick.priority})` };
        });
        return plan;
    }

    function renderPlan(plan) {
        planContainer.innerHTML = '';
        plan.forEach(item => {
            const li = document.createElement('div');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `<span><i class="fas fa-clock text-primary me-2"></i>${item.slot}</span><small class="text-muted">${item.suggestion}</small>`;
            planContainer.appendChild(li);
        });
    }
});
