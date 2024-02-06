const database = require('./Database.js');

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
            return { data };
        }
        catch(e){
            return { error: e.message }
        }
    }

    async getUser() {
        const user = (await this.database._client.auth.getUser()).data
        return user.user
    }

    async ensureAuthenticated(token) {
        try {
            const { data: user, error } = await this.database._client.auth.api.getUser(token);
            if (error || !user) {
                return { error: 'User is not authenticated' };
            }
            return { user };
        } catch (e) {
            return { error: e.message };
        }
    }

}

module.exports = new Authentication(database);