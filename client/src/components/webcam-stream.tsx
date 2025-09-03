
import Webcam from "react-webcam";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Send, X, RotateCcw } from "lucide-react";

// Import your API function
// import { sendImageMessage } from "./api";

export function WebcamStream() {
  const webcamRef = useRef<Webcam>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  const toggleCamera = useCallback(() => {
    setIsEnabled(prev => !prev);
    // Clear any captured image when toggling camera
    if (capturedImage) {
      setCapturedImage(null);
      setImageBlob(null);
      setQuery("");
      setResponse(null);
    }
  }, [capturedImage]);

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        
        // Convert base64 to blob
        fetch(imageSrc)
          .then(res => res.blob())
          .then(blob => {
            setImageBlob(blob);
          });
      }
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setImageBlob(null);
    setQuery("");
    setResponse(null);
  }, []);

  const sendImage = useCallback(async () => {
    if (!imageBlob) return;
    
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      // const result = await sendImageMessage(imageBlob, query);
      
      // Simulated API call for demo
      const formData = new FormData();
      formData.append("image", imageBlob, "capture.jpg");
      if (query) {
        formData.append("text", query);
      }

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setResponse(result.response);
      
      // Optionally play the audio response
      if (result.audio_url) {
        const audio = new Audio(`http://localhost:8000${result.audio_url}`);
        audio.play().catch(console.error);
      }
      
    } catch (error) {
      console.error('Error sending image:', error);
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [imageBlob, query]);

  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return (
    <div className="webcam-container" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="bg-card border border-border rounded-xl shadow-sm h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-foreground">
              {capturedImage ? "Image Captured" : "Live Camera"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {capturedImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={retakePhoto}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Retake Photo"
              >
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCamera}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Camera Settings"
              data-testid="camera-settings"
            >
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Camera Feed Area */}
          <div className="relative flex-1 bg-muted flex items-center justify-center">
            {isEnabled ? (
              <>
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                    data-testid="webcam-stream"
                  />
                )}

                {/* Capture Button - Only show when camera is live */}
                {!capturedImage && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    <Button
                      onClick={captureImage}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 border-4 border-gray-300 shadow-lg"
                      title="Capture Image"
                    >
                      <Camera className="w-8 h-8 text-gray-700" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  <p className="text-sm text-gray-400">Camera is disabled</p>
                  <p className="text-xs text-gray-500 mt-1">Click settings to enable</p>
                </div>
              </div>
            )}
          </div>

          {/* Query Input and Controls - Only show when image is captured */}
          {capturedImage && (
            <div className="p-4 border-t border-border bg-background flex-shrink-0">
              <div className="space-y-3">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about this image... (optional)"
                  className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  rows={2}
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={retakePhoto}
                    variant="outline"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={sendImage}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Processing...' : 'Send'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Response Area */}
          {response && (
            <div className="p-4 border-t border-border bg-muted/50 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-2">AI Response:</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{response}</p>
                </div>
                <Button
                  onClick={clearResponse}
                  variant="ghost"
                  size="sm"
                  className="ml-2 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
