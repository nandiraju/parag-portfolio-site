/* UI/UX Pro Max - Advanced Interactive Engine */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Custom Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursorGlow, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Hover Effect for interactive elements
        const target = e.target;
        if (target.closest('a') || target.closest('button') || target.closest('.glass')) {
            gsap.to(cursorGlow, {
                width: 600,
                height: 600,
                backgroundColor: 'rgba(0, 242, 255, 0.12)',
                duration: 0.4
            });
        } else {
            gsap.to(cursorGlow, {
                width: 400,
                height: 400,
                backgroundColor: 'rgba(0, 242, 255, 0.08)',
                duration: 0.4
            });
        }
    });

    // 3. Three.js Background (Digital Connectivity Mesh)
    const initThree = () => {
        const canvas = document.querySelector('#bg-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesCount = 2000;
        const positions = new Float32Array(particlesCount * 3);
        const geometry = new THREE.BufferGeometry();

        for(let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            size: 0.015,
            color: 0x00f2ff,
            transparent: true,
            opacity: 0.5
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        camera.position.z = 5;

        // Mouse Move Effect on Particles
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            points.rotation.y += 0.001;
            points.rotation.x += 0.0005;

            // Subtle mouse following
            gsap.to(points.rotation, {
                x: mouseY * 0.2,
                y: mouseX * 0.2,
                duration: 2,
                ease: 'power2.out'
            });

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    initThree();

    // 4. GSAP Orchestration (Entrance Animations)
    gsap.registerPlugin(ScrollTrigger);

    // Hero Staggered Entrance
    const heroTl = gsap.timeline();
    heroTl.to('.hero .reveal', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 0.5
    });

    // Scroll Reveal for Sections
    document.querySelectorAll('.container .reveal').forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // 5. Magnetic Buttons
    document.querySelectorAll('.magnetic').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });

            const span = btn.querySelector('span') || btn.querySelector('i');
            if (span) {
                gsap.to(span, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            const span = btn.querySelector('span') || btn.querySelector('i');
            if (span) gsap.to(span, { x: 0, y: 0, duration: 0.5 });
        });
    });

    // 6. Interactive 3D Tilt (Optimized GSAP listener)
    document.querySelectorAll('[data-tilt]').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5 });
        });
    });

    // 7. Navbar Indicator & Active Link Tracking
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');

    const updateIndicator = (activeLink) => {
        if (!activeLink) return;
        const rect = activeLink.getBoundingClientRect();
        const navRect = document.querySelector('.nav-links').getBoundingClientRect();
        
        gsap.to(navIndicator, {
            left: rect.left - navRect.left,
            width: rect.width,
            duration: 0.4,
            ease: 'power3.out'
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateIndicator(link);
        });
    });

    // Initial position
    updateIndicator(document.querySelector('.nav-links a.active'));

    // 8. Theme Switching (Ultra Smooth)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        // Load preference
        const savedTheme = localStorage.getItem('theme') || 'dark';
        body.setAttribute('data-theme', savedTheme);
        updateToggleIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Create transition flash effect
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.inset = '0';
            flash.style.background = newTheme === 'light' ? '#fff' : '#000';
            flash.style.zIndex = '99999';
            flash.style.opacity = '0';
            document.body.appendChild(flash);

            gsap.to(flash, {
                opacity: 0.2,
                duration: 0.4,
                onComplete: () => {
                    body.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                    updateToggleIcon(newTheme);
                    gsap.to(flash, {
                        opacity: 0,
                        duration: 0.4,
                        onComplete: () => flash.remove()
                    });
                }
            });
        });
    }

    function updateToggleIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;
        toggleBtn.innerHTML = theme === 'light' ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Scroll Tracking for Active Nav
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section, header');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
                updateIndicator(link);
            }
        });

        // Navbar opacity on scroll
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            gsap.to(nav, { backgroundColor: 'rgba(2, 4, 8, 0.8)', duration: 0.4 });
        } else {
            gsap.to(nav, { backgroundColor: 'transparent', duration: 0.4 });
        }
    });
});
