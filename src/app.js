import express from "express"
import routesApp from "./routes/routes.js"

const app=express()

app.set("port",4000)

//routes
app.use("/test",routesApp)
app.use("/getSData",routesApp)
app.use("/turnOffOulets",routesApp)

export default app 