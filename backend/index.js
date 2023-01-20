import app from './app.js'

app.get('/', (req, res) => {
  res.send('Forum Salih')
})

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})
