// Motivational Quotes System

// Array of motivational quotes
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
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" }
];

// Function to get a random quote
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Function to display a quote in a specified element
function displayQuote(elementId) {
    const quoteElement = document.getElementById(elementId);
    if (!quoteElement) return;
    
    const quote = getRandomQuote();
    quoteElement.textContent = quote.text;
    
    // If there's an author element (with the same ID + 'Author')
    const authorElement = document.getElementById(elementId + 'Author');
    if (authorElement) {
        authorElement.textContent = `- ${quote.author}`;
    }
}

// Function to initialize quotes on the page
function initQuotes() {
    // Find all elements with the 'quote-display' class
    const quoteElements = document.querySelectorAll('.quote-display');
    
    // Display a different quote in each element
    quoteElements.forEach(element => {
        const quote = getRandomQuote();
        element.textContent = quote.text;
        
        // If there's a sibling with 'quote-author' class
        const authorElement = element.nextElementSibling;
        if (authorElement && authorElement.classList.contains('quote-author')) {
            authorElement.textContent = `- ${quote.author}`;
        }
    });
}

// Function to change quotes periodically
function startQuoteRotation(elementId, intervalMinutes = 5) {
    // Initial display
    displayQuote(elementId);
    
    // Set interval to change quote
    setInterval(() => {
        displayQuote(elementId);
    }, intervalMinutes * 60 * 1000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all quote elements
    initQuotes();
    
    // Start rotation for specific elements if needed
    const rotatingQuoteElement = document.getElementById('motivationalQuote');
    if (rotatingQuoteElement) {
        startQuoteRotation('motivationalQuote', 3);
    }
});