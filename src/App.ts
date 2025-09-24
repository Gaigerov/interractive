import {Avatar} from '@/components/Avatar/Avatar';
import {QuestionButton} from '@/components/QuestionButton/QuestionButton';
import {SpeechSynthesisService} from '@/utils/speechSynthesis';
import {AppConfig, Question} from '@/types';

export class App {
    private avatar: Avatar;
    private questionButtons: QuestionButton[] = [];
    private speechService: SpeechSynthesisService;
    private questionsContainer: HTMLElement;
    private statusElement: HTMLElement;
    private volumeControl: HTMLInputElement;
    private isSpeaking: boolean = false;

    constructor(private config: AppConfig) {
        this.speechService = SpeechSynthesisService.getInstance();

        this.questionsContainer = this.getElement('questions-container');
        this.statusElement = this.getElement('status');
        this.volumeControl = this.getElement('volume') as HTMLInputElement;

        this.avatar = new Avatar('avatar-container', this.config.avatar); 
        this.initQuestions();
        this.initEventListeners();
        this.updateStatus('Выберите вопрос для начала разговора');
        console.log('Доступные русские голоса:',
            this.speechService.getAvailableRussianVoices().map(v => v.name)
        );

        console.log('Доступные мужские голоса:',
            this.speechService.getAvailableMaleVoices().map(v => v.name)
        );
    }


    private getElement(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Element with id "${id}" not found`);
        }
        return element;
    }

    private initQuestions(): void {
        this.config.questions.forEach(question => {
            const button = new QuestionButton(question, this.handleQuestionClick.bind(this));
            this.questionButtons.push(button);
            this.questionsContainer.appendChild(button.getElement());
        });
    }

    private initEventListeners(): void {
        this.volumeControl.addEventListener('input', this.handleVolumeChange.bind(this));

        document.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Escape' && this.isSpeaking) {
                this.stopSpeaking();
            }
        });
    }

    private handleQuestionClick(question: Question): void {
        if (this.isSpeaking) return;

        this.updateStatus(`Отвечаю на: "${question.text}"`);
        this.disableAllButtons();
        this.isSpeaking = true;

        this.avatar.startTalking();

        this.speechService.speak(question.answer, {
            volume: parseFloat(this.volumeControl.value)
        })
            .then(() => {
                this.handleSpeechEnd();
            })
            .catch((error: Error) => {
                console.error('Speech error:', error);
                this.updateStatus('Ошибка воспроизведения речи');
                this.handleSpeechEnd();
            });
    }

    private handleSpeechEnd(): void {
        this.avatar.stopTalking();
        this.enableAllButtons();
        this.updateStatus('Выберите следующий вопрос');
        this.isSpeaking = false;
    }

    private handleVolumeChange(): void {
        const volume = parseFloat(this.volumeControl.value);
        this.questionsContainer.style.opacity = volume > 0.1 ? '1' : '0.7';
    }

    private stopSpeaking(): void {
        this.speechService.stop();
        this.handleSpeechEnd();
    }

    private disableAllButtons(): void {
        this.questionButtons.forEach(button => button.disable());
    }

    private enableAllButtons(): void {
        this.questionButtons.forEach(button => button.enable());
    }

    private updateStatus(text: string): void {
        this.statusElement.textContent = text;
    }

    public destroy(): void {
        this.speechService.stop();
        this.avatar.destroy();
        this.questionButtons.forEach(button => button.destroy());
        this.volumeControl.removeEventListener('input', this.handleVolumeChange.bind(this));
    }
}
