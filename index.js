//including all the req modules
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const allMatch = require("./allMatch");//within file


const url = "https://www.espncricinfo.com/series/icc-cricket-world-cup-2010-11-381449";//the main url

axios(url).then(res => {
    extractLink(res.data);//url called
})
    .catch(err => {
        console.log(err);
    })




//function to get data from parsed html
function extractLink(html) {
    let $ = cheerio.load(html);
    
    let element = $("a[class='ds-block ds-text-center ds-uppercase ds-text-ui-typo-primary ds-underline-offset-4 hover:ds-underline hover:ds-decoration-ui-stroke-primary ds-block']");
    
    let link = element.attr("href");
    let fulllink = "https://www.espncricinfo.com" + link;//link to get the results of all matches
    console.log(fulllink);
    allMatch.getMatch(fulllink);//from allMatch.js

}

const WCPath = path.join(__dirname, "2011-WORLD-CUP");

dirCreator(WCPath);// dir created

//function to create a dir if doesnot exists
function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }

}



