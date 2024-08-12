require("dotenv").config();

const { fetchAndUpload } = require("./lambda_function"); // Replace with the actual file name where your function is located

const event = {}; // Your simulated event object, if needed
const context = {}; // Your simulated context object, if needed

fetchAndUpload(event, context)
  .then((response) => {
    console.log("Lambda Response:", response);
  })
  .catch((error) => {
    console.error("Lambda Error:", error);
  });
