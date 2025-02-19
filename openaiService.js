// openaiService.js

import axios from "axios";
import { REACT_APP_OPENAI_API_KEY } from '@env';


console.log(REACT_APP_OPENAI_API_KEY);


const openaiApi = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    Authorization: `Bearer ${REACT_APP_OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});


export const pingOpenAI = async () => {
  try {
    console.log('Sending request to OpenAI...');
    const response = await openaiApi.post("/chat/completions", {
      model: "gpt-4",
      messages: [{ role: "user", content: "Ping!" }],
    });
    console.log('Response:', response.data); 
    return response.data;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return null;
  }
};

