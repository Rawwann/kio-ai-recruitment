"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Shield, Send, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/data-display/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/overlays/dialog";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { TeamMembersTabProps } from "@/types";
import { StatusBadge, getInitials } from "../TeamMemberStatusBadge";
import { useTeamMembersTab } from "@/hooks/company/useTeamMembersTab";

export function TeamMembersTab({ members, loading, onDeleteMember, onInviteMember }: TeamMembersTabProps) {
    const { dialog, inviteForm, isSending, handleInvite, handleDelete } = useTeamMembersTab(onDeleteMember, onInviteMember);

    if (loading) {
        return (
            <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    return (
        <div className="px-8 py-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Team Members</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{members.length} members in workspace</p>
                </div>
                <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-9 px-4 text-sm">
                            <UserPlus className="size-4" /> Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-gray-800">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <Mail className="size-4 text-purple-600" />
                                </div>
                                Invite a Team Member
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="invite-email">Email Address</Label>
                                <Input id="invite-email" type="email" value={inviteForm.email} onChange={(e) => inviteForm.setEmail(e.target.value)} placeholder="colleague@company.com" className="bg-purple-50/40 border-purple-100" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="invite-role" className="flex items-center gap-1.5"><Shield className="size-3.5 text-purple-500" /> Role / Position</Label>
                                <Input id="invite-role" value={inviteForm.role} onChange={(e) => inviteForm.setRole(e.target.value)} placeholder="e.g., Frontend Engineer" className="bg-purple-50/40 border-purple-100" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => dialog.setIsOpen(false)}>Cancel</Button>
                            <Button onClick={handleInvite} disabled={isSending || !inviteForm.email} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                <Send className="size-3.5" /> {isSending ? "Sending..." : "Send Invite"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80">
                            <TableHead className="py-3">Member</TableHead>
                            <TableHead className="py-3">Role</TableHead>
                            <TableHead className="py-3">Status</TableHead>
                            <TableHead className="py-3">Joined</TableHead>
                            <TableHead className="py-3 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence>
                            {members.map((member, index) => (
                                <motion.tr
                                    key={member.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors"
                                >
                                    <TableCell className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                {getInitials(member.name)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                                <p className="text-xs text-gray-400">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-sm text-gray-600">{member.role}</TableCell>
                                    <TableCell className="py-3"><StatusBadge status={member.status} /></TableCell>
                                    <TableCell className="py-3 text-xs text-gray-400">
                                        {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                    </TableCell>
                                    <TableCell className="py-3 text-right">
                                        <button onClick={() => handleDelete(member)} className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 className="size-4 mx-auto" />
                                        </button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}