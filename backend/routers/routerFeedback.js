require('dotenv').config();

const cors = require('cors');
const express = require('express');
const googleGemini = require('./googleGemini.js')
const openAI = require('./openAI.js')

const router = express.Router();
router.use(cors());
router.use(express.json());

router.post("/feedback", async (req, res) => {
    const {generatedText, userAnswer} = req.body;
    try {
        const feedback = await openAI(
            `You are designed to work in a company called "Smart Notes". At Smart Notes, the goal of the company is to help
            students study and prepare for any upcoming problems or exams.
            Your goal is to give feedback to the question and answers that are given to you.
            
            For example, we can assume this is a sample question that you may possibly receive:
            
            1. What is the solution to 5+7?
                a. 14
                b. 17
                c. 13
                d. 12
            
            If the user responds with (a. 14), your feedback will be that it is wrong with an explanation as to why
            it is wrong. If the user responds with (d. 12), your feedback will simply be that it is correct. No explanation
            is needed in this case since the answer is correct.
            
            Here is another sample question that you may receive to give feedback to:

            2. What is the solution to 5-20?
                a. 25
                b. 52
                c. -15
                d. 15

            If the user answers with (a. 25), your feedback will explain how it is wrong. If the user answers with
            (c. -15), you will simply state that it is correct with no feedback necessary.
                                
            With all of that stated, here is the question that you should provide feedback for: \n\n`
            + 
            generatedText + 'and here is the answer: \n' + userAnswer
        );
        res.json({feedback});
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;