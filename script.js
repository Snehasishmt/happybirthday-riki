/* CONFIG */
const COUNTDOWN_SECONDS = 10;
const TARGET_DATE = Date.now() + COUNTDOWN_SECONDS * 1000;

/* ELEMENTS */
const starter = document.getElementById('starter');
const startBtn = document.getElementById('startBtn');
const timerEl = document.getElementById('timer');
const countdownWrap = document.getElementById('countdown');
const letterEl = document.getElementById('letter');
const typedTextEl = document.getElementById('typedText');
const balloonsDiv = document.getElementById('balloons');
const gallery = document.getElementById('gallery');
const finalSurpriseBtn = document.getElementById('finalSurpriseBtn');
const surprise = document.getElementById('surprise');
const proposalQuestion = document.getElementById('proposalQuestion');
const proposalBtns = document.getElementById('proposalBtns');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const finalMessage = document.getElementById('finalMessage');
const extraSurprise = document.getElementById('extraSurprise');

noBtn.addEventListener('click', () => {
  yesBtn.style.transform = 'scale(1.35)';
  yesBtn.style.transition = 'transform 0.3s cubic-bezier(.5,1.8,.5,1)';
  noBtn.disabled = true;
  setTimeout(() => {
    noBtn.disabled = false;
    yesBtn.style.transform = 'scale(1)';
  }, 800);
});

yesBtn.addEventListener('click', () => {
  proposalQuestion.classList.add('hidden');
  proposalBtns.classList.add('hidden');
  finalMessage.classList.remove('hidden');
  // Confetti burst for YES
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.7 }
  });
});

finalSurpriseBtn.addEventListener('click', () => {
  finalSurpriseBtn.classList.add('hidden');
  surprise.classList.remove('hidden');
  proposalQuestion.classList.remove('hidden');
  setTimeout(() => {
    proposalBtns.classList.remove('hidden');
  }, 1200);
});

/* Helpers */
function formatTimeLeft(ms){
  const s = Math.ceil(ms / 1000);
  return `${s}s`;
}

/* Countdown */
// let interval = setInterval(()=>{
//   const now = Date.now();
//   const diff = TARGET_DATE - now;
//   if(diff <= 0){
//     clearInterval(interval);
//     countdownWrap.style.display = 'none';
//     startCelebration();
//   } else {
//     timerEl.textContent = formatTimeLeft(diff);
//   }
// }, 1000);

function startCountdown() {
  let target = Date.now() + COUNTDOWN_SECONDS * 1000;
  timerEl.textContent = formatTimeLeft(COUNTDOWN_SECONDS * 1000);
  let interval = setInterval(() => {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      clearInterval(interval);
      countdownWrap.style.display = 'none';
      startCelebration();
    } else {
      timerEl.textContent = formatTimeLeft(diff);
    }
  }, 1000);
}

/* Mobile/start logic to satisfy autoplay rules */
function startEverything() {
  // Hide starter overlay
  if (starter) starter.style.display = 'none';
  // Optionally play music
  playMusic().finally(() => {
    // Optional: show a countdown timer
    let secondsLeft = COUNTDOWN_SECONDS;
    timerEl.textContent = `${secondsLeft}s`;
    countdownWrap.classList.remove('hidden');
    let interval = setInterval(() => {
      secondsLeft--;
      timerEl.textContent = `${secondsLeft}s`;
      if (secondsLeft <= 0) {
        clearInterval(interval);
        countdownWrap.classList.add('hidden');
        startCelebration();
      }
    }, 1000);
  });
}

/* attempt to play music, return promise */
function playMusic(){
  if(!bgMusic) return Promise.resolve();
  // set volume soft
  bgMusic.volume = 0.75;
  const p = bgMusic.play();
  if(p !== undefined){
    return p.catch(err=>{
      // autoplay blocked — show small note (starter overlay will have been used)
      console.warn('Autoplay blocked or failed:', err);
    });
  } else {
    return Promise.resolve();
  }
}

/* When countdown hits zero -> sequence */
function startCelebration(){
  document.getElementById('cakeSection').classList.remove('hidden');
  launchConfetti();
  setTimeout(()=>{
    document.getElementById('cakeSection').classList.add('hidden');
    showLetter();
    setTimeout(()=>{startHearts(); showBalloons();}, 900);
  }, 2500);
}

