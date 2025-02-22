import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Hello! How can I help you today?",
      chatTitle: "AI Conversation",
      sideMenu: "Side Menu",
      english: "English",
      spanish: "Spanish",
      french: "French",
      generateTitlePrompt: "Generate a short, relevant and interesting chat title based on this message.",
    }
  },
  es: {
    translation: {
      welcome: "¡Hola! ¿Cómo puedo ayudarte hoy?",
      chatTitle: "Conversación AI",
      sideMenu: "Menú Lateral",
      english: "Inglés",
      spanish: "Español",
      french: "Francés",
      generateTitlePrompt: "Genera un título de chat corto, relevante e interesante basado en este mensaje.",
    }
  },
  fr: {
    translation: {
      welcome: "Bonjour! Comment puis-je vous aider aujourd'hui?",
      chatTitle: "Conversation AI",
      sideMenu: "Menu Latéral",
      english: "Anglais",
      spanish: "Espagnol",
      french: "Français",
      generateTitlePrompt: "Générez un titre de chat court, pertinent et intéressant basé sur ce message.",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;