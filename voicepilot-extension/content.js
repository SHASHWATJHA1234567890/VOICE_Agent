alert("Content script running!");
console.log("Content script loaded")
// 1. Create floating mic button
//document.addEventListener("DOMContentLoaded", () => {
const micButton = document.createElement("button");
micButton.innerText = "🎤";
micButton.style.position = "fixed";
micButton.style.bottom = "20px";
micButton.style.right = "20px";
micButton.style.zIndex = "9999";
micButton.style.padding = "12px";
micButton.style.borderRadius = "50%";
micButton.style.background = "blue";
micButton.style.color = "white";
document.body.appendChild(micButton);
micButton.addEventListener("click", startVoiceQuery);
  //const micImg = document.createElement("img");
  //micImg.src = chrome.runtime.getURL("icons/mic.png");
  //micImg.style.width = "24px";
  //micImg.style.height = "24px";
  //micButton.appendChild(micImg);
  //micButton.addEventListener("click", startVoiceQuery);
  //});

  // 2. Voice to text using WebSpeech API
function startVoiceQuery() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = async (event) => {
      const query = event.results[0][0].transcript;
      const pageText = document.body.innerText.slice(0, 3000); // Truncate for size
  
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page_text: pageText })
      });
  
      const data = await response.json();
      console.log("LLM response:", data);

      if (data.answer) {
        speakText(data.answer);
      } else {
        console.error("No answer in response");
      }
          };
        
          recognition.onerror = (err) => {
            console.error("Voice recognition error:", err);
          };
        }

  // 3. Text to speech
function speakText(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  }
  
//console.log("Content Script Loaded");


//const micButton = document.createElement("button");
//micButton.style.position = "fixed";
//micButton.style.bottom = "20px";
//micButton.style.right = "20px";
//micButton.style.zIndex = "9999";
//micButton.style.padding = "10px";
//micButton.style.borderRadius = "50%";
//micButton.style.border = "none";
//micButton.style.background = "#ffffff";
//micButton.style.cursor = "pointer";