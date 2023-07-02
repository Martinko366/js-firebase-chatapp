// Change this with your Firebase credentials
const firebaseConfig = {
  apiKey: "abcjsbjfbjdhj",
  authDomain: "yourapp-54321.firebaseapp.com",
  projectId: "yourapp-54321",
  storageBucket: "yourapp-54321.appspot.com",
  messagingSenderId: "123456789",
  appId: "12:hajdhg56ge6r4",
  measurementId: "G-SOMETHING",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firestore instance
const db = firebase.firestore();

// DOM elements
const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("nickname-input");
const nicknameSubmit = document.getElementById("nickname-submit");
const inviteForm = document.getElementById("invite-form");
const inviteCodeElement = document.getElementById("invite-code");
const createButton = document.getElementById("create-button");
const joinButton = document.getElementById("join-button");
const joinForm = document.getElementById("join-form");
const inviteInput = document.getElementById("invite-input");
const joinSubmit = document.getElementById("join-submit");
const chatbox = document.getElementById("chatbox");
const roomCodeElement = document.getElementById("room-code");
const messagesElement = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const leaveButton = document.getElementById("leave-button");

let nickname;
let roomCode;

// Event listeners
nicknameSubmit.addEventListener("click", handleNicknameSubmit);
createButton.addEventListener("click", handleCreate);
joinButton.addEventListener("click", handleJoin);
joinSubmit.addEventListener("click", handleJoinSubmit);
messageInput.addEventListener("keydown", handleMessageKeyDown);
leaveButton.addEventListener("click", handleLeave);

// Function to handle nickname submission
function handleNicknameSubmit(e) {
  e.preventDefault();
  nickname = nicknameInput.value.trim();
  if (nickname !== "") {
    nicknameForm.style.display = "none";
    inviteForm.style.display = "block";
  }
}

// Function to generate a random alphanumeric string
function generateInviteCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to handle "Create" button click
function handleCreate() {
  roomCode = generateInviteCode(6);
  inviteCodeElement.textContent = roomCode;

  createButton.style.display = "none";
  joinButton.style.display = "none";
  inviteForm.style.display = "none";
  chatbox.style.display = "block";

  roomCodeElement.textContent = `Share this room code: ${roomCode}`;

  // Save the nickname and room code to Firestore
  saveNicknameAndRoomCode(nickname, roomCode);
}

// Function to handle "Join" button click
function handleJoin() {
  inviteForm.style.display = "none";
  joinForm.style.display = "block";
}

// Function to handle "Join" form submission
function handleJoinSubmit(e) {
  e.preventDefault();
  roomCode = inviteInput.value.trim();
  if (roomCode !== "") {
    joinForm.style.display = "none";
    chatbox.style.display = "block";
    // Save the nickname and room code to Firestore
    saveNicknameAndRoomCode(nickname, roomCode);
  }
}

// Function to handle message submission on Enter key press
function handleMessageKeyDown(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== "") {
      messageInput.value = "";
      sendMessage(nickname, message);
    }
  }
}

// Function to handle "Leave" button click
function handleLeave() {
  // Delete the room from Firestore
  deleteRoom(roomCode);
  // Refresh the page to start over
  location.reload();
}

// Function to save the nickname and room code to Firestore
function saveNicknameAndRoomCode(nickname, roomCode) {
  db.collection("rooms").doc(roomCode).set({
    nickname: nickname,
    roomCode: roomCode,
  });
  listenForMessages(roomCode);
}

// Function to listen for messages in the chat room
function listenForMessages(roomCode) {
  db.collection("rooms")
    .doc(roomCode)
    .collection("messages")
    .orderBy("timestamp")
    .onSnapshot(function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        if (change.type === "added") {
          const message = change.doc.data().message;
          const sender = change.doc.data().sender;
          displayMessage(sender, message);
        }
      });
    });
}

// Function to send a message
function sendMessage(sender, message) {
  db.collection("rooms").doc(roomCode).collection("messages").add({
    sender: sender,
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// Function to display a message in the chatbox
function displayMessage(sender, message) {
  const messageContainer = document.createElement("div");
  const isCurrentUser = sender === nickname;

  // Create container for nickname and image
  const nicknameContainer = document.createElement("div");
  nicknameContainer.classList.add("nickname-container");

  // Create image element
  const imageElement = document.createElement("img");
  imageElement.classList.add("user-image");
  imageElement.src = `https://avatars.dicebear.com/api/identicon/${sender}.svg`;

  // Create nickname element
  const nicknameElement = document.createElement("p");
  nicknameElement.classList.add("nickname");
  nicknameElement.textContent = sender;

  // Create message element
  const messageContentElement = document.createElement("p");
  messageContentElement.classList.add("message");
  messageContentElement.textContent = message;

  // Append elements to the nickname container
  nicknameContainer.appendChild(imageElement);
  nicknameContainer.appendChild(nicknameElement);

  // Append nickname container and message element to the message container
  messageContainer.appendChild(nicknameContainer);
  messageContainer.appendChild(messageContentElement);

  messagesElement.appendChild(messageContainer);

  // Scroll to the bottom of the chatbox
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

// Function to delete the room from Firestore
function deleteRoom(roomCode) {
  db.collection("rooms").doc(roomCode).delete();
}
