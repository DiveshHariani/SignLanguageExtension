const express = require('express');
const cors = require('cors');
const path = require('path');
const globalErrorController = require('./controllers/error');
//routers
const hosterRouter = require(`${__dirname}/routes/hoster`);
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, '/public')));


app.use(cors());
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ extended: false, limit: "5000mb" }));

app.use('/hoster', hosterRouter);

app.get('/video', async (req, res)=>{
    console.log("Here");
    let {h, w, token} = {...req.query};
    let resetSentence = process.env.RESET_SENTENCE*1000;
    let newReqEvery = process.env.NEW_REQEUST_EVERY*1000;
    res.render('base', {h, w, token, resetSentence, newReqEvery});
});

app.all('*', (req, res) => {
    res.send('hand sign live! I am here')
});

//global err
app.use(globalErrorController);

// const port = process.env.PORT || 3000;
// app.listen(port, '0.0.0.0', () => {console.log("Server running!")});

module.exports = app;