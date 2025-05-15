const Post = require('../models/postsModel');

const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;

        //* Create post with author from authenticated user
        const post = await Post.create({
            title,
            description,
            author: req.user._id
        });

        res.status(201).json({
            status: 'success',
            data: post
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        //* add isMine flag to check if current auth. user created the post
        const transformedPosts = posts.map(post => ({
            ...post.toObject(),
            isMine: post.author.toString() === req.user._id.toString()
        }));

        res.json({
            message: 'Posts fetched successfully',
            status: 'success',
            data: transformedPosts
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: 'failed'
        });
    }
}



const getPostById = async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);

    //* Testing the auth middleware
    console.log('User info from token:', req.user);

    if (!post) {
        return res.status(404).json({
            message: 'Post not found',
            status: 'failed'
        })
    }
    //* Add isMine flag to check if current auth. user created the post
    const transformedPost = {
        ...post.toObject(),
        isMine: post.author && post.author.toString() === req.user._id.toString()
    };

    res.json({
        message: 'user fetched successfully',
        status: 'success',
        data: transformedPost
    })
}


const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        //* Find the post and checks if it exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                status: 'failed'
            });
        }

        //* Verify the authenticated user owns the post
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'Not authorized to update this post',
                status: 'failed'
            });
        }

        //*Update thee post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title },
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Post updated successfully',
            status: 'success',
            data: updatedPost
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
            status: 'failed'
        });
    }
}

const deletePost = async (req, res) => {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) {
        res.status(404).json({
            message: 'Post not found',
            status: 'failed'
        })
    }
    //* Verify the authenticated user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: 'Not authorized to delete this post',
            status: 'failed'
        });
    }

    //*Delete the post
    await Post.findByIdAndDelete(id)


    res.status(204).json({
        message: 'Post deleted successfully',
        status: 'success'
    })
}




module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
}