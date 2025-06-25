import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import AdminSidebar from "@/components/admin/sidebar";
import BlogEditor from "@/components/admin/blog-editor";
import ProfileEditor from "@/components/admin/profile-editor";
import ProjectsEditor from "@/components/admin/projects-editor";
import SkillsEditor from "@/components/admin/skills-editor";
import CertificationsEditor from "@/components/admin/certifications-editor";
import Settings from "@/components/admin/settings";
import ContactMessages from "@/components/admin/contact-messages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/auth";
import { ExternalLink, LogOut, FileText, Folder, Award, Settings as SettingsIcon } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const { toast } = useToast();

  // Check authentication
  const { data: user, isLoading: userLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Get statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!userLoading && (!user || error)) {
      setLocation("/admin");
    }
  }, [user, userLoading, error, setLocation]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    }
  };

  const handleViewSite = () => {
    setLocation("/");
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
              <p className="text-gray-600">Manage your portfolio content and settings</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCertifications || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Skills</CardTitle>
                  <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalSkills || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => setActiveSection("blog")}
                    className="w-full btn-primary"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    New Blog Post
                  </Button>
                  <Button 
                    onClick={() => setActiveSection("projects")}
                    className="w-full btn-secondary"
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                  <Button 
                    onClick={() => setActiveSection("profile")}
                    className="w-full btn-accent"
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Public Posts:</span>
                    <span className="font-semibold">{stats?.publicPosts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Private Posts:</span>
                    <span className="font-semibold">{stats?.privatePosts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Messages:</span>
                    <span className="font-semibold">{stats?.totalMessages || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "profile":
        return <ProfileEditor />;
      case "skills":
        return <SkillsEditor />;
      case "certifications":
        return <CertificationsEditor />;
      case "projects":
        return <ProjectsEditor />;
      case "blog":
        return <BlogEditor />;
      case "settings":
        return <Settings />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Portfolio Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleViewSite}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Site
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
