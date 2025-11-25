'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Activity, 
  BarChart3,
  PieChart,
  LineChart,
  Users,
  MessageSquare,
  Clock
} from 'lucide-react';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Insights</h1>
          <p className="text-slate-600">
            Intelligent analysis and insights from your video data
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">87%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last month
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Quality</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">92%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8% from last month
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keyword Density</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">78%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -3% from last month
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>

        <Card className="relative overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">85%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% from last month
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-10 translate-x-10" />
        </Card>
      </div>

      {/* Sentiment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className='bg-white'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-600">
              <Brain className="h-5 w-5" />
              Sentiment Analysis
            </CardTitle>
            <CardDescription>
              Overall sentiment trends across all videos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Positive</span>
                <span className="text-sm text-emerald-600 font-semibold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Neutral</span>
                <span className="text-sm text-slate-600 font-semibold">10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Negative</span>
                <span className="text-sm text-red-600 font-semibold">3%</span>
              </div>
              <Progress value={3} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-white'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Target className="h-5 w-5" />
              Top Keywords
            </CardTitle>
            <CardDescription>
              Most frequently mentioned terms and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-600">
              {[
                { keyword: 'React', count: 45, trend: 'up' },
                { keyword: 'Node.js', count: 38, trend: 'up' },
                { keyword: 'AWS', count: 32, trend: 'down' },
                { keyword: 'TypeScript', count: 28, trend: 'up' },
                { keyword: 'Python', count: 25, trend: 'stable' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="font-medium">{item.keyword}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.count} mentions</span>
                    {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                    {item.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    {item.trend === 'stable' && <div className="h-3 w-3 rounded-full bg-slate-400" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Quality Analysis */}
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-700">
            <BarChart3 className="h-5 w-5" />
            Response Quality Metrics
          </CardTitle>
          <CardDescription className='text-slate-600'>
            Detailed analysis of video response quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Detailed Responses</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                92% of candidates provided detailed answers
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">Response Time</h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Average response time: 2.3 seconds
              </p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Engagement</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                85% showed high engagement levels
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className='bg-white'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-600">
            <LineChart className="h-5 w-5" />
            Trend Analysis
          </CardTitle>
          <CardDescription className='text-slate-600'>
            Monthly trends and patterns in video performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-input text-slate-600">
                <h4 className="font-semibold mb-2">Sentiment Trend</h4>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Consistently improving over the last 6 months</span>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-input text-slate-600">
                <h4 className="font-semibold mb-2">Response Quality</h4>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Steady improvement in detailed responses</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
