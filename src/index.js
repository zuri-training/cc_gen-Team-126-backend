const express = require('express');
const { json } = require('express');
require('dotenv').config();
const connect = require('./config/mongoose');
const app = express();
app.use(json());
app.use('/api/auth', require('./routes/user.routes'));
const APP_PORT = process.env.PORT;
app.get('/', (req, res) => {
  res.json({ msg: "Here's the Home page" });
});
connect();

app.listen(APP_PORT, () => {
  console.log(`Server is live at port ${APP_PORT}`);
});
