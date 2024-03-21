const express = require('express');
const dishesRouter = require('./routes/dishes.route')

const app = express();
app.use(express.json())
app.use('/api', dishesRouter);



app.listen(5000, () => { console.log("Server working on port 5000") });