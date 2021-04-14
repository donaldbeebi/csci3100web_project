const mongoose = require("mongoose");
const User = require("../User_System/UserModel");

const CommentSchema = mongoose.Schema({
    owner: {
        type: String,
        //type: mongoose.Schema.Types.String,
        required: true
        //ref: 'User'
    },
    parentPost:{
        type: String,
        required: true
    },
    parentComment:{
        type: String,
        default: ""
    }, 
    childrenComments: {
        type: [String],
        default: []
    },
    content: {
        type: String,
        required: true,
        maxLength: 2048,
        minLength: 1
    },
    deleted: {
        type: Boolean,
        default: false
    },
    upvotes: {
        type: Number, 
        default: 0
    },
    upvoteOwners: {
        type: [String],
        default:[]
    },
    downvotes: {
        type: Number,
        default: 0
    },
    downvoteOwners: {
        type: [String],
        default:[]
    },
    votes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

CommentSchema.pre('save', async function(next) {
      const comment = this;
      if(comment.isModified('upvotes') || comment.isModified('downvotes')) {
          //Calculating the total votes
          comment.votes = comment.upvotes - comment.downvotes;
      }
      next();
  });

module.exports = CommentSchema;
