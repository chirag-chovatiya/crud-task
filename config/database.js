const mongoose = require('mongoose');

mongoose
  .connect(`mongodb://${process.env.MONGO_SERVER}/${process.env.MONGO_DATABASE}`)
  .then(() => {
    console.log("Connected to Mongodb database");
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
