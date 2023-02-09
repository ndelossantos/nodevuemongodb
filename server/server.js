require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');
const session = require('express-session')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret'
}))


mongoose.connect(process.env.DATABASE_URL , { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB'))

app.use(express.json())
app.use(cors());

// app.use((req, res, next) => {
//     console.log(`${req.method} - ${req.url}`);
// })

const usersRouter = require('./routes/users')
const booksRouter = require('./routes/books')
const bookstwoRouter = require('./routes/bookstwo')
const steamappRouter = require('./routes/steamapp')

app.use('/users', usersRouter)
app.use('/books', booksRouter)
app.use('/bookstwo', bookstwoRouter)
app.use('/steamapps', steamappRouter)

// app.post('/users', (req, res) => {
//     console.log(req.body.name)
//     const user = { name: req.body.name, password: req.body.password }
//     users.push(user)
//     res.status(201).send()
// })

app.listen(4000, () => {
    console.log('Running on port 4000')
})