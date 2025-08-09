// Custom cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-glow');
    if (cursor) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    }
});

// Typing animation for code window
const codeSnippets = [
    `# Claude Code: Your AI Pair Programmer
def solve_problem(task):
    """Let Claude Code handle the heavy lifting"""
    analysis = analyze_requirements(task)
    solution = generate_optimal_code(analysis)
    tests = create_comprehensive_tests(solution)
    return deploy_with_confidence(solution, tests)`,
    
    `// Building the future of development
async function developWithClaude() {
    const idea = await getYourIdea();
    const code = await claude.generateCode(idea);
    const optimized = await claude.optimize(code);
    return ship(optimized); // It's that simple!
}`,
    
    `// Real-time collaboration
import { ClaudeCode } from '@anthropic/claude-code';

const assistant = new ClaudeCode({
    mode: 'pair-programming',
    intelligence: 'maximum',
    speed: 'lightning-fast'
});

assistant.on('code-suggestion', implement);
assistant.on('bug-detected', autoFix);
assistant.on('performance-issue', optimize);`
];

let currentSnippet = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 50;

function typeCode() {
    const element = document.querySelector('.typing-animation');
    if (!element) return;

    const currentText = codeSnippets[currentSnippet];
    
    if (!isDeleting) {
        element.textContent = currentText.substring(0, charIndex);
        charIndex++;
        
        if (charIndex > currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause before deleting
        } else {
            typingSpeed = 50;
        }
    } else {
        element.textContent = currentText.substring(0, charIndex);
        charIndex--;
        
        if (charIndex === 0) {
            isDeleting = false;
            currentSnippet = (currentSnippet + 1) % codeSnippets.length;
            typingSpeed = 500; // Pause before typing next
        } else {
            typingSpeed = 30;
        }
    }
    
    setTimeout(typeCode, typingSpeed);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeCode, 1000);
});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Number counter animation
const animateNumbers = () => {
    const numbers = document.querySelectorAll('.stat-number');
    
    numbers.forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateNumber = () => {
            current += increment;
            if (current < target) {
                number.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateNumber);
            } else {
                number.textContent = target.toLocaleString();
                if (number.textContent.includes('99')) {
                    number.textContent = '99%';
                }
            }
        };
        
        updateNumber();
    });
};

// Intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stats')) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    const stats = document.querySelector('.stats');
    if (stats) {
        observer.observe(stats);
    }
});

// Tab functionality for demo section
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const activeContent = document.getElementById(tabName);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
});

// Parallax effect for floating elements
document.addEventListener('mousemove', (e) => {
    const floatingElements = document.querySelectorAll('.float-element');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 20;
        const xPos = (x - 0.5) * speed;
        const yPos = (y - 0.5) * speed;
        
        element.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
});

// Add hover effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});


// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Scroll animations for navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(15, 15, 30, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 15, 30, 0.8)';
    }
    
    lastScroll = currentScroll;
});

// CTA button click handlers
document.querySelectorAll('.primary-btn, .mega-cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Create particle effect
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            const rect = btn.getBoundingClientRect();
            particle.style.left = rect.left + rect.width / 2 + 'px';
            particle.style.top = rect.top + rect.height / 2 + 'px';
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 5 + Math.random() * 5;
            const lifetime = 1000 + Math.random() * 1000;
            
            let x = 0;
            let y = 0;
            let opacity = 1;
            
            const animate = () => {
                x += Math.cos(angle) * velocity;
                y += Math.sin(angle) * velocity;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
        
        // Simulated action
        console.log('Starting Claude Code journey...');
    });
});

// Console Easter egg
console.log('%c🚀 Welcome to Claude Code!', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 10px 20px; border-radius: 10px;');
console.log('%c💡 Curious about how this was built? Claude Code helped create this entire page!', 'font-size: 14px; color: #6366f1;');
console.log('%c🎯 Ready to code at the speed of thought? Visit https://claude.ai/code', 'font-size: 14px; color: #a855f7;');