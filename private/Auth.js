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

    async signInWithPassword(req, res) {
        try{
            const { data, error } = await this.database._client.auth.signInWithPassword({
                email: req.email,
                password: req.password
            });
            if(error) {
                return { status: 400, error: error.message };
            }
            res.cookie('sb:token', data.session.access_token, { httpOnly: true });
            res.cookie('sb:refreshToken', data.session.refresh_token, { httpOnly: true })
            return { status: 200, message: 'User signed in successfully' };
        }
        catch(e){
            return { status: 500, error: e };
        }
    }

    async getUser(req, res) {
        try {
            const token = req.cookies['sb:token'];
            const { data, error } = await this.database._client.auth.api.getUser(token);
            if (error) {
                return { status: 400, error: error.message };
            }
            return { status: 200, data: data };
        } catch (e) {
            return { status: 500, error: e };
        }
    }

    async logOut(res) {
        try {
            res.clearCookie('sb:token');
            return { status: 200, message: 'Logged out successfully' };
        } catch (e) {
            return { status: 500, error: e };
        }
    }

    async checkAndRefreshSession(req, res) {
        try {
            const token = req.cookies['sb:token'];
            const refreshToken = req.cookies['sb:refreshToken'];
            const { data, error } = await this.database._client.auth.setSession({
                token,
                refreshToken
            })
            const sessionExpiresAt = new Date(jwt.decode(token).exp);
            const now = new Date();
            const timeLeft = sessionExpiresAt.getTime() - now.getTime();

            if (timeLeft < 30 * 60 * 1000) {
                const { data, error } = await this.database._client.auth.refreshSession(refreshToken);
                if (error) {
                    console.log(error)
                    return { status: 400, location: '/' };
                }
                res.cookie('sb:token', refreshData.session.access_token, { httpOnly: true });
            }
                    return { status: 200 };
        } catch (e) {
            return { status: 500, error: e };
        }
    }
}

module.exports = new Authentication(database);