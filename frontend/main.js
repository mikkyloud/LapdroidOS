// LapdroidOS Standalone Tablet & Desktop Emulator Logic

// ==========================================
// Device Global State Management
// ==========================================
let isLandscape = true;
let isPoweredOn = true;
let currentVolume = 80;
let activeApps = new Set(); // Tracks currently opened apps for app switcher

// Orientation Rotation Toggling
function toggleOrientation() {
  const device = document.getElementById('device-frame');
  isLandscape = !isLandscape;
  if (isLandscape) {
    device.classList.remove('portrait');
    device.classList.add('landscape');
  } else {
    device.classList.remove('landscape');
    device.classList.add('portrait');
  }
}

// Power State Toggling
function togglePower() {
  const device = document.getElementById('device-frame');
  isPoweredOn = !isPoweredOn;
  if (!isPoweredOn) {
    device.classList.add('power-off');
    // Hide Quick Settings panel & close apps on power-off
    document.getElementById('quick-settings-panel').classList.remove('active');
    document.querySelectorAll('.os-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-lock').classList.add('active');
    stopCamera();
  } else {
    device.classList.remove('power-off');
  }
}

// Volume Adjustments (Side controls or QS panel)
function adjustVolume(delta) {
  currentVolume = Math.max(0, Math.min(100, currentVolume + delta));
  const slider = document.getElementById('volume-slider');
  if (slider) slider.value = currentVolume;
  showSystemToast('🔈 System Volume', `Volume set to ${currentVolume}%`);
}

function adjustVolumeSlider(val) {
  currentVolume = parseInt(val);
  showSystemToast('🔈 System Volume', `Volume set to ${currentVolume}%`);
}

// Brightness Adjustment (Quick Settings Slider Overlay)
function adjustBrightness(val) {
  const overlay = document.getElementById('brightness-overlay');
  // High value means high brightness (low opacity of dark overlay)
  const opacity = (100 - val) / 100 * 0.8; // Max 80% darkness overlay
  overlay.style.opacity = opacity;
}

// Device Shaking (LDPlayer utility style)
function triggerShake() {
  const device = document.getElementById('device-frame');
  device.classList.add('shaking');
  showSystemToast('📳 Emulator Utility', 'Device Shaken!');
  setTimeout(() => device.classList.remove('shaking'), 400);
}

// Custom Toast popup (similar to the system alerts)
function showSystemToast(title, message) {
  console.log(`${title}: ${message}`);
  // Add a simple dynamic toast alert inside the screen container for premium feel
  const screen = document.getElementById('screen-container');
  const toast = document.createElement('div');
  toast.style.position = 'absolute';
  toast.style.bottom = '90px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(0, 0, 0, 0.75)';
  toast.style.backdropFilter = 'blur(10px)';
  toast.style.color = '#fff';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '20px';
  toast.style.fontSize = '12px';
  toast.style.fontWeight = '600';
  toast.style.zIndex = '9999';
  toast.style.pointerEvents = 'none';
  toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
  toast.style.transition = 'opacity 0.3s, bottom 0.3s';
  toast.innerText = `${title} - ${message}`;
  
  screen.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.bottom = '100px';
  }, 2000);
  
  setTimeout(() => {
    screen.removeChild(toast);
  }, 2350);
}

function takeScreenshot() {
  showSystemToast('📸 Screenshot', 'Captured active screen viewport!');
}

// ==========================================
// Quick Settings Pulldown Logic
// ==========================================
function toggleQuickSettings() {
  if (!isPoweredOn) return;
  const panel = document.getElementById('quick-settings-panel');
  panel.classList.toggle('active');
}

// Toggle Wi-Fi, Bluetooth, Airplane Mode, Auto-Rotate
let features = {
  wifi: true,
  bluetooth: true,
  airplane: false,
  rotate: true
};

