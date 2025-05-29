// Import Firebase modules
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD1Q0RqlOMx4GuXZPAnitwPmeRcHfFkCQU",
  authDomain: "funny-73192.firebaseapp.com",
  projectId: "funny-73192",
  storageBucket: "funny-73192.appspot.com",
  messagingSenderId: "326331283760",
  appId: "1:326331283760:web:de2f108fa8e2ba64ebb0f5",
  measurementId: "G-CX6HDJ4JSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authPage = document.getElementById('auth-page');
const appPage = document.getElementById('app-page');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const authStatus = document.getElementById('auth-status');
const signupStatus = document.getElementById('signup-status');

// Meme Generator Elements
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const textColorInput = document.getElementById('textColor');
const fontSizeSelect = document.getElementById('fontSize');
const emojiPicker = document.getElementById('emojiPicker');
const stickerPicker = document.getElementById('stickerPicker');
const generateBtn = document.getElementById('generateBtn');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');
const feedbackInput = document.getElementById('feedback');
const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
const feedbackListDiv = document.getElementById('feedbackList');

// Voice Recognition Elements
let recognition;
let isListening = false;
const voiceBtn = document.getElementById('voiceBtn');
const voiceStatus = document.getElementById('voiceStatus');
const voiceTextPreview = document.getElementById('voiceTextPreview');
const voiceTextPosition = document.getElementById('voiceTextPosition');

let image = new Image();
let texts = {
  topText: { text: "", x: canvas.width / 2, y: 50 },
  bottomText: { text: "", x: canvas.width / 2, y: canvas.height - 30 }
};
let draggingText = null;
let dragOffset = { x: 0, y: 0 };

// Sticker functionality
let stickers = [];
let selectedSticker = null;
let isDraggingSticker = false;
let dragStickerOffset = { x: 0, y: 0 };
let animationFrame;
let lastTimestamp = 0;
const animatedStickers = [];

// Sticker images
const stickerImages = {
  'thug-life': 'https://i.imgur.com/XWbpt2u.png',
  'deal-with-it': 'https://i.imgur.com/3Q0yNIn.png',
  'cool-emoji': '😎',
  'fire': '🔥',
  '100': '💯',
  'mind-blown': '🤯',
  'party-popper': '🎉'
};

// Initialize voice recognition
function initVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    voiceBtn.disabled = true;
    voiceStatus.textContent = "Voice not supported";
    return;
  }

  recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = function() {
    isListening = true;
    voiceBtn.classList.add('listening');
    voiceStatus.textContent = "Listening...";
  };

  recognition.onerror = function(event) {
    console.error("Speech recognition error", event.error);
    voiceStatus.textContent = "Error: " + event.error;
    stopListening();
  };

  recognition.onend = function() {
    stopListening();
  };

  recognition.onresult = function(event) {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (interimTranscript) {
      voiceTextPreview.textContent = interimTranscript;
    }

    if (finalTranscript) {
      voiceTextPreview.textContent = finalTranscript;
      processVoiceText(finalTranscript);
    }
  };
}

function startListening() {
  if (!recognition) {
    initVoiceRecognition();
  }
  
  try {
    recognition.start();
  } catch (error) {
    console.error("Recognition start error:", error);
    voiceStatus.textContent = "Error starting voice";
  }
}

function stopListening() {
  isListening = false;
  voiceBtn.classList.remove('listening');
  voiceStatus.textContent = "Start Speaking";
}

function processVoiceText(text) {
  const position = voiceTextPosition.value;
  
  switch(position) {
    case 'top':
      topTextInput.value = text;
      break;
    case 'bottom':
      bottomTextInput.value = text;
      break;
    case 'both':
      const words = text.split(' ');
      const half = Math.ceil(words.length / 2);
      topTextInput.value = words.slice(0, half).join(' ');
      bottomTextInput.value = words.slice(half).join(' ');
      break;
  }
  
  generateMeme();
}

// Auth Tab Switching
loginTab.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.add('active');
  signupForm.classList.remove('active');
});

signupTab.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.add('active');
  loginForm.classList.remove('active');
});

// Auth State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    authPage.classList.remove('active');
    appPage.classList.add('active');
    loadFeedbacks();
  } else {
    authPage.classList.add('active');
    appPage.classList.remove('active');
    resetCanvas();
  }
});

// Login Function
loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  if (!email || !password) {
    authStatus.textContent = "Please fill in all fields";
    return;
  }
  
  try {
    authStatus.textContent = "Logging in...";
    await signInWithEmailAndPassword(auth, email, password);
    authStatus.textContent = "";
    document.getElementById('login-email').value = "";
    document.getElementById('login-password').value = "";
  } catch (error) {
    authStatus.textContent = "Error: " + error.message;
  }
});

