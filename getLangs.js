const { TranslationServiceClient } = require("@google-cloud/translate").v3;

// Initialize the translation client
const client = new TranslationServiceClient({
  keyFilename: "./googlekey.json", // Replace with your service account key file path
});

const projectId = "vivaideal";
const location = "global"; // Use global or specify another location if needed

async function listLanguages() {
  try {
    // Get the list of supported languages
    const [response] = await client.getSupportedLanguages({
      parent: `projects/${projectId}/locations/${location}`, // Replace with your project ID
    });

    // Print the list of supported languages
    const languages = response.languages;
    languages.forEach((language) => {
      console.log(`Code: ${language.languageCode}, Name: ${language.displayName}`);
    });
  } catch (err) {
    console.error("Error fetching supported languages:", err);
  }
}

listLanguages();
