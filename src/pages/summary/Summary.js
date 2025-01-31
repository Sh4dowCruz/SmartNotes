import React, { useEffect, useContext, useState } from 'react';
import { OcrContext } from '../question/OcrContext';
import { useNavigate } from 'react-router-dom';
import './summary.css';
import { useAuth0 } from '@auth0/auth0-react';

function Summary() {
    const { ocrText, generatedText, setGeneratedText } = useContext(OcrContext);
    const navigate = useNavigate();
    const { user } = useAuth0();
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [save, setSave] = useState('Save');
    const [saveValue, setSavevalue] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setGeneratedText(null);
        setSave('Save');
        setSavevalue(false);
        fetchGeneratedText();
    }, [ocrText]);
        
        const fetchGeneratedText = async () => {
            try {
                const response = await fetch("https://smart-demo1.ue.r.appspot.com/api/generate-summary", {
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

    const generateNew = () => {
        setGeneratedText(null);
        setSave('Save');
        setSavevalue(false);
        fetchGeneratedText();
        window.scrollTo(0, 0);
    }

    const renderStyledSummary = () => {
        const lines = generatedText.split('\n');
        return lines.map((line, index) => {
            if (line.startsWith('*')) {
                return <p key={index} className="summary-point">{line}</p>;
            } else if (line.includes('ISTP-T')) {
                return <p key={index} className="summary-title">{line}</p>;
            } else {
                return <p key={index} className="summary-text">{line}</p>;
            }
        });
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
        <div className="body-summary">
        <div className="summary-page">
            <h1>Generated Summary:</h1>
            <div className="generated-content">
                {generatedText ? renderStyledSummary() : 'Generating content...'}
            </div>
            {generatedText && (
                <>
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
        </>)}
        </div>
        </div>
    );
}

export default Summary;
