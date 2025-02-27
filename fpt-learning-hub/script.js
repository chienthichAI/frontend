document.addEventListener('DOMContentLoaded', () => {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffcc00' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1 } },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: 'none', random: true, straight: false, out_mode: 'out' }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    particlesJS('particles-js-ranking', {
        particles: { number: { value: 50 }, color: { value: '#ffcc00' }, size: { value: 2 } }
    });

    anime({
        targets: '.loader',
        opacity: [1, 0],
        scale: [0.8, 1],
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => document.querySelector('.loader').style.display = 'none'
    });

    anime({
        targets: '.nav-menu li',
        translateY: [-20, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
});

// Animations
anime({
    targets: '.hero-content',
    translateY: [-50, 0],
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 1200,
    easing: 'easeOutElastic(1, .6)'
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            anime({
                targets: entry.target.querySelector('h2'),
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutExpo'
            });
            anime({
                targets: entry.target.querySelectorAll('.content-card, .ranking-item'),
                translateY: [50, 0],
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 1000,
                delay: anime.stagger(200),
                easing: 'easeOutExpo'
            });
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.section').forEach(section => sectionObserver.observe(section));

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    anime({
        targets: themeToggle,
        rotate: [0, 360],
        duration: 600,
        easing: 'easeOutExpo'
    });
});

// User State
let currentUser = null;
let uploadedVideos = [];

// Sample Data
const instruments = [
    { id: 1, title: 'Đàn Tranh', description: 'Kỹ thuật gảy đàn tranh', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=1' },
    { id: 2, title: 'Đàn Nguyệt', description: 'Học chơi đàn nguyệt cơ bản', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=2' },
    { id: 3, title: 'Sáo', description: 'Kỹ thuật thổi sáo', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=3' }
];

const martialArts = [
    { id: 4, title: 'Vovinam Cơ Bản', description: 'Bài quyền cơ bản', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=4' },
    { id: 5, title: 'Vovinam Nâng Cao', description: 'Kỹ thuật đấm đá', video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://picsum.photos/300/200?random=5' }
];

const challenges = [
    { id: 1, title: 'Chơi Đàn Tranh', description: 'Hoàn thành bài cơ bản', reward: 'Chứng chỉ', thumbnail: 'https://picsum.photos/300/200?random=6' },
    { id: 2, title: 'Vovinam 5 Động Tác', description: 'Thực hiện bài quyền', reward: 'Điểm thưởng', thumbnail: 'https://picsum.photos/300/200?random=7' }
];

const rankings = Array.from({ length: 10 }, (_, i) => ({
    name: `Sinh viên ${i + 1}`,
    points: 200 - i * 15,
    avatar: `https://picsum.photos/50?random=${i + 1}`
}));

let personalCourses = [];
let progress = 0;
let points = 0;

// Render Grid
function renderGrid(gridId, items, isPersonal = false) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = items.map(item => `
        <div class="content-card">
            <div class="thumbnail" style="background-image: url(${item.thumbnail});"></div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="buttons">
                <button class="action-btn" data-type="learn" data-id="${item.id}">Học ngay</button>
                ${!isPersonal ? `<button class="action-btn add" data-type="add-personal" data-id="${item.id}">Thêm</button>` : ''}
            </div>
        </div>
    `).join('');
}

renderGrid('instrument-grid', instruments);
renderGrid('martial-grid', martialArts);
renderGrid('challenge-grid', challenges);

// Render Feedback List (Teacher Dashboard)
function renderFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = uploadedVideos.map(video => `
        <div class="feedback-item">
            <p><strong>Email:</strong> ${video.email}</p>
            <p><strong>Ghi chú:</strong> ${video.note}</p>
            <video controls src="${video.url}" class="feedback-video"></video>
            <textarea class="teacher-comment" placeholder="Nhận xét giảng viên..." data-id="${video.id}">${video.teacherComment || ''}</textarea>
            <button class="action-btn" onclick="submitTeacherComment(${video.id})">Gửi nhận xét</button>
        </div>
    `).join('');
    anime({
        targets: '.feedback-item',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
}

function submitTeacherComment(videoId) {
    const comment = document.querySelector(`.teacher-comment[data-id="${videoId}"]`).value;
    const video = uploadedVideos.find(v => v.id === videoId);
    if (video && comment) {
        video.teacherComment = comment;
        localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
        showNotification('Nhận xét đã được gửi!', 'success');
        renderFeedbackList();
    }
}

// Search
document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    renderGrid('instrument-grid', instruments.filter(i => i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query)));
    renderGrid('martial-grid', martialArts.filter(m => m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)));
});

// Progress and Points
document.addEventListener('click', (e) => {
    const btn = e.target;
    if (btn.dataset.type === 'learn' && currentUser) {
        progress = Math.min(progress + 20, 100);
        points += 10;
        updateProgress();
        showNotification('Hoàn thành bài học! +10 điểm', 'success');
        updateProfile();
        anime({
            targets: btn,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
    } else if (btn.dataset.type === 'add-personal' && currentUser) {
        const lessonId = parseInt(btn.dataset.id);
        const lesson = [...instruments, ...martialArts].find(l => l.id === lessonId);
        if (lesson && !personalCourses.some(pc => pc.id === lessonId)) {
            personalCourses.push(lesson);
            renderGrid('personal-courses-grid', personalCourses, true);
            savePersonalCourses();
            showNotification('Đã thêm vào khóa học cá nhân!', 'success');
            anime({
                targets: btn,
                scale: [1, 1.1, 1],
                duration: 300,
                easing: 'easeOutExpo'
            });
        }
    }
});

function updateProgress() {
    const circumference = 565.48;
    const offset = circumference - (progress / 100) * circumference;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        anime({
            targets: progressFill,
            strokeDashoffset: [anime.setDashoffset, offset],
            duration: 1000,
            easing: 'easeOutExpo',
            begin: () => {
                anime({
                    targets: '.progress-circle',
                    scale: [1, 1.15],
                    rotate: [0, 360],
                    duration: 800,
                    easing: 'easeOutElastic(1, .6)'
                });
            }
        });
    }
    document.getElementById('progress-text').textContent = `${progress}%`;
    document.getElementById('points-text').textContent = `Điểm thưởng: ${points}`;
    saveProgress();
    anime({
        targets: '#points-text',
        scale: [1, 1.2, 1],
        duration: 600,
        easing: 'easeOutExpo'
    });
}

// Notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    anime({
        targets: notification,
        translateX: [50, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: 'easeOutExpo',
        complete: () => setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 50],
                opacity: [1, 0],
                scale: [1, 0.9],
                duration: 600,
                easing: 'easeInExpo',
                complete: () => notification.style.display = 'none'
            });
        }, 3000)
    });
}

