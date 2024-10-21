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
const studentRoute = require("./routes/studentRoute")
const classRoute = require("./routes/classRoute")

// middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(fileUpload())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// index route
app.get("/", (req, res) => {
    res.send("Magnaga National High School Attendance System Restful API Created by: Whilmar M. Bitoco")
})

// routes
app.use("/user", userRouter)
app.use("/teacher", teacherRouter)
app.use("/student", studentRoute)
app.use("/class", classRoute)

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
