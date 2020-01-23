const mongoose = require('mongoose'),
      Comment  = require('./comment');

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            reg: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

campgroundSchema.pre('remove', async function(next) {
    try {
        await Comment.deleteMany({
            "_id": {
                $in: this.comments
            }
        });
        next();
    } catch(err) {
        next(err);
    }
});
module.exports = mongoose.model("Campground", campgroundSchema);