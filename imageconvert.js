const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function convertToAvif(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);

    // Compress and convert to AVIF format
    const avifBuffer = await sharp(buffer)
      .resize({ width: 3840, height: 2160, fit: "outside" }) // Resize while maintaining aspect ratio
      .avif({ quality: 80 }) // Adjust quality as needed
      .toBuffer();

    // Change the file extension to .avif
    const outputFilePath = path.format({
      ...path.parse(filePath),
      base: undefined, // ignore base and use name + ext instead
      ext: ".avif",
    });

    fs.writeFileSync(outputFilePath, avifBuffer);

    console.log(`File converted and saved as: ${outputFilePath}`);
  } catch (error) {
    console.error("Error converting file:", error);
  }
}

// Example usage
const inputFilePath = "public/banner4.jpg"; // Replace with the path to your file
convertToAvif(inputFilePath);
