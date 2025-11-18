// Main JavaScript for Extreme Heat & AI Disaster Prevention Research Website

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollAnimations();
    initTemperatureChart();
    initP5Background();
    initSmoothScrolling();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger animation for cards
                if (entry.target.classList.contains('card-hover')) {
                    const cards = entry.target.parentElement.querySelectorAll('.card-hover');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animationDelay = `${index * 0.2}s`;
                        }, 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animate-fade-in class
    document.querySelectorAll('.animate-fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Temperature Chart using ECharts
function initTemperatureChart() {
    const chartElement = document.getElementById('temperature-chart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        title: {
            text: '温度对比分析',
            left: 'center',
            textStyle: {
                color: '#1e293b',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function(params) {
                let result = `<strong>${params[0].axisValue}</strong><br/>`;
                params.forEach(param => {
                    result += `${param.seriesName}: ${param.value}°C<br/>`;
                });
                return result;
            }
        },
        legend: {
            data: ['天气预报温度', '地表温度', '体感温度'],
            bottom: 10,
            textStyle: {
                color: '#64748b'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
            axisLine: {
                lineStyle: {
                    color: '#cbd5e1'
                }
            },
            axisLabel: {
                color: '#64748b'
            }
        },
        yAxis: {
            type: 'value',
            name: '温度 (°C)',
            nameTextStyle: {
                color: '#64748b'
            },
            axisLine: {
                lineStyle: {
                    color: '#cbd5e1'
                }
            },
            axisLabel: {
                color: '#64748b'
            },
            splitLine: {
                lineStyle: {
                    color: '#f1f5f9'
                }
            }
        },
        series: [
            {
                name: '天气预报温度',
                type: 'line',
                data: [22, 24, 28, 32, 34, 33, 30, 27],
                smooth: true,
                lineStyle: {
                    color: '#3b82f6',
                    width: 3
                },
                itemStyle: {
                    color: '#3b82f6'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(59, 130, 246, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(59, 130, 246, 0.05)'
                        }]
                    }
                }
            },
            {
                name: '地表温度',
                type: 'line',
                data: [20, 26, 35, 45, 52, 48, 40, 32],
                smooth: true,
                lineStyle: {
                    color: '#f97316',
                    width: 3
                },
                itemStyle: {
                    color: '#f97316'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(249, 115, 22, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(249, 115, 22, 0.05)'
                        }]
                    }
                }
            },
            {
                name: '体感温度',
                type: 'line',
                data: [24, 28, 33, 39, 43, 41, 36, 31],
                smooth: true,
                lineStyle: {
                    color: '#059669',
                    width: 3,
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#059669'
                }
            }
        ],
        animation: true,
        animationDuration: 2000,
        animationEasing: 'cubicOut'
    };
    
    chart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// P5.js Background Animation
function initP5Background() {
    const container = document.getElementById('p5-container');
    if (!container) return;
    
    new p5(function(p) {
        let particles = [];
        let time = 0;
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('p5-container');
            canvas.id('p5-canvas');
            
            // Create particles
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    size: p.random(2, 6),
                    speedX: p.random(-0.5, 0.5),
                    speedY: p.random(-0.5, 0.5),
                    opacity: p.random(0.3, 0.8)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            time += 0.01;
            
            // Draw flowing background
            for (let x = 0; x < p.width; x += 50) {
                for (let y = 0; y < p.height; y += 50) {
                    let wave = p.sin(x * 0.01 + y * 0.01 + time) * 20;
                    let alpha = p.map(wave, -20, 20, 0.1, 0.3);
                    
                    p.fill(59, 130, 246, alpha * 255);
                    p.noStroke();
                    p.ellipse(x, y + wave, 30, 30);
                }
            }
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw particle
                p.fill(255, 255, 255, particle.opacity * 255);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// Smooth Scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('shadow-lg');
    } else {
        nav.classList.remove('shadow-lg');
    }
});

// Utility function for animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);

// Loading animation for page elements
function initPageLoadAnimations() {
    // Animate hero elements
    anime({
        targets: '.animate-fade-in',
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(200),
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    // Animate cards with stagger
    anime({
        targets: '.card-hover',
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: anime.stagger(100, {start: 500}),
        duration: 600,
        easing: 'easeOutBack'
    });
}

// Initialize page load animations when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageLoadAnimations);
} else {
    initPageLoadAnimations();
}

// Handle form submissions (if any forms are added)
function handleFormSubmission(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('表单提交成功！', 'success');
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    }[type] || 'bg-blue-500';
    
    notification.className += ` ${bgColor} text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize all forms
function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(handleFormSubmission);
}

// Call form initialization
document.addEventListener('DOMContentLoaded', initForms);