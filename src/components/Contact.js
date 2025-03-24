import React, { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [userInput, setUserInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const sendMessage = async () => {
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    console.log("Loaded API Key:", API_KEY);
  
    if (!API_KEY) {
      console.error("Error: Missing API key in .env file!");
      setAiResponse("Error: API key is missing!");
      return;
    }
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: userInput }] }] // ✅ Correct request format
        },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("API Response:", response.data);
      setAiResponse(response.data.candidates?.[0]?.content || "No response from AI.");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      if (error.response) console.log("Error Details:", error.response.data);
      setAiResponse("Error: Unable to fetch response.");
    }
  };
  
  return (
    <div>
      <h2>Contact AI Chat</h2>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={sendMessage}>Send</button>
      <p>Response: {aiResponse}</p>
    </div>
  );
};

export default Contact;
