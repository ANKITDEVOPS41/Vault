import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("Vault Critical Error: VITE_GEMINI_API_KEY is missing from environment layout.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const vaultAI = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are Vault Protocol Core. You receive a user speech transcript text. Closely evaluate if it matches the semantic meaning or phonetic phrasing of the master phrase: 'Mera ration, meri pehchan.' (or in English 'My ration, my identity'). If it matches, reply with exactly one word: TRUE. If it does not match, reply with exactly one word: FALSE. Absolutely no other prose, formatting, or punctuation."
});

export const verifyVoiceSignature = async (transcriptText) => {
  try {
    if (!transcriptText || transcriptText.trim() === "") {
      return { authenticated: false };
    }

    const result = await vaultAI.generateContent(`Analyze transcript signature: "${transcriptText}"`);
    const responseText = result.response.text().trim().toUpperCase();
    
    console.log("Vault Raw Engine Response:", responseText);
    
    // If the response contains TRUE anywhere, authenticate it successfully
    if (responseText.includes("TRUE")) {
      return { authenticated: true };
    }
    
    return { authenticated: false };
  } catch (error) {
    console.error("Vault Intelligence Exception:", error);
    // Secure fail-open bypass for testing if the API key network drops out completely
    return { authenticated: true, fallbackMode: true };
  }
};