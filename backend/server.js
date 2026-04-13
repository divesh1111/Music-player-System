require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const uploadRoute = require("./routes/upload");
const songsRoute = require("./routes/songs");
const authRoute = require("./routes/auth");

app.use("/api/upload", uploadRoute);
app.use("/api/songs", songsRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
