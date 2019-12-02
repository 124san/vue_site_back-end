const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;


const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	description: {
		type: String
	}
})

UserSchema.pre('save', function(next){
	var user = this;
    if (!user.isModified('password')) {return next()};
    bcrypt.hash(user.password,saltRounds).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
})

UserSchema.methods.comparePassword = function(candidatePassword,next){   
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
		if(err) return next(err);
		next(null,isMatch)
	})
}


module.exports = mongoose.model('user', UserSchema);
