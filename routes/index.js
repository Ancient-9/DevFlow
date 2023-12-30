const express = require('express');
var router = require('express').Router();
const { requiresAuth, auth } = require('express-openid-connect');
const path = require('path'); // Import the 'path' module


const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const YOUR_SECRET_KEY = generateSecretKey();
console.log(YOUR_SECRET_KEY);

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user),
    title: 'Profile page'
  });
});

module.exports = router;
const app = express();
const PORT = 3000;

const authConfig = {
  authRequired: false, // Set to true if authentication is always required
  auth0Logout: true,
  secret: YOUR_SECRET_KEY, // Replace with your secret key
  baseURL: 'http://localhost:3000', // Replace with your base URL
  clientID: 'OeeEOCVVh6zw2Rk325xGAA7Zi0WlwGBZ', // Replace with your client ID from Auth0
  issuerBaseURL: 'https://dev-x1sdcuu20hvhyxlf.us.auth0.com' // Replace with your Auth0 issuer base URL
};

app.use(auth(authConfig));
app.use('/', router);
app.set('view engine', 'ejs'); // Set EJS as the view engine
//app.set('views', path.join(__dirname, './views/index.ejs')); // Set the directory where your views are located
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
app.listen(PORT, () =>{
  console.log('server running on port ${PORT}');
});