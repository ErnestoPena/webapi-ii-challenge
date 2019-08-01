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
        const posts = await db.find();
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
        const postId = req.params.id;

        if (singlePost) {
            res.status(200).json(singlePost);
        } else {
            res.status(404).json({message:`The post with the ID ${postId} could not be found`});
        }
    }
    catch (error) {
        res.status(500).json({message:`There was an error retreiving the post from the database`})
    }
})

//Route to post on root
router.post('/', async (req,res)=>{
    const { title , contents } = req.body;

        try {
          if (title && contents) {
            const addedPost = await db.insert(req.body);
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
router.get('/:id/comments' , async (req,res) => {

    const postId = req.params.id;
    const checkPostId = await db.findById(postId);
        try {
            if (checkPostId) {
                const commentById = await db.findPostComments(postId);
                res.status(200).json(commentById);
              } else {
                  res.status(404).json({message: `The post with the ID ${postId} does not exist.` });
            }
        }
        catch (err) {
            res.status(500).json({error: "The comments information could not be retrieved." });
        }
   
})


//POST to /:id/comments
/*Chirstina, in your previous comments you said to do another if statement to check if the comment was inserted.
I am not sure if this is necessary after succesfull status code 200. For the db function arguments, I tried with just a
single object and it did not work. Another student had the same problem and had to padd the id as a separate
argument. We can go over this and see if thre is a single solution. */
router.post('/:id/comments' , async (req , res) => {

    try {
        const count = await db.findById(req.params.id);
        if (count) {
            const comment = req.body;
            if (comment) {
                const insertedComment = await db.insertComment(comment , req.params.id);
                res.status(200).json({message: `The comment ${insertedComment} was saved successfully`});
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
router.delete('/:id' , async (req , res) => {
    try {
      const count = await db.remove(req.params.id);
      if (count > 0) {
          res.status(200).json({message: 'The post has been deleted'});
      } else {
          res.status(400).json({message: `The post with the specified ID: ${postId} does not exist.` });
      }
    }
    catch(err) {
        res.status(500).json({error: "The post could not be removed"});
    }
})


//PUT method

router.put('/:id' , async (req , res)=> {
    const checkExistingPost = await db.findById(req.params.id);
    const newPost = req.body;
    try {
        if (checkExistingPost) {
            if (newPost.title && newPost.contents) {
                const updatedPost = await db.update(req.params.id , newPost);
                res.status(200).json({message:'Successful update'})
            } else {
                res.status(400).json({errorMessage: "Please provide title and contents for the post." });
            }
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist." });
        }
    }
    catch(err) {
        res.status(500).json({ error: "The post information could not be modified." });
    }
})


module.exports = router;
















module.exports = router;

