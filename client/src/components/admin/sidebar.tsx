import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  User, 
  Settings, 
  Award, 
  Folder, 
  FileText, 
  Cog,
  Mail
} from "lucide-react";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: User },
  { id: "skills", label: "Skills", icon: Settings },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "blog", label: "Blog Posts", icon: FileText },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "settings", label: "Settings", icon: Cog },
];

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white",
                    activeSection === item.id && "bg-gray-700 text-white"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
