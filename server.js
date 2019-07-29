//Adding express
const express = require('express');

//Creating an express instance 
const server = express();

//Declaring a variable for the port
const port = 2000;

//Including the postRoutes
const postRoutes = require('./routes/postRoutes')

//Adding json.
server.use(express.json());

//Adding route to our postRoutes
server.use('/api/posts' , postRoutes)



server.listen(port , (req,res)=> {
    console.log(`Sever listening on port ${port}`)
})

module.exports = server;