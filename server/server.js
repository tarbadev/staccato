const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')

const homeRouter = require('./routes/home-route')

const PORT = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(bodyParser.json())

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    app.get('*', (req, res) => {
        res.sendFile('build/index.html', {root: __dirname})
    })
}

app.use('/api', homeRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(PORT, function () {
    console.log(`Server is running on: ${PORT}`)
})