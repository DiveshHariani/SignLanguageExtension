const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: `${__dirname}/./config.env` });


DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(connectio => {
    console.log('connection to dataBase successful');
}).catch((er) => {
    console.log('bad auth/db');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('server is running!');
})