// Navigation
function resetPage() {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    anime({
        targets: '.hero',
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.98, 1],
        duration: 800,
        easing: 'easeOutExpo'
    });
}

function showLearningPage() {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    const learningPage = document.getElementById('learning-page');
    learningPage.style.display = 'block';
    learningPage.scrollIntoView({ behavior: 'smooth' });
    anime({
        targets: '#learning-page .learning-section',
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.95, 1],
        duration: 1000,
        delay: anime.stagger(300),
        easing: 'easeOutExpo'
    });
}

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.dataset.section;
        if (sectionId === 'explore') return showLearningPage();
        const section = document.getElementById(sectionId);
        if (sectionId === 'instruments' || sectionId === 'martial-arts' || sectionId === 'challenges' || sectionId === 'ranking') {
            document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth' });
            anime({
                targets: section,
                opacity: [0, 1],
                translateY: [20, 0],
                scale: [0.98, 1],
                duration: 800,
                easing: 'easeOutExpo'
            });
            if (sectionId === 'ranking') renderRanking();
        } else {
            showSection(sectionId);
        }
        anime({
            targets: link,
            scale: [1, 1.1, 1],
            duration: 300,
            easing: 'easeOutExpo'
        });
    });
});

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
        anime({
            targets: section,
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.98, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });
        if (sectionId === 'teacher-dashboard') renderFeedbackList();
        if (sectionId === 'profile') updateProfile();
    }
}

