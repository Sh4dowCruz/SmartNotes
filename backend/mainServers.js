const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routerGemini = require('./routers/routerGemini.js');
const routerMongo = require('./routers/routerMongoDB.js');
const routerSyncUsers = require('./routers/routerSynchronize.js');
const routerFeedback = require('./routers/routerFeedback.js')
const routerFolders = require('./routers/routerFolders.js')

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", routerGemini);
app.use("/api", routerMongo);
app.use("/api", routerSyncUsers);
app.use("/api", routerFeedback)
app.use("/api", routerFolders);

app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "API works, if others don't work check the others." });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});