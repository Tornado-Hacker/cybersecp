import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { 
  insertProfileSchema, insertSkillSchema, insertCertificationSchema, 
  insertProjectSchema, insertBlogPostSchema, insertContactMessageSchema 
} from "@shared/schema";

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    isAuthenticated?: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 30 * 60 * 1000 // 30 minutes
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.isAuthenticated) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.isAuthenticated = true;

      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Change username
  app.post("/api/auth/change-username", requireAuth, async (req, res) => {
    try {
      const { newUsername } = req.body;
      const userId = req.session.userId!;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(newUsername);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).send("Username already exists");
      }

      await storage.updateUsername(userId, newUsername);
      res.json({ message: "Username updated successfully" });
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to get skills" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.updateSkill(id, skillData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSkill(id);
      res.json({ message: "Skill deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Certifications routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const certifications = await storage.getCertifications();
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get certifications" });
    }
  });

  app.post("/api/certifications", requireAuth, async (req, res) => {
    try {
      const certData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(certData);
      res.json(certification);
    } catch (error) {
      res.status(400).json({ message: "Invalid certification data" });
    }
  });

  app.put("/api/certifications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const certData = insertCertificationSchema.parse(req.body);
      const certification = await storage.updateCertification(id, certData);
      res.json(certification);
    } catch (error) {
      res.status(400).json({ message: "Invalid certification data" });
    }
  });

  app.delete("/api/certifications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCertification(id);
      res.json({ message: "Certification deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete certification" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.updateProject(id, projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ message: "Project deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Blog posts routes
  app.get("/api/blog", async (req, res) => {
    try {
      const isAuthenticated = req.session?.isAuthenticated;
      const posts = isAuthenticated ? 
        await storage.getBlogPosts() : 
        await storage.getPublicBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      // Check if post is public or user is authenticated
      if (!post.isPublic && !req.session?.isAuthenticated) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to get blog post" });
    }
  });

  app.post("/api/blog", requireAuth, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.put("/api/blog/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(id, postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid blog post data" });
    }
  });

  app.delete("/api/blog/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Contact messages routes
  app.post("/api/contact-messages", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact message data" });
    }
  });

  app.get("/api/contact-messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contact messages" });
    }
  });

  // Reply to contact message
  app.post("/api/contact-messages/:id/reply", requireAuth, async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const { replyMessage } = req.body;

      const originalMessages = await storage.getContactMessages();
      const message = originalMessages.find(m => m.id === messageId);
      
      if (!message) {
        return res.status(404).send("Message not found");
      }

      // Update message with reply
      const updatedMessage = await storage.replyToMessage(messageId, replyMessage);

      // Send email reply (if SendGrid is configured)
      try {
        const { sendEmail } = await import("./email.js");
        const profile = await storage.getProfile();
        const fromEmail = profile?.email || "noreply@example.com";

        const emailSent = await sendEmail({
          to: message.email,
          from: fromEmail,
          subject: `Re: Your message from ${profile?.name || "Portfolio"}`,
          text: replyMessage,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Thank you for your message!</h2>
              <p>Hi ${message.name},</p>
              <p>Thank you for reaching out. Here's my response:</p>
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                ${replyMessage.replace(/\n/g, '<br>')}
              </div>
              <p>Best regards,<br>${profile?.name || "Portfolio Owner"}</p>
              <hr>
              <p style="font-size: 12px; color: #666;">
                Original message: ${message.message}
              </p>
            </div>
          `,
        });

        if (!emailSent) {
          console.warn('Email could not be sent, but reply was saved');
        }
      } catch (emailError) {
        console.warn('Email service not configured, reply saved locally only');
      }

      res.json(updatedMessage);
    } catch (error: any) {
      res.status(500).send(error.message);
    }
  });

  // Password change route
  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password required" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      await storage.updateUserPassword(user.id, newPassword);
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Statistics route for admin dashboard
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const [skills, certifications, projects, blogPosts, contactMessages] = await Promise.all([
        storage.getSkills(),
        storage.getCertifications(),
        storage.getProjects(),
        storage.getBlogPosts(),
        storage.getContactMessages()
      ]);

      res.json({
        totalSkills: skills.length,
        totalCertifications: certifications.length,
        totalProjects: projects.length,
        totalPosts: blogPosts.length,
        totalMessages: contactMessages.length,
        publicPosts: blogPosts.filter(post => post.isPublic).length,
        privatePosts: blogPosts.filter(post => !post.isPublic).length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
