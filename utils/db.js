const mongoose = require('mongoose');

const connectDB = async () => {
    const path = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`

    var conn = await mongoose.connect(process.env.MONGO_DB_LOCAL, {
    // var conn = await mongoose.connect(path, {

        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`mongodb connected: ${conn.connection.host}`);
    console.log(`db connected: ${conn.connection.name}`);

    
};
module.exports = connectDB;
