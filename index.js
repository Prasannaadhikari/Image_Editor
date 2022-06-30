const express = require("express");
const { async } = require('@firebase/util');
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.listen(PORT, () => {
  console.log("Listening on port 3000");
});