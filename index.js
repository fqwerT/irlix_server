const express = require("express");
const router = require("./router/router");
const cors = require('cors')

const bodyParser = require("body-parser");

const app = express();
app.use(express.json())
//app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use("/api", router);
app.listen(port, () => {
  console.log(`server is started on port ${port}`);
});
