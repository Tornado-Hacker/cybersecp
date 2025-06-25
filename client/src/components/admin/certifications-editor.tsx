import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCertificationSchema } from "@shared/schema";
import type { Certification, InsertCertification } from "@shared/schema";
import { Plus, Edit, Trash2, X, Award } from "lucide-react";

const colorOptions = [
  { value: "primary", label: "Primary (Blue)" },
  { value: "secondary", label: "Secondary (Purple)" },
  { value: "accent", label: "Accent (Cyan)" },
];

export default function CertificationsEditor() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  const form = useForm<InsertCertification>({
    resolver: zodResolver(insertCertificationSchema),
    defaultValues: {
      name: "",
      shortName: "",
      description: "",
      icon: "fas fa-certificate",
      color: "primary",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCertification) => {
      const response = await apiRequest("POST", "/api/certifications", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Certification created",
        description: "Your certification has been created successfully.",
      });
      setShowEditor(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create certification.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertCertification }) => {
      const response = await apiRequest("PUT", `/api/certifications/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Certification updated",
        description: "Your certification has been updated successfully.",
      });
      setShowEditor(false);
      setEditingCert(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update certification.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/certifications/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Certification deleted",
        description: "The certification has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete certification.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCertification) => {
    if (editingCert) {
      updateMutation.mutate({ id: editingCert.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    form.reset({
      name: cert.name,
      shortName: cert.shortName,
      description: cert.description,
      icon: cert.icon,
      color: cert.color,
    });
    setShowEditor(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewCert = () => {
    setEditingCert(null);
    form.reset();
    setShowEditor(true);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "primary":
        return "from-primary/5 to-primary/10 text-primary";
      case "secondary":
        return "from-secondary/5 to-secondary/10 text-secondary";
      case "accent":
        return "from-accent/5 to-accent/10 text-accent";
      default:
        return "from-primary/5 to-primary/10 text-primary";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certifications</h2>
          <p className="text-gray-600">Manage your professional certifications</p>
        </div>
        <Button onClick={handleNewCert} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Certification
        </Button>
      </div>

      {showEditor && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingCert ? "Edit Certification" : "Create New Certification"}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingCert(null);
                  form.reset();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CISSP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Theme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Certified Information Systems Security Professional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="Brief description of the certification..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (Font Awesome class)</FormLabel>
                      <FormControl>
                        <Input placeholder="fas fa-certificate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditor(false);
                      setEditingCert(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="btn-primary"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingCert ? "Update Certification" : "Create Certification"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading certifications...</div>
        ) : certifications?.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No certifications found. Create your first certification!
          </div>
        ) : (
          certifications?.map((cert) => (
            <Card key={cert.id} className={`bg-gradient-to-br ${getColorClass(cert.color)} relative`}>
              <CardHeader className="text-center pb-4">
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleEdit(cert)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
                <Award className="h-8 w-8 mx-auto mb-4" />
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {cert.shortName}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm text-gray-600">{cert.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
