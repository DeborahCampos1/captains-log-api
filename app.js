const express = require("express");
const cors = require("cors");
const app = express();
const logsArr = require("./models/log.js");
require("dotenv").config();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json())

app.get("/", (req,res)=>{
    res.send("Welcome to the captain's log")
});


app.get("/logs", (req,res)=>{
    const { order, mistakes, lastCrisis } = req.query;

        if(!order && !mistakes && !lastCrisis){
            res.send(logsArr)
        }
        if(order === "asc"){
               logsArr.sort((a,b)=>{ 
                  return a.captainName > b.captainName ? 1 : -1;
            });
             console.log(logsArr)
             res.send(logsArr) 
        } else if(order === "desc"){
                logsArr.sort((a,b)=>{
                 return b.captainName > a.captainName ? 1 : -1;
            });
             console.log(logsArr)
             res.send(logsArr) 
        } if (mistakes === "true"){
            let filteredTrue = logsArr.filter(log=>{
            return log.mistakesWereMadeToday === true
            });
            res.send(filteredTrue)
            console. log(filteredTrue)
        } else if (mistakes === "false"){
             let filteredFalse = logsArr.filter((log)=>{
             return log.mistakesWereMadeToday === false
            });
            console.log(filteredFalse)
            res.send(filteredFalse)
        } if (lastCrisis === "gte10"){
             let lastCrisis10 = logsArr.filter((log)=>{
             return log.daysSinceLastCrisis > 10;
            });
            console.log(lastCrisis10);
            res.send(lastCrisis10)
        }if (lastCrisis === "gte20"){
            let lastCrisis20 = logsArr.filter((log)=>{
            return log.daysSinceLastCrisis >= 20;
           });
           console.log(lastCrisis20);
           res.send(lastCrisis20)
        } if (lastCrisis === "lte5"){
            let lastCrisis5 = logsArr.filter((log)=>{
            return log.daysSinceLastCrisis <= 5;
            });
            console.log(lastCrisis5);
            res.send(lastCrisis5)
        } 
});


app.get("/logs/:index", (req,res)=>{
    const {index} = req.params;

    if(logsArr[index]){
        res.send(logsArr[index])
    }else{
        res.redirect("*")
    }
})
app.get("*", (req,res)=>{
    res.status(404).json({error: "Page not found"});
})
app.post("/logs", (req,res)=>{
    // const newLog = {
    //     captainName: "Picard",
    //     title: "Stars",
    //     post: "Today I contemplated that there sure are a lot of stars in the sky",
    //     mistakesWereMadeToday: true,
    //     daysSinceLastCrisis: "10",
    //   };
    console.log(req.body)
    logsArr.push(req.body);
    res.json(logsArr[logsArr.length-1])
});
app.put("/logs/:index", (req,res)=>{
    let {index} = req.params;
    if(!logsArr[index]){
        res.redirect("*")
    } 
    
    let {captainName, title, post, mistakesWereMadeToday, daysSinceLastCrisis} = req.body;
    if(captainName && title && post && (mistakesWereMadeToday !== undefined) && daysSinceLastCrisis){

        logsArr[index] = {
            captainName, title, post, mistakesWereMadeToday, daysSinceLastCrisis
        };
        res.json(logsArr[index])
    } else {
        res.status(422).json({
            error: "Please provide all fields"
        })
    }
});

app.delete("/logs/:index", (req,res)=>{
    const{index} = req.params;
    if(logsArr[index]){
        let removed = logsArr.splice(index,1)
        res.json(removed)
    } else {
        res.redirect("*")
    }
})

app.listen(PORT, ()=>{
 console.log(`listening on port ${PORT}`)
});

module.exports = app;