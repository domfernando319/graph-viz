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
    const updatedIcons = [...icons, newIcon];
    setIcons(updatedIcons);
    localStorage.setItem('canvasIcons', JSON.stringify(updatedIcons));
  }

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
