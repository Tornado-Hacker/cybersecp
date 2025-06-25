import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Award } from "lucide-react";
import type { Certification } from "@shared/schema";

const colorMap = {
  primary: "from-primary/5 to-primary/10 text-primary",
  secondary: "from-secondary/5 to-secondary/10 text-secondary",
  accent: "from-accent/5 to-accent/10 text-accent",
};

export default function Certifications() {
  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  if (isLoading) {
    return (
      <section id="certifications" className="section-padding bg-white">
        <div className="container-padding">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="section-padding bg-white">
      <div className="container-padding">
        <div className="text-center mb-16 slide-up">
          <h3 className="section-title">Certifications</h3>
          <div className="divider"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications?.map((cert, index) => {
            const colorClass = colorMap[cert.color as keyof typeof colorMap] || colorMap.primary;
            
            return (
              <div 
                key={cert.id}
                className={`bg-gradient-to-br ${colorClass} p-6 rounded-xl text-center card-hover slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Award className="h-8 w-8 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{cert.shortName}</h4>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
