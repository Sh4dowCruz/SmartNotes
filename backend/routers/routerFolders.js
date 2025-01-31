const express = require('express');
const router = express.Router();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

router.use(cors());
router.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

/*
FOLDER RELATED APIs
- Create folder (done)
- Get folder (done)
- Delete folder (done? needs more testing)
- Rename folders (last priority)
- Maximum folder limit?
*/

router.post("/add-folder", async (req, res) => {
    try {
        const { email, folderName } = req.body;
        await client.connect();
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const newFolder = {
            name: folderName,
            items: []
        }
        try{
            await usersCollection.updateOne(
                { email},
                {$push: {folders: newFolder}}
            );
            res.status(200).json({ message: "folder added to db" });
        } catch(error){
            res.status(500).json({error: "error pushing folder"});
        }
    } catch (error){
        res.status(500).json({error: "error connecting"});
    }
});

router.get("/get-folder", async (req, res) => {
    const email = req.query.email;
    try {
        await client.connect();
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({email});
        if(user){
            res.status(200).json(user.folders);
        } else{
            res.status(400).json("no user found")
        }
    } catch (error){
        res.status(500).json({error: "error connecting"});
    }
});
        
router.delete("/delete-folder", async (req, res) => {
    try {
        const { email } = req.query;
        const folderIndex = parseInt(req.query.folderIndex, 10);
        await client.connect();
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        await usersCollection.updateOne(
            { email },
            { $unset: { [`folders.${folderIndex}`]: 1 } }
        );
        await usersCollection.updateOne(
            { email },
            { $pull: { folders: null } }
        );
        res.status(200).json({ message: "folder deleted deleted" });
    } catch (error) {
        res.status(500).json({ error: "error when attempting to deleting folder" });
    }
});

/*
Content Related APIs
- Save content (this should save the generated questions + feedback. The feedback includes the answers)
- Delete content (complete)
- Have name for generations?
*/

router.post("/save-generate", async (req,res) => {
    const {email, generatedText, feedback, folderName} = req.body;
    try {
        await client.connect();
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const pushObject = {
            generatedText,
            feedback
        }
        await usersCollection.updateOne(
            { email, "folders.name": folderName },
            { $push: { "folders.$.items": pushObject } }
        );
        res.status(200).json({ message: "added" });
    } catch (error) {
        res.status(500).json({ error: "error connecting to mongodb/adding" });
    }
})

router.delete("/delete-generate", async (req,res) => {
    const { email, folderName, itemIndex } = req.body;
    try {
        await client.connect();
        const db = client.db("smart-notes-usermanagement");
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({ email });

        const folder = user.folders.find(f => f.name === folderName);
        folder.items.splice(itemIndex, 1);
        
        await usersCollection.updateOne(
            { email, "folders.name": folderName },
            { $set: { "folders.$.items": folder.items } }
        );
        res.status(200).json({ message: "removed folder" });
    } catch (error) {
        res.status(500).json({ error: "error connecting to mongodb/deleting" });
    }
})

module.exports = router;