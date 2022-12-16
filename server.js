const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app = require('./app')

dotenv.config({path: './config.env'})

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.set('strictQuery', true)
mongoose.connect(db, {
    useNewUrlParser: true
}).then(() => {
    console.log('Database connected successfully!')
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
})