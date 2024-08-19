const fs = require("fs");
const path = require("path");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

// Initialize the translation client
const client = new TranslationServiceClient({
  keyFilename: "./googlekey.json", // Replace with your service account key file path
});

// List of languages you want to translate into
const languages = ["af", "ar", "de", "es", "fr", "hr", "id", "ja", "ka", "ko", "pt", "th", "tr", "vi", "zh"];

const projectId = "vivaideal";
const location = "global"; // Use global or specify another location if needed
const sourceLanguage = "en"; // The source language (en for English)

const translateText = async (text, targetLanguage) => {
  const request = {
    parent: `projects/${projectId}/locations/${location}`,
    contents: [text],
    mimeType: "text/plain", // Can be 'text/html' if your content is HTML
    sourceLanguageCode: sourceLanguage,
    targetLanguageCode: targetLanguage,
  };

  const [response] = await client.translateText(request);
  return response.translations[0].translatedText;
};

const translateJson = async (json, targetLanguage) => {
  const translatedJson = {};

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      if (typeof value === "object" && value !== null) {
        // Recursively translate nested objects
        translatedJson[key] = await translateJson(value, targetLanguage);
      } else {
        // Translate the text value
        translatedJson[key] = await translateText(value, targetLanguage);
      }
    }
  }

  return translatedJson;
};

const translateFiles = async () => {
  const enUS = JSON.parse(fs.readFileSync("./src/locales/dictionaries/en.json", "utf8"));

  const translationPromises = languages.map(async (language) => {
    const outputFilename = path.join(__dirname, `./src/locales/dictionaries/${language}.json`);

    // Skip translation for English (en.json) as it is the source language
    if (language === sourceLanguage) {
      console.log(`Skipping translation for ${language} as it is the source language.`);
      return;
    }

    // Perform the translation
    const translatedContent = await translateJson(enUS, language);

    // Overwrite the translated content to the respective JSON file
    fs.writeFileSync(outputFilename, JSON.stringify(translatedContent, null, 2), "utf8");
    console.log(`${language}.json file created successfully!`);
  });

  await Promise.all(translationPromises);
};

translateFiles().catch(console.error);
