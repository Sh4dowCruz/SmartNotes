const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
async function googleGemini(ocrText) {
  
    const result = await model.generateContent(ocrText);
    const response = await result.response;
    const text = response.text();
    return text;
}

module.exports = googleGemini;