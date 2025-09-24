import {App} from '@/App';
import {AppConfig} from '@/types';
import '@/styles/main.scss';

const appConfig: AppConfig = {
    avatar: {
        imageUrl: 'https://placehold.co/300x300/4a00e0/FFFFFF?text=Аватар',
        scale: 1.0,
        animations: {
            talking: {scale: 1.05},
            idle: {scale: 1.0}
        }
    },
    questions: [
        {
            id: 'greeting',
            text: 'Привет',
            answer: 'Привет! Рад вас видеть. Чем могу помочь?'
        },
        {
            id: 'how-are-you',
            text: 'Как дела?',
            answer: 'Всё отлично! Я ведь программа, поэтому у меня всегда всё хорошо. А как ваши дела?'
        },
        {
            id: 'about',
            text: 'Расскажи о себе',
            answer: 'Я цифровой аватар, созданный для общения и помощи. Я могу отвечать на ваши вопросы и поддерживать беседу.'
        },
        {
            id: 'capabilities',
            text: 'Что ты умеешь?',
            answer: 'Я могу отвечать на ваши вопросы, давать советы и просто общаться. Попробуйте задать мне любой вопрос!'
        },
        {
            id: 'goodbye',
            text: 'Пока!',
            answer: 'До свидания! Было приятно пообщаться. Возвращайтесь скорее!'
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        new App(appConfig);
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
});

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});
