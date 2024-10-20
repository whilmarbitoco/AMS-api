require("dotenv").config();
const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require("morgan")
const path = require("path")
const db = require("./models")
const fileUpload = require("express-fileupload")


const PORT = process.env.PORT || 3500;

// import routes
const userRouter = require("./routes/userRoute")
const teacherRouter = require("./routes/teacherRoute")

// middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(fileUpload())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// index route
app.get("/", (req, res) => {
    res.send("Whilmar Bitoco")
})

// routes
app.use("/user", userRouter)
app.use("/teacher", teacherRouter)

// connect to db and start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    try {
        await db.sequelize.authenticate()
        console.log("DB connected...")
    } catch (err) {
        console.log(err.toString())
    }
})
