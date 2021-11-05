const PORT = process.env.PORT || 8000 //this for deploying heroku

const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')


const app = express()

const newspapers = [
    {
        name:'Youm7 - اليوم السابع',
        address:'https://www.youm7.com/',
        base: 'https://www.youm7.com/'
    },
    {
        name:'akhbarelyom  - اخبار اليوم',
        address:'https://akhbarelyom.com/',
        base: ''
    },
    {
        name:'gomhuriaon  - الجمهوريه',
        address:'https://www.gomhuriaonline.com/',
        base: ''
    }
]


const articles = []

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains(الصحة)', html ).each(function (){ //search for Health in Arabic language
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})



app.get('/', (req,res)=>{
    res.json('Welcome to my Climate Change API')
})

app.get('/news', (req,res)=>{
    res.json(articles)
})


app.get('/news/:newspaperId',  (req,res)=>{
    // console.log(req)
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticle = []
            $('a:contains("climate")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticle.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticle)
        }).catch(err => console.log(err))

})


app.listen(PORT, ()=> console.log(`Server Running on PORT ${PORT}`))


