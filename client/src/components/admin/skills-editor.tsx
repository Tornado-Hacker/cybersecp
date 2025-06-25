import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertSkillSchema } from "@shared/schema";
import type { Skill, InsertSkill } from "@shared/schema";
import { Plus, Edit, Trash2, X, Shield, Network, Code, Settings } from "lucide-react";

const iconOptions = [
  { value: "fas fa-shield-alt", label: "Shield", component: Shield },
  { value: "fas fa-network-wired", label: "Network", component: Network },
  { value: "fas fa-code", label: "Code", component: Code },
  { value: "fas fa-cogs", label: "Settings", component: Settings },
];

export default function SkillsEditor() {
  const [showEditor, setShowEditor] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [itemInput, setItemInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const form = useForm<InsertSkill>({
    resolver: zodResolver(insertSkillSchema),
    defaultValues: {
      category: "",
      name: "",
      icon: "",
      items: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      const response = await apiRequest("POST", "/api/skills", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Skill created",
        description: "Your skill has been created successfully.",
      });
      setShowEditor(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create skill.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertSkill }) => {
      const response = await apiRequest("PUT", `/api/skills/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Skill updated",
        description: "Your skill has been updated successfully.",
      });
      setShowEditor(false);
      setEditingSkill(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update skill.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/skills/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Skill deleted",
        description: "The skill has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSkill) => {
    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    form.reset({
      category: skill.category,
      name: skill.name,
      icon: skill.icon,
      items: skill.items,
    });
    setShowEditor(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewSkill = () => {
    setEditingSkill(null);
    form.reset();
    setShowEditor(true);
  };

  const addItem = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && itemInput.trim()) {
      e.preventDefault();
      const currentItems = form.getValues("items");
      if (!currentItems.includes(itemInput.trim())) {
        form.setValue("items", [...currentItems, itemInput.trim()]);
      }
      setItemInput("");
    }
  };

  const removeItem = (itemToRemove: string) => {
    const currentItems = form.getValues("items");
    form.setValue("items", currentItems.filter(item => item !== itemToRemove));
  };

  const getIconComponent = (iconValue: string) => {
    const option = iconOptions.find(opt => opt.value === iconValue);
    return option ? option.component : Shield;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
          <p className="text-gray-600">Manage your technical skills and expertise</p>
        </div>
        <Button onClick={handleNewSkill} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Skill
        </Button>
      </div>

      {showEditor && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {editingSkill ? "Edit Skill" : "Create New Skill"}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setShowEditor(false);
                  setEditingSkill(null);
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Security Analysis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Security Analysis" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {iconOptions.map((option) => {
                            const IconComponent = option.component;
                            return (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                  <IconComponent className="h-4 w-4 mr-2" />
                                  {option.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Items
                  </label>
                  <Input
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    onKeyDown={addItem}
                    placeholder="Type skill item and press Enter"
                    className="mb-2"
                  />
                  <div className="space-y-2">
                    {form.watch("items").map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditor(false);
                      setEditingSkill(null);
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
                    {editingSkill ? "Update Skill" : "Create Skill"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">Loading skills...</div>
        ) : skills?.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No skills found. Create your first skill!
          </div>
        ) : (
          skills?.map((skill) => {
            const IconComponent = getIconComponent(skill.icon);
            return (
              <Card key={skill.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IconComponent className="h-6 w-6 text-primary mr-3" />
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(skill.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {skill.items.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
