require('dotenv').config()
const supabase = require('@supabase/supabase-js')

class AdminDatabase {
    constructor() {
        if(AdminDatabase.instance) {
            return AdminDatabase.instance;
        }
        this._client = supabase.createClient( process.env.URL , process.env.SERVICE, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            }
        } );
        AdminDatabase.instance = this;
    }

    get client() {
        return this._client;
    }
}
module.exports = new AdminDatabase();                                                                                      