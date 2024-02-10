const database = require('./Database.js');
const jwt = require('jsonwebtoken');


class Authentication {
    constructor(database) {
        this.database = database;
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

    async refreshSession() {
        try{
            const session = await this.database._client.auth.getSession();
            console.log('session is what:', session);
            /*
            const decodedToken = jwt.decode(session.data.session.access_token);
            const currentTime = Date.now() / 1000;
            const bufferTime = 30  // 5 minutes before expiry
            console.log('session is what:', session);
            if (decodedToken.exp < currentTime + bufferTime) {
                const { error } = await this.database._client.auth.refreshSession();
                if (error) {
                    return { error: error.message };
                }
                return { message: 'Session refreshed successfully' };
            }
            */
                return { message: 'Session is valid' };
        }
        catch(e){
            return { error: e.message }
        }
    }

    isSessionExpired() {
        return new Promise((resolve, reject) => {
            try {
                const {data} = this.database._client.auth.onAuthStateChange(async (event, session) => {
                    this.database._client.auth.getSession();
                    if (event === 'TOKEN_REFRESHED') {
                        console.log('Token refreshed');
                        this.database._client.auth.signOut();
                        resolve({ error: 'session expired' });
                    }
                    data.subscription.unsubscribe()
                    const refreshResult = await this.refreshSession();
                    console.log('Token refresh called');
                    if (refreshResult.error) {
                        console.log('token error:', refreshResult);
                        resolve({ error: refreshResult.error });
                    } else {
                        resolve({ message: 'Session is valid' });
                    }
                });
            } catch (e) {
                reject({ error: e.message });
            }
        });
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