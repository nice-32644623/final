# Changelog

## v1.1.0
- Introduced centralized SCSS variables and new modular partial structure.
- Added motion/reveal utilities, magnetic buttons and custom cursor ring.
- Implemented sticky blurred navigation and luxury shadow styles.
- Parallax and IntersectionObserver driven reveals across sections.
- New JavaScript for Swiper inertia, reveals, parallax and hover effects.
- Buttons and key CTAs use `.js-magnetic` class.
- Tune motion via `--dur-medium` and `--ease-luxe` in `app/scss/_variables.scss`.
- Adjust shadow intensity via `@mixin luxe-shadow` in `app/scss/_mixins.scss`.
- Grain overlay utility `.grain-overlay` can be tweaked or disabled in `_effects.scss`.

## v1.1.1
- Enable mousewheel navigation with edge release for hero, product, and menu sliders.
- Hook menu page section into reveal/parallax system for consistent scroll behavior.

## v1.1.2
- Fix mousewheel not advancing slides on hero and menu carousels.

## v1.1.3
- Refine custom cursor with smooth trailing motion and scale feedback on hover and click.

## v1.1.4
- Polish sticky header with translucent blur, hairline border, and highlight edge.
- Throttle parallax transforms with `requestAnimationFrame` for smoother scrolling.
