import express from "express"
import mongoose from "mongoose"
import authRoute from "./routes/auth.route.js"
const app = express()
const port = 8000

mongoose.connect("mongodb://localhost:27017/restapi").then(()=>{
     console.log("connected")
 }).catch((err)=>{
 console.log(err)
 })
 app.use(express.json())
app.use('/api/auth',authRoute)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
