// משתנים גלובליים
let score = 0;
let timeLeft = 30;
let currentAnswer = 0;
let timerInterval = null;
let difficulty = 'medium';
let highscore = localStorage.getItem('highscore') || 0;

// הגדרות קושי
const difficultySettings = {
    easy: { max: 5, time: 40 },
    medium: { max: 10, time: 30 },
    hard: { max: 12, time: 25 }
};

// הודעות עידוד
const correctMessages = [
    '🎉 מצוין!',
    '⭐ כל הכבוד!',
    '🚀 אלוף!',
    '💪 מושלם!',
    '🌟 יופי של תשובה!',
    '🎯 פצצה!',
    '🏆 גאון!',
    '✨ נהדר!'
];

const wrongMessages = [
    '😊 כמעט! נסה שוב',
    '💪 אל תוותר!',
    '🤔 לא נורא, המשך!',
    '😉 תנסה שוב'
];

const encouragementMessages = [
    'אתה מדהים! ממשיך ככה! 🌟',
    'וואו! איזה כישרון! 🚀',
    'אתה גאון של לוח כפל! 🏆',
    'מרשים מאוד! 💪',
    'אתה סוחף! תמשיך ככה! ⭐',
    'כל הכבוד! אתה מצטיין! 🎉'
];

// אתחול המשחק
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('highscore').textContent = highscore;
    showStartScreen();
});

// הצגת מסך התחלה
function showStartScreen() {
    hideAllScreens();
    document.getElementById('start-screen').classList.add('active');
    resetGame();
}

// התחלת משחק
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    const settings = difficultySettings[difficulty];
    timeLeft = settings.time;
    
    hideAllScreens();
    document.getElementById('game-screen').classList.add('active');
    
    score = 0;
    updateScore();
    startTimer();
    generateQuestion();
}

// הסתרת כל המסכים
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

// יצירת שאלה חדשה
function generateQuestion() {
    const settings = difficultySettings[difficulty];
    const num1 = Math.floor(Math.random() * settings.max) + 1;
    const num2 = Math.floor(Math.random() * settings.max) + 1;
    currentAnswer = num1 * num2;
    
    // הצגת השאלה
    document.getElementById('question').textContent = `${num1} × ${num2} = ?`;
    
    // יצירת תשובות
    generateAnswers(currentAnswer);
    
    // ניקוי הודעת משוב
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
}

// יצירת 4 תשובות (אחת נכונה ו-3 שגויות)
function generateAnswers(correct) {
    const answers = [correct];
    
    // יצירת 3 תשובות שגויות
    while (answers.length < 4) {
        let wrong;
        const random = Math.random();
        
        if (random < 0.3) {
            // תשובה קרובה למטה
            wrong = correct - (Math.floor(Math.random() * 5) + 1);
        } else if (random < 0.6) {
            // תשובה קרובה למעלה
            wrong = correct + (Math.floor(Math.random() * 5) + 1);
        } else {
            // תשובה אקראית
            const settings = difficultySettings[difficulty];
            const max = settings.max;
            wrong = Math.floor(Math.random() * (max * max)) + 1;
        }
        
        if (wrong > 0 && !answers.includes(wrong)) {
            answers.push(wrong);
        }
    }
    
    // ערבוב התשובות
    shuffleArray(answers);
    
    // הצגת התשובות
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    
    answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => checkAnswer(answer, btn);
        answersDiv.appendChild(btn);
    });
}

// ערבוב מערך
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// בדיקת תשובה
function checkAnswer(selected, button) {
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.answer-btn');
    
    // ביטול כל הכפתורים זמנית
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (selected === currentAnswer) {
        // תשובה נכונה
        button.classList.add('correct');
        feedback.textContent = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        feedback.className = 'feedback correct';
        score++;
        updateScore();
        
        // שאלה חדשה אחרי חצי שנייה
        setTimeout(() => {
            generateQuestion();
            buttons.forEach(btn => btn.style.pointerEvents = 'auto');
        }, 800);
    } else {
        // תשובה שגויה
        button.classList.add('wrong');
        feedback.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        feedback.className = 'feedback wrong';
        
        // הצגת התשובה הנכונה
        buttons.forEach(btn => {
            if (parseInt(btn.textContent) === currentAnswer) {
                setTimeout(() => {
                    btn.classList.add('correct');
                }, 300);
            }
        });
        
        // שאלה חדשה אחרי שנייה
        setTimeout(() => {
            generateQuestion();
            buttons.forEach(btn => btn.style.pointerEvents = 'auto');
        }, 1500);
    }
}

