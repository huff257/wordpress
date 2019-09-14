if (!process.env.MONGODB_URI) {
    const dotenv = require('dotenv');
    const result = dotenv.config();
    
    // If there's an error, throw 
    if (result.error) {
        throw result.error;
    };
    
    const {parsed: envs} = result;
    
    module.exports = envs;
}