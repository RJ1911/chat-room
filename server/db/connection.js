import mongoose from "mongoose";
const uri = "mongodb+srv://admin:admin123@cluster0.toegsap.mongodb.net/?retryWrites=true&w=majority";



mongoose.connect(uri,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(()=>
{
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
})










// import { MongoClient, ServerApiVersion } from 'mongodb';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     console.log("connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
