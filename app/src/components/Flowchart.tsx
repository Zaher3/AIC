import { useState, useEffect, useRef } from 'react';
import type { FlowNode } from '@/types';
import { flowNodes } from '@/data/flowData';
import {
  Inbox, Search, FileText, Ruler, ClipboardList,
  Settings, Truck, Calculator, FileEdit,
  Handshake, SearchX, Archive, CheckCircle,
  Users, ArrowRightCircle, BarChart3, TrendingUp,
  ChevronRight
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  inbox: Inbox,
  search: Search,
  'file-text': FileText,
  ruler: Ruler,
  'clipboard-list': ClipboardList,
  settings: Settings,
  truck: Truck,
  calculator: Calculator,
  'file-edit': FileEdit,
  handshake: Handshake,
  'search-x': SearchX,
  archive: Archive,
  'check-circle': CheckCircle,
  users: Users,
  'arrow-right-circle': ArrowRightCircle,
  'bar-chart-3': BarChart3,
  'trending-up': TrendingUp,
};

interface FlowchartProps {
  onNodeClick: (node: FlowNode) => void;
  activeNodeId: string | null;
}

export default function Flowchart({ onNodeClick, activeNodeId }: FlowchartProps) {
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-node-id');
          if (id && entry.isIntersecting) {
            setVisibleNodes((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(nodeRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const isActive = (node: FlowNode) => activeNodeId === node.id;
  const isConnectorActive = (nodeIndex: number) => {
    if (!activeNodeId) return false;
    const activeIdx = flowNodes.findIndex(n => n.id === activeNodeId);
    return activeIdx >= 0 && nodeIndex < activeIdx;
  };

  const getNodeClass = (node: FlowNode) => {
    const base = 'flow-node';
    const typeClass = node.type;
    const active = isActive(node) ? 'active' : '';
    const visible = visibleNodes.has(node.id) ? 'animate-in-up' : 'opacity-0';
    return `${base} ${typeClass} ${active} ${visible}`.trim();
  };

  const renderNode = (node: FlowNode, _index: number) => {
    const Icon = node.icon ? iconMap[node.icon] : null;
    const isNodeActive = isActive(node);

    return (
      <div
        key={node.id}
        ref={(el) => { nodeRefs.current[node.id] = el; }}
        data-node-id={node.id}
        className="flex flex-col items-center relative"
      >
        {/* Step number badge */}
        <div
          className={`absolute -left-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10
            ${isNodeActive ? 'bg-green-400 text-gray-900' : 'bg-gray-200 text-gray-600'}
          `}
        >
          {node.step}
        </div>

        <div
          className={getNodeClass(node)}
          onClick={() => onNodeClick(node)}
        >
          <div className="flex items-center gap-2 justify-center">
            {Icon && (
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors duration-300 ${isNodeActive ? 'text-green-400' : ''}`}
              />
            )}
            <span>{node.title}</span>
            <ChevronRight
              size={14}
              className={`flex-shrink-0 transition-all duration-300 ${isNodeActive ? 'text-green-400 translate-x-0 opacity-100' : 'opacity-0 -translate-x-1'}`}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderConnector = (index: number) => (
    <div
      key={`conn-${index}`}
      className={`connector ${isConnectorActive(index) ? 'active' : ''}`}
    />
  );

  // Decision branch rendering
  const renderDecisionBranch = (node: FlowNode, _index: number) => {
    if (!node.branches) return null;

    return (
      <div key={`branch-${node.id}`} className="w-full flex justify-center gap-8 my-2">
        {node.branches.map((branch: {label: string; color?: string}, i: number) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{
                backgroundColor: branch.color ? `${branch.color}20` : '#F3F4F6',
                color: branch.color || '#6B7280',
                border: `1px solid ${branch.color ? `${branch.color}40` : '#E5E7EB'}`,
              }}
            >
              {branch.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Parallel process rendering (Montage/Fabrication | Fournisseur/Sous-traitants)
  const renderParallelNodes = (nodes: FlowNode[]) => {
    return (
      <div key="parallel-6" className="w-full flex justify-center gap-6 my-2 relative">
        {/* Horizontal connector line */}
        <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gray-200 -translate-y-1/2" />

        {nodes.map((node) => {
          const Icon = node.icon ? iconMap[node.icon] : null;
          const nodeActive = isActive(node);

          return (
            <div
              key={node.id}
              ref={(el) => { nodeRefs.current[node.id] = el; }}
              data-node-id={node.id}
              className={`flow-node parallel ${nodeActive ? 'active' : ''} ${visibleNodes.has(node.id) ? 'animate-in-up' : 'opacity-0'}`}
              onClick={() => onNodeClick(node)}
            >
              <div className="flex items-center gap-2 justify-center">
                {Icon && <Icon size={16} className={`flex-shrink-0 ${nodeActive ? 'text-green-400' : ''}`} />}
                <span className="text-xs">{node.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Refusal branch rendering (Analyse des Raisons -> Classement)
  const renderRefusalBranch = () => {
    const analyseNode = flowNodes.find(n => n.id === 'analyse-raisons');
    const classementNode = flowNodes.find(n => n.id === 'classement');
    if (!analyseNode || !classementNode) return null;

    return (
      <div key="refusal-branch" className="flex flex-col items-center gap-0 ml-auto mr-0 w-64">
        {renderNode(analyseNode, flowNodes.indexOf(analyseNode))}
        {renderConnector(flowNodes.indexOf(analyseNode))}
        {renderNode(classementNode, flowNodes.indexOf(classementNode))}
      </div>
    );
  };

  // Build the flowchart structure
  const buildFlowchart = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < flowNodes.length) {
      const node = flowNodes[i];

      // Skip branch nodes (analyse-raisons, classement) - they render separately
      if (node.type === 'branch') {
        i++;
        continue;
      }

      // Regular node
      elements.push(renderNode(node, i));

      // Connector after node (if not the last node)
      if (i < flowNodes.length - 1) {
        elements.push(renderConnector(i));
      }

      // Special: After decision node (preetude), show branch labels
      if (node.id === 'preetude' && node.branches) {
        elements.push(renderDecisionBranch(node, i));
        elements.push(renderConnector(i));
      }

      // Special: After exigences, render parallel nodes together
      if (node.id === 'exigences') {
        i++;
        // Skip to after parallel nodes
        const parallelNodes = flowNodes.filter(n => n.type === 'parallel');
        elements.push(renderParallelNodes(parallelNodes));
        elements.push(renderConnector(i));
        // Skip montage and fournisseur in main loop
        while (i < flowNodes.length && flowNodes[i].type === 'parallel') {
          i++;
        }
        continue;
      }

      // Special: After negociation decision, show refusal branch on the side
      if (node.id === 'negociation') {
        elements.push(renderDecisionBranch(node, i));
        elements.push(
          <div key="negociation-split" className="w-full relative">
            {/* Accept path continues down */}
            <div className="flex flex-col items-center">
              {renderConnector(i)}
            </div>
            {/* Refuse path goes to the right */}
            <div className="absolute top-0 right-0 w-56">
              <div className="flex flex-col items-center gap-0">
                <div className="text-xs text-red-500 font-medium mb-1">Refusée</div>
                {renderRefusalBranch()}
              </div>
            </div>
          </div>
        );
      }

      i++;
    }

    return elements;
  };

  return (
    <div className="flex flex-col items-center relative py-8">
      {/* Central vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2 -z-10" />

      {/* Active path highlight line */}
      {activeNodeId && (
        <div
          className="absolute left-1/2 top-0 w-0.5 bg-gradient-to-b from-green-400 to-green-500 -translate-x-1/2 -z-10 transition-all duration-700"
          style={{
            height: `${(flowNodes.findIndex(n => n.id === activeNodeId) / flowNodes.length) * 100}%`,
          }}
        />
      )}

      {buildFlowchart()}
    </div>
  );
}
