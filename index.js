const express = require('express')
const mainRoutes = require("./routes/mainRoutes")

const port = 3001
const app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use('', mainRoutes)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})