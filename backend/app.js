const express = require("express");
const app = express();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const bodyparser = require("body-parser");
const FAST_API_URL = "http://127.0.0.1:8000";
const cors = require("cors");
// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".")[0];
    cb(null, filename + "_" + uniqueSuffix + ".png");
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyparser.urlencoded({ extended: true }));

// Route for uploading and predicting
app.post("/predict", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));

    const uploadResponse = await axios.post(
      FAST_API_URL + "/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    console.log(uploadResponse.data);

    // Return the response data to the client
    res.status(200).json({ data: uploadResponse.data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
