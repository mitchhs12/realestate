const fs = require("fs");
const path = require("path");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

// Initialize the translation client
const client = new TranslationServiceClient({
  keyFilename: "./googlekey.json", // Replace with your service account key file path
});

// Define your locales
const locales = [
  { locale: "en-US", currency: "USD", decimalsLimit: 2 },
  { locale: "de-DE", currency: "EUR", decimalsLimit: 2 },
  { locale: "en-GB", currency: "GBP", decimalsLimit: 2 },
  { locale: "en-AU", currency: "AUD", decimalsLimit: 2 },
  { locale: "ja-JP", currency: "JPY", decimalsLimit: 0 }, // Japanese Yen has no decimal places
  { locale: "fr-CH", currency: "CHF", decimalsLimit: 2 },
  { locale: "en-IN", currency: "INR", decimalsLimit: 2 },
  { locale: "es-CO", currency: "COP", decimalsLimit: 2 },
  { locale: "es-MX", currency: "MXN", decimalsLimit: 2 },
  { locale: "es-PE", currency: "PEN", decimalsLimit: 2 },
  { locale: "en-CA", currency: "CAD", decimalsLimit: 2 },
  { locale: "zh-CN", currency: "CNY", decimalsLimit: 2 },
  { locale: "en-SG", currency: "SGD", decimalsLimit: 2 },
  { locale: "ar-AE", currency: "AED", decimalsLimit: 2 },
  { locale: "pt-BR", currency: "BRL", decimalsLimit: 2 },
  { locale: "zh-HK", currency: "HKD", decimalsLimit: 2 },
  { locale: "af-ZA", currency: "ZAR", decimalsLimit: 2 },
  { locale: "ko-KR", currency: "KRW", decimalsLimit: 0 }, // South Korean Won has no decimal places
  { locale: "en-NZ", currency: "NZD", decimalsLimit: 2 },
  { locale: "tr-TR", currency: "TRY", decimalsLimit: 2 },
  { locale: "th-TH", currency: "THB", decimalsLimit: 2 },
  { locale: "id-ID", currency: "IDR", decimalsLimit: 0 }, // Indonesian Rupiah has no decimal places
  { locale: "vi-VN", currency: "VND", decimalsLimit: 0 }, // Vietnamese Dong has no decimal places
  { locale: "es-CR", currency: "CRC", decimalsLimit: 2 },
  { locale: "hr-HR", currency: "HRK", decimalsLimit: 2 },
  { locale: "ka-GE", currency: "GEL", decimalsLimit: 2 },
];

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
  const enUS = JSON.parse(fs.readFileSync("./src/app/locales/en.json", "utf8"));

  for (const { locale } of locales) {
    const targetLanguage = locale.split("-")[0]; // Extract language code from locale
    const outputFilename = path.join(__dirname, `./src/app/[lang]/dictionaries/${targetLanguage}.json`);

    // Skip translation if the target language is the same as the source language
    if (targetLanguage === sourceLanguage) {
      console.log(`Skipping translation for ${locale} since target language is the same as the source language.`);
      continue;
    }

    // Skip translation if it has already been done
    if (fs.existsSync(outputFilename)) {
      console.log(`Skipping translation for ${locale} as ${locale}.json already exists.`);
      continue;
    }

    // Perform the translation
    const translatedContent = await translateJson(enUS, targetLanguage);

    // Write the translated content to the respective JSON file
    fs.writeFileSync(outputFilename, JSON.stringify(translatedContent, null, 2), "utf8");
    console.log(`${locale}.json file created successfully!`);
  }
};

translateFiles().catch(console.error);
