require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const mealsRouter = express.Router()
const { v4: uuid} = require('uuid')
const logger = require('./logger')


const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'




app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())


app.use(function validateToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path ${req.path}`)
        return res.send(401).json({error: `Unauthorized Request`})
    }
    next()
});

app.use('/meals', mealsRouter)


app.get('/', (req, res) => {
    res.send('Hey now, it works!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'} }
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app