
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  FileAudio, 
  Brain, 
  Search, 
  Tag, 
  TrendingUp, 
  ArrowRight,
  Star,
  Users,
  Zap,
  Target,
  Play,
  Mic,
  FileText,
  BarChart3
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-input border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="text-2xl font-bold text-foreground">INTERVIEW</div>
                <div className="absolute -top-1 -right-1 flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground font-medium">Transcription & Analysis</div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#insights" className="text-muted-foreground hover:text-foreground transition-colors">Insights</a>
              <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">Community</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </nav>

            {/* CTA */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-primary hover:bg-foreground/90 text-background"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2 text-sm font-medium">
              AI INTERVIEW TRANSCRIPTION PLATFORM
            </Badge>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              HR Solutions
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Powered By AI
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              A cloud-based HR solution that provides intelligent interview transcription, 
              real-time analysis, and AI-powered insights to enhance your talent acquisition 
              and employee development processes.
            </p>

            {/* CTA Button */}
            <Button 
              onClick={() => router.push('/dashboard')}
              size="lg" 
              className="bg-primary text-white px-8 py-4 font-medium"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right Content - Illustrative Graphics */}
          <div className="relative">
            {/* Top-right card */}
            <Card className="absolute top-0 right-0 w-48 bg-white shadow-lg border-0">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-slate-900">Employee Management</p>
              </CardContent>
            </Card>

            {/* Central figures and connections */}
            <div className="relative flex flex-col items-center space-y-8">
              {/* Top profile */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">JD</span>
                    </div>
                  </div>
                </div>
                {/* Connection dots */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                </div>
              </div>

              {/* Central element */}
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              </div>

              {/* Bottom profile */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">SM</span>
                    </div>
                  </div>
                </div>
                {/* Connection dots */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Testimonial card */}
            <Card className="absolute bottom-0 left-0 w-64 bg-white shadow-lg border-0">
              <CardContent className="p-4">
                <p className="text-sm text-slate-700 mb-3">
                  "This platform is my #1 go-to for all interview transcription needs."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">4.8 out of 5 stars</span>
                </div>
              </CardContent>
            </Card>

            {/* Hand-drawn arrows */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
              <svg width="60" height="40" viewBox="0 0 60 40" className="opacity-60">
                <path 
                  d="M10 20 Q30 10 50 20" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  className="text-slate-400"
                />
                <path 
                  d="M45 15 L50 20 L45 25" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  className="text-slate-400"
                />
              </svg>
            </div>
            <div className="absolute top-1/3 left-0 transform -translate-y-1/2">
              <svg width="60" height="40" viewBox="0 0 60 40" className="opacity-40">
                <path 
                  d="M10 20 Q30 30 50 20" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  className="text-slate-400"
                />
                <path 
                  d="M45 15 L50 20 L45 25" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  className="text-slate-400"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
              <FileAudio className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Smart Upload</h3>
            <p className="text-slate-600">Drag & drop audio/video files with instant validation</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto">
              <Brain className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">AI Analysis</h3>
            <p className="text-slate-600">Sentiment analysis, keywords, and intelligent insights</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Smart Search</h3>
            <p className="text-slate-600">Find and highlight specific content instantly</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto">
              <Tag className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Tagging System</h3>
            <p className="text-slate-600">Organize and categorize interview segments</p>
          </div>
        </div>
      </main>
    </div>
  );
}
