import React from 'react';
import { Settings, Download } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => (
  <header className="bg-gray-800 border-b border-gray-700 p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Lyric Video Editor</h1>
      <div className="flex items-center space-x-4">
        <button 
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  </header>
);