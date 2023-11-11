// Import required modules and packages
const express = require("express"); // Express.js for creating the API server
require("dotenv").config(); // Load environment variables from a .env file
const puppeteer = require("puppeteer");

// Define the port to listen on (fallback to 8080 if PORT is not set in environment variables)
const port = process.env.PORT || 8080;

// Create an instance of the Express application
const app = express();

app.get("/screenshot", async (req, res) => {
  const { url } = req.query;

  try {
    const browser = await puppeteer.launch({
      headless: true, // Use headless mode
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 700 }); // Adjust as needed

    await page.goto(url);

    // Take screenshot as a buffer
    const screenshotBuffer = await page.screenshot();

    // Close the browser
    await browser.close();

    // Send the image as a response
    res.contentType("image/png"); // Adjust the content type based on the image format
    res.send(screenshotBuffer);
  } catch (error) {
    console.error("Error taking screenshot:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log("Listening on port " + port);
});
