let express = require("express");
let dotenv = require("dotenv");
let mongoose = require("mongoose");
let path = require("path");
let envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });

//****** APP ******* */
let app = express();

//****** DB CONNECTION ******** */
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB in THE HOUSE!"))
  .catch((err) => {
    throw err;
  });

//************* API  ************ */

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App on Port ${PORT}`));
