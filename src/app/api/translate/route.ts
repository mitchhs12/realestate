// app/api/detectLanguage/route.js

import { NextResponse } from "next/server";
import { TranslationServiceClient } from "@google-cloud/translate";
import { ExternalAccountClient } from "google-auth-library";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { NextRequest } from "next/server";

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

const authClient = ExternalAccountClient.fromJSON({
  type: "external_account",
  audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
  subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
  token_url: "https://sts.googleapis.com/v1/token",
  service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  subject_token_supplier: {
    // Use the Vercel OIDC token as the subject token
    getSubjectToken: getVercelOidcToken,
  },
});

// Instantiates a client
const translationClient = new TranslationServiceClient({
  project: GCP_PROJECT_ID,
  location: "global",
  googleAuthOptions: {
    authClient,
    projectId: GCP_PROJECT_ID,
  },
});

export async function POST(req: NextRequest) {
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
