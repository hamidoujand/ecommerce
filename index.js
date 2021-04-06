let express = require("express");
let dotenv = require("dotenv");
let mongoose = require("mongoose");
let path = require("path");
let envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath });
let session = require("express-session");
let MongoStore = require("connect-mongo");
let cookieParser = require("cookie-parser");

let errorHandler = require("./controllers/errorController");

let usersRoute = require("./routes/usersRoute");
let productsRoute = require("./routes/productsRoute");

//****** APP ******* */
let app = express();

app.enable("trust proxy");

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

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" && true,
      expires: new Date(
        Date.now() + process.env.SESSION_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
    },
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(cookieParser());

//************* API  ************ */

app.use("/api/v1/users", usersRoute);

app.use("/api/v1/products", productsRoute);

//************** GLOBAL ERROR HANDLER *************** */
app.use(errorHandler);

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App on Port ${PORT}`));
