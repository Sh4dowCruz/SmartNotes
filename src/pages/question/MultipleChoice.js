import React, { useEffect, useState, useContext } from 'react';
import './question.css';
import { OcrContext } from './OcrContext';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function MultipleChoice() {
    const { ocrText, generatedText, setGeneratedText, feedback, setFeedbackText } = useContext(OcrContext);
    const [userAnswer1, setUserAnswer1] = useState('');
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const { user } = useAuth0();
    const [labelText, setLabelText] = useState('Submit Answer');
    const [isSubmitted, setSubmit] = useState(false);
    const [save, setSave] = useState('Save');
    const [saveValue, setSavevalue] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setGeneratedText(null);
        setFeedbackText(null);
        setLabelText('Submit Answer');
        setSubmit(false);
        setSave('Save');
        setSavevalue(false);
        fetchGeneratedText();
    }, [ocrText]);
        
        const fetchGeneratedText = async () => {
            try {
                const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/generate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ocrText }),
                });

                const data = await response.json();
                setGeneratedText(data.text.replace(/(\*\*|#)/g, ''));
            } catch (error) {
                console.error('Error fetching generated text:', error);
            }
        };

    useEffect(() => {
        getFolders();
    }, []);

    const handleSubmit = async () => {
        setLabelText('Submitting...');
        setSubmit(true);
        const combinedAnswers = `${userAnswer1}`;
        try {
            const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ generatedText, userAnswer: combinedAnswers }),
            });

            if (response.ok) {
                const data = await response.json();
                setFeedbackText(data.feedback.replace(/(\*\*|#)/g, ''));
                setLabelText('Submitted');
            } else {
                alert("Failed to submit answers.");
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert("Failed to submit answers.");
        }
    };

    const generateNew = () => {
        setUserAnswer1('');
        setGeneratedText(null);
        setFeedbackText(null);
        setSubmit(false);
        setLabelText('Submit Answer');
        setSave('Save');
        setSavevalue(false);
        fetchGeneratedText();
        window.scrollTo(0, 0);
    }

    const renderGeneratedText = () => {
        const questions = generatedText.split('\n').filter(line => line.trim() !== '');
        return questions.map((question, index) => {
            const [questionText] = question.split(/[abcd]\)\s/);

            return (
                <div key={index} className="questions">
                    <p className="question-text">{questionText.trim()}</p>
                </div>
            );
        });
    };

    const renderFeedback = () => {
        return feedback.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
        ));
    };

    const getFolders = async() => {
        try {
          const response = await fetch(`https://smart-demo1.ue.r.appspot.com/api/get-folder?email=${encodeURIComponent(user.email)}`, {
            method: "GET",
          });
          const data = await response.json();
          setFolders(data);
        } catch (error) {
          console.log("Error:", error);
        }
    }

    const saveGeneratedContent = async () => {
        try {
            const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/save-generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: user.email,
                    folderName: selectedFolder,
                    generatedText,
                    feedback
                })
            });
            if (response.ok) {
                console.log("content saved");
                setSave('Saved');
                setSavevalue(true);
            } else {
                console.log("error saving content");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };
    
    return (
        <div className="question-page">
            <h1>Generated Question</h1>
            <p>Please answer the following multiple-choice:</p>
            <div className="generated-content">
                {generatedText ? renderGeneratedText() : 'Generating content...'}
            </div>
            {generatedText && (
                <>
            <h2>Your Answer:</h2>
            <div className="answer-section">
                    <textarea
                        value={userAnswer1}
                        onChange={(e) => setUserAnswer1(e.target.value)}
                        placeholder="Type your answer"
                        className = "answer-area"
                    />
            </div>
            <button onClick={handleSubmit} className={`submit-button ${isSubmitted ? 'yes' : 'no'}`}>{labelText}</button>
            </>)}
            {feedback && (
                <>
                <div className="feedback-section">
                    <h2>Feedback (Enhanced by AI)</h2>
                    {renderFeedback()}
                </div>
            <div className="save-content-section">
            <h3>Do you want to save the generated content?</h3>
            <div className="save-table">
            <div className = "choose-folder">
                <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                >
                    <option value="">Choose a folder</option>
                    {folders.map((folder, index) => (
                        <option key={index} value={folder.name}>
                            {folder.name}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={saveGeneratedContent} className={`save-button ${saveValue ? 'yes' : 'no'}`}>{save}</button>
        </div>
        </div>
        <div className = "generate-new">
        <button onClick = {generateNew} className = "generate-new-button">Generate New</button>
        </div>
        </>
            )}
        </div>
    );
}

export default MultipleChoice;
