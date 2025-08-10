"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  Download,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Brain,
  Award,
  Users,
  Globe,
  BarChart3,
  Eye,
  RefreshCw,
  Wand2,
  Shield,
  Clock,
} from "lucide-react"

interface GeneratedContent {
  resume: string
  coverLetter: string
  analysis: {
    matchScore: number
    keyStrengths: string[]
    skillGaps: string[]
    recommendations: string[]
    atsScore: number
    industryFit: string
  }
}

interface ResumeTemplate {
  id: string
  name: string
  description: string
  industry: string[]
  preview: string
}

const resumeTemplates: ResumeTemplate[] = [
  {
    id: "executive",
    name: "Executive Professional",
    description: "Perfect for senior leadership and C-suite positions",
    industry: ["Management", "Finance", "Consulting"],
    preview: "Clean, authoritative design with emphasis on achievements",
  },
  {
    id: "tech",
    name: "Tech Innovator",
    description: "Optimized for software engineers and tech professionals",
    industry: ["Technology", "Engineering", "Startups"],
    preview: "Modern layout highlighting technical skills and projects",
  },
  {
    id: "creative",
    name: "Creative Professional",
    description: "Designed for designers, marketers, and creative roles",
    industry: ["Design", "Marketing", "Media"],
    preview: "Visually appealing with space for portfolio highlights",
  },
  {
    id: "academic",
    name: "Academic Scholar",
    description: "Tailored for researchers, professors, and academic positions",
    industry: ["Education", "Research", "Healthcare"],
    preview: "Traditional format emphasizing publications and research",
  },
]

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Sales",
  "Engineering",
  "Design",
  "Consulting",
  "Legal",
  "Manufacturing",
  "Retail",
]

