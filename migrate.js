const MongoClient = require('mongodb').MongoClient;

async function copyCollections() {
    
    var db1 = "db-1 url";
    var db2 = "db-2 url";
    const client1 = await MongoClient.connect(db1, { useNewUrlParser: true, useUnifiedTopology: true });
    const client2 = await MongoClient.connect(db2, { useNewUrlParser: true, useUnifiedTopology: true });
    db1 = client1.db("src_db");
    db2 = client2.db("dest_db");
    const collections = await db1.listCollections().toArray();
    for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        const name = collection.name;
        const options = collection.options;
        await db2.createCollection(name, options);
        const cursor = await db1.collection(name).find();
        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            await db2.collection(name).insertOne(doc);
        }
    }
    client1.close();
    client2.close();
}

copyCollections();
