// Common JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('about') || window.location.pathname.includes('blog')) {
        addBlogImages();
    }
});

// Function to add images to blog posts
function addBlogImages() {
    const blogPosts = document.querySelectorAll('.blog-post');
    const blogImages = [
        "assests/student-studying.jpg",
        "assests/productivity.jpg",
        "assests/study-task.jpeg",
        "assests/student task.jpg",
        "assests/unnamed.jpg"
    ];
    blogPosts.forEach((post) => {
        if (!post.querySelector('.blog-img')) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'blog-img mb-3';
            const img = document.createElement('img');
            const src = blogImages[Math.floor(Math.random() * blogImages.length)];
            img.src = src;
            img.className = 'img-fluid rounded';
            img.alt = 'Student Blog Image';
            img.loading = 'lazy';
            imgContainer.appendChild(img);
            post.insertBefore(imgContainer, post.firstChild);
        }
    });
}