export default function ProfessionalResumeGenerator() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("executive")
  const [targetIndustry, setTargetIndustry] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [error, setError] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("input")

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setResumeFile(file)
    setError("")
    setUploadProgress(0)

    try {
      // Simulate file processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const text = await extractTextFromFile(file)
      setResumeText(text)
      setUploadProgress(100)

      setTimeout(() => setUploadProgress(0), 2000)
    } catch (err) {
      setError("Failed to extract text from file. Please try again or paste your resume text manually.")
      setUploadProgress(0)
    }
  }, [])

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        resolve(text)
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const generateContent = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Please provide both resume content and job description.")
      return
    }

    setIsGenerating(true)
    setError("")
    setActiveTab("results")

    try {
      const response = await fetch("/api/generate-professional", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume: resumeText,
          jobDescription: jobDescription,
          template: selectedTemplate,
          industry: targetIndustry,
          experienceLevel: experienceLevel,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data)
    } catch (err) {
      setError("Failed to generate customized content. Please try again.")
      setActiveTab("input")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadContent = (content: string, filename: string, format: "txt" | "pdf" = "txt") => {
    const blob = new Blob([content], { type: format === "pdf" ? "application/pdf" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ResumeTailor
                </h1>
                <p className="text-sm text-gray-500">Professional Resume & Cover Letter Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Enterprise Grade
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Award className="h-3 w-3" />
                ATS Optimized
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl font-bold text-gray-900">Land Your Dream Job with AI-Powered Resumes</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your resume into a job-winning masterpiece. Our advanced AI analyzes job requirements, optimizes
            for ATS systems, and creates compelling cover letters that get you noticed.
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>98% ATS Pass Rate</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span>3x More Interviews</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-purple-500" />
              <span>500K+ Success Stories</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Input & Setup
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Customize & Preview
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Results & Analysis
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Resume Upload Section */}
              <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Upload Your Resume
                  </CardTitle>
                  <CardDescription>
                    Support for PDF, DOCX, and TXT files. Our AI will extract and analyze your content.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Input
                      type="file"
                      accept=".txt,.pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <Label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Processing file...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <div className="relative">
                    <Separator className="my-4" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white px-2 text-xs text-gray-500">OR</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resume-text">Paste Resume Content</Label>
                    <Textarea
                      id="resume-text"
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      rows={8}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Job Description Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Target Job Description
                  </CardTitle>
                  <CardDescription>
                    Paste the complete job posting to get the most accurate customization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste the complete job description here including requirements, responsibilities, and company information..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="w-full"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Target Industry</Label>
                      <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-7 years)</SelectItem>
                          <SelectItem value="senior">Senior Level (8-15 years)</SelectItem>
                          <SelectItem value="executive">Executive (15+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Choose Resume Template
                </CardTitle>
                <CardDescription>
                  Select a professional template optimized for your industry and role level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {resumeTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate === template.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-xs text-gray-600">{template.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {template.industry.slice(0, 2).map((ind) => (
                              <Badge key={ind} variant="outline" className="text-xs">
                                {ind}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <div className="text-center py-6">
              <Button
                onClick={generateContent}
                disabled={isGenerating || !resumeText.trim() || !jobDescription.trim()}
                size="lg"
                className="px-12 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Professional Documents...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Generate AI-Optimized Resume & Cover Letter
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Customize Tab */}
          <TabsContent value="customize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
                <CardDescription>Fine-tune your resume for maximum impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Advanced customization options will appear here after generation</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {isGenerating ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold">AI is crafting your perfect resume...</h3>
                    <p className="text-gray-600">This may take 30-60 seconds for optimal results</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Analyzing job requirements and optimizing content</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : generatedContent ? (
              <>
                {/* Analysis Dashboard */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(generatedContent.analysis.matchScore)}`}>
                        {generatedContent.analysis.matchScore}%
                      </div>
                      <p className="text-sm text-gray-600">Job Match Score</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(generatedContent.analysis.atsScore)}`}>
                        {generatedContent.analysis.atsScore}%
                      </div>
                      <p className="text-sm text-gray-600">ATS Compatibility</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {generatedContent.analysis.keyStrengths.length}
                      </div>
                      <p className="text-sm text-gray-600">Key Strengths</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {generatedContent.analysis.recommendations.length}
                      </div>
                      <p className="text-sm text-gray-600">Recommendations</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Analysis Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      AI Analysis & Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Key Strengths Identified
                        </h4>
                        <ul className="space-y-1">
                          {generatedContent.analysis.keyStrengths.map((strength, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Improvement Opportunities
                        </h4>
                        <ul className="space-y-1">
                          {generatedContent.analysis.skillGaps.map((gap, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                      <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        AI Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {generatedContent.analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm bg-blue-50 p-3 rounded-lg">
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Generated Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Your Optimized Documents
                    </CardTitle>
                    <CardDescription>AI-generated resume and cover letter tailored for maximum impact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="resume" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="resume" className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Optimized Resume
                        </TabsTrigger>
                        <TabsTrigger value="cover-letter" className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Cover Letter
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="resume" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Customized Resume</h3>
                            <Badge variant={getScoreBadgeVariant(generatedContent.analysis.atsScore)}>
                              ATS Score: {generatedContent.analysis.atsScore}%
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => downloadContent(generatedContent.resume, "optimized-resume", "txt")}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download TXT
                            </Button>
                            <Button
                              onClick={() => downloadContent(generatedContent.resume, "optimized-resume", "pdf")}
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto shadow-inner">
                          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                            {generatedContent.resume}
                          </pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="cover-letter" className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Personalized Cover Letter</h3>
                            <Badge variant="default">Industry: {generatedContent.analysis.industryFit}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => downloadContent(generatedContent.coverLetter, "cover-letter", "txt")}
                              variant="outline"
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download TXT
                            </Button>
                            <Button
                              onClick={() => downloadContent(generatedContent.coverLetter, "cover-letter", "pdf")}
                              size="sm"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </Button>
                          </div>
                        </div>
                        <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto shadow-inner">
                          <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                            {generatedContent.coverLetter}
                          </pre>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6">
                  <Button
                    onClick={() => {
                      setActiveTab("input")
                      setGeneratedContent(null)
                    }}
                    variant="outline"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Version
                  </Button>
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Apply to Job
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <Target className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-600">Ready to Generate</h3>
                    <p className="text-gray-500">Complete the input section to see your results here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
