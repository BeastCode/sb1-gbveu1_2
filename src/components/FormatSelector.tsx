import React from 'react';
import { Smartphone, Monitor, Square } from 'lucide-react';
import { ProjectSettings } from '../types/editor';
import { useEditorStore } from '../store/editorStore';

const formats: { 
  id: ProjectSettings['format']; 
  label: string; 
  icon: React.ReactNode;
  dimensions: { width: number; height: number };
}[] = [
  {
    id: 'landscape',
    label: 'Landscape (16:9)',
    icon: <Monitor className="w-6 h-6" />,
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: 'portrait',
    label: 'Portrait (9:16)',
    icon: <Smartphone className="w-6 h-6" />,
    dimensions: { width: 1080, height: 1920 },
  },
  {
    id: 'square',
    label: 'Square (1:1)',
    icon: <Square className="w-6 h-6" />,
    dimensions: { width: 1080, height: 1080 },
  },
];

export const FormatSelector: React.FC = () => {
  const { projectSettings, setProjectSettings } = useEditorStore();

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {formats.map(({ id, label, icon, dimensions }) => (
        <button
          key={id}
          onClick={() => setProjectSettings({ format: id, ...dimensions })}
          className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
            projectSettings.format === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
        >
          {icon}
          <span className="mt-2 text-sm">{label}</span>
        </button>
      ))}
    </div>
  );
};