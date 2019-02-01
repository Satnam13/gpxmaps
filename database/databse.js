const mongoose = require('mongoose');

const registerationSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true},
    usage: {type: String, required: true, trim: false},
    serial: {type: String, required: false, trim: true},
    dob: {type: String, required: true},
    password: {type: String, required: true, trim: true}
}) ;

const user = module.exports = mongoose.model('registeredusers', registerationSchema);

module.exports.findUserByName = (username, callback) => {
    user.findOne({username: username.trim()}, callback);
}
module.exports.findUserById = (id, callback)=>{
    user.findById(id, callback);
}