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
        "https://source.unsplash.com/1200x800/?student",
        "https://source.unsplash.com/1200x800/?study",
        "https://source.unsplash.com/1200x800/?books",
        "https://source.unsplash.com/1200x800/?library",
        "https://source.unsplash.com/1200x800/?notes",
        "https://source.unsplash.com/1200x800/?learning"
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
            imgContainer.appendChild(img);
            post.insertBefore(imgContainer, post.firstChild);
        }
    });
}
