const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is missing. Set it in your environment variables.');
}

const globalCache = global.mongooseConnection || (global.mongooseConnection = { conn: null, promise: null });

const connectDB = async () => {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing');
    }

    mongoose.set('bufferCommands', false);

    globalCache.promise = mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
};

module.exports = connectDB;