function toggleQSFeature(featureName) {
  features[featureName] = !features[featureName];
  const toggleBtn = document.getElementById(`toggle-${featureName}`);
  
  if (features[featureName]) {
    toggleBtn.classList.add('active');
  } else {
    toggleBtn.classList.remove('active');
  }
  
  // Custom action behaviors
  if (featureName === 'wifi') {
    const icon = document.getElementById('status-wifi-icon');
    icon.style.opacity = features.wifi ? '1' : '0.25';
    showSystemToast('📶 Wi-Fi', features.wifi ? 'Wi-Fi Connected' : 'Wi-Fi Disconnected');
  }
  if (featureName === 'bluetooth') {
    const icon = document.getElementById('status-bt-icon');
    icon.style.opacity = features.bluetooth ? '1' : '0.25';
    showSystemToast('🔹 Bluetooth', features.bluetooth ? 'Bluetooth On' : 'Bluetooth Off');
  }
  if (featureName === 'airplane') {
    // Turning on airplane mode disables wifi/bluetooth
    if (features.airplane) {
      features.wifi = false;
      features.bluetooth = false;
      document.getElementById('toggle-wifi').classList.remove('active');
      document.getElementById('toggle-bluetooth').classList.remove('active');
      document.getElementById('status-wifi-icon').style.opacity = '0.25';
      document.getElementById('status-bt-icon').style.opacity = '0.25';
      showSystemToast('✈️ Airplane Mode', 'Airplane Mode Enabled');
    } else {
      showSystemToast('✈️ Airplane Mode', 'Airplane Mode Disabled');
    }
  }
  if (featureName === 'rotate') {
    showSystemToast('🔄 Auto-Rotate', features.rotate ? 'Rotation Unlocked' : 'Rotation Locked');
  }
}

// ==========================================
// Status Clock & Time Syncing
// ==========================================
function syncClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  const strTime = hours + ':' + minutes + ' ' + ampm;
  document.getElementById('status-time').innerText = strTime;
  
  if (document.getElementById('qs-time')) {
    document.getElementById('qs-time').innerText = strTime;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const strDate = days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate();
    document.getElementById('qs-date').innerText = strDate;
  }
  
  if (document.getElementById('lock-clock')) {
    document.getElementById('lock-clock').innerText = strTime;
    document.getElementById('lock-date').innerText = now.toDateString();
  }
}
setInterval(syncClock, 1000);
syncClock();

// Swipe-up/Click Unlock
const lockView = document.getElementById('view-lock');
lockView.addEventListener('click', () => {
  if (!isPoweredOn) return;
  lockView.classList.remove('active');
  document.getElementById('view-home').classList.add('active');
});

// ==========================================
// App Navigation & Switcher
// ==========================================
function openApp(appId) {
  if (!isPoweredOn) return;
  
  // Collapse QS pulldown panel on opening an app
  document.getElementById('quick-settings-panel').classList.remove('active');
  
  const target = document.getElementById('app-' + appId);
  if (target) {
    document.getElementById('view-home').classList.remove('active');
    // Hide switcher view if active
    document.getElementById('app-switcher-view').classList.remove('active');
    
    target.classList.add('active');
    activeApps.add(appId); // Add to switcher list
    
    // Init app routines
    if (appId === 'Camera') startCamera();
  } else {
    showSystemToast('🛠️ Launch Error', `${appId} is not configured.`);
  }
}

function goHome() {
  if (!isPoweredOn) return;
  // Collapse QS pulldown panel on home key
  document.getElementById('quick-settings-panel').classList.remove('active');
  
  document.querySelectorAll('.app-window').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById('view-home').classList.add('active');
  stopCamera();
}

function goBack() {
  // Simple Back Key redirects to Home screen in our emulated model
  goHome();
}

// App switcher multitasking overview
function openAppSwitcher() {
  if (!isPoweredOn) return;
  document.getElementById('quick-settings-panel').classList.remove('active');
  
  const switcher = document.getElementById('switcher-grid');
  switcher.innerHTML = ''; // Clean grid
  
  if (activeApps.size === 0) {
    switcher.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #64748b; margin-top: 40px;">No recently used apps.</div>`;
  } else {
    activeApps.forEach(appId => {
      const card = document.createElement('div');
      card.className = 'switcher-card';
      card.innerHTML = `
        <div class="switcher-card-header">
          <span>${appId}</span>
          <span class="switcher-card-close" onclick="closeAppFromSwitcher('${appId}', event)">✕</span>
        </div>
        <div class="switcher-card-body" onclick="openApp('${appId}')">
          Tap to resume
        </div>
      `;
      switcher.appendChild(card);
    });
  }
  
  document.getElementById('view-home').classList.remove('active');
  // Close any active app viewport to open switcher
  document.querySelectorAll('.app-window').forEach(view => {
    if (view.id !== 'app-switcher-view') view.classList.remove('active');
  });
  
  document.getElementById('app-switcher-view').classList.add('active');
}

function closeAppSwitcher() {
  document.getElementById('app-switcher-view').classList.remove('active');
  document.getElementById('view-home').classList.add('active');
}

function closeAppFromSwitcher(appId, event) {
  event.stopPropagation(); // Avoid card resume trigger
  activeApps.delete(appId);
  openAppSwitcher(); // Re-render switcher
}


