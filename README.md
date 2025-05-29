# Meme Generator with Drag-and-Drop Sticker Editor
## Github Profile
   https://github.com/nishisharma842004
## Demo Link -(https://funwithmems.vercel.app/)

![Project Banner](![WhatsApp Image 2025-05-29 at 12 44 39 PM](https://github.com/user-attachments/assets/80acb4fb-cc8d-4bb8-bf1e-85f7b9cb3586)
)

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

9.**Enabled Services:**

Authentication (Email/Password)

Firestore Database

Storage

9.**Working Screenshot**
Feature	Screenshot (![image](https://github.com/user-attachments/assets/96a91ee4-d07c-49df-95a6-10bd61e4b24b)
)
)
Login Page	Login  (![image](https://github.com/user-attachments/assets/4e250a46-47e1-45c4-88fc-c6cd8dab33b7)
Meme Editor	Editor (![image](https://github.com/user-attachments/assets/0698b50f-8d38-4e0e-88ee-eb7976db52b6)
)
)
Sticker Selection	Stickers (![image](https://github.com/user-attachments/assets/ccb20d01-01ed-45d7-abec-ef61fc46fa4b)
)
)
Voice Input	Voice (![image](https://github.com/user-attachments/assets/985045fe-629b-4abf-b2f5-c1622387aba8)
)
)
Demo meeme (![Uploading my_meme (1).png…]()


Database (![image](https://github.com/user-attachments/assets/f5afdf80-b291-402d-a1b9-548d2073c919)

)
Background  (![image](https://github.com/user-attachments/assets/f5894159-a843-4eed-b9ed-8065fd1f4638)
)

## Future Enhancements
In the future, I aim to take this concept even further by making the interaction more seamless and personalized. Imagine smart stickers that not only detect facial features but also adjust their size, angle, and expression to match the mood in the image — like sunglasses tilting with a smirk. I also plan to enhance the Voice-to-Meme feature so users can casually describe a scenario and instantly get a perfect meme, with auto-selected templates, witty captions, and even voice-over options. Another exciting idea is a Reaction Generator that captures your real-time facial expression through the webcam and instantly converts it into a trending reaction meme — making communication more fun, expressive, and relatable. These enhancements will bring a more “human” touch to the AI, allowing creativity to flow naturally and making meme creation feel more like a conversation than a task.


Hosting
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
