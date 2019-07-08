require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./moviedex-list.json')

//console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())


app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })
console.log('validate bearer token middleware')


app.get('/movie', function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query

    let result = MOVIES
// filter movies by genre
    if (genre) {
        result = result.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()))
    }
//filter movies by country
    if (country) {
        result = result.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()))
    }
//filter movies by vote
    if (avg_vote) {
        let num = Number(avg_vote)
        result = result.filter(movie => movie.avg_vote >= num)
    }

    res.json(result)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`listening on PORT 8000`)
})