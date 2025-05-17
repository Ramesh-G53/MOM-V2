// Common.js - Shared slideshow functionality for all service pages
document.addEventListener('DOMContentLoaded', function() {
    const slideshow = document.getElementById('slideshow');
    const slides = slideshow.querySelectorAll('.slide');
    const prevButton = slideshow.querySelector('.prev');
    const nextButton = slideshow.querySelector('.next');
    
    if (!slideshow || slides.length === 0) return;
    
    let currentSlideIndex = 0;
    let autoplayTimer;
    let isUserInteracting = false;
    let userInteractionTimeout;
    
    // Initialize slideshow
    function initSlideshow() {
        showSlide(currentSlideIndex);
        startAutoplay();
        
        // Add event listeners
        prevButton.addEventListener('click', function() {
            handleUserInteraction();
            previousSlide();
        });
        
        nextButton.addEventListener('click', function() {
            handleUserInteraction();
            nextSlide();
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slideshow.addEventListener('touchstart', function(e) {
            handleUserInteraction();
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        slideshow.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        // Pause autoplay on mouse enter, resume on mouse leave
        slideshow.addEventListener('mouseenter', function() {
            handleUserInteraction();
        });
        
        slideshow.addEventListener('mouseleave', function() {
            resumeAutoplayAfterDelay();
        });
    }
    
    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show current slide
        slides[index].classList.add('active');
    }
    
    // Go to next slide
    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }
    
    // Go to previous slide
    function previousSlide() {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    }
    
    // Handle swipe gestures
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous slide
                previousSlide();
            } else {
                // Swipe left - go to next slide
                nextSlide();
            }
        }
    }
    
    // Start autoplay
    function startAutoplay() {
        if (!isUserInteracting) {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(function() {
                if (!isUserInteracting) {
                    nextSlide();
                }
            }, 3000); // Auto-advance every 3 seconds
        }
    }
    
    // Stop autoplay
    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }
    
    // Handle user interaction
    function handleUserInteraction() {
        isUserInteracting = true;
        stopAutoplay();
        
        // Clear any existing timeout
        clearTimeout(userInteractionTimeout);
    }
    
    // Resume autoplay after user inactivity
    function resumeAutoplayAfterDelay() {
        clearTimeout(userInteractionTimeout);
        userInteractionTimeout = setTimeout(function() {
            isUserInteracting = false;
            startAutoplay();
        }, 3000); // Resume autoplay after 3 seconds of inactivity
    }
    
    // Make functions globally accessible for onclick handlers
    window.changeSlide = function(direction) {
        handleUserInteraction();
        if (direction === 1) {
            nextSlide();
        } else {
            previousSlide();
        }
        resumeAutoplayAfterDelay();
    };
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Ensure current slide is still visible after resize
        showSlide(currentSlideIndex);
    });
    
    // Handle page visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoplay();
        } else {
            if (!isUserInteracting) {
                startAutoplay();
            }
        }
    });
    
    // Initialize the slideshow
    initSlideshow();
});

// Smooth scroll functionality for "View Other Programs" button
document.addEventListener('DOMContentLoaded', function() {
    // Find all links that point to #footer
    const footerLinks = document.querySelectorAll('a[href="#footer"]');
    
    // Add click event to each footer link
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target footer element
            const footer = document.getElementById('footer');
            
            // If footer exists, scroll to it smoothly
            if (footer) {
                footer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});