// ==========================================
// App Specific Modules
// ==========================================

// Play Store App Installation Simulation
function installApp(appName, btnElement) {
  if (btnElement.innerText === 'Installed') return;
  
  btnElement.innerText = 'Installing...';
  
  setTimeout(() => {
    btnElement.innerText = 'Installed';
    btnElement.style.color = '#888';
    btnElement.style.background = '#e2e8f0';
    
    // Append beautiful shortcut dynamically to widescreen grid
    const grid = document.getElementById('home-apps-grid');
    const newApp = document.createElement('div');
    newApp.className = 'app-shortcut';
    
    // Choose custom colorful vector letters for newly installed apps
    let bgStyle = 'background: #cbd5e1;';
    let letter = 'A';
    if (appName === 'Facebook') { bgStyle = 'background: #1877F2;'; letter = 'F'; }
    if (appName === 'Instagram') { bgStyle = 'background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);'; letter = 'I'; }
    if (appName === 'TikTok') { bgStyle = 'background: #000;'; letter = 'T'; }
    
    newApp.innerHTML = `
      <div class="app-icon" style="padding: 0; overflow: hidden;">
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; color: white; ${bgStyle}">${letter}</div>
      </div>
      <span class="app-label">${appName}</span>
    `;
    
    newApp.onclick = () => openApp(appName); // Set launcher trigger
    grid.appendChild(newApp);
    
    // Add dynamically installed app elements to HTML markup for rendering
    createDynamicAppViewport(appName);
    
    showSystemToast('📥 Installation', `${appName} successfully installed!`);
  }, 1200);
}

// Generate new mock viewports for newly installed apps
function createDynamicAppViewport(appName) {
  // If viewport already exists, skip
  if (document.getElementById(`app-${appName}`)) return;
  
  const screen = document.getElementById('screen-container');
  const newView = document.createElement('div');
  newView.id = `app-${appName}`;
  newView.className = 'os-view app-window bg-white';
  
  newView.innerHTML = `
    <div class="app-header">
      <span>${appName} Messenger</span>
      <span class="close-btn" onclick="goHome()">Done</span>
    </div>
    <div class="app-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; color: #475569;">
      <h3 style="font-size: 20px;">Welcome to ${appName} Widescreen!</h3>
      <p style="font-size: 13px;">This is a premium fully emulated frontend card for the newly installed ${appName} tablet application.</p>
    </div>
    <div class="home-indicator" onclick="goHome()"></div>
  `;
  
  screen.appendChild(newView);
}

// WhatsApp Chats
function handleWaEnter(e) {
  if (e.key === 'Enter') sendWaMessage();
}

