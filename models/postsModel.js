const mongoose = require('mongoose');

//Posts schema

const postsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    // For security
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

})

const Post = mongoose.model('post', postsSchema);

module.exports = Post;
