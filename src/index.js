const express = require('express');
const { json } = require('express');
require('dotenv').config();
const connect = require('./config/mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(json());
app.use('/api/auth', require('./routes/user.routes'));
const APP_PORT = process.env.PORT;
app.get('/', (req, res) => {
  res.json({
    msg:
      "Here's the Home page of Zuri X I4G Team 126 Project CC_Gen the World class App",
  });
});
connect();

app.listen(APP_PORT, () => {
  console.log(`Server is live at port ${APP_PORT}`);
});
