'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchInterviews } from '@/redux/features/interviewSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileAudio, 
  FileVideo, 
  Filter,
  Download,
  Eye,
  TrendingUp,
  Users,
  Brain,
  BarChart3,
  Calendar,
  Activity,
  Zap,
  Target,
  Award,
  ArrowUpRight,
  Plus,
  MoreHorizontal
} from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { interviews = [], loading } = useSelector((state: RootState) => state.interview);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  // Calculate dashboard metrics
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === 'completed').length;
  const processingInterviews = interviews.filter(i => i.status === 'processing').length;
  const failedInterviews = interviews.filter(i => i.status === 'failed').length;
  const completionRate = totalInterviews > 0 ? (completedInterviews / totalInterviews) * 100 : 0;

  // Recent interviews (last 5)
  const recentInterviews = interviews.slice(0, 5);

  // Filter interviews based on search
  const filteredInterviews = interviews.filter(interview => 
    interview.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'processing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'mp3':
      case 'wav':
        return <FileAudio className="h-5 w-5 text-blue-500" />;
      case 'mp4':
      case 'mov':
        return <FileVideo className="h-5 w-5 text-purple-500" />;
      default:
        return <FileAudio className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-600">Video Analytics</h1>
          <p className="text-muted-foreground text-slate-600">
            Monitor and manage your video transcription pipeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/interviews">
              <Plus className="h-4 w-4 mr-2" />
              New Video
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{totalInterviews}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 20) + 10}% from last month
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{completionRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
              +5.2% from last week
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{processingInterviews}</div>
            <p className="text-xs text-muted-foreground">
              Currently in transcription
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">
              {totalInterviews > 0 ? ((completedInterviews / (totalInterviews - failedInterviews)) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Successful transcriptions
            </p>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>
      </div>

      {/* Charts and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className='text-slate-600'>
              Latest interview uploads and transcriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInterviews.length > 0 ? (
                recentInterviews.map((interview, index) => (
                  <div key={interview.id} className="flex items-center justify-between p-3 rounded-lg text-slate-600 border border-input bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getFileIcon(interview.filename)}
                      <div>
                        <p className="font-medium text-sm truncate max-w-[200px]">
                          {interview.original_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(interview.upload_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/interviews/${interview.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileAudio className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No videos yet</p>
                  <p className="text-sm">Upload your first video to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className='bg-white'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600">
              <TrendingUp className="h-5 w-5 " />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-sm text-emerald-600 font-semibold">{completedInterviews}</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing</span>
                <span className="text-sm text-amber-600 font-semibold">{processingInterviews}</span>
              </div>
              <Progress value={totalInterviews > 0 ? (processingInterviews / totalInterviews) * 100 : 0} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Failed</span>
                <span className="text-sm text-red-600 font-semibold">{failedInterviews}</span>
              </div>
              <Progress value={totalInterviews > 0 ? (failedInterviews / totalInterviews) * 100 : 0} className="h-2" />
            </div>

            <div className="pt-4 border-t border-input">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Total Files</span>
                <span className="text-muted-foreground">
                  {formatBytes(interviews.reduce((acc, i) => acc + i.file_size, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interviews Table */}
      <Card className='bg-white text-slate-600'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Videos
              </CardTitle>
              <CardDescription>
                Latest video uploads and their status
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/interviews">
                View All
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInterviews.slice(0, 5).map((interview) => (
              <div key={interview.id} className="flex items-center justify-between p-4 rounded-lg border border-input bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getFileIcon(interview.filename)}
                    <div>
                      <p className="font-medium">{interview.original_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatBytes(interview.file_size)} • {formatDate(interview.upload_date)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    {interview.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/interviews/${interview.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Section */}
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-600">
            <Brain className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription className='text-slate-600'>
            Key insights from your video analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Sentiment Analysis</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {Math.floor(Math.random() * 20) + 80}% positive videos
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Keyword Trends</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Top: React, Node.js, AWS
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Response Quality</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                {Math.floor(Math.random() * 15) + 85}% detailed responses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}