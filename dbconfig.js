const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.DB_URL);
    const conn = mongoose.connection

    conn.on('open', ()=>{
        console.log('Database Connected');
    });
    module.exports = conn
} catch (err) {
    console.log(err);
}
