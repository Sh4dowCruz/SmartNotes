import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './Tesseract.css'

function OCRImage() {
    const [imagePath, setImagePath] = useState();
    const [ocrText, setOcrText] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [feedback, setFeedbackText] = useState('')
    const [userAnswer, setUserAnswer] = useState('');
    const [temp, setRandomTemp] = useState('');
    const [problemOption, setProblemOption] = useState('');

    function randomTemp(minimum = 0.9, maximum = 2.0){
        return Math.random() * (maximum-minimum) + minimum;
    }

    function selectProblem(event){
        setProblemOption(event.target.value);
    }

    async function multipleChoice(e) {
        const newFile = e.target.files[0];
        const newFilePath = URL.createObjectURL(newFile);
        setImagePath(newFilePath);
        const temp = randomTemp();
        setRandomTemp(temp);

        try {
            const result = await Tesseract.recognize(newFile, "eng");
            const text = result.data.text;
            const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ocrText: text,
                    temperature: temp
                }),
            });
            const data = await response.json();
            setGeneratedText(data.text);
            setOcrText(text);
        } catch (err) {
            console.error(err);
        }
    }

    async function summary(e) {
        const newFile = e.target.files[0];
        const newFilePath = URL.createObjectURL(newFile);
        setImagePath(newFilePath);
        const temp = randomTemp();
        setRandomTemp(temp);

        try {
            const result = await Tesseract.recognize(newFile, "eng");
            const text = result.data.text;
            const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/generate-summary", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ocrText: text,
                    temperature: temp
                }),
            });
            const data = await response.json();
            setGeneratedText(data.text);
            setOcrText(text);
        } catch (err) {
            console.error(err);
        }
    }

    async function truefalse(e) {
        const newFile = e.target.files[0];
        const newFilePath = URL.createObjectURL(newFile);
        setImagePath(newFilePath);
        const temp = randomTemp();
        setRandomTemp(temp);

        try {
            const result = await Tesseract.recognize(newFile, "eng");
            const text = result.data.text;
            const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/generate-true-false", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ocrText: text,
                    temperature: temp
                }),
            });
            const data = await response.json();
            setGeneratedText(data.text);
            setOcrText(text);
        } catch (err) {
            console.error(err);
        }
    }

    async function feedbackButton() {
        try {
          const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/feedback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ generatedText: generatedText,userAnswer }),
          });
          const data = await response.json();
          setFeedbackText(data.feedback);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <div className="App">
            <div>
                <select onChange={selectProblem} value={problemOption}>
                    <option value="">Select from the 3 options</option>
                    <option value="option1">Multiple Choice</option>
                    <option value="option2">Summary</option>
                    <option value="option3">True/False</option>
                </select>
                <br />
                {problemOption === "option1" && (
                    <input type="file" onChange={multipleChoice} />
                )}
                {problemOption === "option2" && (
                    <input type="file" onChange={summary} />
                )}
                {problemOption === "option3" && (
                    <input type="file" onChange={truefalse} />
                )}
            </div>

            <div className="preUploadText">
                <p>Keep in mind the OCR can detect whitespaces as well.</p>
                <p>Temp: {temp}</p>
            </div>

            <div className="uploadedImage">
                {imagePath && <img src={imagePath} alt="userImageUpload" />}
            </div>

            <div className="ocr_image_text">
                <h2>OCR Text</h2>
                <p>{ocrText}</p>
            </div>

            <div className="generated_text">
                <h2>Generated Text</h2>
                <pre>{generatedText}</pre>
            </div>

            <div className='test_Feedback'>
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your solution here. Make sure your answer is as precise as possible."
                />
                <button onClick={feedbackButton}>Results</button>
                {feedback && (
                <div>
                    <h2>Feedback</h2>
                    <pre>{feedback}</pre>
                </div>
                )}
            </div>

        </div>
    );
}

export default OCRImage;