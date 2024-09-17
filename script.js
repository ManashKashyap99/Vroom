const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const processing = document.getElementById("processing");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let toggleBtn = null;
if (typeof SpeechRecognition === "undefined") 
{
  startBtn.remove();
  result.innerHTML = "Your browser doesn't support Speech API. \nPlease download latest Chrome version.";
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = event => {
    const current = event.resultIndex;
    const recognitionResult = event.results[current];
    const recognitionText = recognitionResult[0].transcript;
   
    if (recognitionResult.isFinal) {
      processing.innerHTML = "processing ...";
  
      const response = process(recognitionText);
      const p = document.createElement("p");
      p.innerHTML = `<strong>You said:</strong> ${recognitionText} 
                     </br><strong>Vroom said:</strong> ${response}`;
      processing.innerHTML = "";
      result.appendChild(p);
      
      readOutLoud(response);
    } else {
      processing.innerHTML = `listening: ${recognitionText}`;
    }
  };

let listening = false;

toggleBtn = () => 
{
  if (listening) 
  {
    recognition.stop();
    startBtn.textContent = "Start listening";
  } 
  else 
  {
    recognition.start();
    startBtn.textContent = "Stop listening";
  }
  listening = !listening;
};

startBtn.addEventListener("click", toggleBtn);

function process(rawText) 
{
    let text = rawText.replace(/\s/g, "").replace(/\'/g, "");
    text = text.toLowerCase();
    let response = null;
  
    if (text.includes("hello") || text.trim() == "hi" || text.includes("hey")) 
    {
        response = "Hi, My name is Vroom";
    } 
    else if (text.includes("Name")) 
    {
      response = "My name is Vroom";
    } 
    else if (text.includes("howareyou")||text.includes("whatsup")) 
    {
      response = "I'm fine. How about you?";
    } 
    else if (text.includes("whattimeisit")) 
    {
      response = new Date().toLocaleTimeString();
    } 
    else if (text.includes("whatisthetime")) 
    {
        response = new Date().toLocaleTimeString();
    } 
    else if (text.includes("open") && text.includes("vtop")) 
    {
        response = "Opened it in another tab";
        window.open("https://vtop.vit.ac.in/vtop/open/page","_blank", "noopener");
    } 
    else if (text.includes("play") && text.includes("despacito")) 
    {
      response = "Opened it in another tab";
      window.open("https://www.youtube.com/watch?v=kJQP7kiw5Fk","_blank", "noopener");
    } 
    else if (text.includes("open") && text.includes("moodle")) 
    {
        response = "Opened it in another tab";
        window.open("https://moovit.vit.ac.in/login/","_blank", "noopener");
    } 
    else if (text.includes("meaning of") || text.includes("definition of")) 
    {
      const word = text.split("of")[1].trim();
      response = "Let me look up the definition of ${word}.";
      fetchDictionaryDefinition(word); // Fetch word definition
    }
    else if (text.includes("flip") && text.includes("coin")) 
    {
      response = Math.random() < 0.5 ? 'heads' : 'tails';
    } 
    else if (text.includes("bye") || text.includes("stop")) 
    {
      response = "Bye!!";
      toggleBtn();
    }
  
    if (!response) 
    {
      window.open(`http://google.com/search?q=${rawText.replace("search", "")}`,"_blank");
      return `I found some information for ${rawText}`;
    }
  
    return response;
  }
  
// Fetch dictionary definition from Dictionary API
function fetchDictionaryDefinition(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data && data.length > 0) {
              const definition = data[0].meanings[0].definitions[0].definition;
              const p = document.createElement("p");
              p.innerHTML = `<strong>Definition of ${word}:</strong> ${definition}`;
              result.appendChild(p);
              readOutLoud(definition);
          } else {
              const p = document.createElement("p");
              p.innerHTML = `I couldn't find a definition for ${word}.`;
              result.appendChild(p);
              readOutLoud(`I couldn't find a definition for ${word}.`);
          }
      })
      .catch(err => {
          const p = document.createElement("p");
          p.innerHTML = `Error fetching the definition. Please try again later.`;
          result.appendChild(p);
          readOutLoud("Error fetching the definition. Please try again later.");
      });
}

function getRandomItemFromArray(array) 
{
    const randomItem = array[Math.floor(Math.random() * array.length)];
    return randomItem;
};

function readOutLoud(message) 
{
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1.8;
    speech.voice = voices[3];
  
    window.speechSynthesis.speak(speech);
}

window.speechSynthesis.onvoiceschanged = function() 
{
    voices = window.speechSynthesis.getVoices();
};