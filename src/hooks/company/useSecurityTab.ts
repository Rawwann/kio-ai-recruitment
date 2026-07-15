import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { apiFetch } from "@/lib/api/apiClient";

export function useSecurityTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSaving(false);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated successfully");
    };

    const handleDeleteWorkspace = async () => {
        if (window.confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
            toast.loading("Deleting workspace...", { id: "delete-workspace" });
            try {
                // Call the actual backend endpoint
                await apiFetch("/api/users/workspace/delete/", {
                    method: "DELETE",
                });
                
                toast.success("Workspace deleted successfully", { id: "delete-workspace" });
                
                // Sign out globally and redirect to /login
                setTimeout(() => {
                    signOut({ callbackUrl: "/login" });
                }, 1000);
            } catch (error: any) {
                // Do NOT try to render the response body (error.message might be HTML if the backend fails catastrophically)
                toast.error("Failed to delete workspace", { id: "delete-workspace" });
            }
        }
    };

    const handleLogoutSession = () => {
        toast.success("Session logged out");
    };

    const isFormValid = !saving && currentPassword && newPassword && confirmPassword && (newPassword === confirmPassword);

    return {
        passwords: { currentPassword, newPassword, confirmPassword },
        setters: { setCurrentPassword, setNewPassword, setConfirmPassword },
        saving,
        isFormValid,
        handleUpdatePassword,
        handleDeleteWorkspace,
        handleLogoutSession
    };
}