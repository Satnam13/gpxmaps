const mongoose = require('mongoose');

const gpxSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    data: { type: String, trim: false, required: true },
    //date: {type: Date, required: true}
});

const gpxUser = module.exports = mongoose.model('gpxdatas', gpxSchema);
module.exports.setGpxData = (user, data) => {
    var newData = new gpxUser();
    newData.username = user.toUpperCase();
    newData.data = data;
    newData.save((err, res) => {
        if (err) console.log(err);
        //console.log(res);
    })

}

