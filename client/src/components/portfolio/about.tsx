import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Profile } from "@shared/schema";

export default function About() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <section id="about" className="section-padding bg-white">
        <div className="container-padding">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-6" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section-padding bg-white">
      <div className="container-padding">
        <div className="text-center mb-16 slide-up">
          <h3 className="section-title">About Me</h3>
          <div className="divider"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="slide-in-left">
            <p className="text-lg text-gray-600 mb-6">
              {profile?.about || "Recently started my journey in cybersecurity with a strong foundation in IT fundamentals. Currently pursuing cybersecurity certifications and hands-on experience with security tools and practices."}
            </p>
            <p className="text-lg text-gray-600 mb-8">
              {profile?.aboutExtended || "I'm excited to begin my cybersecurity career and am actively learning through labs, courses, and self-study. My goal is to contribute to making the digital world more secure."}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">
                  {profile?.experienceYears || 0}
                </div>
                <div className="text-gray-600">Years Learning</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary mb-2">
                  {profile?.projectsCompleted || 5}+
                </div>
                <div className="text-gray-600">Lab Projects</div>
              </div>
            </div>
          </div>
          <div className="slide-in-right">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Network security analysis" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
