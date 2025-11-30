document.addEventListener('DOMContentLoaded', function() {
    const posts = [
        { id: 'p1', title: '5 Ways to Boost Productivity During Exams', excerpt: 'Simple techniques to stay focused and manage time during exam weeks.', content: 'Use structured study blocks, limit distractions, plan daily goals, take restorative breaks, and track progress to stay motivated.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Productivity', tags: ['focus','time management'] },
        { id: 'p2', title: 'Deep Work for Students: A Practical Guide', excerpt: 'Create distraction-free blocks to push hard on challenging topics.', content: 'Pick one hard task, set a timer, silence notifications, use full-screen apps, and reward yourself after concentrated effort.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Productivity', tags: ['deep work','concentration'] },
        { id: 'p3', title: 'Beat Procrastination With Micro-Goals', excerpt: 'Shrink tasks into 5-minute actions to build momentum.', content: 'Write a micro-goal like “open textbook and read one page” to break inertia and start moving.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Productivity', tags: ['procrastination','motivation'] },
        { id: 'p4', title: 'Pomodoro Variations That Actually Help', excerpt: 'Try 40/10 or 60/15 when 25/5 feels too short.', content: 'Adjust work/break ratios to your task type; longer sprints suit reading or problem sets, shorter sprints suit memorization.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Productivity', tags: ['timer','habits'] },

        { id: 'p5', title: 'Active Recall: The Technique You Need', excerpt: 'Test yourself rather than rereading notes for better memory.', content: 'Create mini quizzes from notes, explain concepts aloud, and practice spaced repetition to strengthen memory.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Study Tips', tags: ['memory','revision'] },
        { id: 'p6', title: 'How to Take Better Notes in Class', excerpt: 'Cornell, outline, and mapping methods for different subjects.', content: 'Pick a method that fits your course; review and refine notes within 24 hours to lock in understanding.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Study Tips', tags: ['notes','methods'] },
        { id: 'p7', title: 'Spacing vs. Cramming: Why Spaced Repetition Wins', excerpt: 'Spread sessions to increase retention and reduce stress.', content: 'Schedule reviews at 1, 3, 7-day intervals using flashcards or quick quizzes to build long-term memory.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Study Tips', tags: ['spacing','retention'] },
        { id: 'p8', title: 'Study Groups That Work', excerpt: 'Structure sessions: rotate instructors, time-box questions.', content: 'Use shared goals, rotating explanations, and timed focus blocks to keep group productive and fair.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Study Tips', tags: ['groups','collaboration'] },

        { id: 'p9', title: 'Sleep, Focus, and Grades', excerpt: 'Quality sleep boosts attention, recall, and mood.', content: 'Aim for consistent bedtime, dark room, and tech-free wind-down; trade late-night cram for early review.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Wellness', tags: ['sleep','health'] },
        { id: 'p10', title: 'Nutrition For Study Performance', excerpt: 'Brain-friendly foods and hydration tips for long sessions.', content: 'Favor balanced meals, slow carbs, water; avoid heavy sugar spikes before exams to prevent crashes.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Wellness', tags: ['nutrition','energy'] },
        { id: 'p11', title: 'Movement Snacks To Reset Your Brain', excerpt: 'Short stretches and walks restore focus and mood.', content: 'Add 3-minute movement breaks between study blocks; try neck stretches, squats, and short hallway walks.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Wellness', tags: ['exercise','breaks'] },
        { id: 'p12', title: 'Mindfulness For Students', excerpt: 'Breathing techniques to reduce stress quickly.', content: 'Use box-breathing (4-4-4-4) before starting a tough task; pair with a short gratitude note to shift mindset.', author: 'Minds Motive Team', date: new Date().toISOString(), category: 'Wellness', tags: ['mindfulness','stress'] }
    ];

    const blogList = document.getElementById('blogList');
    const searchInput = document.getElementById('blogSearch');
    const categoryButtons = document.querySelectorAll('[data-category]');

    let activeCategory = 'all';
    let searchQuery = '';

    renderPosts();

    searchInput.addEventListener('input', function() {
        searchQuery = this.value.trim().toLowerCase();
        renderPosts();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.category;
            renderPosts();
        });
    });

    function renderPosts() {
        blogList.innerHTML = '';
        const filtered = posts.filter(p => {
            const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
            const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.excerpt.toLowerCase().includes(searchQuery) || p.content.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'text-center text-muted py-5';
            empty.innerHTML = '<i class="fas fa-newspaper fa-3x mb-3"></i><h5>No articles found</h5><p>Try a different search or category</p>';
            blogList.appendChild(empty);
            return;
        }

        filtered.forEach(post => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            const badgeClass = post.category === 'Productivity' ? 'bg-success' : post.category === 'Study Tips' ? 'bg-primary' : 'bg-info text-dark';
            col.innerHTML = `
                <div class="card h-100 border-0 shadow-sm blog-post">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge ${badgeClass}">${post.category}</span>
                            <small class="text-muted">${new Date(post.date).toLocaleDateString()}</small>
                        </div>
                        <h5 class="card-title">${post.title}</h5>
                        <p class="card-text">${post.excerpt}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">By ${post.author}</small>
                            <button class="btn btn-sm btn-outline-primary" data-id="${post.id}">Read More</button>
                        </div>
                    </div>
                </div>
            `;
            blogList.appendChild(col);
            const btn = col.querySelector('button');
            btn.addEventListener('click', function() {
                openPost(post);
            });
        });
    }

    function openPost(post) {
        const modalEl = document.getElementById('blogModal');
        if (!modalEl) return;
        modalEl.querySelector('.modal-title').textContent = post.title;
        modalEl.querySelector('.modal-body').innerHTML = `<p>${post.content}</p>`;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
});