function sendWaMessage() {
  const input = document.getElementById('wa-input');
  const text = input.value.trim();
  if (!text) return;
  
  const chatBox = document.getElementById('wa-chat-box');
  
  const userBubble = document.createElement('div');
  userBubble.className = 'wa-bubble sent';
  userBubble.innerText = text;
  chatBox.appendChild(userBubble);
  
  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Bot Response
  setTimeout(() => {
    const botBubble = document.createElement('div');
    botBubble.className = 'wa-bubble received';
    botBubble.innerText = "Lapdroid Bot: Excellent, I'm working beautifully on this widescreen display! Try pulling down the status bar or adjusting features in the right-hand sidebar!";
    chatBox.appendChild(botBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 900);
}

// Camera Routines
let streamRef = null;

async function startCamera() {
  try {
    const video = document.getElementById('camera-stream');
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = stream;
    streamRef = stream;
  } catch (err) {
    console.error("Camera access blocked", err);
    document.getElementById('camera-stream').style.background = '#1e293b';
  }
}

function stopCamera() {
  if (streamRef) {
    streamRef.getTracks().forEach(track => track.stop());
    streamRef = null;
  }
}

function snapPhoto() {
  const view = document.getElementById('app-Camera');
  const flash = document.createElement('div');
  flash.style.position = 'absolute';
  flash.style.inset = '0';
  flash.style.backgroundColor = 'white';
  flash.style.zIndex = '9999';
  flash.style.transition = 'opacity 0.25s';
  view.appendChild(flash);
  
  setTimeout(() => { flash.style.opacity = '0'; }, 40);
  setTimeout(() => { view.removeChild(flash); }, 250);
}

// Settings theme
function toggleTheme(checkbox) {
  const appLightBg = checkbox.checked ? '#1e1e24' : '#f8fafc';
  const appTextColor = checkbox.checked ? '#ffffff' : '#1e293b';
  
  document.documentElement.style.setProperty('--app-bg-light', appLightBg);
  document.documentElement.style.setProperty('--text-dark', appTextColor);
  
  const settingsApp = document.getElementById('app-Settings');
  if (checkbox.checked) {
    settingsApp.classList.remove('bg-white');
    settingsApp.classList.add('bg-black');
  } else {
    settingsApp.classList.remove('bg-black');
    settingsApp.classList.add('bg-white');
  }
}

function changeWallpaper() {
  const root = document.documentElement;
  const currentBg = getComputedStyle(root).getPropertyValue('--os-bg').trim();
  const darkBg = "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')";
  const lightBg = "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')";
  
  if (currentBg.includes('1550684848')) {
    root.style.setProperty('--os-bg', lightBg);
  } else {
    root.style.setProperty('--os-bg', darkBg);
  }
}

// ==========================================
// Keyboard Mapping & Gaming Simulator Logic
// ==========================================
let KEY_LEFT = "KeyA";
let KEY_RIGHT = "KeyD";
let KEY_SHOOT = "Space";

let isMappingActive = false;
let currentCapturingAction = null;
let currentCapturingElement = null;

function toggleKeyboardMapping() {
  if (!isPoweredOn) return;
  const panel = document.getElementById('keyboard-mapping-panel');
  isMappingActive = !isMappingActive;
  if (isMappingActive) {
    panel.classList.add('active');
    // Pre-populate input box values from variables
    document.getElementById('km-left-input').value = KEY_LEFT;
    document.getElementById('km-right-input').value = KEY_RIGHT;
    document.getElementById('km-shoot-input').value = KEY_SHOOT;
  } else {
    panel.classList.remove('active');
    cancelKeyCapture();
  }
}

// Click to record a key automatically!
function captureNextKey(element, action) {
  currentCapturingAction = action;
  currentCapturingElement = element;
  element.value = "[ Press any key... ]";
  element.style.borderColor = "#a78bfa";
}

function cancelKeyCapture() {
  currentCapturingAction = null;
  currentCapturingElement = null;
}

// Global listener for capturing keys when input is focused
window.addEventListener('keydown', (e) => {
  if (currentCapturingAction && currentCapturingElement) {
    e.preventDefault();
    const keyCode = e.code; // E.g., 'KeyW', 'ArrowLeft', 'Space'
    currentCapturingElement.value = keyCode;
    
    currentCapturingElement.blur(); // Remove focus
    cancelKeyCapture();
  }
});

function saveKeyboardMappings() {
  const leftVal = document.getElementById('km-left-input').value;
  const rightVal = document.getElementById('km-right-input').value;
  const shootVal = document.getElementById('km-shoot-input').value;
  
  if (leftVal.includes('[') || rightVal.includes('[') || shootVal.includes('[')) {
    showSystemToast('⚠️ Control Error', 'Please map a valid key first.');
    return;
  }
  
  KEY_LEFT = leftVal;
  KEY_RIGHT = rightVal;
  KEY_SHOOT = shootVal;
  
  // Update HUD controls label hints
  document.getElementById('hint-left').innerText = KEY_LEFT.replace('Key', '').replace('Arrow', '');
  document.getElementById('hint-right').innerText = KEY_RIGHT.replace('Key', '').replace('Arrow', '');
  document.getElementById('hint-shoot').innerText = KEY_SHOOT.replace('Key', '').replace('Arrow', '');
  
  showSystemToast('⌨️ Controls Applied', 'Preferred control keys configured!');
  toggleKeyboardMapping();
}

// Space Shooter Game Canvas Logic
let canvas = null;
let ctx = null;
let gameLoopId = null;
let gameActive = false;
let score = 0;

let player = {
  x: 300,
  y: 330,
  width: 40,
  height: 30,
  speed: 6
};

let moveLeft = false;
let moveRight = false;
let lasers = [];
let asteroids = [];

function initSpaceGame() {
  canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  
  score = 0;
  document.getElementById('game-score').innerText = score;
  
  player.x = canvas.width / 2 - player.width / 2;
  lasers = [];
  asteroids = [];
  gameActive = true;
  
  // Mapped Control HUD label update
  document.getElementById('hint-left').innerText = KEY_LEFT.replace('Key', '').replace('Arrow', '');
  document.getElementById('hint-right').innerText = KEY_RIGHT.replace('Key', '').replace('Arrow', '');
  document.getElementById('hint-shoot').innerText = KEY_SHOOT.replace('Key', '').replace('Arrow', '');
  
  // Remove any old loops
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
  runSpaceGameLoop();
}

function runSpaceGameLoop() {
  if (!gameActive) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. Draw glowing space stars background
  ctx.fillStyle = '#020215';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Random star sparks
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 20; i++) {
    const starX = (Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5) * canvas.width;
    const starY = ((Date.now() / 20 + i * 50) % canvas.height);
    ctx.fillRect(starX, starY, 2, 2);
  }
  
  // 2. Move Player Ship
  if (moveLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (moveRight && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
  
  // 3. Draw Player Spaceship (Cool glowing vector triangle)
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#60a5fa';
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();
  
  // Inner core glow
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y + 8);
  ctx.lineTo(player.x + 10, player.y + player.height - 4);
  ctx.lineTo(player.x + player.width - 10, player.y + player.height - 4);
  ctx.closePath();
  ctx.fill();
  
  ctx.shadowBlur = 0; // Reset shadow
  
  // 4. Update and Draw lasers
  ctx.fillStyle = '#f43f5e';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#f43f5e';
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].y -= 8;
    ctx.fillRect(lasers[i].x - 2, lasers[i].y, 4, 12);
    
    // Out of bounds cleanup
    if (lasers[i].y < 0) {
      lasers.splice(i, 1);
    }
  }
  ctx.shadowBlur = 0;
  
  // 5. Spawn Asteroids
  if (Math.random() < 0.02 && asteroids.length < 8) {
    asteroids.push({
      x: Math.random() * (canvas.width - 30) + 15,
      y: -30,
      size: Math.random() * 20 + 15,
      speed: Math.random() * 2 + 1.5,
      color: `hsl(${Math.random() * 360}, 60%, 50%)`
    });
  }
  
  // 6. Update and Draw Asteroids
  for (let i = asteroids.length - 1; i >= 0; i--) {
    asteroids[i].y += asteroids[i].speed;
    
    ctx.fillStyle = asteroids[i].color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = asteroids[i].color;
    ctx.beginPath();
    ctx.arc(asteroids[i].x, asteroids[i].y, asteroids[i].size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Collision: Asteroid hits player ship
    if (
      asteroids[i].x + asteroids[i].size / 2 > player.x &&
      asteroids[i].x - asteroids[i].size / 2 < player.x + player.width &&
      asteroids[i].y + asteroids[i].size / 2 > player.y &&
      asteroids[i].y - asteroids[i].size / 2 < player.y + player.height
    ) {
      score = Math.max(0, score - 5);
      document.getElementById('game-score').innerText = score;
      asteroids.splice(i, 1);
      showSystemToast('💥 Collision!', 'Asteroid hit your ship!');
      triggerShake();
      continue;
    }
    
    // Out of bounds cleanup
    if (asteroids[i].y > canvas.height + 20) {
      asteroids.splice(i, 1);
    }
  }
  
  // 7. Laser Collision with Asteroids
  for (let l = lasers.length - 1; l >= 0; l--) {
    for (let a = asteroids.length - 1; a >= 0; a--) {
      const dist = Math.hypot(lasers[l].x - asteroids[a].x, lasers[l].y - asteroids[a].y);
      if (dist < asteroids[a].size / 2 + 4) {
        // HIT!
        score += 10;
        document.getElementById('game-score').innerText = score;
        asteroids.splice(a, 1);
        lasers.splice(l, 1);
        break; // Out of inner loop, laser spent
      }
    }
  }
  
  gameLoopId = requestAnimationFrame(runSpaceGameLoop);
}

// Hook keydown/keyup events for dynamically mapped keys
window.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  
  // Do not trigger game moves if typing in controls mapper input boxes
  if (isMappingActive) return;
  
  if (e.code === KEY_LEFT) {
    moveLeft = true;
    e.preventDefault();
  }
  if (e.code === KEY_RIGHT) {
    moveRight = true;
    e.preventDefault();
  }
  if (e.code === KEY_SHOOT) {
    // Fire laser!
    lasers.push({
      x: player.x + player.width / 2,
      y: player.y
    });
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  if (!gameActive) return;
  
  if (e.code === KEY_LEFT) {
    moveLeft = false;
  }
  if (e.code === KEY_RIGHT) {
    moveRight = false;
  }
});

// Update openApp to trigger game initiation
const originalOpenApp = openApp;
openApp = function(appId) {
  originalOpenApp(appId);
  if (appId === 'RetroGame') {
    initSpaceGame();
  }
};

// Update goHome to turn off game loop
const originalGoHome = goHome;
goHome = function() {
  originalGoHome();
  gameActive = false;
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
};
