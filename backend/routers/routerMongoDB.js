require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const router = express.Router();
router.use(cors());
router.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongo() {
    await client.connect();
    console.log("Connected to MongoDB");
}

connectToMongo();

// RETURNS THE USER'S DATA FROM MONGODB
router.get("/user-data", async (req, res) => {
    const email = req.query.email;
    try {
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATES THE USER'S DATA IN MONGODB
router.patch("/update-user", async (req, res) => {
    const { email, nickname, avatar, bio } = req.body;
    try {
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const updateFields = {};
        if (nickname !== undefined) {
            updateFields.nickname = nickname;
        }
        if (avatar !== undefined) {
            updateFields.avatar = avatar;
        }
        if (bio !== undefined) {
            updateFields.bio = bio;
        }
        await usersCollection.updateOne({ email }, { $set: updateFields });
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ROUTE THAT DEALS WITH USER PROFILES
router.get("/user/:nickname", async (req, res) => {
    try {
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const nickname = req.params.nickname;
        const user = await usersCollection.findOne({ nickname });
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.json({
            nickname: user.nickname,
            bio: user.bio,
            avatar: user.avatar,
            folders: user.folders,
            publicProfile: user.publicProfile
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CHECK TO SEE IF PUBLIC/PRIV
router.get("/check-privacy", async (req, res) => {
    try {
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const { email } = req.query;
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json({ publicProfile: user.publicProfile });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ENABLE/DISABLE USER PROFILE PUBLIC/PRIVATE
router.post("/toggle-privacy", async (req, res) => {
    try {
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const { email, publicProfile } = req.body;
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        await usersCollection.updateOne(
            { email },
            { $set: {publicProfile: publicProfile} }
        );
        res.status(200).json({ message: "User privacy updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;