//require/import the modules req
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const xlsx = require("xlsx");
const path = require("path");

function process(url) {

    axios(url).then(res => {
        extractMatchDetails(res.data);
    })
        .then(res => {
            extractMatchDetails(res.data);
        })
        .then(res => {
            extractMatchDetails(res.data);
        })
        .then(res => {
            extractMatchDetails(res.data);
        })
        .then(res => {
            extractMatchDetails(res.data);
        })
        .catch(err => {
            console.log(" ");
        })
}






var count = 0;

//function to get data from parsed html
function extractMatchDetails(html) {
    let $ = cheerio.load(html);
    let desc = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let res = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title span");
    let stringArr = desc.text().split(',');

    let matchNo = stringArr[0].trim(); // MAtch Number
    let venue;
    let date;
    if (matchNo.includes("Match")) {
        date = stringArr[3] + " 2022"; // date
        venue = stringArr[2]; // venue
    }
    else {
        venue = stringArr[1]; // venue
        date = stringArr[2] + " 2022"; // date
    }
    let result = res.text();  //result
    count++;
    console.log(count);

    // console.log(matchNo);
    let innings = $(".ds-bg-fill-content-prime.ds-rounded-lg"); // gets the data of both innings
    let playerTM; //Player of the MAtch
    if (matchNo == "Final(D/N)") playerTM = $(".ds-text-tight-xs.ds-capitalize+div a")[0].text().trim();
    else playerTM = $(".ds-text-tight-xs.ds-capitalize+div a").text().trim();

    for (let index = 0; index < innings.length; index++) {
        let teamName = $(innings[index]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        teamName = teamName.split('INNINGS')[0].trim();//team Name
        let opIndex = index == 0 ? 1 : 0;//since only 2 innings
        let oppName;
        if (result == "No result") {
            oppName = $("a[class='ds-text-ui-typo hover:ds-text-ui-typo-primary ds-block'] span");
            oppName = $(oppName[1]).text().trim();//opponent NAme
        }
        else {
            oppName = $(innings[opIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
            oppName = oppName.split('INNINGS')[0].trim();//opponent NAme
        }

        console.log(matchNo + ", " + date + ", " + venue + " || " + teamName + " || " + oppName + " || " + result)
        console.log("..............BATTING..................");
        let batsmantable = $(innings[index]).find("table")[0];
        let allRows = $(batsmantable).find("tbody tr");

        for (let j = 0; j < allRows.length; j++) {
            let isBat = $(allRows[j]).hasClass("ds-border-b ds-border-line ds-text-tight-s");// for removing non-req trs
            // let out="not out";
            let allCols;
            if (isBat === true) {
                allCols = $(allRows[j]).find("td");
                if (allCols.length < 6) isBat = false;// removing "extras" tr
            }

            if (isBat === true) {
                let playerName = $(allCols[0]).text().trim();//player name
                let not_out = false;
                if (($(allCols[1]).text()).trim() == "not out") not_out = true;
                let runs = $(allCols[2]).text();// Runs
                let balls = $(allCols[3]).text();//Balls
                let fours = $(allCols[5]).text();//Fours
                let sixes = $(allCols[6]).text();//Sixes
                let sr = $(allCols[7]).text();//Strike Rate
                let potm = playerTM;



                console.log(playerName + " " + runs + " " + balls + " " + fours + " " + sixes + " " + sr + " " + not_out + " " + potm);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, oppName, venue, result, date, matchNo, not_out, potm);

            }
        }

        console.log("..............BOWLING..................");
        let bowlertable = $(innings[index]).find("table")[1];
        let allRows2 = $(bowlertable).find("tbody tr");

        for (let j = 0; j < allRows2.length; j++) {
            let isBowl = $(allRows2[j]).hasClass("ds-border-b ds-border-line ds-text-tight-s");// for removing non-req tr


            if (isBowl === true) {
                let allCols = $(allRows2[j]).find("td");
                let playerName = $(allCols[0]).text().trim();//player name
                let overs = $(allCols[1]).text();// Overs
                let maiden = $(allCols[2]).text();//MAiden
                let runs = $(allCols[3]).text();//Runs
                let wkts = $(allCols[4]).text();//Wickets
                let econ = $(allCols[5]).text();//Economy
                let potm = playerTM;


                console.log(playerName + " " + overs + " " + maiden + " " + runs + " " + wkts + " " + econ + " " + potm);
                processPlayer2(oppName, playerName, overs, maiden, runs, wkts, econ, teamName, venue, result, date, matchNo, potm);

            }
        }


    }
    console.log("..............................................................................................................................................");



}


function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, oppName, venue, result, date, matchNo, not_out, potm) {
    let teamPath = path.join(__dirname, "2011-WORLD-CUP", teamName); //Dir of team
    dirCreator(teamPath);//Dir made if not already
    let battingpath = path.join(teamPath, playerName);
    dirCreator(battingpath);//Dir made if not already
    let filePath = path.join(battingpath, "BATTING.xlsx");
    let content = execlReader(filePath, playerName);//json content from file reader
    let playerObj = {
        "Team Name": teamName,
        "Opponent Name": oppName,
        "Match No.": matchNo,
        "Venue": venue,
        "Date": date,
        "Player Name": playerName,
        "Runs": runs,
        "Balls": balls,
        "Not Out": not_out,
        "Fours": fours,
        "Sixes": sixes,
        "SR": sr,
        "POTM": potm,
        "RESULT": result
    } //player obj for json
    content.push(playerObj);//object pushed
    execlWriter(filePath, content, playerName);//object updated in file
}


function processPlayer2(teamName, playerName, overs, maiden, runs, wkts, econ, oppName, venue, result, date, matchNo, potm) {
    let teamPath = path.join(__dirname, "2011-WORLD-CUP", teamName); //Dir of team
    dirCreator(teamPath);//Dir made if not already
    let bowlingpath = path.join(teamPath, playerName);
    dirCreator(bowlingpath);//Dir made if not already
    let filePath = path.join(bowlingpath, "BOWLING.xlsx");
    let content = execlReader(filePath, playerName);//json content from file reader
    let playerObj = {
        "Team Name": teamName,
        "Opponent Name": oppName,
        "Match No.": matchNo,
        "Venue": venue,
        "Date": date,
        "Player Name": playerName,
        "Overs": overs,
        "Maiden Overs": maiden,
        "Runs": runs,
        "Wickets": wkts,
        "Economy": econ,
        "POTM": potm,
        "RESULT": result
    } //player obj for json
    content.push(playerObj);//object pushed
    execlWriter(filePath, content, playerName);//object updated in file
}

//function to create dir if it doesn't exists
function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }

}


//function to read excel file
function execlReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];// if not exists then empty json
    }

    let wb = xlsx.readFile(filePath);//get workbook
    let excelData = wb.Sheets[sheetName];//get sheet
    let ans = xlsx.utils.sheet_to_json(excelData);//get data in json
    return ans;//json returned
}


//function to write/append excel file
function execlWriter(filePath, json, sheetName) {
    let newWb = xlsx.utils.book_new();//new workbook
    let newWs = xlsx.utils.json_to_sheet(json);//new worksheet
    xlsx.utils.book_append_sheet(newWb, newWs, sheetName);//appends worksheet to workbook
    xlsx.writeFile(newWb, filePath);//file updated

}

//made a module
module.exports = {
    ps: process
}
