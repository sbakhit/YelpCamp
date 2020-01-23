const mongoose              = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
    username: String,
    password: String,
    campgrounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }]
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);