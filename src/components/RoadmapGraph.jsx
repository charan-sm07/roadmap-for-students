import React, { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import { ExternalLink, Bot } from 'lucide-react';
import '@xyflow/react/dist/style.css';

export default function RoadmapGraph({ roadmap, openChatForTopic, openQuizForTopic }) {
  const { nodes, edges } = useMemo(() => {
    if (!roadmap || !roadmap.phases) return { nodes: [], edges: [] };
    
    const initialNodes = [];
    const initialEdges = [];
    let currY = 0;

    roadmap.phases.forEach((phase, pIndex) => {
      // Phase Node
      initialNodes.push({
        id: `phase-${pIndex}`,
        position: { x: 300, y: currY },
        data: { 
          label: (
            <div className="text-center">
              <span className="text-xs uppercase tracking-wider block opacity-80 mb-1">Phase {pIndex + 1}</span>
              <span className="font-bold text-base">{phase.title}</span>
            </div>
          )
        },
        style: { 
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', 
          color: 'white', 
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          width: 300,
          padding: '16px'
        }
      });
      
      if (pIndex > 0) {
         initialEdges.push({
           id: `edge-phase-${pIndex-1}-${pIndex}`,
           source: `phase-${pIndex-1}`,
           target: `phase-${pIndex}`,
           type: 'smoothstep',
           animated: true,
           style: { stroke: '#94a3b8', strokeWidth: 3 }
         });
      }

      currY += 120;
      
      // Topic Nodes
      phase.topics?.forEach((topic, tIndex) => {
        const isLeft = tIndex % 2 === 0;
        
        initialNodes.push({
           id: `topic-${pIndex}-${tIndex}`,
           position: { x: isLeft ? 20 : 580, y: currY },
           data: { 
             label: (
               <div className="flex flex-col gap-2">
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-bold">{topic.name}</span>
                   {topic.completed && <span className="text-green-500 text-lg ml-2">✓</span>}
                 </div>
                 
                 <div className="flex items-center gap-1 mt-1 flex-wrap">
                   {topic.link ? (
                     <a href={topic.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-[10px] text-primary-600 font-medium bg-slate-50 px-1.5 py-0.5 rounded" onClick={(e) => e.stopPropagation()}>
                       Source <ExternalLink size={8} />
                     </a>
                   ) : (
                     <span className="text-[10px] text-slate-500 font-medium bg-slate-50 px-1.5 py-0.5 rounded">{topic.source}</span>
                   )}
                   
                   <div className="ml-auto flex gap-1">
                     <button 
                       onClick={(e) => openQuizForTopic && openQuizForTopic(e, topic.name)}
                       className="text-[10px] flex items-center bg-green-50 text-green-700 hover:bg-green-100 px-1.5 py-0.5 rounded font-bold transition-colors"
                     >
                       Quiz
                     </button>
                     <button 
                       onClick={(e) => openChatForTopic && openChatForTopic(e, topic.name)}
                       className="text-[10px] flex items-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-1.5 py-0.5 rounded font-bold transition-colors"
                     >
                       <Bot size={10} className="mr-0.5" /> AI
                     </button>
                   </div>
                 </div>
               </div>
             ) 
           },
           style: { 
             background: topic.completed ? '#f0fdf4' : '#ffffff', 
             color: '#1e293b', 
             border: topic.completed ? '2px solid #22c55e' : '1px solid #cbd5e1', 
             borderRadius: '8px',
             width: 250,
             padding: '12px'
           }
        });
        
        initialEdges.push({
           id: `edge-topic-${pIndex}-${tIndex}`,
           source: `phase-${pIndex}`,
           target: `topic-${pIndex}-${tIndex}`,
           type: 'smoothstep',
           style: { stroke: topic.completed ? '#22c55e' : '#cbd5e1', strokeWidth: 2 }
        });
        
        currY += 90;
      });
      
      currY += 60;
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [roadmap]);

  return (
    <div className="w-full h-[600px] glass-card rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-lg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
        className="bg-slate-50 dark:bg-slate-900/50"
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-md" />
        <MiniMap 
          nodeColor={(n) => {
            if (n.id.startsWith('phase')) return '#8b5cf6';
            if (n.style?.background === '#f0fdf4') return '#22c55e';
            return '#cbd5e1';
          }}
          maskColor="rgba(0,0,0, 0.1)"
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
        />
      </ReactFlow>
    </div>
  );
}
