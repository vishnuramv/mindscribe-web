
import React from 'react';
import { TranscriptEntry } from '../../types';

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  title: string;
}

const TranscriptPanel: React.FC<TranscriptPanelProps> = ({ transcript, title }) => {
  return (
    <div className="w-1/2 border-r border-gray-200 ">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="max-h-[82vh] overflow-y-scroll p-4 space-y-4">
        {transcript.map((entry, index) => (
          <div key={index} className="flex gap-4">
            <div className="text-sm text-gray-500 w-16 text-right">{entry.time}</div>
            <div className="flex-1">
              <p className={`font-semibold ${entry.speaker === 'You' ? 'text-blue-600' : 'text-pink-600'}`}>
                {entry.speaker}
              </p>
              <p className="text-gray-700">{entry.dialogue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptPanel;