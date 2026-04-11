// ❌ Removed Anthropic import (VERY IMPORTANT)

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
      { name: 'System Design & Scalability', type: 'Course', source: isVideo ? 'YouTube' : "O'Reilly", link: searchUrl('System Design Scalability', isVideo ? 'YouTube' : 'Google') },
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

// ✅ AI Tutor (SIMULATED — SAFE FOR FRONTEND)
export const askAiTutor = async (topicName, question) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`AI Tutor (Simulated) 🤖

Topic: ${topicName}

Question: ${question}

👉 Explanation:
Focus on understanding the core concepts step by step.

👉 Tip:
- Break the problem into smaller parts  
- Try building a mini project  
- Refer official docs  

👉 Example:
Practice daily and apply concepts — that’s how mastery happens 🚀`);
    }, 1000);
  });
};