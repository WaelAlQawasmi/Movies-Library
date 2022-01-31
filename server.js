'use strict';
//use the pacages and required data

const express= require('express');
const cors=require('cors');
  const data=require("./Movie Data/data.json");
//creating server
const server=express();
server.use(cors())

// handel the routs
server.get('/',handelJson);
server.get('/favorite',favoriteHandel);
server.get('*',error404);

function error404(req,res){ 
    let jsonData={
        "status": 404,
        "responseText": "Sorry, the page Not found"
        }  
    return res.status(404).json(jsonData);
    }

function favoriteHandel(req,res){   
return res.status(200).send("Welcome to Favorite Page");
}

function handelJson(req,res){
  
        let  newData= new Movies(data.title,data.poster_path,data.overview);
     
   
 return res.status(200).json(newData);
}

function Movies(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

//run server
server.listen(7500,()=>{
    console.log("listening to port:7500 ");
})