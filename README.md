# Simple Chat App
Simple JavaScript chat app using Firebase.

## Create & Invite Session
One user can create a chat room, only creator will be provided with the invite code that they can share to others to chat with!
The invite code contains only A-Z and 1-9. When creator leaves the session, the entire session will stop working.

## Setup
In order to make your code work, create Firebase app at https://console.firebase.google.com/.
- Once you do, click on the "Project Overview", you should now see circualr button with "</>" symbol, click on it.
- Provide name and press the blue button.
- You should get the JS code that looks like this:
```js
const firebaseConfig = {
  apiKey: "abcjsbjfbjdhj",
  authDomain: "yourapp-54321.firebaseapp.com",
  projectId: "yourapp-54321",
  storageBucket: "yourapp-54321.appspot.com",
  messagingSenderId: "123456789",
  appId: "12:hajdhg56ge6r4",
  measurementId: "G-SOMETHING",
};
```

Go into `app.js` and replace the old firebaseConfig with the new one. Once you do, you are ready to go!
