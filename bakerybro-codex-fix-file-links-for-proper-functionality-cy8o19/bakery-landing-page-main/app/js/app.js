document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.mobile-overlay');
    const header = document.querySelector('header');

    if (toggle) {
        toggle.addEventListener('click', () => {
            if (nav) nav.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            if (header) header.classList.toggle('active');
        });
    }

    const heroSwiperEl = document.querySelector('.hero-swiper');
    let heroSwiper;
    if (heroSwiperEl && window.Swiper) {
        heroSwiper = new Swiper('.hero-swiper', {
            direction: 'horizontal',
            loop: false,
            slidesPerView: 3,
            centeredSlides: true,
            initialSlide: 1,
            speed: 500,
            pagination: {
                el: '.hero-pagination',
                type: 'bullets',
                clickable: true
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    centeredSlides: false
                },
                600: {
                    slidesPerView: 3,
                    centeredSlides: true
                }
            }
        });
    }

    const productsSwiperEl = document.querySelector('.products-swiper');
    let productsSwiper;
    if (productsSwiperEl && window.Swiper) {
        productsSwiper = new Swiper('.products-swiper', {
            direction: 'horizontal',
            loop: false,
            pagination: {
                el: '.products-pagination',
                type: 'bullets',
                clickable: true
            }
        });
    }

    const menuSwiperEl = document.querySelector('.menu-swiper');
    let menuSwiper;
    if (menuSwiperEl && window.Swiper) {
        menuSwiper = new Swiper('.menu-swiper', {
            direction: 'horizontal',
            loop: false,
            slidesPerView: 1,
            centeredSlides: true,
            pagination: {
                el: '.menu-pagination',
                type: 'bullets',
                clickable: true
            }
        });

        menuSwiperEl.addEventListener('wheel', (e) => {
            if (e.deltaY > 0 && !menuSwiper.isEnd) {
                e.preventDefault();
                menuSwiper.slideNext();
            } else if (e.deltaY < 0 && !menuSwiper.isBeginning) {
                e.preventDefault();
                menuSwiper.slidePrev();
            }
        }, { passive: false });
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            heroSection.querySelectorAll('.btn').forEach(btn => {
                const speed = btn.getAttribute('data-speed');
                const percent = 300;
                const x = (window.innerWidth - e.pageX * speed) / percent;
                const y = (window.innerHeight - e.pageY * speed) / percent;
                btn.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });
    }

    const sections = Array.from(document.querySelectorAll('.snap-section'));
    if (sections.length) {
        let activeSection = 0;
        let isScrollingSection = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeSection = sections.indexOf(entry.target);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));

        const htmlEl = document.documentElement;

        const scrollToSection = (target) => {
            htmlEl.style.scrollSnapType = 'none';
            target.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                htmlEl.style.scrollSnapType = '';
                isScrollingSection = false;
            }, 700);
        };

        window.addEventListener('wheel', (e) => {
            if (isScrollingSection) return;

            // Handle hero swiper in first section
            if (activeSection === 0 && heroSwiper) {
                if (e.deltaY > 0 && !heroSwiper.isEnd) {
                    e.preventDefault();
                    heroSwiper.slideNext();
                    return;
                } else if (e.deltaY < 0 && !heroSwiper.isBeginning) {
                    e.preventDefault();
                    heroSwiper.slidePrev();
                    return;
                }
            }

            // Handle products swiper in second section
            if (activeSection === 1 && productsSwiper) {
                if (e.deltaY > 0 && !productsSwiper.isEnd) {
                    e.preventDefault();
                    productsSwiper.slideNext();
                    return;
                } else if (e.deltaY < 0 && !productsSwiper.isBeginning) {
                    e.preventDefault();
                    productsSwiper.slidePrev();
                    return;
                }
            }

            if (e.deltaY > 0 && activeSection < sections.length - 1) {
                e.preventDefault();
                isScrollingSection = true;
                scrollToSection(sections[activeSection + 1]);
            } else if (e.deltaY < 0 && activeSection > 0) {
                e.preventDefault();
                isScrollingSection = true;
                scrollToSection(sections[activeSection - 1]);
            }
        }, { passive: false });
    }

    const parallaxItems = document.querySelectorAll('[data-parallax]');
    let lastScrollY = window.pageYOffset;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (header) {
            if (scrolled > lastScrollY && scrolled > header.offsetHeight) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }

            if (scrolled > 80) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        }

        if (parallaxItems.length) {
            parallaxItems.forEach(el => {
                const speed = parseFloat(el.dataset.parallax);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }

        lastScrollY = scrolled;
    });

    const animateEls = document.querySelectorAll('[data-animate]');
    if (animateEls.length) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });

        animateEls.forEach(el => animateObserver.observe(el));
    }
});
