const express = require('express');
const app = express();

app.get("/", (req, res) => {
   res.send("mlkefwenf")
})

app.listen(5000,()=>{console.log("Server working on port 5000")});