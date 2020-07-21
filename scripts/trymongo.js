const { MongoClient } = require('mongodb')

const url = "mongodb://localhost/issuetracker"

function testWithCallbacks(callback) {
    console.log('\n--- testWithCallbacks ---');
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(function (err, client) {
        if (err) {
            callback(err);
            return;
        }
        console.log('Connected to MongoDB');
        const db = client.db();
        const collection = db.collection('issues');

        const issu = { title :"Service crashing with 5 simul request", status: "New", owner :"saiesh", effort:15 };
        collection.insertOne(issu, function (err, result) {
            if (err) {
                client.close();
                callback(err);
                return;
            }
            console.log('Result of insert:\n', result.insertedId);
            collection.find({ _id: result.insertedId })
                .toArray(function (err, docs) {
                    if (err) {
                        client.close();
                        callback(err);
                        return;
                    }
                    console.log('Result of find:\n', docs);
                    client.close();
                    callback(err);
                });
        });
    });
}
testWithCallbacks(function (err) {
    if (err) {
        console.log(err);
    }
});