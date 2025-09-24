import {AnimationService} from '@/utils/animation';
import {Question} from '@/types';

export class QuestionButton {
    private element: HTMLButtonElement;
    private question: Question;
    private onClickHandler: (question: Question) => void;
    private isEnabled: boolean = true;

    constructor(question: Question, onClick: (question: Question) => void) {
        this.question = question;
        this.onClickHandler = onClick;
        this.element = document.createElement('button');
        this.createElement();
    }

    private createElement(): void {
        this.element.className = 'question-btn';
        this.element.textContent = this.question.text;
        this.element.setAttribute('data-question-id', this.question.id);

        this.element.addEventListener('click', this.handleClick.bind(this));

        AnimationService.fadeIn(this.element, 800);
    }

    private handleClick(event: Event): void {
        event.preventDefault();

        if (!this.isEnabled) return;

        AnimationService.animateButtonClick(this.element);
        this.onClickHandler(this.question);
    }

    public enable(): void {
        this.isEnabled = true;
        this.element.disabled = false;
        this.element.style.opacity = '1';
    }

    public disable(): void {
        this.isEnabled = false;
        this.element.disabled = true;
        this.element.style.opacity = '0.6';
    }

    public getElement(): HTMLButtonElement {
        return this.element;
    }

    public updateQuestion(newQuestion: Question): void {
        this.question = newQuestion;
        this.element.textContent = newQuestion.text;
    }

    public destroy(): void {
        this.element.removeEventListener('click', this.handleClick.bind(this));
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
