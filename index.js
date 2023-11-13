const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const url = require("url");

const app = express();
const port = 8080;

// Use cors middleware
app.use(cors());

app.get("/", async (req, res) => {
  const urlString = req.query.url;

  if (!urlString) {
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    // Make a GET request to the specified URL
    const response = await axios.get(urlString);

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Load the HTML content into Cheerio
      const $ = cheerio.load(response.data);

      const metaTags = ["og", "twitter"];

      let site_name = "",
        title = "",
        image = "",
        description = "";

      // Iterate over metaTags and extract data
      metaTags.forEach((metatag) => {
        if (!site_name) {
          site_name = $(`meta[property="${metatag}:site_name"]`).attr(
            "content"
          );
        }
        if (!title) {
          title = $(`meta[property="${metatag}:title"]`).attr("content");
        }
        if (!image) {
          // Check if the image attribute starts with a forward slash
          const relativeImagePath = $(`meta[property="${metatag}:image"]`).attr(
            "content"
          );
          if (relativeImagePath && relativeImagePath.startsWith("/")) {
            // Prepend the base URL to make it an absolute URL
            image = new URL(relativeImagePath, urlString).href;
          } else {
            image = relativeImagePath;
          }
        }
        if (!description) {
          description = $(`meta[property="${metatag}:description"]`).attr(
            "content"
          );
        }
      });

      if (!site_name) {
        const parsedUrl = url.parse(urlString);
        site_name = parsedUrl.hostname;
      }

      if (!title) {
        title = "";
      }
      if (!description) {
        description = "";
      }
      if (!site_name) {
        site_name = "";
      }
      if (!image) {
        image = "/no-image.png";
      }

      // Extracted data
      const data = {
        site_name,
        title,
        image,
        description,
        // Add more fields as needed
      };
      console.log(data);
      // Send the extracted data as JSON in the response
      res.json(data);
    } else {
      res.status(response.status).json({
        error: `Failed to retrieve the webpage. Status code: ${response.status}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
