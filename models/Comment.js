const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//Model comment
const commentSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    _author: {
        id:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;