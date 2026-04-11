// ❌ Removed Anthropic (not allowed in frontend)

// ✅ ROADMAP GENERATION (Mock)
export const generateLearningRoadmap = async ({ goal, skillLevel, timeCommitment, learningStyle }) => {
  return [
    {
      id: "phase-1",
      title: "Phase 1: Fundamentals",
      description: "Build strong basics",
      estimatedTime: "4 weeks",
      topics: [
        {
          name: `${goal} Basics`,
          type: "Video",
          source: "YouTube",
          cost: "Free"
        },
        {
          name: "Core Concepts",
          type: "Documentation",
          source: "MDN / Official Docs",
          cost: "Free"
        }
      ]
    },
    {
      id: "phase-2",
      title: "Phase 2: Intermediate",
      description: "Level up your skills",
      estimatedTime: "6 weeks",
      topics: [
        {
          name: "Projects",
          type: "Project",
          source: "Practice",
          cost: "Free"
        }
      ]
    }
  ];
};

// ✅ QUIZ (Mock)
export const generateTopicQuiz = async (topicName, goal) => {
  return [
    {
      question: `What is the main goal of ${topicName}?`,
      options: [
        "Memorize syntax",
        "Understand concepts",
        "Ignore logic",
        "Copy code"
      ],
      correctAnswerIndex: 1,
      explanation: "Understanding concepts is key."
    }
  ];
};

// ✅ FLASHCARDS (Mock)
export const generateFlashcards = async (topicName, notes) => {
  return [
    {
      front: `What is ${topicName}?`,
      back: "A concept you need to understand clearly."
    },
    {
      front: "Key idea?",
      back: notes || "Practice regularly"
    }
  ];
};