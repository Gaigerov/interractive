import {SpeechSynthesisOptions} from '@/types';

export class SpeechSynthesisService {
    private static instance: SpeechSynthesisService;
    private isSupported: boolean;
    private voices: SpeechSynthesisVoice[] = [];
    private selectedVoice: SpeechSynthesisVoice | null = null;
    private voicesLoaded: boolean = false;

    private constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.loadVoices();
    }

    public static getInstance(): SpeechSynthesisService {
        if (!SpeechSynthesisService.instance) {
            SpeechSynthesisService.instance = new SpeechSynthesisService();
        }
        return SpeechSynthesisService.instance;
    }

    private loadVoices(): void {
        if (!this.isSupported) return;

        this.voices = speechSynthesis.getVoices();

        if (this.voices.length > 0) {
            this.selectMaleRussianVoice();
            this.voicesLoaded = true;
        }

        speechSynthesis.onvoiceschanged = () => {
            this.voices = speechSynthesis.getVoices();
            if (!this.voicesLoaded && this.voices.length > 0) {
                this.selectMaleRussianVoice();
                this.voicesLoaded = true;
                console.log('Доступные голоса:', this.voices.map(v => `${v.name} (${v.lang})`));
            }
        };
    }

    private selectMaleRussianVoice(): void {
        // Приоритеты поиска мужского голоса
        const voicePriorities = [
            // 1. Явно мужские русские голоса
            (voice: SpeechSynthesisVoice) =>
                (voice.lang.includes('ru') || voice.lang.includes('RU')) &&
                (voice.name.toLowerCase().includes('male') ||
                    voice.name.toLowerCase().includes('мужск') ||
                    voice.name.toLowerCase().includes('microsoft david') ||
                    voice.name.toLowerCase().includes('yandex')),

            // 2. Любые русские голоса (кроме явно женских)
            (voice: SpeechSynthesisVoice) =>
                (voice.lang.includes('ru') || voice.lang.includes('RU')) &&
                !voice.name.toLowerCase().includes('female') &&
                !voice.name.toLowerCase().includes('женск') &&
                !voice.name.toLowerCase().includes('microsoft zira'),

            // 3. Английские мужские голоса (как запасной вариант)
            (voice: SpeechSynthesisVoice) =>
                voice.lang.includes('en') &&
                (voice.name.toLowerCase().includes('male') ||
                    voice.name.toLowerCase().includes('microsoft david')),

            // 4. Первый доступный голос
            (voice: SpeechSynthesisVoice) => true
        ];

        for (const priority of voicePriorities) {
            const voice = this.voices.find(priority);
            if (voice) {
                this.selectedVoice = voice;
                console.log(`Выбран голос: ${voice.name} (${voice.lang})`);
                break;
            }
        }
    }

    public async waitForVoices(): Promise<void> {
        if (this.voicesLoaded) return;

        return new Promise((resolve) => {
            const checkVoices = () => {
                if (this.voicesLoaded) {
                    resolve();
                } else {
                    setTimeout(checkVoices, 100);
                }
            };
            checkVoices();
        });
    }

    public speak(text: string, options: SpeechSynthesisOptions = {}): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (!this.isSupported) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            await this.waitForVoices();

            speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.rate = options.rate || 0.9;
            utterance.pitch = options.pitch || (this.isMaleVoice() ? 0.9 : 1.1);
            utterance.volume = options.volume || 0.8;

            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
                utterance.lang = this.selectedVoice.lang;
            } else {
                utterance.lang = 'ru-RU';
            }

            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(event);

            speechSynthesis.speak(utterance);
        });
    }

    private isMaleVoice(): boolean {
        if (!this.selectedVoice) return false;

        const voiceName = this.selectedVoice.name.toLowerCase();
        return voiceName.includes('male') ||
            voiceName.includes('мужск') ||
            voiceName.includes('david') ||
            voiceName.includes('yandex');
    }

    public stop(): void {
        if (this.isSupported) {
            speechSynthesis.cancel();
        }
    }

    public isSpeaking(): boolean {
        return this.isSupported ? speechSynthesis.speaking : false;
    }

    public getVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }

    public getAvailableRussianVoices(): SpeechSynthesisVoice[] {
        return this.voices.filter(voice =>
            voice.lang.includes('ru') || voice.lang.includes('RU')
        );
    }

    public getAvailableMaleVoices(): SpeechSynthesisVoice[] {
        return this.voices.filter(voice =>
            voice.name.toLowerCase().includes('male') ||
            voice.name.toLowerCase().includes('мужск') ||
            voice.name.toLowerCase().includes('david')
        );
    }

    public setVoice(voiceName: string): void {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.selectedVoice = voice;
        }
    }

    public setVoiceByCriteria(criteria: (voice: SpeechSynthesisVoice) => boolean): void {
        const voice = this.voices.find(criteria);
        if (voice) {
            this.selectedVoice = voice;
        }
    }
}
