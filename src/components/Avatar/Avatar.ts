import {AnimationService} from '@/utils/animation';
import {AvatarConfig} from '@/types';

export class Avatar {
    private element: HTMLImageElement;
    private container: HTMLElement;
    private config: AvatarConfig;
    private currentAnimation: any = null;

    constructor(containerId: string, config: AvatarConfig) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }

        this.container = container;
        this.config = config;
        this.element = document.createElement('img');
        this.createElement();
    }

    private createElement(): void {
        this.element.src = this.config.imageUrl;
        this.element.className = 'avatar';
        this.element.alt = 'Digital Avatar';
        this.container.appendChild(this.element);

        AnimationService.fadeIn(this.element);
    }

    public startTalking(duration?: number): void {
        this.stopTalking();
        this.currentAnimation = AnimationService.animateAvatarTalking(this.element, duration);
    }

    public stopTalking(): void {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
            this.currentAnimation = null;
        }
        AnimationService.stopAvatarTalking(this.element);
    }

    public show(): void {
        this.element.style.display = 'block';
        AnimationService.fadeIn(this.element);
    }

    public hide(): void {
        AnimationService.fadeOut(this.element).finished.then(() => {
            this.element.style.display = 'none';
        });
    }

    public updateImage(newImageUrl: string): void {
        this.element.src = newImageUrl;
    }

    public destroy(): void {
        this.stopTalking();
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
