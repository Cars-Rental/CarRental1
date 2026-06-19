import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userModel } from '../../DB/model/user.model.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await userModel.findOne({
            providerId: profile.id
        });

        if (!user) {
            user = await userModel.create({
                userName: profile.displayName,
                email: profile.emails[0].value,
                provider: 'google',
                providerId: profile.id
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }

}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
export default passport;