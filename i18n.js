import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Hello! How can I help you?",
      chatTitle: "AI Conversation",
      sideMenu: "Side Menu",
      english: "English (Default)",
      spanish: "Español",
      french: "Français",
      german: "Deutsch",
      chinese: "中文",
      japanese: "日本人",
      korean: "한국어",
      thai: "ไทย",
      lowCredits: "Get more messages",
      noCreditsCount: "You're out of your daily credits",
      adAvailableCredits: "You get 10 free chats daily, ",
      watchAdsToGain: "Watch Ads to gain more credits!",
      generateTitlePrompt: "Generate a short, relevant, and interesting chat title based on this message.",
      translatePrompt: "Translate the following text to {language}:",
      errorMessage: "Oops! Something went wrong.",
      clear: "Clear",
      loadPreviousMessages: "Load previous messages",
      aiTyping: "AI is typing...",
      chatInputPlaceholder: "Type a message...",
      send: "Send",
      close: "Close",
      chatHistory: "Chat History",
      delete: "Delete",
      selectLanguage: "Select Language",
      deleteAllChats: "Delete all chats",
      deleteAllChatsTitle: "Delete all chats?",
      deleteAllChatsMessage: "All existing chats will be deleted",
      cancel: "Cancel",
      deleteAllChatsSuccess: "All chats successfully deleted!",
      newConversation: "New Conversation",
      darkMode: "Dark Mode",
      about: "About",
      accumulatedSpace: "This is your accumulated chat history space.",
      settings: "Settings",
      newChat: "New Chat",
      availableCredits: "Available Credits",
      writeAMessage: "Write a message...",
      clearChatHistory: "Clear Chat History",
      language: "Language",
      seeMoreMessages: "See more messages",
    }
    
  },
  es: {
    translation: {
      welcome: "¡Hola! ¿Cómo puedo ayudarte ?",
      chatTitle: "Conversación AI",
      sideMenu: "Menú Lateral",
      english: "Inglés",
      spanish: "Español",
      french: "Francés",
      german: "Alemán",
      chinese: "Chino",
      japanese: "Japonés",
      korean: "Coreano",
      thai: "Tailandés",
      generateTitlePrompt: "Genera un título de chat corto, relevante e interesante basado en este mensaje.",
      translatePrompt: "Traduce el siguiente texto al {language}:",
      errorMessage: "¡Vaya! Algo salió mal.",
      clear: "Limpiar",
      loadPreviousMessages: "Cargar mensajes anteriores",
      aiTyping: "La IA está escribiendo...",
      chatInputPlaceholder: "Escribe un mensaje ...",
      send: "Enviar",
      close: "Cerrar",
      chatHistory: "Historial de chat",
      delete: "Eliminar",
      selectLanguage : "Seleccionar idioma",
      deleteAllChats: "Borrar historial de chat",
      deleteAllChatsTitle: "¿Eliminar todos los chats?",
      deleteAllChatsMessage: "Todos los chats existentes serán eliminados",
      cancel: "Cancelar",
      deleteAllChatsSuccess: "¡Todos los chats eliminados con éxito!",
      newConversation: "Nueva conversación",
      darkMode: "Modo oscuro",
      about: "Acerca de",
      accumulatedSpace: "Este es tu espacio acumulado del historial de chat.",
      generateTitlePrompt: "Genera un título de chat corto, relevante e interesante basado en este mensaje.",
      settings : "Configuración",
      newChat: "Nuevo chat",
      availableCredits: "Créditos disponibles",
      chatHistory: "Historial de chat",
      writeAMessage: "Escribe un mensaje...",
      darkMode: "Modo oscuro",
      about: "Acerca de",
      clearChatHistory: "Borrar historial de chat",
      deleteAllChats: "Eliminar todos los chats",
      deleteAllChatsTitle: "¿Eliminar todos los chats?",
      deleteAllChatsMessage: "Todos los chats existentes serán eliminados",
      cancel: "Cancelar",
      deleteAllChatsSuccess: "¡Todos los chats eliminados con éxito!",
      language: "Idioma",
      seeMoreMessages: "Ver más mensajes",
    }
  },
  fr: {
    translation: {
      welcome: "Bonjour ! Comment puis-je vous aider ?",
      chatTitle: "Conversation IA",
      sideMenu: "Menu Latéral",
      english: "Anglais",
      spanish: "Espagnol",
      french: "Français",
      german: "Allemand",
      chinese: "Chinois",
      japanese: "Japonais",
      korean: "Coréen",
      thai: "Thaïlandais",
      generateTitlePrompt: "Générez un titre de chat court, pertinent et intéressant basé sur ce message.",
      translatePrompt: "Traduisez le texte suivant en {language} :",
      errorMessage: "Oups ! Quelque chose s'est mal passé.",
      clear: "Effacer",
      loadPreviousMessages: "Charger les messages précédents",
      aiTyping: "L'IA est en train d'écrire...",
      chatInputPlaceholder: "Écrivez un message...",
      send: "Envoyer",
      close: "Fermer",
      chatHistory: "Historique de chat",
      delete: "Supprimer",
      selectLanguage: "Sélectionner la langue",
      deleteAllChats: "Supprimer tous les chats",
      deleteAllChatsTitle: "Supprimer tous les chats ?",
      deleteAllChatsMessage: "Tous les chats existants seront supprimés",
      cancel: "Annuler",
      deleteAllChatsSuccess: "Tous les chats ont été supprimés avec succès !",
      newConversation: "Nouvelle conversation",
      darkMode: "Mode sombre",
      about: "À propos",
      accumulatedSpace: "Ceci est votre espace d'historique de chat accumulé.",
      settings: "Paramètres",
      newChat: "Nouveau chat",
      availableCredits: "Crédits disponibles",
      writeAMessage: "Écrivez un message...",
      clearChatHistory: "Effacer l'historique de chat",
      language: "Langue",
      seeMoreMessages: "Voir plus de messages",
    }
    
  },
  de: {
    translation: {
      welcome: "Hallo! Wie kann ich Ihnen helfen?",
      chatTitle: "KI-Konversation",
      sideMenu: "Seitenmenü",
      english: "Englisch",
      spanish: "Spanisch",
      french: "Französisch",
      german: "Deutsch",
      chinese: "Chinesisch",
      japanese: "Japanisch",
      korean: "Koreanisch",
      thai: "Thailändisch",
      generateTitlePrompt: "Erzeuge einen kurzen, relevanten und interessanten Chattitel basierend auf dieser Nachricht.",
      translatePrompt: "Übersetze den folgenden Text ins {language}:",
      errorMessage: "Ups! Etwas ist schiefgelaufen.",
      clear: "Löschen",
      loadPreviousMessages: "Vorherige Nachrichten laden",
      aiTyping: "KI schreibt...",
      chatInputPlaceholder: "Schreiben Sie eine Nachricht...",
      send: "Senden",
      close: "Schließen",
      chatHistory: "Chatverlauf",
      delete: "Löschen",
      selectLanguage: "Sprache auswählen",
      deleteAllChats: "Alle Chats löschen",
      deleteAllChatsTitle: "Alle Chats löschen?",
      deleteAllChatsMessage: "Alle bestehenden Chats werden gelöscht",
      cancel: "Abbrechen",
      deleteAllChatsSuccess: "Alle Chats wurden erfolgreich gelöscht!",
      newConversation: "Neues Gespräch",
      darkMode: "Dunkelmodus",
      about: "Über",
      accumulatedSpace: "Dies ist Ihr angesammelter Chatverlauf.",
      settings: "Einstellungen",
      newChat: "Neuer Chat",
      availableCredits: "Verfügbare Credits",
      writeAMessage: "Schreiben Sie eine Nachricht...",
      clearChatHistory: "Chatverlauf löschen",
      language: "Sprache",
      seeMoreMessages: "Weitere Nachrichten anzeigen",
    }
    
  },
  zh: {
    translation: {
      welcome: "你好！我能帮你什么吗？",
      chatTitle: "人工智能对话",
      sideMenu: "侧边菜单",
      english: "英语",
      spanish: "西班牙语",
      french: "法语",
      german: "德语",
      chinese: "中文",
      japanese: "日语",
      korean: "韩语",
      thai: "泰语",
      generateTitlePrompt: "根据此消息生成一个简短、相关且有趣的聊天标题。",
      translatePrompt: "将以下文本翻译成{language}：",
      errorMessage: "哎呀！出了点问题。",
      clear: "清除",
      loadPreviousMessages: "加载之前的消息",
      aiTyping: "AI正在输入...",
      chatInputPlaceholder: "输入消息...",
      send: "发送",
      close: "关闭",
      chatHistory: "聊天记录",
      delete: "删除",
      selectLanguage: "选择语言",
      deleteAllChats: "删除所有聊天",
      deleteAllChatsTitle: "删除所有聊天？",
      deleteAllChatsMessage: "所有现有聊天将被删除",
      cancel: "取消",
      deleteAllChatsSuccess: "所有聊天已成功删除！",
      newConversation: "新对话",
      darkMode: "深色模式",
      about: "关于",
      accumulatedSpace: "这是您累积的聊天记录空间。",
      settings: "设置",
      newChat: "新聊天",
      availableCredits: "可用积分",
      writeAMessage: "输入消息...",
      clearChatHistory: "清除聊天记录",
      language: "语言",
      seeMoreMessages: "查看更多消息",
    }
    
  },
  jp: {
    translation: {
      welcome: "こんにちは！どのようにお手伝いできますか？",
      chatTitle: "AI会話",
      sideMenu: "サイドメニュー",
      english: "英語",
      spanish: "スペイン語",
      french: "フランス語",
      german: "ドイツ語",
      chinese: "中国語",
      japanese: "日本語",
      korean: "韓国語",
      thai: "タイ語",
      generateTitlePrompt: "このメッセージに基づいて、短くて関連性があり、興味深いチャットタイトルを生成してください。",
      translatePrompt: "{language}に以下のテキストを翻訳してください：",
      errorMessage: "おっと！問題が発生しました。",
      clear: "クリア",
      loadPreviousMessages: "以前のメッセージを読み込む",
      aiTyping: "AIが入力中...",
      chatInputPlaceholder: "メッセージを入力...",
      send: "送信",
      close: "閉じる",
      chatHistory: "チャット履歴",
      delete: "削除",
      selectLanguage: "言語を選択",
      deleteAllChats: "すべてのチャットを削除",
      deleteAllChatsTitle: "すべてのチャットを削除しますか？",
      deleteAllChatsMessage: "既存のすべてのチャットが削除されます",
      cancel: "キャンセル",
      deleteAllChatsSuccess: "すべてのチャットが正常に削除されました！",
      newConversation: "新しい会話",
      darkMode: "ダークモード",
      about: "概要",
      accumulatedSpace: "これはあなたの累積されたチャット履歴スペースです。",
      settings: "設定",
      newChat: "新しいチャット",
      availableCredits: "利用可能なクレジット",
      writeAMessage: "メッセージを入力...",
      clearChatHistory: "チャット履歴をクリア",
      language: "言語",
      seeMoreMessages: "さらにメッセージを表示",
    }
    
  },
  kr:{
    translation: {
      welcome: "안녕하세요! 어떻게 도와드릴까요?",
      chatTitle: "AI 대화",
      sideMenu: "사이드 메뉴",
      english: "영어",
      spanish: "스페인어",
      french: "프랑스어",
      german: "독일어",
      chinese: "중국어",
      japanese: "일본어",
      korean: "한국어",
      arabic: "아랍어",
      generateTitlePrompt: "이 메시지를 기반으로 짧고 관련성 있으며 흥미로운 채팅 제목을 생성하세요.",
      translatePrompt: "{language}로 다음 텍스트를 번역하세요:",
      errorMessage: "이런! 문제가 발생했습니다.",
      clear: "지우기",
      loadPreviousMessages: "이전 메시지 불러오기",
      aiTyping: "AI가 입력 중...",
      chatInputPlaceholder: "메시지를 입력하세요...",
      send: "보내기",
      close: "닫기",
      chatHistory: "채팅 기록",
      delete: "삭제",
      selectLanguage: "언어 선택",
      deleteAllChats: "모든 채팅 삭제",
      deleteAllChatsTitle: "모든 채팅을 삭제하시겠습니까?",
      deleteAllChatsMessage: "기존 채팅이 모두 삭제됩니다.",
      cancel: "취소",
      deleteAllChatsSuccess: "모든 채팅이 성공적으로 삭제되었습니다!",
      newConversation: "새로운 대화",
      darkMode: "다크 모드",
      about: "정보",
      accumulatedSpace: "누적된 채팅 기록 공간입니다.",
      settings: "설정",
      newChat: "새 채팅",
      availableCredits: "사용 가능한 크레딧",
      writeAMessage: "메시지를 입력하세요...",
      clearChatHistory: "채팅 기록 삭제",
      language: "언어",
      seeMoreMessages: "더 많은 메시지 보기",
    }
    
  },
  th:{
    translation: {
      welcome: "สวัสดี! ฉันสามารถช่วยอะไรคุณได้บ้าง?",
      chatTitle: "การสนทนา AI",
      sideMenu: "เมนูด้านข้าง",
      english: "อังกฤษ",
      spanish: "สเปน",
      french: "ฝรั่งเศส",
      german: "เยอรมัน",
      chinese: "จีน",
      japanese: "ญี่ปุ่น",
      korean: "เกาหลี",
      arabic: "อาหรับ",
      thai: "ไทย",
      generateTitlePrompt: "สร้างชื่อบทสนทนาที่สั้น เกี่ยวข้อง และน่าสนใจจากข้อความนี้",
      translatePrompt: "แปลข้อความต่อไปนี้เป็น {language}:",
      errorMessage: "โอ๊ะ! เกิดข้อผิดพลาดบางอย่าง",
      clear: "ล้าง",
      loadPreviousMessages: "โหลดข้อความก่อนหน้า",
      aiTyping: "AI กำลังพิมพ์...",
      chatInputPlaceholder: "พิมพ์ข้อความ...",
      send: "ส่ง",
      close: "ปิด",
      chatHistory: "ประวัติการสนทนา",
      delete: "ลบ",
      selectLanguage: "เลือกภาษา",
      deleteAllChats: "ลบการสนทนาทั้งหมด",
      deleteAllChatsTitle: "ลบการสนทนาทั้งหมดหรือไม่?",
      deleteAllChatsMessage: "การสนทนาทั้งหมดที่มีจะถูกลบออก",
      cancel: "ยกเลิก",
      deleteAllChatsSuccess: "ลบการสนทนาทั้งหมดเรียบร้อยแล้ว!",
      newConversation: "เริ่มการสนทนาใหม่",
      darkMode: "โหมดมืด",
      about: "เกี่ยวกับ",
      accumulatedSpace: "นี่คือพื้นที่สะสมของประวัติการสนทนาของคุณ",
      settings: "การตั้งค่า",
      newChat: "แชทใหม่",
      availableCredits: "เครดิตที่มีอยู่",
      writeAMessage: "พิมพ์ข้อความ...",
      clearChatHistory: "ล้างประวัติการสนทนา",
      language: "ภาษา",
      seeMoreMessages: "ดูข้อความเพิ่มเติม",
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