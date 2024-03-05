require('dotenv').config()
const supabase = require('@supabase/supabase-js')

class SanboxDatabase {
    constructor() {
        if(SanboxDatabase.instance) {
            return SanboxDatabase.instance;
        }
        this._client = supabase.createClient( process.env.URL , process.env.KEY, {
            auth: {
                autoRefreshToken: false,
            }
        } );
        SanboxDatabase.instance = this;
    }

    get client() {
        return this._client;
    }
}
module.exports = new SanboxDatabase();                                                                                      