import { 
  users, profile, skills, certifications, projects, blogPosts, contactMessages,
  type User, type Profile, type Skill, type Certification, type Project, type BlogPost, type ContactMessage,
  type InsertUser, type InsertProfile, type InsertSkill, type InsertCertification, type InsertProject, type InsertBlogPost, type InsertContactMessage
} from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<void>;
  
  // Profile management
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profileData: InsertProfile): Promise<Profile>;
  
  // Skills management
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: InsertSkill): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;
  
  // Certifications management
  getCertifications(): Promise<Certification[]>;
  createCertification(cert: InsertCertification): Promise<Certification>;
  updateCertification(id: number, cert: InsertCertification): Promise<Certification>;
  deleteCertification(id: number): Promise<void>;
  
  // Projects management
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Blog posts management
  getBlogPosts(): Promise<BlogPost[]>;
  getPublicBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Contact messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private profiles: Map<number, Profile> = new Map();
  private skills: Map<number, Skill> = new Map();
  private certifications: Map<number, Certification> = new Map();
  private projects: Map<number, Project> = new Map();
  private blogPosts: Map<number, BlogPost> = new Map();
  private contactMessages: Map<number, ContactMessage> = new Map();
  
  private currentUserId = 1;
  private currentProfileId = 1;
  private currentSkillId = 1;
  private currentCertId = 1;
  private currentProjectId = 1;
  private currentBlogId = 1;
  private currentContactId = 1;

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Create default admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: hashedPassword,
    };
    this.users.set(adminUser.id, adminUser);

    // Create default profile
    const defaultProfile: Profile = {
      id: this.currentProfileId++,
      name: "Alex Morgan",
      title: "Aspiring Cybersecurity Professional",
      headline: "Passionate about cybersecurity and dedicated to learning the latest security practices, tools, and techniques to protect digital environments.",
      about: "Recently started my journey in cybersecurity with a strong foundation in IT fundamentals. Currently pursuing cybersecurity certifications and hands-on experience with security tools and practices.",
      aboutExtended: "I'm excited to begin my cybersecurity career and am actively learning through labs, courses, and self-study. My goal is to contribute to making the digital world more secure.",
      email: "alex.morgan@cybersec.com",
      phone: "+1 (555) 123-4567",
      location: "Remote",
      experienceYears: 0,
      projectsCompleted: 5,
    };
    this.profiles.set(defaultProfile.id, defaultProfile);

    // Initialize skills
    const defaultSkills: Skill[] = [
      {
        id: this.currentSkillId++,
        category: "Security Fundamentals",
        name: "Security Fundamentals",
        icon: "fas fa-shield-alt",
        items: ["Basic Risk Assessment", "Security Awareness", "Password Management", "Basic Incident Response"]
      },
      {
        id: this.currentSkillId++,
        category: "Learning Tools",
        name: "Learning Tools",
        icon: "fas fa-network-wired",
        items: ["Wireshark Basics", "Nmap Scanning", "Virtual Machines", "Kali Linux"]
      },
      {
        id: this.currentSkillId++,
        category: "Technical Skills",
        name: "Technical Skills",
        icon: "fas fa-code",
        items: ["Python Scripting", "Windows Security", "Linux Basics", "Network Troubleshooting"]
      }
    ];
    defaultSkills.forEach(skill => this.skills.set(skill.id, skill));

    // Initialize certifications
    const defaultCerts: Certification[] = [
      {
        id: this.currentCertId++,
        name: "CompTIA Security+",
        shortName: "Sec+",
        description: "Currently studying for CompTIA Security+ certification",
        icon: "fas fa-certificate",
        color: "primary"
      },
      {
        id: this.currentCertId++,
        name: "CompTIA Network+",
        shortName: "Net+",
        description: "Planning to pursue CompTIA Network+ next",
        icon: "fas fa-certificate",
        color: "secondary"
      },
      {
        id: this.currentCertId++,
        name: "Google Cybersecurity Certificate",
        shortName: "Google Cyber",
        description: "Completed Google Cybersecurity Professional Certificate",
        icon: "fas fa-certificate",
        color: "accent"
      }
    ];
    defaultCerts.forEach(cert => this.certifications.set(cert.id, cert));

    // Initialize projects
    const defaultProjects: Project[] = [
      {
        id: this.currentProjectId++,
        title: "Home Network Security Lab",
        description: "Built a virtual lab environment to practice network security concepts, including firewall configuration and intrusion detection.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["VirtualBox", "pfSense", "Wireshark"],
        link: null,
        createdAt: new Date(),
      },
      {
        id: this.currentProjectId++,
        title: "Password Security Analyzer",
        description: "Created a Python script to analyze password strength and provide recommendations for better security practices.",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["Python", "Regex", "Security Analysis"],
        link: null,
        createdAt: new Date(),
      },
      {
        id: this.currentProjectId++,
        title: "Cybersecurity Learning Portfolio",
        description: "This website! Built to showcase my learning journey and document my progress in cybersecurity.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        technologies: ["React", "Node.js", "TypeScript"],
        link: null,
        createdAt: new Date(),
      }
    ];
    defaultProjects.forEach(project => this.projects.set(project.id, project));

    // Initialize blog posts
    const defaultBlogPosts: BlogPost[] = [
      {
        id: this.currentBlogId++,
        title: "My Journey into Cybersecurity",
        content: "Starting my cybersecurity journey has been exciting and challenging. Here's what I've learned so far about the fundamentals of information security...",
        excerpt: "Starting my cybersecurity journey has been exciting and challenging. Here's what I've learned so far.",
        category: "Learning Journey",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        isPublic: true,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: this.currentBlogId++,
        title: "Setting Up My First Security Lab",
        content: "Documentation of building my home cybersecurity lab using VirtualBox and various security tools...",
        excerpt: "Documentation of building my home cybersecurity lab using VirtualBox and various security tools.",
        category: "Labs & Practice",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        isPublic: true,
        createdAt: new Date("2024-03-08"),
        updatedAt: new Date("2024-03-08"),
      },
      {
        id: this.currentBlogId++,
        title: "CompTIA Security+ Study Notes",
        content: "My study notes and key concepts while preparing for the CompTIA Security+ certification exam...",
        excerpt: "My study notes and key concepts while preparing for the CompTIA Security+ certification exam.",
        category: "Certification Study",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        isPublic: true,
        createdAt: new Date("2024-02-28"),
        updatedAt: new Date("2024-02-28"),
      },
      {
        id: this.currentBlogId++,
        title: "Personal Learning Goals",
        content: "My private notes on cybersecurity learning goals and career planning for the next year...",
        excerpt: "My private notes on cybersecurity learning goals and career planning for the next year.",
        category: "Personal Notes",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300",
        isPublic: false,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      }
    ];
    defaultBlogPosts.forEach(post => this.blogPosts.set(post.id, post));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, id, password: hashedPassword };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(id: number, password: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      this.users.set(id, user);
    }
  }

  // Profile methods
  async getProfile(): Promise<Profile | undefined> {
    return Array.from(this.profiles.values())[0];
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existingProfile = Array.from(this.profiles.values())[0];
    const profile: Profile = existingProfile ? 
      { ...existingProfile, ...profileData } : 
      { ...profileData, id: this.currentProfileId++, aboutExtended: profileData.aboutExtended || null, phone: profileData.phone || null, location: profileData.location || null, experienceYears: profileData.experienceYears || null, projectsCompleted: profileData.projectsCompleted || null };
    this.profiles.set(profile.id, profile);
    return profile;
  }

  // Skills methods
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const newSkill: Skill = { ...skill, id };
    this.skills.set(id, newSkill);
    return newSkill;
  }

  async updateSkill(id: number, skill: InsertSkill): Promise<Skill> {
    const updatedSkill: Skill = { ...skill, id };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<void> {
    this.skills.delete(id);
  }

  // Certifications methods
  async getCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values());
  }

  async createCertification(cert: InsertCertification): Promise<Certification> {
    const id = this.currentCertId++;
    const newCert: Certification = { ...cert, id };
    this.certifications.set(id, newCert);
    return newCert;
  }

  async updateCertification(id: number, cert: InsertCertification): Promise<Certification> {
    const updatedCert: Certification = { ...cert, id };
    this.certifications.set(id, updatedCert);
    return updatedCert;
  }

  async deleteCertification(id: number): Promise<void> {
    this.certifications.delete(id);
  }

  // Projects methods
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const newProject: Project = { ...project, id, createdAt: new Date(), link: project.link || null };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project> {
    const existing = this.projects.get(id);
    const updatedProject: Project = { 
      ...project, 
      id, 
      createdAt: existing?.createdAt || new Date(),
      link: project.link || null
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // Blog posts methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getPublicBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublic)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogId++;
    const newPost: BlogPost = { 
      ...post, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      image: post.image || null,
      isPublic: post.isPublic || null
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost> {
    const existing = this.blogPosts.get(id);
    const updatedPost: BlogPost = { 
      ...post, 
      id, 
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
      image: post.image || null,
      isPublic: post.isPublic || null
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }

  // Contact messages methods
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const newMessage: ContactMessage = { ...message, id, createdAt: new Date() };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
