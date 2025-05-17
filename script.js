// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Scroll animation functionality
    const scrollElements = document.querySelectorAll('.slide-in, .slide-in-left, .slide-in-right');
    
    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('appear');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('appear');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 85)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    // Initialize scroll animation check
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Mobile menu toggle functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (dropdownBtn && dropdownContent) {
        // Toggle dropdown with animation on button click
        dropdownBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            const isDisplayed = dropdownContent.style.display === 'block';
            
            // Toggle menu icon animation if it exists
            if (menuIcon) {
                if (isDisplayed) {
                    menuIcon.classList.remove('active');
                } else {
                    menuIcon.classList.add('active');
                }
            }
            
            dropdownContent.style.display = isDisplayed ? 'none' : 'block';
        });
        
        // Close dropdown when clicking a link
        const dropdownLinks = dropdownContent.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Check for mobile view
                if (window.innerWidth < 992) {
                    setTimeout(() => {
                        dropdownContent.style.display = 'none';
                        if (menuIcon) menuIcon.classList.remove('active');
                    }, 100);
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.matches('.dropdown-btn') && !dropdownContent.contains(event.target)) {
                dropdownContent.style.display = 'none';
                if (menuIcon) menuIcon.classList.remove('active');
            }
        });
    }
    
    // Handle window resize to fix mobile/desktop menu transitions
    window.addEventListener('resize', function() {
        if (dropdownContent) {
            // For mobile-desktop transitions, reset style but don't hide dropdown
            if (window.innerWidth >= 992) {
                // Don't reset display property on desktop - allow hover to control it
                if (menuIcon) menuIcon.classList.remove('active');
            } else {
                // On mobile, hide the dropdown when resizing down
                dropdownContent.style.display = 'none';
                if (menuIcon) menuIcon.classList.remove('active');
            }
        }
    });
    
    const expandButtons = document.querySelectorAll('.btn-expand');

    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentSection = this.closest('.content-expandable');
            contentSection.classList.toggle('content-expanded');

            if (contentSection.classList.contains('content-expanded')) {
                this.textContent = 'Read Less';
            } else {
                this.textContent = 'Read More';
            }
        });
    });   
    
    // Handle mentor expand/collapse buttons
    const mentorExpandButtons = document.querySelectorAll('.mentor-expand');
    
    mentorExpandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mentorInfo = this.closest('.mentor-info');
            const detailsDiv = mentorInfo.querySelector('.mentor-details');
            
            // Toggle expanded class on the mentor info
            mentorInfo.classList.toggle('mentor-expanded');
            
            if (mentorInfo.classList.contains('mentor-expanded')) {
                this.textContent = 'Read Less';
                detailsDiv.style.maxHeight = detailsDiv.scrollHeight + 'px';
                detailsDiv.style.opacity = '1';
            } else {
                this.textContent = 'Read More';
                detailsDiv.style.maxHeight = '0';
                detailsDiv.style.opacity = '0';
            }
        });
    });
    
    // Banner text rotation
    const bannerTexts = document.querySelectorAll(".banner-text");
    let currentTextIndex = 0;
    
    function rotateBannerText() {
        // Hide all texts
        bannerTexts.forEach(text => {
            text.style.opacity = "0";
            text.style.zIndex = "1";
        });
        
        // Show current text
        bannerTexts[currentTextIndex].style.opacity = "1";
        bannerTexts[currentTextIndex].style.zIndex = "2";
        
        // Increment index for next rotation
        currentTextIndex = (currentTextIndex + 1) % bannerTexts.length;
    }
    
    // Initialize banner text rotation
    if (bannerTexts.length > 0) {
        // Set initial state - first text visible, others hidden
        bannerTexts.forEach((text, i) => {
            if (i === 0) {
                text.style.opacity = "1";
                text.style.zIndex = "2";
            } else {
                text.style.opacity = "0";
                text.style.zIndex = "1";
            }
        });
        
        // Start rotation after 3 seconds
        setInterval(rotateBannerText, 5000); // Increased to 5 seconds for longer quotes
    }    
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 60; // Adjust based on header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Updated Services Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(document.querySelectorAll('.service-card'));
    const dots = Array.from(document.querySelectorAll('.carousel-dots .dot'));
    const nextButton = document.querySelector('.next-arrow');
    const prevButton = document.querySelector('.prev-arrow');
    
    if (!track || !nextButton || !prevButton) return;
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
    let autoplayInterval;
    let isPaused = false;
    
    // Function to update carousel on window resize
    function updateCarouselDimensions() {
        cardWidth = cards[0].offsetWidth + parseInt(window.getComputedStyle(cards[0]).marginLeft) * 2;
        goToSlide(currentIndex);
    }
    
    // Initialize carousel
    function initCarousel() {
        updateCarouselDimensions();
        
        // Highlight the active card
        updateActiveCard();
        
        // Event listeners for controls
        nextButton.addEventListener('click', function() {
            pauseAutoplay();
            nextSlide();
        });
        
        prevButton.addEventListener('click', function() {
            pauseAutoplay();
            prevSlide();
        });
        
        // Event listeners for dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                pauseAutoplay();
                const slideIndex = parseInt(this.getAttribute('data-index'));
                goToSlide(slideIndex);
            });
        });
        
        // Listen for window resize
        window.addEventListener('resize', function() {
            updateCarouselDimensions();
        });
        
        // Start autoplay
        startAutoplay();
        
        // Pause autoplay on hover
        track.addEventListener('mouseenter', pauseAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
    }
    
    function updateActiveCard() {
        // Remove active class from all cards
        cards.forEach(card => card.classList.remove('active'));
        // Add active class to current card
        cards[currentIndex].classList.add('active');
    }
    
    function goToSlide(index) {
        // Handle looping for index
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        
        currentIndex = index;
        
        // Update track position
        track.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
        
        // Update active card
        updateActiveCard();
        
        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    function startAutoplay() {
        if (!isPaused) {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(function() {
                nextSlide();
            }, 1000); // Auto slide every 2 seconds
        }
    }
    
    function pauseAutoplay() {
        isPaused = true;
        clearInterval(autoplayInterval);
        
        // Resume autoplay after 5 seconds of inactivity
        setTimeout(function() {
            isPaused = false;
            startAutoplay();
        }, 3000);
    }
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        pauseAutoplay();
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left, go next
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right, go prev
            prevSlide();
        }
    }
    
    // Initialize the carousel
    initCarousel();
});