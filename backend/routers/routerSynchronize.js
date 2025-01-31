const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

router.post("/sync-user", async (req, res) => {
    try {
        await client.connect();
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");

        const userData = req.body;
        const existingUser = await usersCollection.findOne({ email: userData.email });

        if (existingUser) {
            await usersCollection.updateOne({ email: userData.email }, { $set: userData });
        } else {
            const newUser = {
                email: userData.email,
                nickname: "",
                bio: "",
                avatar: "",
                publicProfile: false,
                folders: []
            };
            await usersCollection.insertOne(newUser);
        }

        res.status(200).json({ message: "Successful data synchronization" });
    } catch (error) {
        res.status(500).json({ error: "Error connecting to the database" });
    }
});

module.exports = router;