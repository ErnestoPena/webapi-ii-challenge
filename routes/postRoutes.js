//Adding express to create the Router instance
const express = require('express');

//Adding DB methods
const db = require('../data/db'); 

//Creating the Router Instance
const router = express.Router();

//Blog for all routes at '/'
//GET for all posts
router.get('/' , async (req,res)=>{
    try {
        const posts = await db.find(req.body);
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({error: "The posts information could not be retrieved."})
    }
})


//GET an specific id
router.get('/:id', async (req,res)=>{
    try {
        const singlePost = await db.findById(req.params.id);
        res.status(200).json(singlePost)
    }
    catch (error) {
        res.status(404).json({message:`The post with the id ${req.params.id} does not exist`})
    }
})

//Route to post on root
router.post('/', async (req,res)=>{
    const newPost = req.body;
    const mytitle = req.body.title;

        try {
          if (req.body.title && req.body.contents) {
            const addedPost = await db.insert(newPost);
            res.status(200).json(addedPost);
            } else {
                res.status(400).json({message: "Please provide title and contents for the post."})
        }
       }
        catch (error){
            res.status(500).json({error: "There was an error while saving the post to the database" })
        }
})
//-----------------------------------------------------------------------------------------------------------

//GET for '/:id/comments'

//this GET is not working properly
router.get('/:id/comments' , async (req,res) => {

    const postId = req.params.id;
    const checkPostId = await db.findById(postId);
    const print = await console.log(checkPostId);
        try {
            if (checkPostId) {
                const commentById = await db.findPostComments(postId);
                res.status(200).json(commentById);
              } else {
                  res.status(404).json({message: "The post with the specified ID does not exist." });
            }
        }
        catch (err) {
            res.status(500).json({error: "The comments information could not be retrieved." });
        }
   
})


//POST to /:id/comments

router.post('/:id/comments' , async (req , res) => {

    try {
        const postIdExist = await db.findById(req.params.id);
        if (postIdExist) {
            const comment = await req.body;
            console.log(comment.text);
            if (comment.text) {
                await db.insertComment(comment.text , req.params.id);
                res.status(201).json(comment);
            } else {
                res.status(400).json({errorMessage: "Please provide text for the comment."});
            }
        } 
    }
    catch (err) {
        res.status(500).json({error: "There was an error while saving the comment to the database"});
    }
})

//DETETE method on /api/posts/:id
//with unexisting posts, the catch is triggered 

router.delete('/:id' , async (req , res) => {
    try {
      const existingPost = await db.findById(req.params.id);
      if (existingPost) {
          console.log(`inside the if, ${id}`);
          const removedPost = await db.remove(req.params.id);
          res.status(200).json(removedPost);
      } else {
          res.status(400).json({message: "The post with the specified ID does not exist." });
      }
    }
    catch(err) {
        res.status(500).json({error: "The post could not be removed"})
    }
})




module.exports = router;
















module.exports = router;

