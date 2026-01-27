const navbar = document.querySelector('.navbar');

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinkAnchors = document.querySelectorAll('.nav-links a');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinkAnchors.forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// Skill bar animation
// On mobile, a 0.5 threshold may never be reached (section isn't 50% visible),
// so progress bars stay at width: 0. Keep the trigger forgiving.
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillBars = entry.target.querySelectorAll('.skill-progress-fill');
            skillBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            });
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Education timeline animation
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const timelineItems = entry.target.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate');
                }, index * 200);
            });
        }
    });
}, { threshold: 0.2 });

const educationSection = document.querySelector('.education');
if (educationSection) {
    timelineObserver.observe(educationSection);
}

// EmailJS (lazy-loaded so it doesn't slow initial load)
const EMAILJS_PUBLIC_KEY = 'g4UUK3V4vY1rij9YI';
let emailJsLoadPromise;

async function loadEmailJs() {
    if (window.emailjs?.sendForm) {
        return window.emailjs;
    }

    if (!emailJsLoadPromise) {
        emailJsLoadPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.async = true;
            script.onload = () => resolve(window.emailjs);
            script.onerror = () => reject(new Error('Failed to load EmailJS'));
            document.head.appendChild(script);
        }).then((emailjs) => {
            if (emailjs && !emailjs.__portfolioInited) {
                emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
                emailjs.__portfolioInited = true;
            }
            return emailjs;
        });
    }

    return emailJsLoadPromise;
}

// Preload EmailJS shortly before user reaches contact section
const contactSection = document.querySelector('#contact');
if (contactSection && 'IntersectionObserver' in window) {
    const emailPrefetchObserver = new IntersectionObserver(
        (entries) => {
            if (entries.some(e => e.isIntersecting)) {
                loadEmailJs().catch(() => {});
                emailPrefetchObserver.disconnect();
            }
        },
        { rootMargin: '600px 0px' }
    );

    emailPrefetchObserver.observe(contactSection);
}

// Google Form fallback URL (Replace with your Google Form URL)
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSejGRYr-oZ5uWTuyIzxag2rLOjFp_LKZqHPilPxR_c2CTqrDQ/formResponse";

