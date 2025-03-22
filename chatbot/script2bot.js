const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");

const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const  fileCancelButton=document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// API setup
const API_KEY = "your_api_key_here";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};

// Create message element dynamically and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Bot API call
const generateBotResponse = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message },
            ...(userData.file.data ? [{ inlineData: { mimeType: userData.file.mime_type, data: userData.file.data } }] : []),
          ],
        },
      ],
    }),
  };

  try {
    // Fetch bot response from API
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Extract bot's response text
    const botResponse = data.candidates[0].content.parts[0].text;

    // Remove thinking indicator
    const thinkingMessage = chatBody.querySelector(".thinking");
    if (thinkingMessage) thinkingMessage.remove();

    // Display bot's response
    const messageContent = `
      <svg class="body-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
      </svg>
      <div class="message-text">${botResponse}</div>
    `;
    const incomingMessage = createMessageElement(messageContent, "bot-message");
    chatBody.appendChild(incomingMessage);
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  }
};

// Handle outgoing message
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  if (!userData.message && !userData.file.data) return; // Ignore empty messages

  messageInput.value = "";

  // Create and display user message
  const messageContent = `
    <div class="message-text">${userData.message}</div>
    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}
  `;
  const outgoingMessage = createMessageElement(messageContent, "user-message");
  chatBody.appendChild(outgoingMessage);

  // Simulate bot response with thinking indicator
  setTimeout(() => {
    const messageContent = `
      <svg class="body-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
      </svg>
      <div class="message-text">
        <div class="thinking-indicator">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    `;
    const incomingMessage = createMessageElement(messageContent, "bot-message", "thinking");
    chatBody.appendChild(incomingMessage);

    // Generate bot response
    generateBotResponse();
  }, 600);
};

// Handle Enter key press
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && messageInput.value.trim()) {
    handleOutgoingMessage(e);
  }
});

// Handle file input change
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64string = e.target.result.split(",")[1];

    // Store file data in userData
    userData.file = {
      data: base64string,
      mime_type: file.type,
    };
    fileInput.value = ""; // Clear file input
  };
  reader.readAsDataURL(file);
});
// file-cancel
fileCancelButton.addEventListener("click",()=>{
  userData.file={}
  fileUploadWrapper.classList.remove("file-uploaded");
})

// Handle send message button click
sendMessageButton.addEventListener("click", handleOutgoingMessage);

// Handle file upload button click
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());

// for emoji handling
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePodition: "none",
    previewPosition: "none",
  
    onEmojiSelect: (emoji) => {
      const { selectionStart: start, selectionEnd: end } = messageInput;
      messageInput.setRangeText(emoji.native, start, end, "end");
      messageInput.focus();
    },
  
    onClickOutside: (e) => {
      if (!e.target.closest("#emoji-picker")) {
        document.body.classList.remove("show-emoji-picker");
      }
    },
  });
  
  // Append the picker to the chat form
  document.querySelector(".chat-form").appendChild(picker);
  
  // Toggle the emoji picker visibility when the button is clicked
  document.getElementById("emoji-picker").addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event bubbling
    document.body.classList.toggle("show-emoji-picker");
  });
  
  // Hide the emoji picker when clicking outside of it
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#emoji-picker") && !e.target.closest(".emoji-mart")) {
      document.body.classList.remove("show-emoji-picker");
    }
  });


  //   onClickOutside: (e) => {
  //     if (e.target.id === "emoji-picker") {
  //       document.body.classList.add("show-emoji-picker");
  //     } else {
  //       document.body.classList.remove("show-emoji-picker");
  //     }
      
  //   },
  // });
  // document.querySelector(".chat-form").appendChild(picker);




  // document.querySelector("#emoji-picker").addEventListener("click", () => document.body.classList.add("show-emoji-picker"));
  // document.querySelector("#emoji-picker").addEventListener("click", () => document.body.classList.remove("show-emoji-picker"));

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));






// for mobile user
// Function to check if the user is on a mobile device
// function isMobileDevice() {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// }

// // Add a class to the chatbot container if the user is on a mobile device
// if (isMobileDevice()) {
//   document.querySelector('.chatbot-popup').classList.add('mobile');
// }
