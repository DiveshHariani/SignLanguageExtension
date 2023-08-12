const app = require('./index');
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

const PORT = process.env.PORT || 3000;
// const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('server is running!', PORT);
})