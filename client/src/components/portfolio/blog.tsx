import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <section id="blog" className="section-padding bg-white">
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
    <section id="blog" className="section-padding bg-white">
      <div className="container-padding">
        <div className="text-center mb-16 slide-up">
          <h3 className="section-title">Latest Blog Posts</h3>
          <div className="divider"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts?.map((post, index) => (
            <article 
              key={post.id}
              className="bg-gray-50 rounded-xl overflow-hidden card-hover slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(post.createdAt || "").toLocaleDateString()}</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{post.title}</h4>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="text-primary hover:opacity-80 font-medium">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
