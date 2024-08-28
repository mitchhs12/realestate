// app/api/detectLanguage/route.js

import { NextResponse } from "next/server";
import { TranslationServiceClient } from "@google-cloud/translate";

// Instantiates a client
const translationClient = new TranslationServiceClient();

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const projectId = "vivaideal";
    const location = "global";

    // Construct request
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      content: text,
    };

    console.log("request", request);
    const [response] = await translationClient.detectLanguage(request);

    if (!response.languages) {
      return NextResponse.json({ error: "No languages detected" }, { status: 400 });
    }

    const detectedLanguages = response.languages.map((language) => ({
      languageCode: language.languageCode,
      confidence: language.confidence,
    }));

    return NextResponse.json({ detectedLanguages }, { status: 200 });
  } catch (error) {
    console.error("Error detecting language:", error);
    return NextResponse.json({ error: "Failed to detect language" }, { status: 500 });
  }
}
