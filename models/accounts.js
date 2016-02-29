//setup for user accounts

import mongo from 'mongodb';
import Model from 'mongoose-babelmodel';

class User extends Model{
	username= String;
	password= String;
};

let user = new User();
export default user.generateModel();

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});