/* Typewriter letter */
function showLetter() {
  letterEl.classList.remove('hidden');
  const message = `💌 Dear Riki,

On this special day, I just want to remind you how deeply you’re loved. 
You are the reason I smile, the reason my heart races, and the reason I believe in forever.

Every moment with you is a treasure I hold close. 
From our laughter to our quiet moments, from silly talks to our biggest dreams — I cherish it all.

You’re my best friend, my love, my inspiration, and my future. 
Today is your day, but you’re my gift every single day.

Happy Birthday, my forever. ❤

Yours forever,
Maity 💍`;
  typeWriter(message, () => {
    // Only show the gallery and final surprise button after typing is done
    showGallery();
    // finalSurpriseBtn.classList.remove('hidden'); // Remove this if present elsewhere
  });
}

function typeWriter(text, cb){
  typedTextEl.innerHTML = '';
  let i = 0, speed = 35;
  function step(){
    if(i < text.length){
      typedTextEl.innerHTML += text.charAt(i);
      i++;
      setTimeout(step, speed);
    } else if(cb) cb();
  }
  step();
}

/* Balloons creation */
function showBalloons(){
  balloonsDiv.classList.remove('hidden');
  for(let i=0;i<28;i++){
    const b = document.createElement('div');
    b.className = 'balloon';
    // random left, color, size
    const left = Math.random()*100;
    const hue = Math.floor(Math.random()*360);
    const size = 32 + Math.random()*40; // 32-72px
    b.style.left = `${left}vw`;
    b.style.width = `${size}px`;
    b.style.height = `${Math.floor(size*1.25)}px`;
    b.style.background = `linear-gradient(180deg,hsl(${hue} 80% 70%), hsl(${hue} 70% 55%))`;
    b.style.animation = `float ${4 + Math.random()*4}s linear ${Math.random()*2}s infinite`;
    balloonsDiv.appendChild(b);
  }
  // reveal surprise button after some time
  setTimeout(()=> {
    surprise.classList.remove('hidden');
  }, 4500);
}

/* Confetti */
function launchConfetti(){
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;
  (function frame(){
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });
    if(Date.now() < end) requestAnimationFrame(frame);
  })();
}

/* Gallery reveal */
function showGallery() {
  gallery.classList.remove('hidden');
  setTimeout(() => {
    finalSurpriseBtn.classList.remove('hidden');
  }, 1200);
}

/* Reveal final message */

/* Simple falling hearts generator */
function startHearts(){
  // create many hearts progressively
  for(let i=0;i<30;i++){
    setTimeout(()=>createHeart(), i*220);
  }
  // keep generating gently
  setInterval(()=>createHeart(), 1800);
}

function createHeart(){
  const heart = document.createElement('div');
  heart.className = 'falling-heart';
  const size = 12 + Math.random()*28;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${Math.random()*100}vw`;
  heart.style.opacity = 0.85;
  heart.style.backgroundImage = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0))';
  // color palette
  const palettes = ['#ff6fa3','#ff9ac8','#ffd1e6','#ffb3d9','#ff7fb3'];
  heart.style.backgroundColor = palettes[Math.floor(Math.random()*palettes.length)];
  heart.style.borderRadius = '50% 50% 40% 40% / 60% 60% 40% 40%';
  heart.style.position = 'absolute';
  heart.style.zIndex = 1;
  heart.style.pointerEvents = 'none';
  // transform to heart-shape using pseudo via rotated squares is complex — use emoji heart as fallback
  // Use text node heart for perfect shape (emoji)
  heart.textContent = '❤';
  heart.style.fontSize = `${size}px`;
  heart.style.lineHeight = `${size}px`;
  heart.style.textAlign = 'center';
  heartsLayer.appendChild(heart);

  // animate with CSS-ish via JS
  const duration = 4000 + Math.random()*4000;
  const start = performance.now();
  const startX = parseFloat(heart.style.left);
  const sway = (Math.random()*20) - 10;
  (function animate(t){
    const elapsed = t - start;
    const progress = elapsed / duration;
    if(progress >= 1){
      heart.remove();
      return;
    }
    const y = progress * (window.innerHeight + 60);
    const x = startX + Math.sin(progress * Math.PI * 2) * sway;
    heart.style.transform = `translate(${x - startX}vw, ${y}px) rotate(${progress*360}deg)`;
    heart.style.opacity = 1 - progress;
    requestAnimationFrame(animate);
  })(start);
}

/* Starter button to satisfy gesture requirement and also hide overlay */
startBtn?.addEventListener('click', ()=>{
  startEverything();
  // also, if countdown already passed, trigger celebration
  if(Date.now() >= TARGET_DATE) startCelebration();
});

/* If user has already interacted with page (desktop), hide starter quickly after first click anywhere */
document.addEventListener('click', (e)=>{
  if(starter && e.target !== startBtn){
    // If clicked on page but not on start, still try to remove overlay after trying to play
    playMusic().then(()=>{ if(starter) starter.style.display='none'; }).catch(()=>{ /* ignore */ });
  }
});