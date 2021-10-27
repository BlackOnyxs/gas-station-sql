const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGODB_NCC, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Db online!');

    } catch (error) {
        console.log(error);
        throw new Error('DB Error.');
    }
}

module.exports = {
    dbConnection
}