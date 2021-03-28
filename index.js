let express = require("express");
let dotenv = require("dotenv");
let mongoose = require("mongoose");
let path = require("path");
let envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });
let errorHandler = require("./controllers/errorController");

let usersRoute = require("./routes/usersRoute");
let productsRoute = require("./routes/productsRoute");

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
  .catch((error) => {
    throw error;
  });

//***************** MIDDLEWARE ***************** */
app.use(express.json());

//************* API  ************ */

app.use("/api/v1/users", usersRoute);

app.use("/api/v1/products", productsRoute);

//************** GLOBAL ERROR HANDLER *************** */
app.use(errorHandler);

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App on Port ${PORT}`));
