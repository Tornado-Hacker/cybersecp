import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Network, Code } from "lucide-react";
import type { Skill } from "@shared/schema";

const iconMap = {
  "fas fa-shield-alt": Shield,
  "fas fa-network-wired": Network,
  "fas fa-code": Code,
};

const colorMap = {
  "Security Analysis": "primary",
  "Network Security": "secondary",
  "Penetration Testing": "accent",
};

export default function Skills() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  if (isLoading) {
    return (
      <section id="skills" className="section-padding bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section-padding bg-gray-50">
      <div className="container-padding">
        <div className="text-center mb-16 slide-up">
          <h3 className="section-title">Technical Skills</h3>
          <div className="divider"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {skills?.map((skill, index) => {
            const IconComponent = iconMap[skill.icon as keyof typeof iconMap] || Shield;
            const colorClass = colorMap[skill.category as keyof typeof colorMap] || "primary";
            
            return (
              <div 
                key={skill.id} 
                className={`bg-white p-6 rounded-xl shadow-sm card-hover slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-center mb-6">
                  <IconComponent className={`h-12 w-12 text-${colorClass} mx-auto mb-4`} />
                  <h4 className="text-xl font-semibold text-gray-900">{skill.name}</h4>
                </div>
                <ul className="space-y-3 text-gray-600">
                  {skill.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center">
                      <div className={`w-2 h-2 bg-${colorClass} rounded-full mr-3`}></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
