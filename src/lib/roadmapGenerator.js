import Anthropic from '@anthropic-ai/sdk';

export const generateRoadmap = (goal, skillLevel, timeCommitment, learningStyle) => {
  const isVideo = learningStyle === 'video';
  
  const searchUrl = (query, src) => {
    if (src === 'YouTube') return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    if (src === 'Coursera') return `https://www.coursera.org/search?query=${encodeURIComponent(query)}`;
    if (src === 'Udemy') return `https://www.udemy.com/courses/search/?src=ukw&q=${encodeURIComponent(query)}`;
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const recommendations = {
    fundamentals: [
      { name: `Introduction to ${goal}`, type: 'Course', source: isVideo ? 'YouTube' : 'FreeCodeCamp', link: searchUrl(`Introduction to ${goal} full course`, isVideo ? 'YouTube' : 'FreeCodeCamp') },
      { name: 'Core Concepts & Principles', type: 'Tutorial', source: isVideo ? 'Coursera' : 'MDN Docs', link: searchUrl(`${goal} core concepts`, isVideo ? 'Coursera' : 'Google') },
      { name: 'Basic Project Setup', type: 'Project', source: 'GitHub', link: searchUrl(`${goal} basic project setup github`, 'Google') }
    ],
    intermediate: [
      { name: 'Advanced Patterns applied to ' + goal, type: 'Course', source: 'Udemy', link: searchUrl(`Advanced Patterns ${goal}`, 'Udemy') },
      { name: 'Best Practices & Architecture', type: 'Article', source: 'Medium / Dev.to', link: searchUrl(`${goal} best practices architecture`, 'Google') },
      { name: 'Mid-level Application', type: 'Project', source: 'Frontend Mentor', link: 'https://www.frontendmentor.io/challenges' }
    ],
    advanced: [
      { name: 'System Design & Scalability', type: 'Course', source: isVideo ? 'TechLead' : 'O\'Reilly', link: searchUrl('System Design Scalability', isVideo ? 'YouTube' : 'Google') },
      { name: 'Performance Optimization', type: 'Documentation', source: 'Official Docs', link: searchUrl(`${goal} performance optimization advanced`, 'Google') },
      { name: 'Capstone MVP', type: 'Project', source: 'Portfolio', link: searchUrl(`${goal} capstone project ideas`, 'Google') }
    ]
  };

  const calculateHours = (baseHours) => {
    return Math.max(1, Math.round(baseHours / (timeCommitment / 10)));
  };

  const phases = [];

  if (skillLevel === 'beginner') {
    phases.push({
      id: 'phase-1',
      title: 'Phase 1: Fundamentals',
      description: `Laying the groundwork for ${goal}.`,
      estimatedTime: `${calculateHours(20)} weeks`,
      topics: recommendations.fundamentals
    });
  }

  if (skillLevel === 'beginner' || skillLevel === 'intermediate') {
    phases.push({
      id: skillLevel === 'beginner' ? 'phase-2' : 'phase-1',
      title: skillLevel === 'beginner' ? 'Phase 2: Intermediate' : 'Phase 1: Core Skills',
      description: `Building functional knowledge in ${goal}.`,
      estimatedTime: `${calculateHours(30)} weeks`,
      topics: recommendations.intermediate
    });
  }

  phases.push({
    id: phases.length === 0 ? 'phase-1' : `phase-${phases.length + 1}`,
    title: `${phases.length === 0 ? 'Phase 1' : `Phase ${phases.length + 1}`}: Advanced Mastery`,
    description: `Becoming an expert in ${goal}.`,
    estimatedTime: `${calculateHours(40)} weeks`,
    topics: recommendations.advanced
  });

  return phases;
};

// AI Chatbot Helper using Anthropic (If Key exists, else mock)
export const askAiTutor = async (topicName, question) => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    // Return a smart simulation since user has no real API key configured.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`This is a simulated AI tutor response regarding "${topicName}".\n\nI see you're asking: "${question}".\n\nTo master this, I highly recommend focusing on the foundational abstractions. If you are stuck, try checking out the official documentation or taking a step back to build a small sandbox project to test out the concepts practically!`);
      }, 1500);
    });
  }

  try {
    const anthropic = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true 
    });

    const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 500,
      system: `You are an expert, encouraging tutor specifically helping a student stuck on the topic: ${topicName}. Be extremely concise but highly actionable. Provide a bulleted answer or a small code example where relevant.`,
      messages: [
        { role: "user", content: question }
      ]
    });
    
    return msg.content[0].text;
  } catch (err) {
    console.error("AI Tutor Error:", err);
    return "I encountered an error connecting to my brain. Please try again or check your API key.";
  }
};
