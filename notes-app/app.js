// ============================================
// Чайная лавка - App Shell с навигацией
// ============================================

const contentDiv = document.getElementById('app-content');
const homeBtn = document.getElementById('home-btn');
const aboutBtn = document.getElementById('about-btn');

// Переключение активной кнопки
function setActiveButton(activeId) {
    if (homeBtn && aboutBtn) {
        homeBtn.classList.remove('active');
        aboutBtn.classList.remove('active');
        document.getElementById(activeId).classList.add('active');
    }
}

// Загрузка динамического контента
async function loadContent(page) {
    if (!contentDiv) return;
    
    try {
        const response = await fetch(`/content/${page}.html`);
        if (!response.ok) throw new Error('Страница не найдена');
        const html = await response.text();
        contentDiv.innerHTML = html;
        
        // Если загружена главная страница - инициализируем заметки
        if (page === 'home') {
            initNotes();
        }
    } catch (err) {
        console.error('Ошибка загрузки:', err);
        contentDiv.innerHTML = '<div class="status" style="color: #b45a5a;">❌ Ошибка загрузки страницы</div>';
    }
}

// Обработчики навигации
if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        setActiveButton('home-btn');
        loadContent('home');
    });
}

if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
        setActiveButton('about-btn');
        loadContent('about');
    });
}

// Загружаем главную страницу при старте
loadContent('home');

// ============================================
// Функционал заметок (инициализируется после загрузки home.html)
// ============================================

const STORAGE_KEY = 'tea-notes';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const list = document.getElementById('notesList');
    const notesCountSpan = document.getElementById('notesCount');
    
    if (notesCountSpan) {
        notesCountSpan.textContent = notes.length;
    }
    
    if (!list) return;
    
    if (notes.length === 0) {
        list.innerHTML = '<div class="empty-message">🍃 пока нет заметок… добавьте первую</div>';
        return;
    }
    
    list.innerHTML = notes.map((note, index) => `
        <li class="note-item">
            <span class="note-text">${escapeHtml(note)}</span>
            <button class="delete-btn" data-index="${index}" aria-label="Удалить">✕</button>
        </li>
    `).join('');
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            deleteNote(index);
        });
    });
}

function addNote(text) {
    if (!text || !text.trim()) return;
    
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    notes.push(text.trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        const originalText = statusDiv.innerHTML;
        statusDiv.innerHTML = '🌱 заметка сохранена';
        statusDiv.style.background = '#e8f0e0';
        setTimeout(() => {
            statusDiv.innerHTML = originalText;
            statusDiv.style.background = '';
        }, 1500);
    }
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    notes.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    loadNotes();
    
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        const originalText = statusDiv.innerHTML;
        statusDiv.innerHTML = '🍂 заметка удалена';
        statusDiv.style.background = '#f0ece0';
        setTimeout(() => {
            statusDiv.innerHTML = originalText;
            statusDiv.style.background = '';
        }, 1500);
    }
}

function initNotes() {
    const form = document.getElementById('noteForm');
    const input = document.getElementById('noteInput');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = input?.value.trim();
            if (text) {
                addNote(text);
                if (input) input.value = '';
                input?.focus();
            }
        });
    }
    
    loadNotes();
}

// ============================================
// Обновление статуса сети
// ============================================

function updateNetworkStatus() {
    const statusDiv = document.getElementById('status');
    if (!statusDiv) return;
    
    if (navigator.onLine) {
        statusDiv.innerHTML = '🟢 онлайн — приложение работает в обычном режиме';
        statusDiv.style.background = '#e8f0e0';
    } else {
        statusDiv.innerHTML = '🔴 офлайн — данные сохраняются локально, всё работает!';
        statusDiv.style.background = '#f0ece0';
    }
}

window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// ============================================
// PWA INSTALL
// ============================================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'inline-block';
        
        installBtn.addEventListener('click', async () => {
            installBtn.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`📲 Пользователь ${outcome} установку приложения`);
                deferredPrompt = null;
            }
        });
    }
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWA успешно установлено!');
    const installBtn = document.getElementById('installBtn');
    if (installBtn) installBtn.style.display = 'none';
});

// ============================================
// Регистрация Service Worker
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker зарегистрирован:', registration.scope);
        } catch (err) {
            console.error('❌ Ошибка регистрации Service Worker:', err);
        }
    });
}