// עדכון ניקוד
function updateScore() {
    document.getElementById('score').textContent = score;
    
    // עדכון שיא
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
        document.getElementById('highscore').textContent = highscore;
    }
}

// התחלת טיימר
function startTimer() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        // אזהרה כשנשארו 10 שניות
        if (timeLeft <= 10) {
            timerElement.classList.add('timer-warning');
        }
        
        // סיום המשחק
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// סיום משחק
function endGame() {
    clearInterval(timerInterval);
    
    hideAllScreens();
    document.getElementById('end-screen').classList.add('active');
    
    document.getElementById('final-score').textContent = score;
    
    // הודעת עידוד
    let message = '';
    if (score >= 20) {
        message = 'וואו! אתה מלך לוח הכפל! 👑';
    } else if (score >= 15) {
        message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    } else if (score >= 10) {
        message = 'ביצוע טוב! עוד קצת תרגול ותהיה מושלם! 💪';
    } else if (score >= 5) {
        message = 'התחלה טובה! המשך לתרגל! 😊';
    } else {
        message = 'אל תוותר! עם תרגול תשתפר! 🌟';
    }
    
    document.getElementById('encouragement').textContent = message;
}

// איפוס משחק
function resetGame() {
    clearInterval(timerInterval);
    score = 0;
    updateScore();
    
    const timerElement = document.getElementById('timer');
    timerElement.classList.remove('timer-warning');
    timerElement.textContent = '30';
}

// מקשי מקלדת (אופציונלי - למספרים 1-4)
document.addEventListener('keydown', function(e) {
    if (document.getElementById('game-screen').classList.contains('active')) {
        const key = e.key;
        if (key >= '1' && key <= '4') {
            const buttons = document.querySelectorAll('.answer-btn');
            const index = parseInt(key) - 1;
            if (buttons[index]) {
                buttons[index].click();
            }
        }
    }
});

// PWA - טיפול בהתקנה
let deferredPrompt;
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    // מונע את הדיאלוג האוטומטי
    e.preventDefault();
    // שומר את האירוע לשימוש מאוחר יותר
    deferredPrompt = e;
    // מציג את כפתור ההתקנה
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    // מציג את דיאלוג ההתקנה
    deferredPrompt.prompt();
    // מחכה לתשובת המשתמש
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`תוצאת התקנה: ${outcome}`);
    // מאפס את המשתנה
    deferredPrompt = null;
    // מסתיר את הכפתור
    installButton.style.display = 'none';
});

// מסתיר את כפתור ההתקנה אחרי התקנה
window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    console.log('PWA הותקנה בהצלחה! 🎉');
});

// בדיקה אם האפליקציה כבר מותקנת
if (window.matchMedia('(display-mode: standalone)').matches) {
    installButton.style.display = 'none';
    console.log('האפליקציה רצה במצב standalone');
}

// התקנת PWA
// שימוש באותו משתנה שהוגדר קודם עבור beforeinstallprompt
const installPrompt = document.getElementById('install-prompt');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // מונע את ההודעה האוטומטית של הדפדפן
    e.preventDefault();
    // שומר את האירוע לשימוש מאוחר יותר
    deferredPrompt = e;
    // מציג את כפתור ההתקנה שלנו
    installPrompt.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
        return;
    }
    // מציג את הודעת ההתקנה
    deferredPrompt.prompt();
    // ממתין לתשובת המשתמש
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`תוצאת ההתקנה: ${outcome}`);
    // מאפס את המשתנה
    deferredPrompt = null;
    // מסתיר את ההודעה
    installPrompt.style.display = 'none';
});

dismissBtn.addEventListener('click', () => {
    installPrompt.style.display = 'none';
});

// מסתיר את ההודעה אם האפליקציה כבר מותקנת
window.addEventListener('appinstalled', () => {
    console.log('האפליקציה הותקנה בהצלחה!');
    installPrompt.style.display = 'none';
    deferredPrompt = null;
});
