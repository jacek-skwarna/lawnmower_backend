use "lawnmower";
db.users.createIndex({email: 1}, {unique: true});