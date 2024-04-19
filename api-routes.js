
const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb')
const url = process.env.MONGODB_URI || require('./secrets/mongodb.json').url
const client = new MongoClient(url)

const getCollection = async (dbName, collectionName) => {
    await client.connect();
    return client.db(dbName).collection(collectionName);
};
// GET /api/todos
router.get('/', async (_, response) => {
    const collection = await getCollection()
    const todos = await collection.find().toArray()
	response.json(todos);
})

// POST /api/todos
router.post('/', async (request, response) => {
	const { item, complete } = request.body
    const collection = await getCollection()
    const result = await collection.insertOne({ item, complete })
    response.json(result.ops[0]);

})

// PUT /api/todos/:id
router.put('/:id', async (request, response) => {
    const { id } = request.params;
    const collection = await getCollection();
    const objectId = new ObjectId(id);
    const todo = await collection.findOne({ _id: new ObjectId(id) });
    const complete = !todo.complete;
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { complete } });
    response.json({ id, complete });
});

module.exports = router;

