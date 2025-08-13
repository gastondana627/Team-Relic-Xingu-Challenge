'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ForceGraphMethods, NodeObject } from 'react-force-graph-2d';

// Define types for our graph data
interface Node extends NodeObject {
  id: string;
  name: string;
  val?: number;
  color?: string;
  type?: string;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

const LEGEND_TYPES = {
  'Team': '#c7a44a',
  'Person': '#e0dccc',
  'Anomaly': '#a8a192',
  'Technology': '#5c554a',
  'Location': '#6b7280', 
};

export default function KnowledgeGraphShowcase({ highlightedNodes = [] }: { highlightedNodes?: string[] }) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const fgRef = useRef<ForceGraphMethods>();

  const [searchTerm, setSearchTerm] = useState('');
  const [legendFilter, setLegendFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/graph-data')
      .then(res => res.json())
      .then(data => {
        const typedNodes = data.nodes.map((node: Node) => {
          let type = 'Technology';
          if (['Team Relic'].includes(node.id)) type = 'Team';
          if (['Gaston', 'Chisom'].includes(node.id)) type = 'Person';
          if (node.id.startsWith('Anomaly')) type = 'Anomaly';
          if (['Texas', 'Nigeria', 'Xingu River'].includes(node.id)) type = 'Location';
          return { ...node, type };
        });
        setGraphData({ ...data, nodes: typedNodes });
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!graphData) return { nodes: [], links: [] };
    let filteredNodes = graphData.nodes;
    if (legendFilter) {
      filteredNodes = graphData.nodes.filter(node => node.type === legendFilter);
    }
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(node => 
        node.name.toLowerCase().includes(lowerCaseSearch)
      );
    }
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = graphData.links.filter(link => 
      visibleNodeIds.has(link.source as string) && visibleNodeIds.has(link.target as string)
    );
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, searchTerm, legendFilter]);

  const handleReset = () => {
    setSearchTerm('');
    setLegendFilter(null);
    fgRef.current?.zoomToFit(400, 100);
  };

  if (!graphData) {
    return <div className="kg-loading-text">Loading Knowledge Graph...</div>;
  }

  return (
    <div className="kg-wrapper">
      <style>{`
        .kg-controls-wrapper {
          position: absolute;
          top: 1rem;
          left: 1rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .kg-search-input {
          background-color: rgba(0,0,0,0.5);
          border: 1px solid var(--border-color);
          border-radius: 50px;
          padding: 0.5rem 1rem;
          color: var(--text-primary);
          font-family: 'Manrope', sans-serif;
        }
        .kg-search-input:focus {
          outline: none;
          border-color: var(--accent-gold);
        }
        .kg-legend {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .kg-legend-button {
          background-color: rgba(0,0,0,0.5);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-family: 'Manrope', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .kg-legend-button.active, .kg-legend-button:hover {
          color: white;
          border-color: var(--accent-gold);
        }
      `}</style>
      
      <div className="kg-controls-wrapper">
        <input 
          type="text"
          placeholder="Search nodes..."
          className="kg-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="kg-legend">
          {Object.entries(LEGEND_TYPES).map(([type, color]) => (
            <button 
              key={type}
              className={`kg-legend-button ${legendFilter === type ? 'active' : ''}`}
              onClick={() => setLegendFilter(prev => prev === type ? null : type)}
              style={{ borderColor: legendFilter === type ? color : 'var(--border-color)'}}
            >
              {type}
            </button>
          ))}
          {(searchTerm || legendFilter) && (
            <button className="kg-legend-button" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={filteredData}
        nodeLabel="name"
        nodeVal="val"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 14 / globalScale;
          ctx.font = `bold ${fontSize}px Manrope, sans-serif`;
          const isHighlighted = highlightedNodes.includes(node.id as string);
          if (isHighlighted) {
            const glowRadius = (node.val || 1) * 2.5;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, glowRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = `rgba(255, 223, 0, ${Math.random() * 0.5 + 0.3})`;
            ctx.fill();
          }
          ctx.fillStyle = (node as Node).type ? LEGEND_TYPES[node.type as keyof typeof LEGEND_TYPES] : (node.color || 'rgba(199, 164, 74, 0.8)');
          if (node === hoverNode) {
             ctx.fillStyle = '#ffdf00';
          }
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, (node.val || 1) * 1.2, 0, 2 * Math.PI, false);
          ctx.fill();
          
          // --- START: Font Outline ---
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // **THE FIX**: Use the direct hex code for the accent gold color.
          ctx.strokeStyle = '#c7a44a'; 
          ctx.lineWidth = 4 / globalScale;
          ctx.strokeText(label, node.x || 0, node.y || 0);
          ctx.fillStyle = '#1f1d1a';
          ctx.fillText(label, node.x || 0, node.y || 0);
          // --- END: Font Outline ---
        }}
        onNodeHover={node => setHoverNode(node as Node || null)}
        linkColor={() => 'rgba(92, 85, 74, 0.3)'}
        linkWidth={2}
        backgroundColor="var(--panel-dark)"
        onNodeClick={(node) => {
          fgRef.current?.centerAt(node.x, node.y, 1000);
          fgRef.current?.zoom(2.5, 1000);
        }}
        cooldownTicks={100}
        onEngineStop={() => fgRef.current?.zoomToFit(400, 100)}
      />
      <a href="https://neo4j.com" target="_blank" rel="noopener noreferrer" className="neo4j-link">
        Powered by Neo4j
      </a>
    </div>
  );
}
