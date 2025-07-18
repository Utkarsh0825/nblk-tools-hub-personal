// Database schema and operations for storing user responses and analytics

export interface UserResponse {
  id: string
  sessionId: string
  toolName: string
  userName?: string
  userEmail?: string
  userPhone?: string
  responses: Array<{
    questionId: string
    question: string
    answer: "Yes" | "No"
  }>
  score: number
  completedAt: Date
  createdAt: Date
  ipAddress?: string
  userAgent?: string
  referrer?: string
}

export interface AnalyticsData {
  totalSessions: number
  completedSessions: number
  completionRate: number
  averageScore: number
  toolUsage: Record<string, number>
  dailyStats: Array<{
    date: string
    sessions: number
    completions: number
  }>
  questionAnalytics: Array<{
    questionId: string
    question: string
    yesCount: number
    noCount: number
    yesPercentage: number
  }>
  userInsights: {
    topPerformingAreas: string[]
    commonChallenges: string[]
    industryBenchmarks: Record<string, number>
  }
}

// Simulated database operations (replace with actual database calls)
class DatabaseService {
  private responses: UserResponse[] = []
  private sessions: Array<{
    id: string
    toolName: string
    startedAt: Date
    completed: boolean
    abandonedAt?: Date
  }> = []

  // Store user response
  async saveUserResponse(response: Omit<UserResponse, "id" | "createdAt">): Promise<string> {
    const id = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const userResponse: UserResponse = {
      ...response,
      id,
      createdAt: new Date(),
    }

    this.responses.push(userResponse)

    // Update session as completed
    const session = this.sessions.find((s) => s.id === response.sessionId)
    if (session) {
      session.completed = true
    }

    return id
  }

  // Track session start
  async trackSessionStart(toolName: string): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    this.sessions.push({
      id: sessionId,
      toolName,
      startedAt: new Date(),
      completed: false,
    })

    return sessionId
  }

  // Track session abandonment
  async trackSessionAbandonment(sessionId: string): Promise<void> {
    const session = this.sessions.find((s) => s.id === sessionId)
    if (session && !session.completed) {
      session.abandonedAt = new Date()
    }
  }

  // Get analytics data
  async getAnalytics(dateRange?: { start: Date; end: Date }): Promise<AnalyticsData> {
    const filteredResponses = dateRange
      ? this.responses.filter((r) => r.createdAt >= dateRange.start && r.createdAt <= dateRange.end)
      : this.responses

    const filteredSessions = dateRange
      ? this.sessions.filter((s) => s.startedAt >= dateRange.start && s.startedAt <= dateRange.end)
      : this.sessions

    const totalSessions = filteredSessions.length
    const completedSessions = filteredResponses.length
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0

    const averageScore =
      filteredResponses.length > 0
        ? filteredResponses.reduce((sum, r) => sum + r.score, 0) / filteredResponses.length
        : 0

    // Tool usage statistics
    const toolUsage: Record<string, number> = {}
    filteredSessions.forEach((session) => {
      toolUsage[session.toolName] = (toolUsage[session.toolName] || 0) + 1
    })

    // Daily statistics
    const dailyStats = this.generateDailyStats(filteredSessions, filteredResponses)

    // Question analytics
    const questionAnalytics = this.generateQuestionAnalytics(filteredResponses)

    // User insights
    const userInsights = this.generateUserInsights(filteredResponses)

    return {
      totalSessions,
      completedSessions,
      completionRate,
      averageScore,
      toolUsage,
      dailyStats,
      questionAnalytics,
      userInsights,
    }
  }

  private generateDailyStats(sessions: any[], responses: UserResponse[]) {
    const dailyMap = new Map<string, { sessions: number; completions: number }>()

    // Count sessions by day
    sessions.forEach((session) => {
      const date = session.startedAt.toISOString().split("T")[0]
      const current = dailyMap.get(date) || { sessions: 0, completions: 0 }
      dailyMap.set(date, { ...current, sessions: current.sessions + 1 })
    })

    // Count completions by day
    responses.forEach((response) => {
      const date = response.completedAt.toISOString().split("T")[0]
      const current = dailyMap.get(date) || { sessions: 0, completions: 0 }
      dailyMap.set(date, { ...current, completions: current.completions + 1 })
    })

    return Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  private generateQuestionAnalytics(responses: UserResponse[]) {
    const questionMap = new Map<string, { question: string; yesCount: number; noCount: number }>()

    responses.forEach((response) => {
      response.responses.forEach(({ questionId, question, answer }) => {
        const current = questionMap.get(questionId) || { question, yesCount: 0, noCount: 0 }
        if (answer === "Yes") {
          current.yesCount++
        } else {
          current.noCount++
        }
        questionMap.set(questionId, current)
      })
    })

    return Array.from(questionMap.entries()).map(([questionId, data]) => {
      const total = data.yesCount + data.noCount
      return {
        questionId,
        question: data.question,
        yesCount: data.yesCount,
        noCount: data.noCount,
        yesPercentage: total > 0 ? (data.yesCount / total) * 100 : 0,
      }
    })
  }

  private generateUserInsights(responses: UserResponse[]) {
    // Analyze common patterns
    const allResponses = responses.flatMap((r) => r.responses)
    const yesAnswers = allResponses.filter((r) => r.answer === "Yes")
    const noAnswers = allResponses.filter((r) => r.answer === "No")

    // Top performing areas (most "Yes" answers)
    const yesFrequency = new Map<string, number>()
    yesAnswers.forEach((answer) => {
      yesFrequency.set(answer.question, (yesFrequency.get(answer.question) || 0) + 1)
    })

    const topPerformingAreas = Array.from(yesFrequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([question]) => question)

    // Common challenges (most "No" answers)
    const noFrequency = new Map<string, number>()
    noAnswers.forEach((answer) => {
      noFrequency.set(answer.question, (noFrequency.get(answer.question) || 0) + 1)
    })

    const commonChallenges = Array.from(noFrequency.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([question]) => question)

    // Industry benchmarks (simulated)
    const industryBenchmarks = {
      "Data Hygiene & Business Clarity": 72,
      "Marketing Effectiveness": 68,
      "Cash Flow & Financial Clarity": 75,
    }

    return {
      topPerformingAreas,
      commonChallenges,
      industryBenchmarks,
    }
  }

  // Get user responses for export
  async exportUserResponses(format: "json" | "csv" = "json"): Promise<string> {
    if (format === "csv") {
      return this.convertToCSV(this.responses)
    }
    return JSON.stringify(this.responses, null, 2)
  }

  private convertToCSV(responses: UserResponse[]): string {
    const headers = [
      "ID",
      "Session ID",
      "Tool Name",
      "User Name",
      "User Email",
      "Score",
      "Completed At",
      "Created At",
      "Responses",
    ]

    const rows = responses.map((response) => [
      response.id,
      response.sessionId,
      response.toolName,
      response.userName || "",
      response.userEmail || "",
      response.score.toString(),
      response.completedAt.toISOString(),
      response.createdAt.toISOString(),
      JSON.stringify(response.responses),
    ])

    return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
  }
}

export const db = new DatabaseService()
