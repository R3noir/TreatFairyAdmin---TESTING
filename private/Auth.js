const database = require('./Database.js');

class Authentication {
    constructor() {
        if (!Authentication.instance) {
            Authentication.instance = this;
        }
        return Authentication.instance;
    }

    async signInWithPassword({ email, password }) {
        const { data, error } = await database._client.auth.signInWithPassword({
            email: email,
            password: password
        });
        if(error) {
            return { error };
        }
        return { data };
    }

    async getUser() {
        const user = (await database._client.auth.getUser()).data
        return user.user
    }

}

module.exports = new Authentication();