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
    getSubjectToken: getVercelOidcToken,
  },
});

if (!authClient) {
  throw new Error("Failed to create authClient");
}

const translationClient = new TranslationServiceClient({ authClient: authClient });

export async function POST(req: NextRequest) {
  try {
    const { text, source, target } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    } else if (!source) {
      return NextResponse.json({ error: "Source language is required" }, { status: 400 });
    } else if (!target) {
      return NextResponse.json({ error: "Target language is required" }, { status: 400 });
    }

    const request = {
      parent: `projects/${GCP_PROJECT_ID}/locations/global`,
      contents: [text],
      mimeType: "text/html",
      // sourceLanguageCode: source,
      targetLanguageCode: target,
    };

    // console.log("request", request);

    const [response] = await translationClient.translateText(request);

    if (!response.translations) {
      return NextResponse.json({ error: "Failed to translate text" }, { status: 500 });
    }

    const responseObj = {
      text: response.translations[0].translatedText,
    };

    return NextResponse.json(responseObj, { status: 200 });
  } catch (error) {
    console.error("Error detecting language:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
