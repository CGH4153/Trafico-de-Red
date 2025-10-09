import React, { useState, useEffect } from 'react';
import { Network, Send, Trash2, Plus, Settings } from 'lucide-react';

export default function NetworkSimulator() {
  const [nodes, setNodes] = useState([
    { id: 'R1', type: 'router', x: 200, y: 200, routingTable: {} },
    { id: 'R2', type: 'router', x: 400, y: 200, routingTable: {} },
    { id: 'H1', type: 'host', x: 100, y: 100, routingTable: {} },
    { id: 'H2', type: 'host', x: 500, y: 100, routingTable: {} }
  ]);
  const [links, setLinks] = useState([
    { from: 'H1', to: 'R1' },
    { from: 'R1', to: 'R2' },
    { from: 'R2', to: 'H2' }
  ]);
  const [packets, setPackets] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [stats, setStats] = useState({ sent: 0, delivered: 0, dropped: 0 });
  const [newPacket, setNewPacket] = useState({ source: '', destination: '' });
  const [dragging, setDragging] = useState(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkStart, setLinkStart] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => {
        const updated = prev.map(p => {
          if (p.status === 'delivered' || p.status === 'dropped') return p;
          
          const currentNode = nodes.find(n => n.id === p.currentNode);
          if (!currentNode) return { ...p, status: 'dropped' };

          if (p.currentNode === p.destination) {
            setStats(s => ({ ...s, delivered: s.delivered + 1 }));
            return { ...p, status: 'delivered', progress: 1 };
          }

          const nextHop = currentNode.routingTable?.[p.destination];
          if (!nextHop) {
            setStats(s => ({ ...s, dropped: s.dropped + 1 }));
            return { ...p, status: 'dropped' };
          }

          const hasLink = links.some(l => 
            (l.from === p.currentNode && l.to === nextHop) ||
            (l.to === p.currentNode && l.from === nextHop)
          );

          if (!hasLink) {
            setStats(s => ({ ...s, dropped: s.dropped + 1 }));
            return { ...p, status: 'dropped' };
          }

          if (p.progress < 1) {
            return { ...p, progress: Math.min(p.progress + 0.02, 1) };
          } else {
            return { ...p, currentNode: nextHop, progress: 0 };
          }
        });

        return updated.filter(p => 
          p.status !== 'delivered' && p.status !== 'dropped' || 
          Date.now() - p.timestamp < 2000
        );
      });
    }, 50);

    return () => clearInterval(interval);
  }, [nodes, links]);

  const sendPacket = () => {
    if (!newPacket.source || !newPacket.destination) return;
    const sourceNode = nodes.find(n => n.id === newPacket.source);
    if (!sourceNode) return;

    const packet = {
      id: Date.now(),
      source: newPacket.source,
      destination: newPacket.destination,
      currentNode: newPacket.source,
      progress: 0,
      status: 'in-transit',
      timestamp: Date.now()
    };

    setPackets(prev => [...prev, packet]);
    setStats(s => ({ ...s, sent: s.sent + 1 }));
    setNewPacket({ source: '', destination: '' });
  };

  const addNode = (type) => {
    const id = type === 'router' ? `R${nodes.filter(n => n.type === 'router').length + 1}` : `H${nodes.filter(n => n.type === 'host').length + 1}`;
    setNodes([...nodes, {
      id,
      type,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      routingTable: {}
    }]);
  };

  const updateRoutingTable = (nodeId, destination, nextHop) => {
    setNodes(nodes.map(n => 
      n.id === nodeId 
        ? { ...n, routingTable: { ...n.routingTable, [destination]: nextHop } }
        : n
    ));
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setLinks(links.filter(l => l.from !== nodeId && l.to !== nodeId));
    setSelectedNode(null);
  };

  const getNodePosition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const getPacketPosition = (packet) => {
    const current = getNodePosition(packet.currentNode);
    if (packet.progress >= 1) return current;

    const currentNode = nodes.find(n => n.id === packet.currentNode);
    const nextHop = currentNode?.routingTable?.[packet.destination];
    if (!nextHop) return current;

    const next = getNodePosition(nextHop);
    return {
      x: current.x + (next.x - current.x) * packet.progress,
      y: current.y + (next.y - current.y) * packet.progress
    };
  };

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDragging(nodeId);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNodes(nodes.map(n => n.id === dragging ? { ...n, x, y } : n));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white p-4 flex gap-4">
      <div className="flex-1 bg-gray-800 rounded-lg p-4 relative overflow-hidden"
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUp}>
        <svg className="w-full h-full">
          {links.map((link, i) => {
            const from = getNodePosition(link.from);
            const to = getNodePosition(link.to);
            return (
              <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke="#4b5563" strokeWidth="2" />
            );
          })}
          
          {nodes.map(node => (
            <g key={node.id} onMouseDown={(e) => handleMouseDown(e, node.id)}
               className="cursor-move">
              <circle cx={node.x} cy={node.y} r="30"
                      fill={node.type === 'router' ? '#3b82f6' : '#10b981'}
                      stroke={selectedNode === node.id ? '#fbbf24' : 'none'}
                      strokeWidth="3"
                      onClick={() => setSelectedNode(node.id)} />
              <text x={node.x} y={node.y + 5} textAnchor="middle"
                    fill="white" fontSize="14" fontWeight="bold"
                    pointerEvents="none">
                {node.id}
              </text>
            </g>
          ))}

          {packets.map(packet => {
            const pos = getPacketPosition(packet);
            return (
              <circle key={packet.id} cx={pos.x} cy={pos.y} r="8"
                      fill={packet.status === 'dropped' ? '#ef4444' : 
                            packet.status === 'delivered' ? '#22c55e' : '#f59e0b'}
                      opacity={packet.status !== 'in-transit' ? 0.5 : 1} />
            );
          })}
        </svg>
      </div>

      <div className="w-80 bg-gray-800 rounded-lg p-4 overflow-y-auto space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-6 h-6" />
          <h1 className="text-xl font-bold">Control Panel</h1>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Añadir Nodos
          </h3>
          <div className="flex gap-2">
            <button onClick={() => addNode('router')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm">
              Router
            </button>
            <button onClick={() => addNode('host')}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm">
              Host
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Send className="w-4 h-4" /> Enviar Paquete
          </h3>
          <select value={newPacket.source} 
                  onChange={e => setNewPacket({ ...newPacket, source: e.target.value })}
                  className="w-full bg-gray-700 px-3 py-2 rounded text-sm">
            <option value="">Origen</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <select value={newPacket.destination}
                  onChange={e => setNewPacket({ ...newPacket, destination: e.target.value })}
                  className="w-full bg-gray-700 px-3 py-2 rounded text-sm">
            <option value="">Destino</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
          <button onClick={sendPacket}
                  className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm">
            Enviar
          </button>
        </div>

        {selectedNode && (
          <div className="space-y-2 border-t border-gray-700 pt-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" /> Tabla de Ruteo: {selectedNode}
            </h3>
            {nodes.filter(n => n.id !== selectedNode).map(dest => {
              const current = nodes.find(n => n.id === selectedNode);
              if (!current) return null;
              return (
                <div key={dest.id} className="flex items-center gap-2">
                  <span className="text-sm w-12">{dest.id}:</span>
                  <select 
                    value={current.routingTable?.[dest.id] || ''}
                    onChange={e => updateRoutingTable(selectedNode, dest.id, e.target.value)}
                    className="flex-1 bg-gray-700 px-2 py-1 rounded text-sm">
                    <option value="">-</option>
                    {nodes.filter(n => n.id !== selectedNode).map(n => (
                      <option key={n.id} value={n.id}>{n.id}</option>
                    ))}
                  </select>
                </div>
              );
            })}
            <button onClick={() => deleteNode(selectedNode)}
                    className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Eliminar Nodo
            </button>
          </div>
        )}

        <div className="border-t border-gray-700 pt-4">
          <h3 className="font-semibold mb-2">Estadísticas</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Enviados:</span>
              <span className="text-blue-400">{stats.sent}</span>
            </div>
            <div className="flex justify-between">
              <span>Entregados:</span>
              <span className="text-green-400">{stats.delivered}</span>
            </div>
            <div className="flex justify-between">
              <span>Perdidos:</span>
              <span className="text-red-400">{stats.dropped}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
