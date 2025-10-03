document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('has-js');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('header');
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.mobile-overlay');

    const updateSnap = () => {
        if (window.innerWidth >= 768) {
            document.body.classList.add('snap-enabled');
        } else {
            document.body.classList.remove('snap-enabled');
        }
    };
    updateSnap();
    window.addEventListener('resize', updateSnap);

    const closeNav = () => {
        nav?.classList.remove('active');
        overlay?.classList.remove('active');
        header?.classList.remove('active');
        document.body.classList.remove('nav-open');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (toggle && nav) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Toggle navigation');
        toggle.addEventListener('click', () => {
            const isActive = nav.classList.toggle('active');
            overlay?.classList.toggle('active', isActive);
            header?.classList.toggle('active', isActive);
            document.body.classList.toggle('nav-open', isActive);
            toggle.setAttribute('aria-expanded', String(isActive));
        });
    }

    overlay?.addEventListener('click', closeNav);
    nav?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }
    }, { passive: true });

    if (window.Swiper) {
        const wheelify = (selector, opts = {}) => {
            const el = document.querySelector(selector);
            if (!el) return null;
            const swiper = new Swiper(el, opts);
            el.addEventListener('wheel', e => {
                if (!e.target.closest('.swiper-container-disabled')) {
                    if (e.deltaY > 0 && !swiper.isEnd) {
                        e.preventDefault();
                        swiper.slideNext();
                    } else if (e.deltaY < 0 && !swiper.isBeginning) {
                        e.preventDefault();
                        swiper.slidePrev();
                    }
                }
            }, { passive: false });
            return swiper;
        };

        wheelify('.hero-swiper', {
            speed: 820,
            mousewheel: { forceToAxis: true, releaseOnEdges: true },
            watchSlidesProgress: true,
            pagination: { el: '.hero-pagination', clickable: true }
        });

        wheelify('.products-swiper', {
            speed: 700,
            mousewheel: { forceToAxis: true, releaseOnEdges: true },
            pagination: { el: '.products-pagination', clickable: true },
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
                600: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });

        wheelify('.menu-swiper', {
            speed: 720,
            mousewheel: { forceToAxis: true, releaseOnEdges: true },
            pagination: { el: '.menu-pagination', clickable: true },
            slidesPerView: 1,
            spaceBetween: 24,
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }

    if (!reduce.matches) {
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(ring);

        let ringX = window.innerWidth / 2;
        let ringY = window.innerHeight / 2;
        let mouseX = ringX;
        let mouseY = ringY;
        let targetScale = 1;
        let currentScale = 1;
        let visible = false;

        const render = () => {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            currentScale += (targetScale - currentScale) * 0.2;
            ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${currentScale})`;
            requestAnimationFrame(render);
        };
        render();

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!visible) {
                ring.style.opacity = '1';
                visible = true;
            }
        });

        document.addEventListener('mousedown', () => { targetScale = 0.75; });
        document.addEventListener('mouseup', () => { targetScale = 1; });

        document.querySelectorAll('a, button, .js-magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => { targetScale = 1.4; });
            el.addEventListener('mouseleave', () => { targetScale = 1; });
        });

        document.querySelectorAll('.js-magnetic').forEach(el => {
            const strength = 5;
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const offsetX = ((e.clientX - rect.left) - rect.width / 2) / strength;
                const offsetY = ((e.clientY - rect.top) - rect.height / 2) / strength;
                el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });

        const revealEls = document.querySelectorAll('[data-reveal]');
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10%' });
        revealEls.forEach(el => io.observe(el));

        const depthEls = document.querySelectorAll('[data-depth]');
        if (depthEls.length) {
            let latestY = window.scrollY;
            let ticking = false;
            const update = () => {
                depthEls.forEach(el => {
                    const d = parseFloat(el.dataset.depth || '0');
                    el.style.transform = `translate3d(0, ${latestY * d}px, 0)`;
                });
                ticking = false;
            };
            const onScroll = () => {
                latestY = window.scrollY;
                if (!ticking) {
                    requestAnimationFrame(update);
                    ticking = true;
                }
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            update();
        }
    } else {
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-inview'));
    }
});
