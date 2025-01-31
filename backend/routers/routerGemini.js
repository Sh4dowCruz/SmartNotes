require('dotenv').config();

const express = require('express');
const cors = require('cors');
const googleGemini = require('./googleGemini.js');
const openAI = require('./openAI.js')

const router = express.Router();
router.use(cors());
router.use(express.json());

router.post("/generate", async (req, res) => {
    const ocrText = req.body.ocrText;
    try {
        const result = await openAI(
            `Create a multiple choice problem that is similar to the text. Please keep the format of the multiple choice question as a A,B,C,D format. Do not include the answers or any other meaningless text.\n\n` + ocrText
        );
        res.json({ text: result });
    } catch (err) {
        console.log(err);
    }
});

router.post("/generate-summary", async (req, res) => {
    const ocrText = req.body.ocrText;
    try {
        const result = await openAI(
            `Create a summary based on the text following: `
            + ocrText
        );
        res.json({ text: result });
    } catch (err) {
        console.log(err);
    }
});

router.post("/generate-true-false", async (req, res) => {
    const ocrText = req.body.ocrText;
    try {
        const result = await openAI(
            `Create a true/false problem that is similar to the text. Do not include the answers or any other meaningless text.\n\n` + ocrText
        );
        res.json({ text: result });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;