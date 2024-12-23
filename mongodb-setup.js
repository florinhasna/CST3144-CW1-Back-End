import PropertiesReader from "properties-reader";
import path from "path";
import { fileURLToPath } from 'url';
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

// making filename and dirname functional in ES module environment
// get the current file path 
const __filename = fileURLToPath(import.meta.url);
// get the directory name
const __dirname = path.dirname(__filename);

let propertiesPath = path.resolve(__dirname, "conf/db.properties");
let properties = PropertiesReader(propertiesPath);
let dbPprefix = properties.get("db.prefix");
//URL-Encoding of User and PWD
//for potential special characters
let dbUsername = encodeURIComponent(properties.get("db.user"));
let dbPwd = encodeURIComponent(properties.get("db.pwd"));
let dbName = properties.get("db.dbName");
let dbUrl = properties.get("db.dbUrl");
let dbParams = properties.get("db.params");
const uri = dbPprefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;


export const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
export let db = client.db(dbName);

// collections of the db exported
export const collections = {
    lessons: db.collection('Lessons'),
    orders: db.collection('Orders'),
}

// function to get a collection's entries
export async function find(aCollection, query, sortCriteria) {
    // connect to db
    await client.connect();

    // get the data in an array
    const result = await aCollection.find(query, sortCriteria).toArray();

    // close connection
    await client.close();

    return result;
}

// function to insert a new entry in a collection
export async function insert(aCollection, newEntry) {
    // connect to db
    await client.connect();

    // enter a new entry in the desired collection
    let insertion = await aCollection.insertOne(newEntry);

    // close connection
    await client.close();

    return insertion.insertedId;
}

// function to update an entry of a collection
export async function update(aCollection, data) {
    try {
        // connect to the database
        await client.connect();

        // perform updates concurrently
        const updates = data.map(async ({ _id, ...updateFields }) => {
            return aCollection.updateOne(
                { _id: new ObjectId(_id) },
                { $set: updateFields }
            );
        });

        // wait for all updates to complete and return after
        return await Promise.all(updates);
    } catch (error) { // log the error
        console.error("Error updating documents:", error);
    } finally {
        // Close the connection
        await client.close();
    }
}

// test connection and print confirmation
(async () => {
    try {
        await client.connect();
        console.log('MongoDB connected successfully!');

        // Use the client
        const db = client.db(dbName);
        console.log('Database:', dbName);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    } finally {
        // Close the client when you're done
        await client.close();
    }
})();