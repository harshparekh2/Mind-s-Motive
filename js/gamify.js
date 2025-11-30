const Gamify = (function() {
    function getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }
    function setUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    function getCurrentUser() {
        const cu = JSON.parse(localStorage.getItem('currentUser'));
        if (!cu) return null;
        const users = getUsers();
        return users.find(u => u.id === cu.id) || null;
    }
    function saveUser(user) {
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = user;
            setUsers(users);
        }
    }
    function ensureFields(user) {
        if (!user) return null;
        user.xp = typeof user.xp === 'number' ? user.xp : 0;
        user.level = typeof user.level === 'number' ? user.level : 1;
        user.badges = Array.isArray(user.badges) ? user.badges : [];
        return user;
    }
    function levelForXP(xp) {
        return Math.floor(1 + xp / 100);
    }
    function awardXP(points, reason = '') {
        const user = ensureFields(getCurrentUser());
        if (!user) return;
        user.xp += points;
        const newLevel = levelForXP(user.xp);
        if (newLevel > user.level) {
            user.level = newLevel;
            addBadge(`Level ${newLevel} Achieved`);
        }
        saveUser(user);
    }
    function addBadge(name) {
        const user = ensureFields(getCurrentUser());
        if (!user) return;
        if (!user.badges.includes(name)) {
            user.badges.push(name);
            saveUser(user);
        }
    }
    function award(event) {
        switch(event) {
            case 'task_completed':
                awardXP(10, 'Task completed');
                addBadge('Task Finisher');
                break;
            case 'study_session':
                awardXP(15, 'Study session');
                addBadge('Focused Learner');
                break;
        }
    }
    return { awardXP, addBadge, award, levelForXP };
})();
