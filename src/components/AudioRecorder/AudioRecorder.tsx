import React, { useState } from "react";

export const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Audio Recorder</h2>
        <div className="flex flex-col items-center">
          <button
            className={`w-full py-2 px-4 rounded shadow text-white transition-colors focus:outline-none ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>
      </div>
    </div>
  );
};
