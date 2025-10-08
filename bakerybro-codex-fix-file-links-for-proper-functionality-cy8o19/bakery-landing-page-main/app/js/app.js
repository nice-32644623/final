document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('has-js');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let motionEnabled = !reduce.matches;
    reduce.addEventListener('change', event => {
        motionEnabled = !event.matches;
    });
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
            const threshold = typeof opts.wheelThreshold === 'number' ? Math.max(opts.wheelThreshold, 0) : 24;
            const handleWheel = e => {
                if (swiper.animating) return;
                const delta = e.deltaY;
                if (Math.abs(delta) < threshold) return;
                if (delta > 0 && !swiper.isEnd) {
                    e.preventDefault();
                    swiper.slideNext();
                } else if (delta < 0 && !swiper.isBeginning) {
                    e.preventDefault();
                    swiper.slidePrev();
                }
            };
            el.addEventListener('wheel', handleWheel, { passive: false });
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

    const pointerFine = window.matchMedia('(pointer: fine)');
    let ring = null;
    let ringVisible = false;
    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScale = 1;
    let currentScale = 1;
    let rafId = 0;

    const handleMouseMove = event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (ring && !ringVisible) {
            ring.style.opacity = '1';
            ringVisible = true;
        }
    };

    const handleMouseLeave = () => {
        ringVisible = false;
        if (ring) {
            ring.style.opacity = '0';
        }
    };

    const handleMouseDown = () => {
        if (!ring) return;
        targetScale = 0.8;
    };

    const handleMouseUp = () => {
        if (!ring) return;
        targetScale = 1;
    };

    const renderCursor = () => {
        if (!ring) return;
        if (!motionEnabled) {
            ringX = mouseX;
            ringY = mouseY;
            currentScale = targetScale;
        } else {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            currentScale += (targetScale - currentScale) * 0.24;
        }
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${currentScale})`;
        rafId = requestAnimationFrame(renderCursor);
    };

    const attachCursor = () => {
        if (!pointerFine.matches || ring) return;
        ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(ring);
        document.body.classList.add('has-cursor');

        ringX = mouseX = window.innerWidth / 2;
        ringY = mouseY = window.innerHeight / 2;
        currentScale = targetScale = 1;
        ringVisible = false;
        ring.style.opacity = '0';

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(renderCursor);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseLeave);
    };

    const detachCursor = () => {
        if (!ring) return;
        cancelAnimationFrame(rafId);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
        ring.remove();
        ring = null;
        ringVisible = false;
        document.body.classList.remove('has-cursor');
    };

    if (pointerFine.matches) {
        attachCursor();
    }

    pointerFine.addEventListener('change', event => {
        if (event.matches) {
            attachCursor();
        } else {
            detachCursor();
        }
    });

    document.querySelectorAll('a, button, .js-magnetic').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!ring) return;
            targetScale = motionEnabled ? 1.35 : 1.1;
        });
        el.addEventListener('mouseleave', () => {
            if (!ring) return;
            targetScale = 1;
        });
    });

    const magneticEls = document.querySelectorAll('.js-magnetic');
    magneticEls.forEach(el => {
        const strength = 6;
        el.addEventListener('mousemove', e => {
            if (reduce.matches) return;
            const rect = el.getBoundingClientRect();
            const offsetX = ((e.clientX - rect.left) - rect.width / 2) / strength;
            const offsetY = ((e.clientY - rect.top) - rect.height / 2) / strength;
            el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
        el.addEventListener('touchend', () => {
            el.style.transform = '';
        }, { passive: true });
    });

    reduce.addEventListener('change', event => {
        targetScale = 1;
        if (event.matches) {
            magneticEls.forEach(el => {
                el.style.transform = '';
            });
        }
    });

    const revealEls = document.querySelectorAll('[data-reveal]');
    if (motionEnabled) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -10%' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-inview'));
    }

    reduce.addEventListener('change', event => {
        if (event.matches) {
            revealEls.forEach(el => el.classList.add('is-inview'));
        }
    });

    const depthEls = document.querySelectorAll('[data-depth]');
    if (depthEls.length) {
        let latestY = window.scrollY;
        let ticking = false;
        const update = () => {
            if (!motionEnabled) {
                depthEls.forEach(el => {
                    el.style.transform = '';
                });
            } else {
                depthEls.forEach(el => {
                    const d = parseFloat(el.dataset.depth || '0');
                    el.style.transform = `translate3d(0, ${latestY * d}px, 0)`;
                });
            }
            ticking = false;
        };
        const onScroll = () => {
            if (!motionEnabled) return;
            latestY = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        reduce.addEventListener('change', () => {
            latestY = window.scrollY;
            update();
        });
    }

    const filterNav = document.querySelector('[data-filter-nav]');
    const filterLinks = filterNav ? Array.from(filterNav.querySelectorAll('[data-filter]')) : [];
    const menuGrid = document.querySelector('[data-menu-grid]');
    const menuItems = menuGrid ? Array.from(menuGrid.querySelectorAll('[data-menu-item]')) : [];

    const applyFilter = (value, { updateHash = true } = {}) => {
        if (!filterLinks.length || !menuItems.length) return;
        const normalized = value && value !== '' ? value : 'all';

        filterLinks.forEach(link => {
            const active = link.dataset.filter === normalized;
            link.classList.toggle('is-active', active);
            link.setAttribute('aria-current', active ? 'true' : 'false');
        });

        menuItems.forEach(item => {
            const tags = (item.dataset.tags || '').split(' ');
            const matches = normalized === 'all' || tags.includes(normalized);
            item.hidden = !matches;
        });

        if (menuGrid) {
            menuGrid.setAttribute('data-active-filter', normalized);
        }

        if (updateHash) {
            const hash = `#filter-${normalized}`;
            if (history.replaceState) {
                history.replaceState(null, '', hash);
            } else {
                window.location.hash = hash;
            }
        }
    };

    const filterFromHash = () => {
        const hash = window.location.hash;
        const match = hash.match(/^#filter-([a-z-]+)$/i);
        return match ? match[1].toLowerCase() : 'all';
    };

    if (filterLinks.length && menuItems.length) {
        filterLinks.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                applyFilter(link.dataset.filter || 'all');
            });
        });

        applyFilter(filterFromHash(), { updateHash: false });

        window.addEventListener('hashchange', () => {
            applyFilter(filterFromHash(), { updateHash: false });
        });
    }

    if (reduce.matches) {
        revealEls.forEach(el => el.classList.add('is-inview'));
    }
});