// Auth Modal
const authModal = document.getElementById('auth-modal');
document.querySelector('.login-btn').addEventListener('click', () => openAuthModal('Đăng nhập'));
document.querySelector('.signup-btn').addEventListener('click', () => openAuthModal('Đăng ký'));

function openAuthModal(title) {
    authModal.style.display = 'flex';
    document.getElementById('modal-title').textContent = title;
    document.querySelector('.auth-submit').textContent = title;
    document.getElementById('toggle-link').textContent = title === 'Đăng nhập' ? 'Đăng ký' : 'Đăng nhập';
    anime({
        targets: '.modal-content',
        scale: [0, 1],
        opacity: [0, 1],
        translateY: [-100, 0],
        rotate: [5, 0],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
    });
    anime({
        targets: '.auth-form input, .auth-submit, .toggle-auth, .social-login button',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
}

authModal.querySelector('.close-modal').addEventListener('click', closeAuthModal);
document.getElementById('toggle-link').addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal(document.getElementById('modal-title').textContent === 'Đăng nhập' ? 'Đăng ký' : 'Đăng nhập');
});

function closeAuthModal() {
    anime({
        targets: '.modal-content',
        scale: [1, 0],
        opacity: [1, 0],
        translateY: [0, -100],
        rotate: [0, 5],
        duration: 400,
        easing: 'easeInExpo',
        complete: () => authModal.style.display = 'none'
    });
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    showLoading();
    setTimeout(() => {
        if (email === 'student@fpt.edu.vn' && password === 'student123') {
            currentUser = { email, name: 'Nguyễn Văn A', role: 'student' };
            showNotification('Đăng nhập thành công!', 'success');
            closeAuthModal();
            updateProfile();
        } else if (email === 'teacher@fpt.edu.vn' && password === 'teacher123') {
            currentUser = { email, name: 'Giảng viên B', role: 'teacher' };
            showNotification('Đăng nhập thành công!', 'success');
            closeAuthModal();
            updateProfile();
        } else if (email && password) {
            currentUser = { email, name: 'Người dùng mới', role: 'student' };
            showNotification('Đăng ký thành công!', 'success');
            closeAuthModal();
            updateProfile();
        } else {
            showNotification('Thông tin không hợp lệ!', 'error');
        }
        hideLoading();
    }, 500);
});

// Video Upload Modal
const videoUploadModal = document.getElementById('video-upload-modal');
document.getElementById('upload-video-btn')?.addEventListener('click', () => {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để gửi video!', 'error');
        return;
    }
    videoUploadModal.style.display = 'flex';
    anime({
        targets: '.modal-content',
        scale: [0, 1],
        opacity: [0, 1],
        translateY: [-100, 0],
        duration: 600,
        easing: 'easeOutElastic(1, .6)'
    });
});

videoUploadModal.querySelector('.close-modal').addEventListener('click', () => {
    anime({
        targets: '.modal-content',
        scale: [1, 0],
        opacity: [1, 0],
        translateY: [0, -100],
        duration: 400,
        easing: 'easeInExpo',
        complete: () => videoUploadModal.style.display = 'none'
    });
});

document.getElementById('video-upload-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const file = document.getElementById('video-file').files[0];
    const note = document.getElementById('video-note').value;
    if (file && currentUser) {
        const videoId = Date.now();
        const videoUrl = URL.createObjectURL(file);
        uploadedVideos.push({ id: videoId, email: currentUser.email, note, url: videoUrl, teacherComment: '' });
        localStorage.setItem('uploadedVideos', JSON.stringify(uploadedVideos));
        showNotification('Video đã được gửi thành công!', 'success');
        closeModal(videoUploadModal);
        if (currentUser.role === 'teacher') renderFeedbackList();
    }
});

function closeModal(modal) {
    anime({
        targets: '.modal-content',
        scale: [1, 0],
        opacity: [1, 0],
        translateY: [0, -100],
        duration: 400,
        easing: 'easeInExpo',
        complete: () => modal.style.display = 'none'
    });
}

