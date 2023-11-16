const express = require('express');
const port = process.env.PORT || 27485;
const app = express();
const cors = require('cors');
require('dotenv').config()

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('triolingo is running...');
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoPassword}@milestone11.ja7anyt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const database = client.db('triolingoDB');
        const usersCollection = database.collection('users');
        const classesCollection = database.collection('classes');
        const activitiesCollection = database.collection('activities');

        //get all classes api
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result);
        })

        //get all users api
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        //get single user api
        app.post('/user', async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const userDetails = await usersCollection.findOne(query);
            res.send(userDetails);
        })
        //popular instructors user api
        app.get('/popularInstructors', async (req, res) => {
            const query = { role: 'instructor' };
            const instructors = await usersCollection.find(query).limit(6).toArray();
            res.send(instructors);
        })

        //all instructors user api
        app.get('/allInstructors', async (req, res) => {
            const query = { role: 'instructor' };
            const instructors = await usersCollection.find(query).toArray();
            res.send(instructors);
        })
        //popular instructors user api
        app.get('/popularInstructors', async (req, res) => {
            const query = { role: 'instructor' };
            const instructors = await usersCollection.find(query).limit(6).toArray();
            res.send(instructors);
        })

        //popular classes user api
        app.get('/popularClasses', async (req, res) => {
            const classes = await classesCollection.find().sort({"enrolled": -1}).limit(6).toArray();
            res.send(classes);
        })

        //add new user api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const isUserExist = await usersCollection.findOne(query);
            if (isUserExist) {
                return res.send({ message: 'user already exist.' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        //updating a user role api
        app.patch('/user', async (req, res) => {
            const data = req.body;
            const filter = { email: data.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: data.role
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        //updating a class status
        app.patch('/class', async (req, res) => {
            const data = req.body;
            const filter = { _id: new ObjectId(data.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: data.newStatus
                },
            };
            const result = await classesCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        //send feedback api
        app.put('/feedback', async (req, res) => {
            const data = req.body;
            const filter = { _id: new ObjectId(data.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    feedback: data.feedback
                },
            };
            const result = await classesCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })



        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('triolingo running on port:', port)
})