"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchInterview,
  setCurrentTime,
  setIsPlaying,
  transcribeInterview,
} from "@/redux/features/interviewSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Download,
  Search,
  Tag,
  Brain,
  FileText,
  Clock,
  ArrowLeft,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { interviewApi } from "@/lib/api";

export default function InterviewDetailPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentInterview, currentTime, isPlaying, loading, error } =
    useSelector((state: RootState) => state.interview);

  // Debug logging
  console.log("Interview Detail Page State:", {
    loading,
    error,
    currentInterview: currentInterview
      ? {
          id: currentInterview.id,
          original_name: currentInterview.original_name,
          cloudinary_url: currentInterview.cloudinary_url,
          status: currentInterview.status,
        }
      : null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [playerRef, setPlayerRef] = useState<HTMLVideoElement | null>(null);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);

  useEffect(() => {
    if (params.id) {
      console.log("Fetching interview with ID:", params.id);
      dispatch(fetchInterview(params.id as string));
    }
  }, [dispatch, params.id]);

  // Reset player state when interview changes
  useEffect(() => {
    if (currentInterview) {
      setIsPlayerReady(false);
      setPlayerError(null);
      dispatch(setCurrentTime(0));
      dispatch(setIsPlaying(false));
    }
  }, [currentInterview, dispatch]);

  // Status polling for transcription
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentInterview && currentInterview.status === "processing") {
      interval = setInterval(() => {
        dispatch(fetchInterview(currentInterview.id));
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentInterview?.status, currentInterview?.id, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Pause playback when component unmounts
      dispatch(setIsPlaying(false));
      setPlayerRef(null);
    };
  }, [dispatch]);

  const handlePlayPause = async () => {
    try {
      if (playerRef && isPlayerReady) {
        if (isPlaying) {
          playerRef.pause();
        } else {
          playerRef.play();
        }
      }
    } catch (error) {
      console.error("Play/Pause error:", error);
      setPlayerError("Failed to control playback");
    }
  };

  const handleSeek = (time: number) => {
    try {
      if (playerRef && isPlayerReady) {
        playerRef.currentTime = time;
        dispatch(setCurrentTime(time));
      }
    } catch (error) {
      console.error("Seek error:", error);
      setPlayerError("Failed to seek to position");
    }
  };

  const handleSkip = (seconds: number) => {
    try {
      if (playerRef && isPlayerReady) {
        const newTime = Math.max(0, currentTime + seconds);
        playerRef.currentTime = newTime;
        dispatch(setCurrentTime(newTime));
      }
    } catch (error) {
      console.error("Skip error:", error);
      setPlayerError("Failed to skip");
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    try {
      if (playerRef && isPlayerReady) {
        playerRef.volume = newVolume;
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
          setIsMuted(false);
        }
      }
    } catch (error) {
      console.error("Volume change error:", error);
    }
  };

  const handleMuteToggle = () => {
    try {
      if (playerRef && isPlayerReady) {
        if (isMuted) {
          // Unmute
          playerRef.volume = previousVolume;
          setVolume(previousVolume);
          setIsMuted(false);
        } else {
          // Mute
          setPreviousVolume(volume);
          playerRef.volume = 0;
          setVolume(0);
          setIsMuted(true);
        }
      }
    } catch (error) {
      console.error("Mute toggle error:", error);
    }
  };

  const handleExport = async (format: string = "json") => {
    if (!currentInterview) return;

    try {
      const data = await interviewApi.exportInterview(
        currentInterview.id,
        format
      );

      if (format === "json") {
        // Download JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${currentInterview.original_name}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (format === "txt") {
        // Download text file
        const blob = new Blob([data.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          data.filename || `${currentInterview.original_name}_export.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast.success(`Interview exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export interview");
    }
  };

  // Helper function to get video URL
  const getVideoUrl = (filePath: string): string => {
    // If the interview has a Cloudinary URL, use it
    if (currentInterview?.cloudinary_url) {
      console.log("Using Cloudinary URL:", currentInterview.cloudinary_url);
      return currentInterview.cloudinary_url;
    }

    // If it's already a full URL (Cloudinary), return as is
    if (filePath.startsWith("http")) {
      console.log("Using direct URL:", filePath);
      return filePath;
    }

    // Fallback to mock video for testing
    console.log("Using fallback video URL");
    return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Error Loading Interview
        </h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link href="/dashboard/interviews">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Link>
        </Button>
      </div>
    );
  }

  if (!currentInterview) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Interview not found</h2>
        <p className="text-muted-foreground mb-6">
          The interview you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/dashboard/interviews">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Interviews
          </Link>
        </Button>
      </div>
    );
  }

  // Use real transcript and analysis data from the interview
  const transcript = currentInterview.transcript || [];
  const analysis = currentInterview.analysis || {
    summary:
      "No analysis available yet. Start transcription to generate analysis.",
    sentiment: "neutral",
    keywords: [],
    questions: [],
  };

  const filteredTranscript = transcript.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/interviews">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {currentInterview.original_name}
            </h1>
            <p className="text-muted-foreground">
              Video Analysis & Transcript
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentInterview.status === "uploaded" && (
            <Button
              onClick={() => dispatch(transcribeInterview(currentInterview.id))}
              disabled={loading}
              className=""
            >
              <Brain className="h-4 w-4 mr-2" />
              Start Transcription
            </Button>
          )}
          {currentInterview.status === "processing" && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Transcribing...</span>
            </div>
          )}
          {currentInterview.status === "completed" && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <Brain className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            disabled={!currentInterview.transcript}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Player */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5" />
            Media Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video/Audio Player */}
            <div className="relative bg-slate-900 rounded-lg overflow-hidden">
              {playerError ? (
                <div className="flex items-center justify-center h-64 bg-slate-800 text-white">
                  <div className="text-center">
                    <p className="text-red-400 mb-2">{playerError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPlayerError(null);
                        setIsPlayerReady(false);
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                     <video
                     ref={setPlayerRef}
                     src={getVideoUrl(currentInterview.file_path)}
                     className="w-full h-full object-contain"
                     onTimeUpdate={(e) => {
                       const video = e.target as HTMLVideoElement;
                       dispatch(setCurrentTime(video.currentTime));
                     }}
                     onPlay={() => dispatch(setIsPlaying(true))}
                     onPause={() => dispatch(setIsPlaying(false))}
                     onLoadedData={() => setIsPlayerReady(true)}
                     onError={() => setPlayerError("Failed to load video")}
                     onVolumeChange={(e) => {
                       const video = e.target as HTMLVideoElement;
                       setVolume(video.volume);
                     }}
                   />
                </div>
              )}
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkip(-10)}
                  disabled={!isPlayerReady}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  disabled={!isPlayerReady}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSkip(10)}
                  disabled={!isPlayerReady}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
                             <div className="flex items-center gap-2">
                 <div className="relative">
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleMuteToggle}
                     onMouseEnter={() => setShowVolumeSlider(true)}
                     onMouseLeave={() => setShowVolumeSlider(false)}
                     className="p-1"
                     disabled={!isPlayerReady}
                   >
                     {isMuted || volume === 0 ? (
                       <VolumeX className="h-4 w-4 text-muted-foreground" />
                     ) : volume < 0.5 ? (
                       <Volume1 className="h-4 w-4 text-muted-foreground" />
                     ) : (
                       <Volume2 className="h-4 w-4 text-muted-foreground" />
                     )}
                   </Button>
                                       {showVolumeSlider && (
                      <div className="absolute bottom-full right-0 mb-2 p-2 bg-background border border-border rounded-lg shadow-lg">
                       <input
                         type="range"
                         min="0"
                         max="1"
                         step="0.1"
                         value={isMuted ? 0 : volume}
                         onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                                   className="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(isMuted ? 0 : volume) * 100}%, hsl(var(--muted)) ${(isMuted ? 0 : volume) * 100}%, hsl(var(--muted)) 100%)`
                          }}
                       />
                     </div>
                   )}
                 </div>
                 <span className="text-sm text-muted-foreground">
                   {formatTime(currentTime)} /{" "}
                   {formatTime(transcript[transcript.length - 1]?.end || 0)}
                 </span>
                 {!isPlayerReady && (
                   <span className="text-xs text-amber-600">Loading...</span>
                 )}
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5" />
                Transcript
              </CardTitle>
              <div className="relative">
                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search transcript..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTranscript.map((item, index) => (
                <div
                  key={index}
                                     className={`p-3 rounded-lg cursor-pointer transition-colors ${
                     currentTime >= item.start && currentTime <= item.end
                       ? "bg-primary/10 border border-primary/20"
                       : "hover:bg-accent"
                   }`}
                  onClick={() => handleSeek(item.start)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {formatTime(item.start)} - {formatTime(item.end)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Tag className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Brain className="h-5 w-5" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <h4 className="font-semibold mb-2">Video Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {analysis.summary}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Questions Asked</h4>
                  <ul className="space-y-1">
                    {analysis.questions?.map((question, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary">•</span>
                        {typeof question === "string"
                          ? question
                          : question.question}
                      </li>
                    )) || (
                      <li className="text-sm text-muted-foreground">
                        No questions available
                      </li>
                    )}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="sentiment" className="space-y-4">
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                    Positive Sentiment
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300">
                    The interview shows a positive and engaging conversation
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg border border-input">
                    <div className="text-2xl font-bold text-emerald-600">
                      87%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Positive
                    </div>
                  </div>
                  <div className="text-center p-3 rounded-lg border border-input">
                    <div className="text-2xl font-bold text-slate-600">13%</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4">
                <div className="space-y-3">
                  {analysis.keywords?.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-input"
                    >
                      <span className="text-sm">{keyword}</span>
                      <Badge variant="secondary">
                        {Math.floor(Math.random() * 20) + 10} mentions
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center p-4 text-muted-foreground">
                      No keywords available
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Interview Metadata */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">1:15:30</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">File Size</p>
                <p className="text-sm text-muted-foreground">52.4 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                  Completed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
