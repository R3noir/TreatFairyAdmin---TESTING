require('dotenv').config()
const supabase = require('@supabase/supabase-js')

class Database {
    constructor(URL, KEY) {
        if(Database.instance) {
            return Database.instance;
        }
        this._client = supabase.createClient( process.env.URL , process.env.KEY );
        Database.instance = this;
    }

    get client() {
        return this._client;
    }
}

module.exports = new Database().client;