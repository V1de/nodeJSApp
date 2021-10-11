const { MongoClient } = require("mongodb");

const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;

let db = null;
const uri = `mongodb+srv://Vide:${dbPass}@cluster0.naegm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 

exports.connect = () => {
  client.connect((err, cl) => {
    if (err) console.log(err);

    db = cl.db(dbName).collection("cars");
    console.log("db connection established");
  });
};

exports.instance = () => {
  return db;
}
