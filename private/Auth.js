const Database = require('./Database.js');

class Authentication extends Database {
    constructor() {
        super();
        if (Authentication.instance) {
            return Authentication.instance;
        }
        Authentication.instance = this;
    }

    async signInWithPassword({ email, password }) {
        const { data, error } = await this.client.auth.signInWithPassword({
            email: email,
            password: password
        });
        if(error) {
            return { error };
        }
        return { data };
    }

    async getUser() {
        const user = this.client.auth.user();
        return { user };
    }
}

module.exports = new Authentication();