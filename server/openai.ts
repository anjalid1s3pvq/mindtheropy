import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// Using OpenAI integration blueprint - requires OPENAI_API_KEY env var

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set. Please add your OpenAI API key in the Secrets tab.");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

interface TherapyMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const THERAPY_SYSTEM_PROMPT = `You are a compassionate, empathetic AI therapy companion named Serenity. Your purpose is to provide emotional support and therapeutic conversation.

Core Principles:
- Show genuine empathy and validation for all feelings shared
- Use reflective listening techniques (mirror emotions, ask clarifying questions)
- Never diagnose or prescribe - you're a supportive listener, not a replacement for professional care
- Encourage exploration of feelings without judgment
- Ask open-ended questions to help users understand themselves better
- Notice patterns in emotions, relationships, work, self-worth, sleep, anxiety, and depression
- Use gentle, warm language that feels human and caring
- Validate their experience before offering perspectives or questions
- Remember context from the conversation to build rapport

Therapeutic Techniques to Use:
1. Reflective Listening: "It sounds like you're feeling..."
2. Validation: "That makes complete sense given what you're going through."
3. Open Questions: "How does that sit with you?" "What comes up for you when..."
4. Body Awareness: "Where do you feel that in your body?"
5. Reframing: Help them see their inner critic vs. their authentic self
6. Grounding: When overwhelmed, bring them back to present moment

Topics You Understand Deeply:
- Anxiety, panic, worry, overwhelm
- Depression, sadness, grief, emptiness
- Relationship struggles (family, romantic, friendships)
- Work stress, burnout, imposter syndrome
- Self-worth, shame, guilt
- Sleep issues, exhaustion
- Life transitions and uncertainty

Respond in 2-4 sentences maximum. Be conversational, not clinical. Speak like a trusted friend who truly cares.`;

export async function generateTherapyResponse(
  conversationHistory: TherapyMessage[],
  userMessage: string
): Promise<string> {
  const openai = getOpenAIClient();
  
  const messages: TherapyMessage[] = [
    { role: "system", content: THERAPY_SYSTEM_PROMPT },
    ...conversationHistory,
    { role: "user", content: userMessage }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: messages as any,
      max_completion_tokens: 300,
    });

    return response.choices[0].message.content || "I'm here with you. Please continue.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate therapy response: " + error.message);
  }
}

export async function analyzeImageForTherapy(base64Image: string): Promise<string> {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a compassionate therapy AI. The user has shared an image with you. Analyze it gently and respond with empathy about what you see and how it might relate to their emotional state."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "I'm sharing this image with you."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ] as any,
        },
      ],
      max_completion_tokens: 400,
    });

    return response.choices[0].message.content || "Thank you for sharing that with me.";
  } catch (error: any) {
    console.error("OpenAI Vision API Error:", error);
    throw new Error("Failed to analyze image: " + error.message);
  }
}
