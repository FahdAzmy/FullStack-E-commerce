const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/INETechs').then(async () => {
  const products = await mongoose.connection.db.collection('products').find({}).project({ _id: 1, title: 1, imageCover: 1 }).toArray();
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
