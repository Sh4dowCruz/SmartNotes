import React, { createContext, useState } from 'react';

export const OcrContext = createContext();

export const OcrProvider = ({ children }) => {
    const [ocrText, setOcrText] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [useranswer, setUserAnswer] = useState('');
    const [feedback, setFeedbackText] = useState('');

    return (
        <OcrContext.Provider value={{ ocrText, setOcrText, generatedText, setGeneratedText,
            useranswer, setUserAnswer, feedback, setFeedbackText, score, setScore, currentQuestionIndex, setCurrentQuestionIndex, quizCompleted, setQuizCompleted
         }}>
            {children}
        </OcrContext.Provider>
    );
};
