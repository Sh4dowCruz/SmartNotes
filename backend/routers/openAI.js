const { OpenAI } = require('openai');

const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY});

/* 
https://platform.openai.com/docs/models/gpt-4o
gpt-4o-mini is cheapest model, smaller tasks
gpt-40 is slightly more expensive but not by much

https://platform.openai.com/docs/api-reference/chat/create
*/
async function openAI(ocrText) {
  const completion = await openai.chat.completions.create({
    messages: [
        {"role": "system", "content": "You are designed to work in a company called `Smart Notes`. The company `Smart Notes` is designed to help students create guides on topics of their choice. The structure of `Smart Notes` is as follows: \n\n 1. Students upload an image into the application. The image is converted into text with the use of OCR (optical character recognition).\n 2. Your will generate problem based questions or guides on whatever problem type the user chooses with the use of the text that was read from the image. "},
        {"role": "user", "content": ocrText}
      ],
    model: "gpt-4o-mini",
  });
  const text = completion.choices[0].message.content;
  return text;
}

module.exports = openAI;