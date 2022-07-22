const express = require('express')
const session = require('express-session')
const port = 3000
const app = express()
const routes = require('./routes')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'crafty lynx',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true
  }
}))
app.use(routes)


app.listen(port, () => {
  console.log('app.js is running on port', port)
})