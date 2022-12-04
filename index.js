require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const authRoute = require("./routes/auth");
const port = process.env.PORT || 5000;
// Allowing cross origin access
app.use(cors());
if (!config.has("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
// Connecting mongo db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.log(err));
app.use(express.json());
// User signup and login details
app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`Backend server is running! on port ${port}`);
});
