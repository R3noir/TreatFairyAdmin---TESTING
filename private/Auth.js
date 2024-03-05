const database = require('./Database.js');
const jwt = require('jsonwebtoken');
const Formvalidation = require('./FormValidation.js');

class Authentication {
    constructor(database) {
        this.database = database;
        let session;
        if (!Authentication.instance) {
            Authentication.instance = this;
        }
        return Authentication.instance;
    }

    async signInWithPassword({ email, password }, res) {
        try{
            const { data, error } = await this.database._client.auth.signInWithPassword({
                email: email,
                password: password
            });
            if(error) {
                return { error : error.message };
            }
            //await (this.session = data.session.access_token);
            res.cookie('session', data.session.access_token, { httpOnly: true });
            return { message: 'User signed in successfully' };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getUser() {
        const user = (await this.database._client.auth.getUser());
        return user.data.user
    }

    async isSessionExpired(req) {
        try{
            const sessionToken = req.cookies.session;
            if (!sessionToken){
                return { error: 'No session found' };
            }
            const decodedToken = jwt.decode(sessionToken);
            const currentTime = Date.now() / 1000;
            const bufferTime = 5 * 60;  // 5 minute
            
            if (decodedToken.exp < currentTime) {
                this.database._client.auth.signOut();
                console.log('Session expired')
                return { error: 'Session expired' };
            }
    
            if (decodedToken.exp < currentTime + bufferTime) {
                console.log('Session will expire soon')
                const refreshSession = (await this.database._client.auth.refreshSession()).data.session;
                req.cookies.session = refreshSession.access_token;
                if (!refreshSession) {
                    return { error: 'Session expired' };
                }
            }
            return { message: 'Session is valid' };
        }
        catch(e){
            return { error: e.message }
        }
    }
    
    async getUserByCookie(sessionId) {
        try {
            const { data: user, error } = await this.database._client.auth.api.getUser(sessionId);
            if (error) {
                return { error: error.message };
            }
            return { user };
        } catch (e) {
            return { error: e.message };
        }
    }

    async logOut() {
        const { error } = await this.database._client.auth.signOut()
        if (error) {
            return { error: error.message }
        }
        return { message: 'Logged out successfully' };
    }

    async resetPassword(email) {
        try {
            console.log(Formvalidation.validateEmail(email))
            if(!Formvalidation.validateEmail(email)){
                return { error: 'Invalid email' };
            }
            const { data, error } = await this.database._client.auth.resetPasswordForEmail(email /*, {
                redirectTo: 'http://localhost:3000/'} */); // Replace with your own URL
            if (error) {
                return { error: error.message };
            }
            return { message: 'Password reset email sent' };
        } catch (e) {
            return { error: e.message };
        }
    }
    
    async setsession(accessToken, expiresIn, refreshToken, tokenType, res) {
        this.database._client.auth.signOut();
        const { data, error } = this.database._client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        if(error){
            return { error: error.message };
        }
        // Set a cookie with the session token
        res.cookie('session', accessToken, { httpOnly: true });
        return { message: 'Session set successfully' };
        }
    }

module.exports = new Authentication(database);