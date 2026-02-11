import { useRef, useState, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { colors, categoryColors } from '../../theme';
import type { GraphData, GraphNode } from '../../hooks/useGraphData';

interface NetworkGraphProps {
  graphData: GraphData;
  loading: boolean;
  onNodeClick: (nodeId: string) => void;
}

export default function NetworkGraph({ graphData, loading, onNodeClick }: NetworkGraphProps) {
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const connectedNodes = useCallback((nodeId: string) => {
    const connected = new Set<string>();
    connected.add(nodeId);
    for (const link of graphData.links) {
      const src = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const tgt = typeof link.target === 'object' ? (link.target as any).id : link.target;
      if (src === nodeId) connected.add(tgt);
      if (tgt === nodeId) connected.add(src);
    }
    return connected;
  }, [graphData.links]);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const gNode = node as GraphNode;
    const catColor = categoryColors[gNode.category] || colors.graphNode;
    const size = (gNode.val || 1) * 3 + 4;
    const isHovered = hoveredNode === gNode.id;
    const isConnected = hoveredNode ? connectedNodes(hoveredNode).has(gNode.id) : true;

    ctx.beginPath();
    ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
    ctx.fillStyle = isConnected ? catColor : catColor + '30';
    ctx.fill();

    if (isHovered) {
      ctx.strokeStyle = colors.graphHighlight;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Label
    const label = gNode.title?.substring(0, 20) || '';
    if (label) {
      ctx.font = `${isHovered ? 'bold ' : ''}10px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = isConnected ? colors.textPrimary : colors.textMuted + '60';
      ctx.fillText(label, node.x!, node.y! + size + 12);
    }
  }, [hoveredNode, connectedNodes]);

  const linkColor = useCallback((link: any) => {
    if (!hoveredNode) return colors.graphLink;
    const src = typeof link.source === 'object' ? link.source.id : link.source;
    const tgt = typeof link.target === 'object' ? link.target.id : link.target;
    if (src === hoveredNode || tgt === hoveredNode) return colors.graphHighlight;
    return colors.graphLink + '30';
  }, [hoveredNode]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>
        Analyzing correlations...
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: colors.textMuted }}>
        No data to visualize. Add some entries first.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 260px)',
        minHeight: '400px',
        background: colors.bgPrimary,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={colors.bgPrimary}
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          const size = ((node as GraphNode).val || 1) * 3 + 4;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, size + 4, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={linkColor}
        linkWidth={(link: any) => {
          const src = typeof link.source === 'object' ? link.source.id : link.source;
          const tgt = typeof link.target === 'object' ? link.target.id : link.target;
          return (src === hoveredNode || tgt === hoveredNode) ? 2 : 0.5;
        }}
        onNodeHover={(node: any) => setHoveredNode(node?.id || null)}
        onNodeClick={(node: any) => {
          if (node?.id) onNodeClick(node.id);
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
