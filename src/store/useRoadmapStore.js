import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useRoadmapStore = create(
  persist(
    (set) => ({
      roadmaps: [],
      activeRoadmapId: null,
      
      // User Auth & Gamification
      currentUser: null,
      lastLoginDate: null,
      currentStreak: 0,
      totalFocusMinutes: 0,
      dailyActivity: {},
      flashcards: [],
      userPoints: 0,
      
      login: (userData) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        let newStreak = state.currentStreak;
        
        if (state.lastLoginDate !== today) {
           const yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           const yesterdayStr = yesterday.toISOString().split('T')[0];
           
           if (state.lastLoginDate === yesterdayStr) {
              newStreak += 1;
           } else {
              newStreak = 1;
           }
        }
        
        return {
          currentUser: userData,
          lastLoginDate: today,
          currentStreak: newStreak || 1,
        };
      }),
      
      logout: () => set({ currentUser: null }),

      updateUserProfile: (profileData) => set((state) => {
        if (state.currentUser) {
          return { currentUser: { ...state.currentUser, ...profileData } };
        }
        return state;
      }),

      // Save a newly generated roadmap
      addRoadmap: (roadmap) => set((state) => {
        const newRoadmap = {
          ...roadmap,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        return {
          roadmaps: [...state.roadmaps, newRoadmap],
          activeRoadmapId: newRoadmap.id
        };
      }),

      // Switch active roadmap
      setActiveRoadmap: (id) => set({ activeRoadmapId: id }),
      
      // Delete a roadmap
      deleteRoadmap: (id) => set((state) => ({
        roadmaps: state.roadmaps.filter(r => r.id !== id),
        activeRoadmapId: state.activeRoadmapId === id 
          ? (state.roadmaps.find(r => r.id !== id)?.id || null) 
          : state.activeRoadmapId
      })),

      // Toggle topic completion
      toggleTopicCompletion: (roadmapId, phaseId, topicIndex) => set((state) => {
        const updatedRoadmaps = state.roadmaps.map(roadmap => {
          if (roadmap.id !== roadmapId) return roadmap;
          
          const updatedPhases = roadmap.phases.map(phase => {
            if (phase.id !== phaseId) return phase;
            
            const updatedTopics = [...phase.topics];
            updatedTopics[topicIndex] = {
              ...updatedTopics[topicIndex],
              completed: !updatedTopics[topicIndex].completed
            };
            
            return { ...phase, topics: updatedTopics };
          });
          
          return { ...roadmap, phases: updatedPhases };
        });
        
        return { roadmaps: updatedRoadmaps };
      }),

      // Update topic note
      updateTopicNote: (roadmapId, phaseId, topicIndex, note) => set((state) => {
        const updatedRoadmaps = state.roadmaps.map(roadmap => {
          if (roadmap.id !== roadmapId) return roadmap;
          
          const updatedPhases = roadmap.phases.map(phase => {
            if (phase.id !== phaseId) return phase;
            
            const updatedTopics = [...phase.topics];
            updatedTopics[topicIndex] = {
              ...updatedTopics[topicIndex],
              note: note
            };
            
            return { ...phase, topics: updatedTopics };
          });
          
          return { ...roadmap, phases: updatedPhases };
        });
        
        return { roadmaps: updatedRoadmaps };
      }),

      // Add focus time (Pomodoro)
      addFocusTime: (minutes) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const currentDaily = state.dailyActivity || {};
        return {
          totalFocusMinutes: (state.totalFocusMinutes || 0) + minutes,
          dailyActivity: {
            ...currentDaily,
            [today]: (currentDaily[today] || 0) + minutes
          }
        };
      }),

      // Flashcards
      saveFlashcards: (topicName, cards) => set((state) => ({
        flashcards: [...(state.flashcards || []), { topicName, cards, id: Date.now().toString(), createdAt: new Date().toISOString() }]
      })),

      // Quiz Points
      addPoints: (points) => set((state) => ({
        userPoints: (state.userPoints || 0) + points
      }))
    }),
    {
      name: 'path-ai-storage', // unique name for localStorage key
    }
  )
);

export default useRoadmapStore;
