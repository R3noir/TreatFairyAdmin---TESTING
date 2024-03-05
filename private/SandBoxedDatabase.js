require('dotenv').config()
const supabase = require('@supabase/supabase-js')

class SanboxDatabase {
    constructor() {
        this._client = supabase.createClient( process.env.URL , process.env.KEY, {
            auth: {
                autoRefreshToken: false,
            }
        } );
    }

    get client() {
        return this._client;
    }
}
module.exports = new SanboxDatabase();                                                                                      