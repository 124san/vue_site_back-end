const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// CHANGE uri to environment variable in the future
const uri = process.env.MONGO_URI || "mongodb+srv://124san:kdh10293847@cluster0-4rswz.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB connected'))
.catch(err => {console.log(err)})
