import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const changeUsernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
type ChangeUsernameForm = z.infer<typeof changeUsernameSchema>;

export default function Settings() {
  const { toast } = useToast();

  const passwordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const usernameForm = useForm<ChangeUsernameForm>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordForm) => {
      const res = await apiRequest("/api/auth/change-password", "POST", data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to change password");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      passwordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const changeUsernameMutation = useMutation({
    mutationFn: async (data: ChangeUsernameForm) => {
      const res = await apiRequest("/api/auth/change-username", "POST", data);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to change username");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Username changed successfully",
      });
      usernameForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onPasswordSubmit = (data: ChangePasswordForm) => {
    changePasswordMutation.mutate(data);
  };

  const onUsernameSubmit = (data: ChangeUsernameForm) => {
    changeUsernameMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-600">Manage your account settings and security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Username</CardTitle>
          <CardDescription>
            Update your admin username for login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
              <FormField
                control={usernameForm.control}
                name="newUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={changeUsernameMutation.isPending}
                className="w-full"
              >
                {changeUsernameMutation.isPending ? "Changing..." : "Change Username"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={changePasswordMutation.isPending}
                className="w-full"
              >
                {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}