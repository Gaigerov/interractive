import anime from 'animejs';

export class AnimationService {
    public static animateAvatarTalking(
        element: HTMLElement,
        duration: number = 2000
    ): any {
        return anime({
            targets: element,
            scale: [
                {value: 1.02, duration: 200},
                {value: 1.05, duration: 300}
            ],
            duration: duration,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }

    public static stopAvatarTalking(element: HTMLElement): void {
        anime.remove(element);
        anime({
            targets: element,
            scale: 1,
            duration: 300,
            easing: 'easeOutQuad'
        });
    }

    public static animateButtonClick(element: HTMLElement): any {
        return anime({
            targets: element,
            scale: 0.95,
            duration: 100,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }

    public static fadeIn(element: HTMLElement, duration: number = 500): any {
        return anime({
            targets: element,
            opacity: [0, 1],
            duration: duration,
            easing: 'easeOutQuad'
        });
    }

    public static fadeOut(element: HTMLElement, duration: number = 500): any {
        return anime({
            targets: element,
            opacity: [1, 0],
            duration: duration,
            easing: 'easeInQuad'
        });
    }
}
