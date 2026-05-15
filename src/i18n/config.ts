import i18next from "i18next"
import { initReactI18next } from "react-i18next"

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Schema.org Agent",
      "ask": "Ask about schema.org",
      "placeholder": "What is schema.org?",
      "typing": "Typing..."
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido al Agente Schema.org",
      "ask": "Pregunta sobre schema.org",
      "placeholder": "¿Qué es schema.org?",
      "typing": "Escribiendo..."
    }
  },
  zh: {
    translation: {
      "welcome": "欢迎使用 Schema.org 代理",
      "ask": "询问 schema.org",
      "placeholder": "什么是 schema.org?",
      "typing": "输入中..."
    }
  }
}

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en"
})

export default i18next
