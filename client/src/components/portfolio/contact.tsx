import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";
import type { Profile, InsertContactMessage } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    contactMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <section id="contact" className="section-padding bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="h-24 w-full mb-8" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-padding">
        <div className="text-center mb-16 slide-up">
          <h3 className="section-title">Get In Touch</h3>
          <div className="divider"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="slide-in-left">
            <h4 className="text-2xl font-semibold text-gray-900 mb-6">Let's Connect</h4>
            <p className="text-gray-600 mb-8">
              Interested in connecting with a passionate cybersecurity enthusiast? Let's discuss learning 
              opportunities, entry-level positions, or collaborate on security projects. Please provide your email 
              so I can respond to your message.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-4" />
                <span className="text-gray-700">{profile?.email || "alex.morgan@cybersec.com"}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-4" />
                <span className="text-gray-700">{profile?.phone || "+1 (555) 123-4567"}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-4" />
                <span className="text-gray-700">{profile?.location || "Remote"}</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-8">
              <Button className="btn-primary p-3" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button className="bg-gray-700 text-white hover:bg-gray-600 p-3" size="icon">
                <Github className="h-5 w-5" />
              </Button>
              <Button className="bg-blue-500 text-white hover:bg-blue-400 p-3" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm slide-in-right">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="How can I help you?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Tell me about your project or question..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
