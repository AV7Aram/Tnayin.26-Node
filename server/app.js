const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const { UserService } = require('./services/UserService');
const { ProductService } = require('./services/ProductService');
const { CartService } = require('./services/CartService');

const models = require('./models');

const app = express();

mongoose.connect('mongodb+srv://Aram:Aramik88@cluster0.jul6yuh.mongodb.net/usersDB?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Failed to connect to database:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.models = {
  user: models.user,
  prod: models.prod,
  cart: models.cart
}

app.locals.services = {
  user: new UserService(app.locals.models),
  prod: new ProductService(app.locals.models),
  cart: new CartService(app.locals.models)
};

app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/users', usersRouter);

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;