let selectedYear = 2009;
const currentYear = new Date().getFullYear();
let currentStoryIndex = 0;
let typingTimer;

// EDIT KALIMAT SLIDE TERAKHIR DI SINI
const storyMessages = [
    { 
        title: "Oh iyaa..", 
        text: "We cuma mau bilang:", 
        emoji: "😊" 
    },
    { 
        title: "Tetap Cemangatt", 
        text: "Jangan sedih teruss yaa..", 
        emoji: "🔥" 
    },
    { 
        title: "Don't Worry", 
        text: "Semua bakal baik-baik saja kok!", 
        emoji: "✨" 
    },
    { 
        title: "Support", 
        text: "I'm always support you!", 
        emoji: "😎" 
    },
    { 
        title: "The End", 
        text: "CEMANGATT TERUS YA!!", 
        emoji: "🥳" 
    }
];

function updateYear(val) {
    selectedYear = val;
    document.getElementById('yearDisplay').innerText = val;
}

function nextStep(step) {
    const card = document.getElementById('mainCard');
    card.style.opacity = "0";

    setTimeout(() => {
        for(let i=1; i<=5; i++) {
            const el = document.getElementById('step' + i);
            if(el) el.classList.add('hidden');
        }
        document.getElementById('step' + step).classList.remove('hidden');
        card.style.opacity = "1";

        if(step === 3) initGame();
        if(step === 5) startStory();
    }, 400);
}

// Memory Game Logic
const emojis = ['🌹', '💖', '🧸', '🌹', '💖', '🧸'];
let flippedCards = [];
let matchedCount = 0;

function initGame() {
    const grid = document.getElementById('memoryGrid');
    const shuffled = emojis.sort(() => 0.5 - Math.random());
    grid.innerHTML = '';
    matchedCount = 0;
    shuffled.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `<div class="card-back">?</div><div class="card-front">${emoji}</div>`;
        card.dataset.emoji = emoji;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) setTimeout(checkMatch, 700);
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.emoji === c2.dataset.emoji) {
        matchedCount += 2;
        if (matchedCount === emojis.length) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => runStep4(), 1000);
        }
    } else {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
    }
    flippedCards = [];
}

// STEP 4: LONG TEXT
function runStep4() {
    nextStep(4);
    const age = currentYear - selectedYear;
    const longMsg = `Selamat ulang tahun ke-${age}! ✨\nCiyee.. Ada yang bertambah usianya nih 😋\n\nSemoga di usia baru ini, kamu selalu dikelilingi kebahagiaan, kesehatan, dan semoga segala doa serta cita-citamu bisa terwujud.\n\nDan semoga hari ini menjadi awal dari tahun yang penuh keberkahan untukmu ya... 🥳`;
    
    document.getElementById('finalTitle').innerText = `Happy ${age}th Birthday!`;
    
    setTimeout(() => {
        typeWriter(longMsg, "typewriterLong", 50, true, () => {
            document.getElementById('btnContinue').classList.remove('hidden');
            document.getElementById('btnContinue').classList.add('fade-in');
        });
    }, 800);
}

// STEP 5: AUTOMATIC STORY
function startStory() {
    showNextSlide();
}

function showNextSlide() {
    if (currentStoryIndex < storyMessages.length) {
        const data = storyMessages[currentStoryIndex];
        const container = document.getElementById('storyContent');
        
        container.style.opacity = "1";
        document.getElementById('storyTitle').innerText = data.title;
        document.getElementById('storyEmoji').innerText = data.emoji;
        
        typeWriter(data.text, "typewriterStory", 60, false, () => {
            setTimeout(() => {
                if (currentStoryIndex < storyMessages.length - 1) {
                    container.style.opacity = "0";
                    setTimeout(() => {
                        currentStoryIndex++;
                        showNextSlide();
                    }, 500);
                } else {
                    document.getElementById('btnReset').classList.remove('hidden');
                    document.getElementById('btnReset').classList.add('fade-in');
                }
            }, 1800);
        });
    }
}

function typeWriter(text, elementId, speed, autoScroll, callback) {
    let i = 0;
    const element = document.getElementById(elementId);
    const scrollCont = document.getElementById('scrollContainer');
    element.innerHTML = "";
    clearTimeout(typingTimer);

    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            if(autoScroll && scrollCont) scrollCont.scrollTop = scrollCont.scrollHeight;
            typingTimer = setTimeout(typing, speed);
        } else if (callback) {
            element.style.borderRight = "none";
            callback();
        }
    }
    typing();
}

// FUNGSI UNTUK RESET KONTEN
function resetGame() {
    currentStoryIndex = 0;
    matchedCount = 0;
    flippedCards = [];
    document.getElementById('typewriterLong').innerHTML = "";
    document.getElementById('typewriterStory').innerHTML = "";
    document.getElementById('btnContinue').classList.add('hidden');
    document.getElementById('btnReset').classList.add('hidden');
    nextStep(1);
}
