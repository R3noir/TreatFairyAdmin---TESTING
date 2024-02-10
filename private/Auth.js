const database = require('./Database.js');
const jwt = require('jsonwebtoken');


class Authentication {
    constructor(database) {
        this.database = database;
        let session;
        if (!Authentication.instance) {
            Authentication.instance = this;
        }
        return Authentication.instance;
    }

    async signInWithPassword({ email, password }) {
        try{
            const { data, error } = await this.database._client.auth.signInWithPassword({
                email: email,
                password: password
            });
            if(error) {
                return { error : error.message };
            }
            await (this.session = data.session.access_token);
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

    async isSessionExpired() {
        try{
            const user = await this.getUser();
            if (!this.session | !user){
                console.log('No session found')
                return { error: 'No session found' };
            }
            const decodedToken = jwt.decode(this.session);
            const currentTime = Date.now() / 1000;
            const bufferTime = 5 * 60;  // 5 minutes
            
            if (decodedToken.exp < currentTime) {
                this.database._client.auth.signOut();
                console.log('Session expired')
                return { error: 'Session expired' };
            }

            if (decodedToken.exp < currentTime + bufferTime) {
                const refreshSession = (await this.database._client.auth.refreshSession()).data.session;
                this.session = refreshSession.access_token;
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

    async logOut() {
        const { error } = await this.database._client.auth.signOut()
        if (error) {
            return { error: error.message }
        }
        return { message: 'Logged out successfully' };
    }
}

module.exports = new Authentication(database);