const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const cors = require('cors');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's origin
  credentials: true,
  methods: ['GET', 'POST']

}));
// app.set('view engine', 'ejs');
// app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('665ea7320597006cf4182a5b')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://ishi:ishi2001@cluster0.s27bx1x.mongodb.net/store', { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
