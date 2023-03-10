import express from "express"
import { scrape } from './function.js'
import cors from 'cors'

// const url = "https://en.wikipedia.org/wiki/Redux_(JavaScript_library)"
const app = express();
const PORT = process.env.PORT || 4000
app.use(cors())
app.get('/',async(req,res)=>{
    res.send({data:"get the url from wikipedia add '/search?url=wikipediaUrl' with no quotes})
})
app.get('/search?',async(req,res)=>{
    const url = req.query.url
    const data = await scrape(url)
    const result = data.map(element=>{if(element.rank){return element}}).filter(element=>element).sort((a,b)=>b.rank-a.rank)
    res.send({data:result})
})

app.listen(PORT,()=>console.log(`Running on http://localhost:${PORT}`))
