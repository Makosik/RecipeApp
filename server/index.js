const express = require('express');
const dishesRouter = require('./routes/dishes.route')
const uploadRouter = require('./routes/upload.route')
const ordersRouter = require('./routes/orders.route')
const path = require('path')

const app = express();
app.use(express.json())
app.use('/api', dishesRouter);
app.use('/api', uploadRouter);
app.use('/api', ordersRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) 


app.listen(process.env.PORT || 5000, () => { console.log("Server working on port 5000") });