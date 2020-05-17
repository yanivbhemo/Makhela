var mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10;

var user = new mongoose.Schema({
    full_name:{type: String, required: true},
    email: String,
    username: {type: String, required: true},
    password: String,
    role: {type: String, required: true},
    native_id: Number
}, { collection: 'users', versionKey: ''} )

user.pre('save', function(next) {
    if(this.isNew || this.isModified('password') || this.isModified('username')) {
        const document = this
        bcrypt.hash(document.password, saltRounds,
            function(err, hashedPassword) {
                if(err) {
                    next(err);
                } else {
                    document.password = hashedPassword
                    next();
                }
            });
    } else {
        next();
    }
});

user.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, same) {
        if(err){
            callback(err)
        }
        else {
            callback(err, same)
        }
    })
}

var User = mongoose.model('User', user);

module.exports = User;