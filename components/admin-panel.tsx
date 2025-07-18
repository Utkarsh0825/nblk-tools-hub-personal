"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, BarChart3, Users, Settings, Database, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AnalyticsDashboard from "./analytics-dashboard"
import type { ViewType } from "@/app/page"

interface AdminPanelProps {
  onNavigate: (view: ViewType) => void
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [currentTab, setCurrentTab] = useState<"overview" | "analytics" | "users" | "settings">("overview")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication (replace with proper auth)
    if (credentials.username === "admin" && credentials.password === "nblk2024") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid credentials")
    }
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (currentTab === "analytics") {
    return <AnalyticsDashboard onBack={() => setCurrentTab("overview")} />
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your NBLK Tools Hub platform</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Sign Out
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "analytics", label: "Analytics", icon: Database },
            { id: "users", label: "Users", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={currentTab === tab.id ? "default" : "ghost"}
              onClick={() => setCurrentTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {currentTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCurrentTab("analytics")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>View detailed user engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track completion rates, popular tools, and user behavior patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View user profiles, manage service partners, and handle support requests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Report Templates
                </CardTitle>
                <CardDescription>Customize diagnostic report templates</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Edit report layouts, add custom insights, and manage PDF generation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  Data Export
                </CardTitle>
                <CardDescription>Export user data and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download user responses, analytics data, and generate custom reports.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage API keys, email templates, and system configurations.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {currentTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and service partners</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management features coming soon...</p>
            </CardContent>
          </Card>
        )}

        {currentTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform settings and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input id="openai-key" type="password" placeholder="sk-..." className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
                  <Input id="sendgrid-key" type="password" placeholder="SG..." className="mt-2" />
                </div>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
