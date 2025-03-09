'use client';
import {Stage, Group, Layer, Text, Rect, Line} from 'react-konva';
import { useState } from 'react';
import Playground from './components/Playground';

interface IconItem {
  id: string;
  x: number;
  y: number;
  name: string;
}

interface ConnectionMap {
  [key:string]: {
    [key: string]: number;
  }
}

const AVAILABLE_ICONS = [
  { type: 'server', name: 'Server' },
  { type: 'database', name: 'Database' },
  { type: 'client', name: 'Client' },
  // Add more icon types as needed
];


export default function Home() {
  // Grid configuration
  const CELL_SIZE = 50;
  const GRID_WIDTH = 800;
  const GRID_HEIGHT = 600;

  const [connections, setConnections] = useState<ConnectionMap>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canvasConnections');
      return saved ? JSON.parse(saved) : {};
    }
    return {}; // we need this to default return
  });
  
  // Create grid lines
  const gridLines = [];
  
  // Vertical lines
  for (let i = 0; i <= GRID_WIDTH; i += CELL_SIZE) {
    gridLines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, GRID_HEIGHT]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }
  
  // Horizontal lines
  for (let i = 0; i <= GRID_HEIGHT; i += CELL_SIZE) {
    gridLines.push(
      <Line
        key={`h${i}`}
        points={[0, i, GRID_WIDTH, i]}
        stroke="#ddd"
        strokeWidth={1}
      />
    );
  }

  // Initialize icons state from localStorage if available
  const [icons, setIcons] = useState<IconItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canvasIcons');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Calculate distance between two points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const name = e.dataTransfer.getData('name');
    const stageElement = e.currentTarget.getBoundingClientRect();

    const newIcon: IconItem = {
      id: Date.now().toString(),
      x: e.clientX - stageElement.left,
      y: e.clientY - stageElement.top,
      name,
    }
    console.log('Icon dropped', {name: newIcon.name, coordinates: {x: newIcon.x, y: newIcon.y}, id: newIcon.id})
    // update icons
    const updatedIcons = [...icons, newIcon];
    setIcons(updatedIcons);
    // update connections map
    const updatedConnections = {...connections}
    updatedConnections[newIcon.id] = {}

    icons.forEach(existingIcon => {
      const distance = calculateDistance(
        newIcon.x, newIcon.y,
        existingIcon.x, existingIcon.y
      );
      // add bidirectional connections
      updatedConnections[newIcon.id][existingIcon.id] = distance;
      if (!updatedConnections[existingIcon.id]) {
        updatedConnections[existingIcon.id] = {}
      }
      updatedConnections[existingIcon.id][newIcon.id] = distance;
    })
    setConnections(updatedConnections)
    localStorage.setItem('canvasConnections', JSON.stringify(updatedConnections));
    localStorage.setItem('canvasIcons', JSON.stringify(updatedIcons));
  }

  // Helper function to get all connections for rendering
  const getAllConnections = () => {
    const rendered = new Set<string>();
    const result = [];
    
    for (const [fromId, targets] of Object.entries(connections)) {
      for (const [toId, distance] of Object.entries(targets)) {
        // Create a unique key for each connection
        const connectionKey = [fromId, toId].sort().join('-');
        if (!rendered.has(connectionKey)) {
          result.push({ from: fromId, to: toId, distance });
          rendered.add(connectionKey);
        }
      }
    }
    return result;
  };

  const [isEditing, setIsEditing] = useState(true);
  const handleToggleEdit = () => {
    if (isEditing) {
      localStorage.setItem('canvasIcons', JSON.stringify(icons));
    }
    setIsEditing(!isEditing);
  }

  return (
    <div>
      <div  className="flex p-4">
        {/* Icon Menu */}
        {isEditing && (<div className="w-48 space-y-2">
          {AVAILABLE_ICONS.map((icon) => (
            <div
              key={icon.name}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('name', icon.name)}
              className="p-2 bg-gray-100 rounded cursor-move"
            >
              {icon.name}
            </div>
          ))}
        </div>)}
        <button
          onClick={handleToggleEdit}
          className="h-[40px] mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
        {/* Canvas */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Stage width={GRID_WIDTH} height={GRID_HEIGHT}>
            <Layer>
              {gridLines}
              {/* Render connections */}
              {getAllConnections().map((conn) => {
                const fromIcon = icons.find(icon => icon.id === conn.from);
                const toIcon = icons.find(icon => icon.id === conn.to);
                if (!fromIcon || !toIcon) return null;
                
                return (
                  <Line
                    key={`${conn.from}-${conn.to}`}
                    points={[
                      fromIcon.x + 20, fromIcon.y + 20,  // Center of first icon
                      toIcon.x + 20, toIcon.y + 20       // Center of second icon
                    ]}
                    stroke="#999"
                    strokeWidth={1}
                    dash={[5, 5]}
                  />
                );
              })}
              {icons.map(icon => (
                <Group
                  key={icon.id}
                  x={icon.x}
                  y={icon.y}
                  draggable={false}
                  onMouseEnter={(e) => {
                    const container = e.target.getStage()?.container();
                    if (container) container.style.cursor = 'not-allowed';
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage()?.container();
                    if(container) container.style.cursor = 'default';
                  }}
                >
                  <Rect
                    width={40}
                    height={40}
                    fill="#666"
                    cornerRadius={5}
                  />
                  <Text
                    text={icon.name}
                    fontSize={12}
                    width={40}
                    align="center"
                    y={45}
                  />
                </Group>
              ))}
            </Layer>
          </Stage>

        </div>
      </div>
      <Playground/>
    </div>
  );
}
