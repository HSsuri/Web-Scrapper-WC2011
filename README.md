
# WEB SCRAPPER World Cup 2011

Web Scrapper is implemented using NodeJS. It scraps the data of Cricket World Cup 2011.The Scrapped data is uploaded with in the project.




## Features

- Stores the Scrapped data in Excel 
- Each team has a separate directory
- Every player has a separate directory in his team directory
- Bowling and Batting Stats/Data of every player are stored separately 


## Run Locally

Clone the project

```bash
  git clone https://github.com/HSsuri/Web-Scrapper-WC2011
```

Go to the project directory

```bash
  cd Web-Scrapper-WC2011
```

Install dependencies

```bash
  npm install cheerio
  npm install xlsx
  npm install axios
```

Run it in Node Enviornment

```bash
  node index.js
```


## Screenshots

![Inside Main Dir 2011-World-Cup](https://i.postimg.cc/Bn2vv85k/Screenshot-2022-07-21-002920.png)

![Inside the Dir of a Team](https://i.postimg.cc/rspd08yW/Screenshot-2022-07-21-003351.png)

![Inside the Dir of a Player](https://i.postimg.cc/bJ9bSCxX/Screenshot-2022-07-21-003412.png)

![Batting Data of a player](https://i.postimg.cc/zDwHxcH4/Screenshot-2022-07-21-003432.png)

![Bowling Data of a player](https://i.postimg.cc/9fFjjzLG/Screenshot-2022-07-21-004312.png)
## Lessons Learned

- This is my first project using NodeJS . It increased my knowledge related to CSS Selectors & Javascript
- It strengthened some Javascript concepts like Async Javascript,Promises,etc;

## Tech Stack

**Technologies Used:** Node , Javascript




## Optimizations

Intially i used the **Request** module but it gave timout errors while fetching the HTML, so then I used **Axios** module which is Promise based HTTP client for the browser and node.js
