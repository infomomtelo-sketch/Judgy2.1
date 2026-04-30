import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Image, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const VoiceButton = ({ onTranscription, disabled }) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribe(blob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Please allow microphone access to use voice input.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const transcribe = async (blob) => {
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      const response = await axios.post(`${API}/voice/transcribe`, formData);
      if (response.data.text) {
        onTranscription(response.data.text);
      }
    } catch (error) {
      console.error('Transcription failed:', error);
    }
    setProcessing(false);
  };

  if (processing) {
    return (
      <Button variant="ghost" size="icon" disabled className="h-10 w-10 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={recording ? stopRecording : startRecording}
      disabled={disabled}
      className={cn(
        "h-10 w-10 transition-colors",
        recording ? "text-[#FF2E4C] bg-[#FF2E4C]/10 animate-pulse" : "text-muted-foreground hover:text-foreground"
      )}
      data-testid="voice-btn"
      title={recording ? "Stop recording" : "Voice input"}
    >
      {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  );
};

export const ImageUploadButton = ({ onImageSelected, disabled }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image too large. Max 10MB.');
        return;
      }
      onImageSelected(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleChange}
        className="hidden"
        data-testid="image-upload-input"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        className="h-10 w-10 text-muted-foreground hover:text-foreground"
        data-testid="image-upload-btn"
        title="Upload image"
      >
        <Image className="w-4 h-4" />
      </Button>
    </>
  );
};

export const ImagePreview = ({ file, onRemove }) => {
  const [preview] = useState(() => URL.createObjectURL(file));

  return (
    <div className="relative inline-block mr-2 mb-2" data-testid="image-preview">
      <img src={preview} alt="Upload preview" className="h-16 w-16 object-cover rounded-md border border-border" />
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
        data-testid="remove-image-btn"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};
