'use strict';// to work under strict mode
//use the pacages and required data  
// npm i express cors dotenv axios pg   ,, to downloade the pacage
const axios=require('axios');//to read from api
require('dotenv').config(); // to read the scure data from .dev file
const express= require('express');// node js freame work
const cors=require('cors');// rols in node js
  const data=require("./Movie Data/data.json"); // to read data from file
  const pg=require('pg');//  to connect for dada base manag mant system  (postGrese)
//creating server
const clint=  new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})// to connect to the db that we created by ubunto where the url is scure in een file
const server=express(); // to use frame work
server.use(cors()) // to use the rule
server.use(express.json());  // to convert to obj from json
// glbal var
const PORT = process.env.PORT;  // to read virabel from  .env file 
// handel the routs
server.get('/',handelJson);  // rout and the function that will call when requst this rout
server.get('/favorite',favoriteHandel);
server.get('/trending',trendingHandel);
server.get('/popular',popularHandel);
server.get('/search',searchHandel);
server.get('/tv',searchHandel);

server.post('/addMovie',addHandel);// post req
server.get('/getMovies',getMovieHandel);

server.get('/getMovie/:id',getSpMoviesHandel); // git req with var
server.put('/UPDATE/:id',updateHandel);
server.delete('/DELETE/:id',deleteMoviesHandel);

server.get('*',error404);// error 404
server.use(errorHandler);//error 500

///////////////////////error/////////////////////////////
function error404(req,res){ // this spictional function have req and res respectively
        let jsonData={
            "status": 404,
            "responseText": "Sorry, the page Not found"
            }  
        return res.status(404).json(jsonData);  /// return the req with ststus code and data
        }

function errorHandler (error,req,res){
            const err = {
                status : 500,
                message : error
            }
            res.status(500).send(err);
        
        }
//////////////////////////rout handel//////////////////////////////////////
 function addHandel(req,res){  //// this function to deal with post req to add data to db
                    const movi = req.body; /// the data that i will put in body of post requst
                let sql=`INSERT INTO movies(title,comment) VALUES ($1,$2) RETURNING *;`;// to add data to db table
                let values=[movi.title,movi.overview]; // the values that i will take from body and add to bd table
                clint.query(sql,values).then(data =>{ // to excute the query if it it done secssesfoly
                    res.status(200).json(data.rows);
                }).catch(error=>{// to giv error if the query not complete
                    errorHandler(error,req,res)
                });
                    }


function getMovieHandel(req,res){   
        let sql = `SELECT * FROM movies;`;
        clint.query(sql).then(data=>{
           res.status(200).json(data.rows);
        }).catch(error=>{
            errorHandler(error,req,res)
        });
        }


function getSpMoviesHandel(req,res){  
    const id = req.params.id; // www.0000.cpm/888/id   params 
            let sql = `SELECT * FROM movies WHERE id=${id};`;
            clint.query(sql).then(data=>{
               res.status(200).json(data.rows);
            }).catch(error=>{
                errorHandler(error,req,res)
            });
            }
        
      
 
 function updateHandel(req,res){   
    const id = req.params.id;
 
    const movie = req.body;
    const sql = `UPDATE movies SET title =$1,comment=$2 WHERE id=$3 RETURNING *;`; 
    let values=[movie.title,movie.overview,id];
    clint.query(sql,values).then(data=>{
        res.status(200).json(data.rows);
      
    }).catch(error=>{
        errorHandler(error,req,res)
    });

            }

function deleteMoviesHandel(req,res){   
    const id = req.params.id;
 
    const sql = `DELETE FROM movies WHERE id=${id}`; 
    clint.query(sql).then(()=>{
        res.status(200).send("The movie has been deleted");
     
    }).catch(error=>{
        errorHandler(error,req,res)
    });
                }

            
function favoriteHandel(req,res){   
        return res.status(200).send("Welcome to Favorite Page");
        }
        //api

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
clint.connect().then(()=>{ // to connect to db then listen to server
    server.listen(PORT,()=>{
        console.log(`listening to port:${process.env.PORT}`);
    })
})