// Signup Function
signupBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  
  if (!email || !password || !confirm) {
    signupStatus.textContent = "Please fill in all fields";
    return;
  }
  
  if (password !== confirm) {
    signupStatus.textContent = "Passwords don't match!";
    return;
  }
  
  try {
    signupStatus.textContent = "Creating account...";
    await createUserWithEmailAndPassword(auth, email, password);
    signupStatus.textContent = "Account created successfully!";
    document.getElementById('signup-email').value = "";
    document.getElementById('signup-password').value = "";
    document.getElementById('signup-confirm').value = "";
    
    setTimeout(() => {
      loginTab.click();
      signupStatus.textContent = "";
    }, 1500);
  } catch (error) {
    signupStatus.textContent = "Error: " + error.message;
  }
});

// Logout Function
logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Meme Generator Functions
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    image.onload = function() {
      canvas.width = image.width > 700 ? 700 : image.width;
      canvas.height = (image.height * canvas.width) / image.width;

      texts.topText.x = canvas.width / 2;
      texts.topText.y = 50;
      texts.bottomText.x = canvas.width / 2;
      texts.bottomText.y = canvas.height - 30;

      drawMeme();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

function drawMeme() {
  if (!image.src) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Draw text
  ctx.textAlign = "center";
  ctx.fillStyle = textColorInput.value;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = `${fontSizeSelect.value}px Impact`;
  ctx.lineJoin = "round";

  Object.values(texts).forEach(({ text, x, y }) => {
    if (!text) return;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  });
  
  // Draw stickers
  stickers.forEach(sticker => {
    ctx.save();
    ctx.translate(sticker.x, sticker.y);
    ctx.rotate(sticker.rotation * Math.PI / 180);
    ctx.scale(sticker.scale, sticker.scale);
    
    if (sticker.type === 'image') {
      ctx.drawImage(
        sticker.content, 
        -sticker.width/2, 
        -sticker.height/2, 
        sticker.width, 
        sticker.height
      );
    } else if (sticker.type === 'emoji') {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${sticker.height}px Arial`;
      ctx.fillText(sticker.content, 0, 0);
    }
    
    ctx.restore();
  });
}

function generateMeme() {
  texts.topText.text = topTextInput.value;
  texts.bottomText.text = bottomTextInput.value;
  drawMeme();
}

function shareMeme() {
  if (!image.src) {
    alert("Please upload an image first!");
    return;
  }
  generateMeme();
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "my_meme.png";
  link.click();
}

function resetCanvas() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  animatedStickers.length = 0;
  image = new Image();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  topTextInput.value = "";
  bottomTextInput.value = "";
  texts.topText.text = "";
  texts.bottomText.bottomText = "";
  imageUpload.value = "";
  stickers = [];
}

emojiPicker.addEventListener('change', () => {
  const emoji = emojiPicker.value;
  if (!emoji) return;

  if (document.activeElement === topTextInput) {
    topTextInput.value += emoji;
  } else if (document.activeElement === bottomTextInput) {
    bottomTextInput.value += emoji;
  } else {
    bottomTextInput.value += emoji;
  }
  emojiPicker.value = "";
  generateMeme();
});

// Add sticker to canvas
stickerPicker.addEventListener('change', () => {
  const stickerType = stickerPicker.value;
  if (!stickerType) return;
  
  if (stickerType === 'cool-emoji' || stickerType === 'fire' || 
      stickerType === '100' || stickerType === 'mind-blown' || stickerType === 'party-popper') {
    // For emoji stickers
    addSticker({
      type: 'emoji',
      content: stickerImages[stickerType],
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: 50,
      height: 50,
      scale: 1,
      rotation: 0
    });
  } else {
    // For image stickers
    const img = new Image();
    img.onload = function() {
      addSticker({
        type: 'image',
        content: img,
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: img.width > 150 ? 150 : img.width,
        height: img.width > 150 ? (img.height * 150) / img.width : img.height,
        scale: 1,
        rotation: 0
      });
    };
    img.src = stickerImages[stickerType];
  }
  
  stickerPicker.value = "";
});

function addSticker(sticker) {
  stickers.push(sticker);
  
  if (sticker.content === '🎉') {
    sticker.animation = {
      angle: 0,
      scale: 1,
      growing: true
    };
    animatedStickers.push(sticker);
    startAnimation();
  }
  
  drawMeme();
}

// Animation loop
function startAnimation() {
  if (animationFrame) return;
  
  function animate(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    animatedStickers.forEach(sticker => {
      // Rotate
      sticker.rotation = (sticker.rotation + (20 * deltaTime / 1000)) % 360;
      
      // Pulse scale
      if (sticker.animation.growing) {
        sticker.scale += 0.005 * deltaTime / 16;
        if (sticker.scale >= 1.5) sticker.animation.growing = false;
      } else {
        sticker.scale -= 0.005 * deltaTime / 16;
        if (sticker.scale <= 1) sticker.animation.growing = true;
      }
    });
    
    drawMeme();
    animationFrame = requestAnimationFrame(animate);
  }
  
  animationFrame = requestAnimationFrame(animate);
}

// Drag & Drop Text on Canvas
canvas.addEventListener('mousedown', (e) => {
  const mousePos = getMousePos(e);
  
  // First check if we're clicking on text
  draggingText = getTextAtPos(mousePos);
  if (draggingText) {
    dragOffset.x = mousePos.x - draggingText.x;
    dragOffset.y = mousePos.y - draggingText.y;
    return;
  }
  
  // Then check if we're clicking on a sticker
  for (let i = stickers.length - 1; i >= 0; i--) {
    const sticker = stickers[i];
    const stickerWidth = sticker.width * sticker.scale;
    const stickerHeight = sticker.height * sticker.scale;
    
    if (mousePos.x >= sticker.x - stickerWidth/2 && 
        mousePos.x <= sticker.x + stickerWidth/2 &&
        mousePos.y >= sticker.y - stickerHeight/2 && 
        mousePos.y <= sticker.y + stickerHeight/2) {
      selectedSticker = sticker;
      isDraggingSticker = true;
      dragStickerOffset.x = mousePos.x - sticker.x;
      dragStickerOffset.y = mousePos.y - sticker.y;
      
      // Move sticker to top of array (z-index)
      stickers.splice(i, 1);
      stickers.push(sticker);
      
      break;
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  const mousePos = getMousePos(e);
  
  if (draggingText) {
    draggingText.x = mousePos.x - dragOffset.x;
    draggingText.y = mousePos.y - dragOffset.y;
    drawMeme();
    return;
  }
  
  if (isDraggingSticker && selectedSticker) {
    selectedSticker.x = mousePos.x - dragStickerOffset.x;
    selectedSticker.y = mousePos.y - dragStickerOffset.y;
    drawMeme();
  }
});

canvas.addEventListener('mouseup', () => { 
  draggingText = null;
  isDraggingSticker = false;
  selectedSticker = null;
});

canvas.addEventListener('mouseleave', () => { 
  draggingText = null;
  isDraggingSticker = false;
  selectedSticker = null;
});

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getTextAtPos(pos) {
  const threshold = 20;
  for (const key in texts) {
    const t = texts[key];
    const dx = pos.x - t.x;
    const dy = pos.y - t.y;
    if (Math.sqrt(dx * dx + dy * dy) < threshold) {
      return t;
    }
  }
  return null;
}

// Voice Button Event Listener
voiceBtn.addEventListener('click', function() {
  if (isListening) {
    recognition.stop();
    stopListening();
  } else {
    voiceTextPreview.textContent = '';
    startListening();
  }
});

// Meme Generator Event Listeners
generateBtn.addEventListener('click', generateMeme);
shareBtn.addEventListener('click', shareMeme);
resetBtn.addEventListener('click', resetCanvas);

// Feedback System
submitFeedbackBtn.addEventListener('click', async () => {
  const feedbackText = feedbackInput.value.trim();
  if (!feedbackText) {
    alert("Please enter some feedback.");
    return;
  }
  
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to submit feedback");
    return;
  }
  
  try {
    await addDoc(collection(db, "feedbacks"), {
      text: feedbackText,
      timestamp: Date.now(),
      userId: user.uid,
      userEmail: user.email
    });
    feedbackInput.value = "";
    alert("Thank you for your feedback!");
    loadFeedbacks();
  } catch (error) {
    alert("Error submitting feedback: " + error.message);
  }
});

async function loadFeedbacks() {
  feedbackListDiv.innerHTML = "Loading feedbacks...";
  try {
    const q = query(collection(db, "feedbacks"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      feedbackListDiv.innerHTML = "<p>No feedbacks yet.</p>";
      return;
    }
    feedbackListDiv.innerHTML = "";
    querySnapshot.forEach(doc => {
      const fb = doc.data();
      const div = document.createElement("div");
      div.className = "feedback-item";
      
      const p = document.createElement("p");
      p.textContent = fb.text;
      div.appendChild(p);
      
      const small = document.createElement("small");
      small.textContent = `Posted by: ${fb.userEmail || 'anonymous'}`;
      div.appendChild(small);
      
      feedbackListDiv.appendChild(div);
    });
  } catch (error) {
    feedbackListDiv.innerHTML = "Error loading feedbacks: " + error.message;
  }
}

// Initialize voice recognition when app loads
document.addEventListener('DOMContentLoaded', function() {
  initVoiceRecognition();
});