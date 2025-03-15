const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_ID;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbSendResult = async function (winner, loser, score, game) {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const database = client.db("GamePlace");
    const historyCollection = database.collection("MatchHistory");
    const doc = {
      winner: winner,
      loser: loser,
      score: score,
      game: game,
      timestamp: new Date(),
    };
    const result = await historyCollection.insertOne(doc);
    return result;
  } catch {
    console.error("An error occurred while connecting to MongoDB", error);
    return;
  }
};

const dbGetData = async function (email) {
  let result = [];
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const database = client.db("GamePlace");
    const historyCollection = database.collection("MatchHistory");
    result = historyCollection
      .find({
        $or: [{ winner: email }, { loser: email }],
      })
      .sort({ timestamp: -1 })
      .toArray();
  } catch {
    console.error("An error occurred while connecting to MongoDB", error);
  }
  return result;
};

module.exports = { dbSendResult, dbGetData };
