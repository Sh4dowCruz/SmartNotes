/*Serin*/
import React, { useState, useEffect, useContext } from 'react';
import "./Generate.css";
import Wand from './Wand.png';
import BlackWand from './BlackWand.png';
import Upload from './Upload.png';
import Summarize from './Summarize.jpg';
import MultipleChoice from './MultipleChoice.jpg';
import TrueFalse from './TrueFalse.jpg';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { OcrContext } from '../question/OcrContext';

function Generate() {
    const [file, setFile] = useState(null);
    const [option, setOption] = useState('');
    const [approved, setApproved] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { ocrText, setOcrText } = useContext(OcrContext);
    const [labelText, setLabelText] = useState('Upload');

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        setOcrText('');
    }, [setOcrText]);

    const handleFileChange = async (event) => {
        setFile(event.target.files[0]);
        setIsProcessing(true); 
        setLabelText('Uploading...');

        if (event.target.files[0]) {
            try {
                const result = await Tesseract.recognize(event.target.files[0], 'eng', {
                    logger: (m) => console.log(m),
                });
                const text = result.data.text;
                setOcrText(text);
                setIsProcessing(false); 
                setLabelText('Uploaded');
                
            } catch (error) {
                console.error('Error processing file with Tesseract.js:', error);
                setIsProcessing(false);
                setLabelText('Error');
                
            }
        }
    };

    const handleOptionChange = (event) => {
        setOption(event.target.value);
    };

    const handleInputChange = (event) => {
        setOcrText(event.target.value);  
    };

    const handleGenerate = async () => {
        if (!option || !approved) {
            alert('Please upload a file, select an option, and approve the content.');
            return;
        }
        if (option === 'summarize') {
            navigate('/summarize');
        } else if (option === 'multipleChoice') {
            navigate('/multiple-choice');
        } else if (option === 'trueFalse') {
            navigate('/true-false');
        } 

    };
    
    return (
        <div className="generate-page">
            <div className="heading-icon">
                <h1>Generate Study Materials (Enhanced by AI)</h1> 
                <img src={BlackWand} alt="Generate Icon" className="generate-sticker"/>
            </div>
            <input 
                type="file"
                accept ="image/*"
                onChange={handleFileChange}
                style = {{display: 'none'}}
                id = "container-upload"
            />
            <label htmlFor="container-upload" className="upload-button">
                {labelText}<img src={Upload} alt="Upload Icon" className="upload-sticker"/>
            </label>
            <div className="table">
                <div className="upload-box">
                    <textarea
                        type="text"
                        placeholder="Waiting for the document to be uploaded....."
                        value={ocrText}
                        onChange={handleInputChange}
                        className="text-input"
                    />
                </div>
                <div className="options-container">
                    <h2 className="option">Select an option from below:</h2>
                        <div className="option-box">
                            <label>
                                <input type="radio" className="checkbox" value="summarize" checked={option === 'summarize'} onChange={handleOptionChange} />
                                Summarize
                            </label> 
                            <label>
                                <input type="radio" className="checkbox" value="multipleChoice" checked={option === 'multipleChoice'} onChange={handleOptionChange} />
                                Multiple Choice
                            </label>
                            <label>
                                <input type="radio" className="checkbox" value="trueFalse" checked={option === 'trueFalse'} onChange={handleOptionChange} />
                                True or False
                            </label>
                                <div className="notice">
                                    Please make sure the scanned notes <br></br> are correct before clicking generate
                                </div>
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox" checked={approved} onChange={() => setApproved(!approved)} />
                                Approve the scanned notes
                            </label>
                        </div>
                        <button
                            onClick={handleGenerate}
                            onMouseOver={() => setButtonHover(true)}
                            onMouseOut={() => setButtonHover(false)}
                            className={`generate-button ${buttonHover ? 'hover' : ''}`}
                        >
                            Generate
                            <img src={Wand} alt="Generate Icon" className="generate-sticker-sub"/>
                        </button>
                </div>
            </div>
                <div className="card1-container">
                    <div className="card1">
                        <img src={Summarize} alt="Summarize"/>
                        <h3>Summarize</h3>
                        <p>Generate a short summary of your uploaded notes that you can review quickly.</p>
                    </div>
                    <div className="card1">
                        <img src={MultipleChoice} alt="Multiple Choice"/>
                        <h3>Multiple Choice</h3>
                        <p>Generate multiple choice questions that you can quiz yourself on.</p>
                        </div>
                    <div className="card1">
                        <img src={TrueFalse} alt="True or False"/>
                        <h3>True or False</h3>
                        <p>Generate simple true or false questions that you can quiz fast on.</p>
                    </div>
                </div>
        </div>
);
}

export default Generate;