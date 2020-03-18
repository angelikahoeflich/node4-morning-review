require('dotenv').config()
const express = require('express')
const cors = require('cors')
const massive = require('massive')
const session = require('express-session')

const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env
const middleware = require('./middleware/middleware')
const authCtrl = require('./controllers/authController')

const app = express()

app.use(cors())
app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('DB connected')
    app.listen(SERVER_PORT, () => console.log(`Server running on Port: ${SERVER_PORT}`))
})

app.post('/auth/register', middleware.checkUsername, authCtrl.register)
app.post('/auth/login', middleware.checkUsername, authCtrl.login)
app.post('/auth/logout', authCtrl.logout)
app.get('/api/user', authCtrl.getUser)