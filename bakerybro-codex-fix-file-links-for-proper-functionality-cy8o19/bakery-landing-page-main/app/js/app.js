document.addEventListener('DOMContentLoaded', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('header');
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.mobile-overlay');

    if (toggle) {
        toggle.addEventListener('click', () => {
            nav?.classList.toggle('active');
            overlay?.classList.toggle('active');
            header?.classList.toggle('active');
        });
    }

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    });

    if (window.Swiper) {
        new Swiper('.hero-swiper', {
            speed: 800,
            mousewheel: { forceToAxis: true },
            watchSlidesProgress: true,
            pagination: { el: '.hero-pagination', clickable: true }
        });
        new Swiper('.products-swiper', {
            speed: 700,
            pagination: { el: '.products-pagination', clickable: true }
        });
        new Swiper('.menu-swiper', {
            speed: 700,
            pagination: { el: '.menu-pagination', clickable: true }
        });
    }

    if (!reduce) {
        const ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(ring);
        document.addEventListener('mousemove', e => {
            ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.querySelectorAll('.js-magnetic').forEach(el => {
            const strength = 4;
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / strength;
                const y = (e.clientY - rect.top - rect.height / 2) / strength;
                el.style.transform = `translate(${x}px, ${y}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });

        const revealEls = document.querySelectorAll('[data-reveal]');
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('is-inview');
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => io.observe(el));

        const depthEls = document.querySelectorAll('[data-depth]');
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            depthEls.forEach(el => {
                const d = parseFloat(el.dataset.depth || 0);
                el.style.transform = `translate3d(0, ${y * d}px, 0)`;
            });
        });
    }
});