// Form submission with EmailJS and Google Form fallback
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Change button text
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Try EmailJS first
        try {
            const emailjs = await loadEmailJs();

            const response = await emailjs.sendForm(
                'service_kuidmrj',
                'template_tbin4ai',
                contactForm
            );
            
            console.log('SUCCESS!', response.status, response.text);
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Check if quota exceeded or other EmailJS error
            if (error.status === 402 || error.status === 429 || error.text?.includes('quota')) {
                console.log('EmailJS quota exceeded, using Google Form fallback...');
                submitToGoogleForm(contactForm);
            } else {
                // For other errors, still try Google Form
                console.log('EmailJS failed, trying Google Form fallback...');
                submitToGoogleForm(contactForm);
            }
        } finally {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Submit to Google Form as fallback
function submitToGoogleForm(form) {
    const formData = new FormData(form);
    const name = formData.get('from_name');
    const email = formData.get('from_email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Check if Google Form URL is configured
    if (!GOOGLE_FORM_URL || GOOGLE_FORM_URL === "YOUR_GOOGLE_FORM_URL_HERE") {
        showNotification(
            'Sorry, something went wrong. Please email directly at <a href="mailto:info@rajdeep.engineer">info@rajdeep.engineer</a>.',
            'error',
            true
        );
        return;
    }
    
    // Create Google Form submission URL with pre-filled data
    const googleFormSubmitURL = `${GOOGLE_FORM_URL}?` + 
        `entry.175039083=${encodeURIComponent(name)}&` +
        `entry.1972227466=${encodeURIComponent(email)}&` +
        `entry.46353101=${encodeURIComponent(subject)}&` +
        `entry.1705711033=${encodeURIComponent(message)}`;
    
    // Submit to Google Form
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'google-form-iframe';
    document.body.appendChild(iframe);
    
    const googleForm = document.createElement('form');
    googleForm.target = 'google-form-iframe';
    googleForm.method = 'POST';
    googleForm.action = GOOGLE_FORM_URL;
    
    // Add form fields
    ['from_name', 'from_email', 'subject', 'message'].forEach(fieldName => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = fieldName;
        input.value = formData.get(fieldName);
        googleForm.appendChild(input);
    });
    
    document.body.appendChild(googleForm);
    googleForm.submit();
    
    // Clean up and show notification
    setTimeout(() => {
        document.body.removeChild(googleForm);
        document.body.removeChild(iframe);
        showNotification('Message sent via backup system! I will get back to you soon.', 'success');
        form.reset();
    }, 1000);
}

// Show notification function
function showNotification(message, type, isHtml = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    if (isHtml) {
        notification.innerHTML = message;
    } else {
        notification.textContent = message;
    }

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;

    if (isHtml) {
        notification.querySelectorAll('a').forEach(a => {
            a.style.color = 'inherit';
            a.style.textDecoration = 'underline';
        });
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Achievements: click/keyboard toggle highlight
const achievementCards = document.querySelectorAll('.achievement-card');
if (achievementCards.length) {
    const clearActive = () => {
        achievementCards.forEach(card => card.classList.remove('is-active'));
    };

    const hasActive = () => Array.from(achievementCards).some(card => card.classList.contains('is-active'));

    achievementCards.forEach((card) => {
        card.addEventListener('click', () => {
            const willActivate = !card.classList.contains('is-active');
            clearActive();
            if (willActivate) card.classList.add('is-active');
        });

        card.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            const willActivate = !card.classList.contains('is-active');
            clearActive();
            if (willActivate) card.classList.add('is-active');
        });
    });

    // Click anywhere outside achievements cards to clear active highlight
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        if (target.closest('.achievement-card')) return;
        if (!hasActive()) return;
        clearActive();
    });

    // Escape clears active state (keyboard-friendly)
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!hasActive()) return;
        clearActive();
    });
}

// Scroll animations for sections
const fadeInElements = document.querySelectorAll('.about-content, .timeline-item, .project-card, .achievement-card');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(element);
});

// Scroll to top button
function createScrollTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.classList.add('scroll-top-btn');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-color);
        color: var(--primary-color);
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(button);
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
    return button;
}

const scrollTopButton = createScrollTopButton();

// Consolidated scroll handler (rAF-throttled + passive)
const sections = Array.from(document.querySelectorAll('section'));
const navLinksAll = Array.from(document.querySelectorAll('.nav-links a'));

let sectionTops = [];
let activeSectionId = '';

function updateSectionTops() {
    sectionTops = sections
        .map((section) => ({ id: section.getAttribute('id'), top: section.offsetTop }))
        .filter((s) => s.id);
}

function handleScroll() {
    const y = window.scrollY || 0;

    if (navbar) {
        navbar.classList.toggle('scrolled', y > 50);
    }

    if (scrollTopButton) {
        scrollTopButton.style.display = y > 300 ? 'flex' : 'none';
    }

    let current = '';
    for (let i = sectionTops.length - 1; i >= 0; i--) {
        if (y + 110 >= sectionTops[i].top) {
            current = sectionTops[i].id;
            break;
        }
    }

    if (current && current !== activeSectionId) {
        activeSectionId = current;
        navLinksAll.forEach((link) => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active', href.startsWith('#') && href.slice(1) === activeSectionId);
        });
    }
}

let scrollTicking = false;
function requestScrollTick() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        scrollTicking = false;
        handleScroll();
    });
}

updateSectionTops();
handleScroll();

window.addEventListener('scroll', requestScrollTick, { passive: true });
window.addEventListener('resize', () => {
    updateSectionTops();
    handleScroll();
}, { passive: true });

window.addEventListener('load', () => {
    updateSectionTops();
    handleScroll();
}, { once: true });
