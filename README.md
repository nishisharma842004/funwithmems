# Meme Generator with Drag-and-Drop Sticker Editor

![Project Banner](/docs/screenshots/banner.png)

## Problem Statement
Traditional meme generators often lack interactive elements and dynamic sticker options, making them less engaging for users who want to create personalized, visually appealing memes with animated elements.

## Objective
To develop a web-based meme generator with:
- Firebase authentication and storage
- Voice-to-text input
- Drag-and-drop sticker functionality
- Animated GIF support
- Real-time preview and editing

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Libraries**: Canvas API, Web Speech API
- **Hosting**: Firebase Hosting

## Features Implemented
1. **User Authentication** (Login/Signup)
2. **Image Upload & Canvas Editing**
3. **Text Customization** (Font size, color, position)
4. **Voice-to-Text Conversion**
5. **Sticker Library**:
   - Static stickers (Thug Life glasses, emojis)
   - Animated GIFs (Dancing banana, rainbow puke)
6. **Drag-and-Drop Interface**
7. **Feedback System**
8. **Meme Download**

## Firebase Setup Explanation
1. **Configuration**:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
  measurementId: "G-ABC123"
};
