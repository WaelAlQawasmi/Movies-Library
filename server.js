'use strict';
//use the pacages and required data
const axios=require('axios');
require('dotenv').config();
const express= require('express');
const cors=require('cors');
  const data=require("./Movie Data/data.json");
//creating server
const server=express();
server.use(cors())

// glbal var
const PORT = process.env.PORT;
// handel the routs
server.get('/',handelJson);
server.get('/favorite',favoriteHandel);
server.get('/trending',trendingHandel);
server.get('/popular',popularHandel);
server.get('/search',searchHandel);
server.get('/tv',searchHandel);
server.get('*',error404);
server.use(errorHandler);

//error
function error404(req,res){ 
        let jsonData={
            "status": 404,
            "responseText": "Sorry, the page Not found"
            }  
        return res.status(404).json(jsonData);
        }

 function errorHandler (error,req,res){
            const err = {
                status : 500,
                message : error
            }
            res.status(500).send(err);
        
        }
//rout handel
function favoriteHandel(req,res){   
        return res.status(200).send("Welcome to Favorite Page");
        }
const url3=`https://api.themoviedb.org/3/person/popular?api_key=${process.env.APIKEY}&language=en-US&page=1"`;
const url=`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}&language=en-US`;
const url2=`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&query="${process.env.QURY}"`;

function trendingHandel(req,res){ 
        axios.get(url).then(result=>{
            let trendArr=[];
            
            result.data.results.forEach(element => {
             let obj=  new Movies(element.id,element.release_date,element.title,element.poster_path,element.overview);
           trendArr.push(obj);
            })
            console.log(trendArr);
           res.status(200).json(trendArr);
        } )
         
        }


        function popularHandel(req,res){ 
            axios.get(url3).then(result=>{
                let trendArr=[];
                
                result.data.results.forEach(element => {
                 let obj=  new Movies(element.id,element.release_date,element.title,element.poster_path,element.overview);
               trendArr.push(obj);
                })
                console.log(trendArr);
               res.status(200).json(trendArr);
            } )
             
            }
    

 function searchHandel(req,res){ 
            axios.get(url2).then(result=>{
                let trendArr=[];
                
                result.data.results.forEach(element => {
                 let obj=  new Movies(element.id,element.release_date,element.title,element.poster_path,element.overview);
               trendArr.push(obj);
                })
                console.log(trendArr);
               res.status(200).json(trendArr);
            } )
             
            }

function handelJson(req,res){
  
        let  newData= new Movies(data.title,data.poster_path,data.overview);
     
   
 return res.status(200).json(newData);
}
// constractor
function Movies(id,release_date,title,poster_path,overview){
    this.id=id;
    this.release_date=release_date;
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}




//run server
server.listen(PORT,()=>{
    console.log("listening to port:7500 ");
})