const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors");
const dbConfig = require("./config/db.config.js");
const cookieParser = require('cookie-parser');

const blogRoutes = require('./routes/blogRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const ticketStatusRoutes = require('./routes/ticketStatusRoutes');
const supportLevelRoutes = require('./routes/supportLevelRoutes');
const faqRoutes = require('./routes/faqRoutes');
const issueCategoryRoutes = require('./routes/issueCategoryRoutes');
const complainRoutes = require('./routes/complainRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');

// custom middlewares
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// express app
const app = express();
// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());

// connect to mongodb & listen for requests
const dbURI = dbConfig.url;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () =>{
    app.listen(PORT)
    console.log(`Server running on port ${PORT}`)
  })
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', requireAuth, (req, res) => {
  res.render('about', { title: 'About' });
});


app.use('/blogs', blogRoutes);
app.use('/tickets', requireAuth,checkUser, ticketRoutes);
app.use(authRoutes);
app.use('/ticket-status', ticketStatusRoutes);
app.use('/support-level', supportLevelRoutes);
app.use('/faq', faqRoutes);
app.use('/issue-category', issueCategoryRoutes);
app.use('/complains', complainRoutes);
app.use('/users', requireAuth, userRoutes);
app.use('/roles', requireAuth, roleRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});