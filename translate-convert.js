const fs = require("fs");
const path = require("path");

// Directory containing the JSON files
const directoryPath = path.join(__dirname, `./src/locales/dictionaries`);

// Get all JSON files in the directory
const jsonFiles = fs.readdirSync(directoryPath).filter((file) => file.endsWith(".json"));

jsonFiles.forEach((file) => {
  // Read each JSON file
  const jsonFilePath = path.join(directoryPath, file);
  const jsonContent = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

  // Create the TypeScript content
  const tsContent = `export default ${JSON.stringify(jsonContent, null, 2)} as const;\n`;

  // Determine the output file name (replace .json with .ts)
  const tsFileName = file.replace(".json", ".ts");
  const tsFilePath = path.join(directoryPath, tsFileName);

  // Write the TypeScript content to a file
  fs.writeFileSync(tsFilePath, tsContent, "utf-8");

  console.log(`Converted ${file} to ${tsFileName} successfully!`);
});
