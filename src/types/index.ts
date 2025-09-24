export interface Question {
    id: string;
    text: string;
    answer: string;
    audioUrl?: string;
}

export interface AvatarConfig {
    imageUrl: string;
    scale: number;
    animations: {
        talking: object;
        idle: object;
    };
}

export interface AppConfig {
    avatar: AvatarConfig;
    questions: Question[];
}

export interface SpeechSynthesisOptions {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
}

export interface VoiceInfo {
    name: string;
    lang: string;
    isMale: boolean;
}
