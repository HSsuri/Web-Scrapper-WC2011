//require/import the modules req
const axios = require("axios");
const cheerio = require("cheerio");
const scorecard = require("./Data");//within file


//callback function for url
function getAllMatchesLink(url) {
    axios(url).then(res => {
        getLink(res.data);//url called
    })
    .catch(err => {
        console.log(err);
    })
}

//this function gets the link of all matches
function getLink(html) {
    let $ = cheerio.load(html);
    let scorecardElems = $(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent>span+span+span a");
    console.log(scorecardElems.length / 2);
    for (let i = 0; i < scorecardElems.length; i++) {
        if (i % 2 != 0) continue;
        let link = $(scorecardElems[i]).attr("href")
        link = "https://www.espncricinfo.com" + link;//link of each match scorecard
        console.log(link);
        scorecard.ps(link);//from Data,js
    }

}

//made a module
module.exports = {
    getMatch: getAllMatchesLink
}