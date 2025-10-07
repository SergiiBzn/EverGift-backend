import OpenAI from "openai"; //for chat gpt
// for google gemini
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Contact } from "../models/index.js";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// google generative ai
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Groq API (same client as OpenAI)
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
export const chatController = async (req, res) => {
  const ownerId = req.userId;

  // find wischlist of user contact and add to prompt
  const { prompt, contactId, wishList, contactName, birthdate, gender } =
    req.body;

  try {
    /* const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", //"chat gpt",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: response.data.choices[0].message.content });

    console.log("prompt", prompt); */

    /*  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    console.log("response", result.response.text());
    res.json({ reply: result.response.text() }); */

    const contact = await Contact.findById(contactId);
    console.log("contact ", contact);
    /*    if (!contact) return res.status(404).json({ message: "Contact not found" }); */

    const contactWishlist = [...wishList];
    let contactWishlistPrompt = "";

    if (contactWishlist) {
      contactWishlistPrompt = `
      I have the following wishlist for ${contactName}:
      ${contactWishlist.map((w) => `- ${w.item}+ ${w.description}`).join("\n")}.
      `;
    }

    console.log("contactWishlistPrompt", contactWishlistPrompt);

    const completion = await groq.chat.completions.create({
      // model: "openai/gpt-oss-20b", // free model from Groq
      model: "allam-2-7b", // free model from Groq
      messages: [
        {
          role: "system",
          content: `ROLE: You are a concise gift assistant for ${contactName}.
          You are a gift assistant for ${contactName} with the following birthdate ${birthdate} and gender ${gender}.

CONTEXT: Available wishlist items: ${contactWishlistPrompt}

RESPONSE REQUIREMENTS:
• Keep responses very short
• Suggest only at most 8 relevant gifts, but not the gift from the wishlist
• Format responses clearly with bullet points
• Focus on why each gift suits ${contactName}
• Provide thoughtful and relevant gift suggestions tailored to the user’s birthdate (${birthdate}), gender (${gender}) and wishlist, making sure each idea fits their likely age, personality, and preferences.
• Use the same language as the user's question
•answer also another questions related to the gift or to your suggestions
•for every answer always use markdown separated by 1 line break to format the response


`,
        },
        {
          role: "user",
          content: `Brief gift suggestions: ${prompt}`,
        },
      ],
      max_tokens: 1000, // Increase max tokens
      temperature: 0.3, // More deterministic
    });

    console.log("completion message", completion.choices[0].message.content);
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};
