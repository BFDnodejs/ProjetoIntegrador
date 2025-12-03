import express from "express"


const app = express()
app.use(express.json())

app.get("/", () =>{
  console.log("API is running 🚀")
})



export default app;
