module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://192.168.0.3/luriflix',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'YOUR_UNIQUE_JWT_TOKEN_SECRET',
}