'use strict';
//use the pacages and required data
const axios=require('axios');
require('dotenv').config();
const express= require('express');
const cors=require('cors');
  const data=require("./Movie Data/data.json");
  const pg=require('pg');
//creating server
const clint= new pg.Client(process.env.DB_URL);
const server=express();
server.use(cors())
server.use(express.json());
// glbal var
const PORT = process.env.PORT;
// handel the routs
server.get('/',handelJson);
server.get('/favorite',favoriteHandel);
server.get('/trending',trendingHandel);
server.get('/popular',popularHandel);
server.get('/search',searchHandel);
server.get('/tv',searchHandel);

server.post('/addMovie',addHandel);
server.get('/getMovies',getMovieHandel);

server.get('/getMovie/:id',getSpMoviesHandel);
server.put('/UPDATE/:id',updateHandel);
server.delete('/DELETE/:id',deleteMoviesHandel);

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
 function addHandel(req,res){  
                    const movi = req.body; 
                let sql=`INSERT INTO movies(title,comment) VALUES ($1,$2) RETURNING *;`;
                let values=[movi.title,movi.overview];
                clint.query(sql,values).then(data =>{
                    res.status(200).json(data.rows);
                }).catch(error=>{
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
    const id = req.params.id; 
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
