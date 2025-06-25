import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@shared/schema";

export default function Hero() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className="gradient-bg section-padding">
        <div className="container-padding">
          <div className="text-center">
            <Skeleton className="h-16 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gradient-bg section-padding">
      <div className="container-padding">
        <div className="text-center fade-in">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {profile?.title || "Aspiring Cybersecurity Professional"}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {profile?.headline || "Passionate about cybersecurity and dedicated to learning the latest security practices, tools, and techniques to protect digital environments."}
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => scrollToSection('contact')}
              className="btn-primary px-8 py-3 text-lg"
            >
              Get In Touch
            </Button>
            <Button 
              variant="outline" 
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 text-lg border-primary text-primary hover:bg-gray-50"
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
