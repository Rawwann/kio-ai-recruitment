import { useState } from "react";
import { toast } from "sonner";
import { TeamMember } from "@/types";

export function useTeamMembersTab(onDeleteMember: (id: string) => void, onInviteMember?: (email: string, role: string) => void) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setIsSending(true);
        await new Promise((r) => setTimeout(r, 1200));

        if (onInviteMember) {
            onInviteMember(inviteEmail, inviteRole);
        }

        toast.success(`Invite sent to ${inviteEmail}!`, {
            description: `Role: ${inviteRole || "Member"}`,
        });

        setIsSending(false);
        setDialogOpen(false);
        setInviteEmail("");
        setInviteRole("");
    };

    const handleDelete = (member: TeamMember) => {
        toast.warning(`Remove ${member.name}?`, {
            description: "This will remove them from your workspace.",
            action: {
                label: "Confirm",
                onClick: () => {
                    onDeleteMember(member.id);
                    toast.success(`${member.name} has been removed.`);
                },
            },
            cancel: { label: "Cancel", onClick: () => { } },
        });
    };

    return {
        dialog: { isOpen: dialogOpen, setIsOpen: setDialogOpen },
        inviteForm: { email: inviteEmail, setEmail: setInviteEmail, role: inviteRole, setRole: setInviteRole },
        isSending,
        handleInvite,
        handleDelete,
    };
}