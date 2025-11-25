"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  fetchInterviews,
  uploadInterview,
  deleteInterview,
} from "@/redux/features/interviewSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  FileAudio,
  FileVideo,
  Clock,
  Search,
  Filter,
  Play,
  Pause,
  Download,
  Trash2,
  Eye,
  Plus,
  Grid3X3,
  List,
  SortAsc,
  MoreHorizontal,
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardInterviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    interviews = [],
    loading,
    error,
  } = useSelector((state: RootState) => state.interview);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "audio/mp3",
      "audio/wav",
      "audio/mpeg",
      "video/mp4",
      "video/mov",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a valid audio or video file (MP3, WAV, MP4, MOV)"
      );
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be less than 100MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await dispatch(uploadInterview(file)).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success("Interview uploaded successfully!");

      // Reset form
      event.target.value = "";
    } catch (error) {
      toast.error("Failed to upload interview");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteInterview = async () => {
    if (!interviewToDelete) return;

    try {
      await dispatch(deleteInterview(interviewToDelete.id)).unwrap();
      toast.success("Interview deleted successfully!");
      setInterviewToDelete(null);
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "processing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400";
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "mp3":
      case "wav":
        return <FileAudio className="h-8 w-8 text-blue-500" />;
      case "mp4":
      case "mov":
        return <FileVideo className="h-8 w-8 text-purple-500" />;
      default:
        return <FileAudio className="h-8 w-8 text-slate-500" />;
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.original_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || interview.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-slate-600">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Video Management
          </h1>
          <p className="text-muted-foreground">
            Upload, transcribe, and analyze your video recordings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <SortAsc className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4 mr-2" />
            ) : (
              <Grid3X3 className="h-4 w-4 mr-2" />
            )}
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="bg-white text-slate-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Video
          </CardTitle>
          <CardDescription>
            Upload audio or video files (MP3, WAV, MP4, MOV) up to 100MB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            <p className="font-medium mb-2">Drop your video file here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <Input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild disabled={isUploading}>
                <span>{isUploading ? "Uploading..." : "Choose File"}</span>
              </Button>
            </label>
            {isUploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="bg-white text-slate-600 p-4 rounded shadow-md space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus:outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-2 border text-sm border-slate-300 dark:border-slate-600 rounded-md bg-background"
          >
            <option className="text-xs" value="all">All Status</option>
            <option value="uploaded">Uploaded</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Interviews List */}
        <Tabs
          defaultValue="all"
          className="space-y-4 "
        >
          <TabsList>
            <TabsTrigger value="all">
              All Videos ({filteredInterviews.length})
            </TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="border border-dashed rounded-2xl border-slate-300">
                <CardContent className="p-12 text-center">
                  <FileAudio className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No videos found
                  </h3>
                  <p className="text-muted-foreground">
                    Upload your first video to get started
                  </p>
                </CardContent>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
                    : "grid-cols-1 "
                }`}
              >
                {filteredInterviews.map((interview) => (
                  <Card
                    key={interview.id}
                    className="transition-all duration-200 group border border-dashed border-slate-300"
                    data-testid="interview-card"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        {getFileIcon(interview.filename)}
                        <Badge className={getStatusColor(interview.status)}>
                          {interview.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {interview.original_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatDate(interview.upload_date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            File size:
                          </span>
                          <span>{formatBytes(interview.file_size)}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link
                              href={`/dashboard/interviews/${interview.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>

                          {interview.status === "completed" && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setInterviewToDelete({
                                    id: interview.id,
                                    name: interview.original_name,
                                  })
                                }
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-800">
                                  Delete Interview
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600">
                                  Are you sure you want to delete "
                                  {interview.original_name}"? This action cannot
                                  be undone and will permanently remove the
                                  interview file and all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => setInterviewToDelete(null)}
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteInterview}
                                  className="bg-red-400 hover:bg-red-700"
                                >
                                  Delete Interview
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
              Recent interviews will appear here
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="text-center text-muted-foreground py-8">
              Completed interviews will appear here
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
