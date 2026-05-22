# 🍵 Чайная лавка — тихие заметки

**Прогрессивное веб-приложение (PWA) для заметок о чае и пуэре**

[![PWA](https://img.shields.io/badge/PWA-Enabled-green)](https://developer.mozilla.org/ru/docs/Web/Progressive_web_apps)
[![HTTPS](https://img.shields.io/badge/HTTPS-Enabled-brightgreen)](https://developer.mozilla.org/ru/docs/Web/Security)
[![Service Worker](https://img.shields.io/badge/Service_Worker-✔-blue)](https://developer.mozilla.org/ru/docs/Web/API/Service_Worker_API)

---

## ✨ О приложении

Простое, тихое и уютное приложение для заметок.  
Работает **полностью офлайн** и может быть **установлено на устройство** как нативное приложение.

**Особенности:**
- ✅ Работает без интернета
- ✅ Устанавливается на домашний экран
- ✅ Заметки хранятся локально (localStorage)
- ✅ App Shell — мгновенная загрузка интерфейса
- ✅ Никакой рекламы и слежки
- ✅ Две страницы: «Заметки» и «О лавке»

---

## 🚀 Демо

Приложение доступно по адресу:  
**https://localhost:3000** (при локальном запуске)

> ⚠️ При первом запуске может появиться предупреждение о сертификате — нажмите «Продолжить».

---

## 📦 Технологии

| Технология | Назначение |
|------------|------------|
| **HTML5/CSS3** | Интерфейс и стили |
| **JavaScript (ES6+)** | Логика приложения |
| **Service Worker** | Офлайн-режим, кэширование |
| **Web App Manifest** | Установка PWA на устройство |
| **App Shell** | Мгновенная загрузка каркаса |
| **HTTPS (mkcert)** | Безопасное соединение |

---

## 🛠️ Установка и запуск

### Требования
- Node.js (для http-server)
- Git

### 1. Клонируй репозиторий
```bash
git clone https://github.com/SilverYare/tea-notes-pwa.git
cd tea-notes-pwa
