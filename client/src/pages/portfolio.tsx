import Navigation from "@/components/portfolio/navigation";
import Hero from "@/components/portfolio/hero";
import About from "@/components/portfolio/about";
import Skills from "@/components/portfolio/skills";
import Certifications from "@/components/portfolio/certifications";
import Projects from "@/components/portfolio/projects";
import Blog from "@/components/portfolio/blog";
import Contact from "@/components/portfolio/contact";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background smooth-scroll">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Certifications />
      <Projects />
      <Blog />
      <Contact />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-padding">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Alex Morgan</h3>
            <p className="text-gray-400 mb-6">Aspiring Cybersecurity Professional</p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#skills" className="text-gray-400 hover:text-white transition-colors">Skills</a>
              <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projects</a>
              <a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">&copy; 2024 Alex Morgan. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
