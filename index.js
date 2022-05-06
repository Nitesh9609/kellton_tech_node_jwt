const express = require('express')
const dotenv = require('dotenv')
const mongoose = require("mongoose")
const cors = require('cors')
const authRoute = require('./route/auth')

const app = express()

const port = 8080

app.get("/", (req,res) =>{
    res.send("running JWT app")
})


app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`)
)


// Accessing the Environment Variables
dotenv.config()

// Connecting the database
mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser:true},
    () => console.log("Connected to DB")
)

// Middlewares 
app.use(express.json(),cors())

// Route Middleware
app.use("/api/users",authRoute)



