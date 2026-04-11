import Anthropic from '@anthropic-ai/sdk';

// We initialize safely since the API key might exist in .env
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const anthropic = apiKey ? new Anthropic({
  apiKey,
  dangerouslyAllowBrowser: true, // Typically unsafe for production frontend, but required for this local/demo architecture
}) : null;

export const generateLearningRoadmap = async ({ goal, skillLevel, timeCommitment, learningStyle }) => {
  if (!anthropic) {
    throw new Error("Anthropic API key is missing. Please add VITE_ANTHROPIC_API_KEY to your .env file.");
  }

  const prompt = `
You are an expert educational curriculum designer. Create a personalized learning roadmap for the following:
- Learning Goal: ${goal}
- Current Skill Level: ${skillLevel}
- Available Time: ${timeCommitment} hours per week
- Preferred Learning Style: ${learningStyle}

Organize the learning journey into a highly structured JSON object. 
Ensure your response is ONLY a strictly valid JSON object and contains no markdown formatting around it (no \`\`\`json).

The JSON object must have a single key "phases", which is an array of objects representing chronological learning phases.
If the skill level is "intermediate", you may skip absolute beginner basics. If "advanced", skip to advanced/expert topics.

For each phase, provide:
- "id": A unique string ID (e.g., "phase-1")
- "title": Phase title (e.g., "Phase 1: Deep Dive into React")
- "description": A short motivating sentence.
- "estimatedTime": Estimated time to complete given the ${timeCommitment} hrs/week (e.g., "4 weeks", "12 weeks")
- "topics": An array of specific learning milestones.

For each topic, provide:
- "name": The exact concept to learn.
- "type": "Video", "Article", "Course", "Project", "Book", or "Documentation"
- "source": Specifically recommend a real world resource (e.g., "YouTube - Traversy Media", "MDN Docs", "FreeCodeCamp", "Udemy - Maximilian", etc.)
- "cost": "Free" or "Paid"

Here is an example format mapping:
{
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase 1: Fundamentals",
      "description": "Laying the groundwork...",
      "estimatedTime": "4 weeks",
      "topics": [
        {
          "name": "Introduction to Concept X",
          "type": "Video",
          "source": "YouTube",
          "cost": "Free"
        }
      ]
    }
  ]
}

Only Output raw JSON.
`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219", // up to date model
      max_tokens: 3500,
      system: "You are a master curriculum designer who outputs strictly valid JSON without markdown wrapping.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const contentText = response.content[0].text.trim();
    // In case the AI includes markdown wrappers like ```json ... ```, strip them out:
    const jsonStr = contentText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.phases) {
        throw new Error("Invalid output format from AI.");
    }
    
    return parsed.phases;
  } catch (error) {
    console.error("Error generating roadmap via Anthropic:", error);
    throw new Error(error.message || "Failed to generate roadmap. Please check your API key and try again.");
  }
};

export const generateTopicQuiz = async (topicName, goal) => {
  try {
    if (!apiKey || apiKey === 'YOUR_API_KEY' || !anthropic) {
      throw new Error("Invalid API Key");
    }

    const prompt = `
Generate a 5-question multiple choice quiz to test understanding of the following topic within the context of learning ${goal}.
Topic: ${topicName}

Return ONLY valid JSON. No markdown wrappings. The JSON must exactly match this format:
{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correctAnswerIndex": 0,
      "explanation": "Short explanation of why A is correct."
    }
  ]
}
`;

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 2000,
      system: "You are an expert tutor. Output strictly valid JSON without markdown wrapping.",
      messages: [{ role: "user", content: prompt }]
    });

    const jsonStr = response.content[0].text.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();
    return JSON.parse(jsonStr).questions;
  } catch (error) {
    console.warn("Falling back to simulated quiz due to Anthropic API error:", error.message || error);
    
    // Fallback Mock Data
    return [
      {
        question: `What is the primary objective when mastering ${topicName}?`,
        options: [
          `To memorize all the syntax.`,
          `To understand the core principles and apply them to solve problems.`,
          `To never use documentation.`,
          `To copy code without understanding it.`
        ],
        correctAnswerIndex: 1,
        explanation: `Understanding principles allows you to adapt to new problems, which is critical for mastering ${topicName}.`
      },
      {
        question: `When applying ${topicName} within ${goal}, what is considered a best practice?`,
        options: [
          `Writing everything in a single file.`,
          `Ignoring error handling.`,
          `Modularity and clean structure.`,
          `Avoiding updates.`
        ],
        correctAnswerIndex: 2,
        explanation: `Modularity makes your architecture maintainable and scalable.`
      },
      {
        question: `Which scenario represents the ideal use-case for this topic?`,
        options: [
          `When you need a quick, undocumented hack.`,
          `When building a scalable foundation for your project.`,
          `When you want to slow down system performance.`,
          `None of the above.`
        ],
        correctAnswerIndex: 1,
        explanation: `Core topics are meant to provide robust foundations.`
      }
    ];
  }
};

export const generateFlashcards = async (topicName, notes) => {
  try {
    if (!apiKey || apiKey === 'YOUR_API_KEY' || !anthropic) {
      throw new Error("Invalid API Key");
    }

    const prompt = `
Create 5 to 10 spaced-repetition flashcards based on the user's study notes for the topic: ${topicName}.
User Notes:
${notes}

Return ONLY valid JSON. No markdown wrappings. The JSON must exactly match this format:
{
  "flashcards": [
    {
      "front": "A direct, clear question or concept name?",
      "back": "The concise, clear answer or definition."
    }
  ]
}
`;

    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 2000,
      system: "You output strictly valid JSON without markdown wrapping.",
      messages: [{ role: "user", content: prompt }]
    });

    const jsonStr = response.content[0].text.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();
    return JSON.parse(jsonStr).flashcards;
  } catch (error) {
    console.warn("Falling back to simulated flashcards due to Anthropic API error:", error.message || error);
    
    // Fallback Mock Data
    return [
      {
        front: `What is the core focus of ${topicName}?`,
        back: `The fundamental principles and syntax related to the topic.`
      },
      {
        front: `Key takeaway from your notes?`,
        back: notes.slice(0, 100) + (notes.length > 100 ? "..." : "")
      },
      {
        front: `How does Spaced Repetition help?`,
        back: `It systematically reviews information right before you're likely to forget it, cementing it into long-term memory.`
      }
    ];
  }
};
