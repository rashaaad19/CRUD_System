const Router = require('express')
const postController = require('../controllers/postsController');
const auth = require('../middleware/auth');


const router = Router();


//Create Post
router.post('/',auth, postController.createPost);
//Get all posts
router.get('/',auth, postController.getAllPosts)
//Get post by id
router.get('/:id',auth, postController.getPostById);
//Update post
router.patch('/:id',auth, postController.updatePost)
//Delete post
router.delete('/:id',auth, postController.deletePost)


module.exports = router 