// Ranking
let currentRankingIndex = 0;
function renderRanking() {
    const rankingList = document.getElementById('ranking-list');
    const visibleRankings = rankings.slice(currentRankingIndex, currentRankingIndex + 3);
    rankingList.innerHTML = visibleRankings.map((user, i) => `
        <div class="ranking-item ${i + currentRankingIndex < 3 ? 'top-' + (i + currentRankingIndex + 1) : ''}">
            <div class="rank">${i + currentRankingIndex + 1}</div>
            <img src="${user.avatar}" alt="${user.name}" class="rank-avatar">
            <span>${user.name}</span>
            <span class="points">${user.points} điểm</span>
        </div>
    `).join('');
    anime({
        targets: '.ranking-item',
        translateX: [-50, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
    document.querySelector('.scroll-down-btn').style.display = currentRankingIndex + 3 < rankings.length ? 'block' : 'none';
    document.querySelector('.scroll-up-btn').style.display = currentRankingIndex > 0 ? 'block' : 'none';
}

document.querySelectorAll('.filter-btn')?.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRankingIndex = 0;
        renderRanking();
    });
});

document.querySelector('.scroll-down-btn')?.addEventListener('click', () => {
    if (currentRankingIndex + 3 < rankings.length) {
        currentRankingIndex += 3;
        renderRanking();
        anime({
            targets: '.ranking-item',
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }
});

document.querySelector('.scroll-up-btn')?.addEventListener('click', () => {
    if (currentRankingIndex > 0) {
        currentRankingIndex -= 3;
        renderRanking();
        anime({
            targets: '.ranking-item',
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100),
            easing: 'easeOutExpo'
        });
    }
});

// Profile
function updateProfile() {
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-points').textContent = points;
        document.getElementById('profile-progress').textContent = `${progress}%`;
        document.getElementById('upload-video-btn').style.display = currentUser.role === 'student' ? 'block' : 'none';
        updateProgress();
        anime({
            targets: '.profile-details img',
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }
}

// Loading
function showLoading() {
    document.querySelector('.loader').style.display = 'flex';
    anime({ targets: '.loader', opacity: [0, 1], scale: [0.8, 1], duration: 300, easing: 'easeOutExpo' });
}

function hideLoading() {
    anime({
        targets: '.loader',
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 300,
        easing: 'easeInExpo',
        complete: () => document.querySelector('.loader').style.display = 'none'
    });
}

function showChatbotLoading() {
    document.getElementById('chatbot-loading').style.display = 'flex';
    anime({ targets: '#chatbot-loading', opacity: [0, 1], scale: [0.8, 1], duration: 300, easing: 'easeOutExpo' });
}

function hideChatbotLoading() {
    anime({
        targets: '#chatbot-loading',
        opacity: [1, 0],
        scale: [1, 0.8],
        duration: 300,
        easing: 'easeInExpo',
        complete: () => document.getElementById('chatbot-loading').style.display = 'none'
    });
}

// Save Data
function saveProgress() {
    localStorage.setItem('progress', progress);
    localStorage.setItem('points', points);
}

function savePersonalCourses() {
    localStorage.setItem('personalCourses', JSON.stringify(personalCourses));
}

function loadData() {
    progress = parseInt(localStorage.getItem('progress')) || 0;
    points = parseInt(localStorage.getItem('points')) || 0;
    personalCourses = JSON.parse(localStorage.getItem('personalCourses')) || [];
    uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos')) || [];
    updateProfile();
}

loadData();

// Chatbot
const chatbot = document.getElementById('chatbot');
const chatbotToggle = document.getElementById('chatbot-toggle');

chatbotToggle.addEventListener('click', () => {
    if (chatbot.style.display === 'none' || chatbot.style.display === '') {
        chatbot.style.display = 'flex';
        chatbotToggle.style.display = 'none';
        anime({
            targets: '.chatbot',
            translateX: [100, 0],
            opacity: [0, 1],
            scale: [0.95, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .6)',
            begin: () => {
                anime({
                    targets: '.chatbot-header',
                    background: ['#1e3a8a', 'var(--gradient-primary)'],
                    duration: 800,
                    easing: 'easeOutExpo'
                });
            }
        });
    }
});

chatbot.querySelector('.chatbot-close').addEventListener('click', () => {
    anime({
        targets: '.chatbot',
        translateX: [0, 100],
        opacity: [1, 0],
        scale: [1, 0.95],
        duration: 400,
        easing: 'easeInExpo',
        complete: () => {
            chatbot.style.display = 'none';
            chatbotToggle.style.display = 'block';
        }
    });
});

chatbot.addEventListener('mouseover', () => {
    document.getElementById('predefined-questions').classList.remove('hidden-questions');
    anime({
        targets: '#predefined-questions',
        opacity: [0, 1],
        translateX: [-20, 0],
        scale: [0.9, 1],
        duration: 300,
        easing: 'easeOutExpo'
    });
});

chatbot.addEventListener('mouseout', () => {
    document.getElementById('predefined-questions').classList.add('hidden-questions');
    anime({
        targets: '#predefined-questions',
        opacity: [1, 0],
        translateX: [0, -20],
        scale: [1, 0.9],
        duration: 300,
        easing: 'easeInExpo'
    });
});

document.getElementById('send-msg').addEventListener('click', sendChatMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});
document.getElementById('predefined-questions').addEventListener('change', (e) => {
    if (e.target.value) {
        document.getElementById('chat-input').value = e.target.value;
        sendChatMessage();
        e.target.value = '';
    }
});

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.textContent = message;
    document.querySelector('.chatbot-body').appendChild(userMsg);
    anime({
        targets: userMsg,
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
        easing: 'easeOutExpo'
    });

    input.value = '';
    showChatbotLoading();

    const predefinedReplies = {
        'làm sao để chơi đàn tranh?': 'Bạn cần điều chỉnh dây và tập gảy từng nốt cơ bản trước.',
        'các bước tập vovinam cơ bản?': 'Bắt đầu với tư thế đứng và các động tác quyền cơ bản.',
        'làm thế nào để thổi sáo?': 'Học cách kiểm soát hơi thở và vị trí bấm lỗ.'
    };

    let reply;
    if (predefinedReplies[message.toLowerCase()]) {
        reply = predefinedReplies[message.toLowerCase()];
        setTimeout(() => sendBotReply(reply), 500);
    } else {
        try {
            const apiKey = 'AIzaSyACh0Vfj8yGq2ylw0_Z09dF3i9vH3jjtZc'; // Thay bằng API key thực tế nếu có
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: message
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        }
                    })
                }
            );
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            reply = data.candidates[0].content.parts[0].text || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn!';
            sendBotReply(reply);
        } catch (error) {
            reply = 'Tôi là trợ lý FPT. Hiện tại tôi chỉ trả lời được các câu hỏi cơ bản. Hãy thử hỏi về cách chơi đàn tranh hoặc tập Vovinam!';
            setTimeout(() => sendBotReply(reply), 500);
            console.error('Gemini API Error (Mock Free):', error);
        }
    }
}

function sendBotReply(reply) {
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.textContent = reply;
    document.querySelector('.chatbot-body').appendChild(botMsg);
    anime({
        targets: botMsg,
        translateY: [20, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 400,
        easing: 'easeOutExpo'
    });
    hideChatbotLoading();
    document.querySelector('.chatbot-body').scrollTop = document.querySelector('.chatbot-body').scrollHeight;
}

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
    const nav = document.querySelector('.nav-menu');
    nav.classList.toggle('active');
    anime({
        targets: '.nav-menu.active li',
        translateX: [-50, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
    });
    anime({
        targets: '.hamburger span',
        rotate: nav.classList.contains('active') ? 45 : 0,
        translateY: nav.classList.contains('active') ? [0, 5, -5] : 0,
        duration: 400,
        easing: 'easeOutExpo'
    });
});