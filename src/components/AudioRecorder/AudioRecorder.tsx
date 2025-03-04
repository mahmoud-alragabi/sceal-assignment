import React, { useState, useRef, useCallback } from "react";

export const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!navigator.mediaDevices) {
      alert("Your browser does not support audio recording.");
      return;
    }
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob: Blob = new Blob(audioChunks, {
          type: "audio/wav",
        });
        const url: string = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        uploadAudio(audioBlob);
      };
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  const stopRecording = useCallback((): void => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const uploadAudio = useCallback(async (audioBlob: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");
    try {
      const response = await fetch(
        "https://SOME_API_ENDPOINT_OBVIOUSLY/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      console.log("Upload success:", data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Audio Recorder</h2>
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full py-2 px-4 rounded shadow text-white transition-colors focus:outline-none ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          {audioURL && (
            <div className="mt-6 w-full">
              <h3 className="text-xl font-semibold text-center mb-2">
                Playback
              </h3>
              <audio
                ref={audioRef}
                src={audioURL}
                controls
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
