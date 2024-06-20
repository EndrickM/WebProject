const express = require("express")
const routes = require("../src/routes")
const cors = require("cors")


const app = express();

app.use(cors());
app.use(express.json());
app.use(routes); 




app.listen(3333, () => console.log("Server up in 3333"));