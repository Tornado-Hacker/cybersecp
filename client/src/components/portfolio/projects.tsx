import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Project } from "@shared/schema";

const techColorMap: Record<string, string> = {
  "Python": "skill-badge-primary",
  "SIEM": "skill-badge-secondary",
  "Machine Learning": "skill-badge-accent",
  "Node.js": "skill-badge-primary",
  "OWASP": "skill-badge-secondary",
  "Docker": "skill-badge-accent",
  "Kubernetes": "skill-badge-primary",
  "AWS": "skill-badge-secondary",
  "Terraform": "skill-badge-accent",
};

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <section id="projects" className="section-padding bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-gray-50">
      <div className="container-padding">
        <div className="text-center mb-16 slide-up">
          <h3 className="section-title">Featured Projects</h3>
          <div className="divider"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <div 
              key={project.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden card-hover slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h4>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge 
                      key={techIndex}
                      className={`${techColorMap[tech] || "skill-badge-primary"}`}
                      variant="secondary"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                {project.link && project.link !== "#" && (
                  <a 
                    href={project.link} 
                    className="text-primary hover:opacity-80 font-medium inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Details <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
