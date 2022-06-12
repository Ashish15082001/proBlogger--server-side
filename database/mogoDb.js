const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://ashish:12345@cluster0.r2ify.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let dataBase;

const setDatabase = function (dataBaseObject) {
  dataBase = dataBaseObject;
};

const getDatabase = function () {
  return dataBase;
};

module.exports = { client, setDatabase, getDatabase };
