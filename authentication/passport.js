const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const user = require('../database/databse');

module.exports = (passport)=>{
    let opts={};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = 'Mysecret';
    passport.use(new JwtStrategy(opts, (payload, done) => {
        user.findUserById(payload._id, (err, result) => {
            if(err) return done(err, false);
            else if(result) {
                return done(null, result);
                
            }
            else return done(null, false);
        })
    }))
}