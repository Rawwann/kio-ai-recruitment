"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Bot, Bell, Megaphone } from "lucide-react";
import { Switch } from "@/components/ui/forms/switch";
import { Label } from "@/components/ui/forms/label";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Button } from "@/components/ui/forms/button";
import { NotificationsTabProps, NotificationRow } from "@/types";
import { toast } from "sonner";

import { EMAIL_NOTIFICATIONS, AI_NOTIFICATIONS } from "@/lib/constants/company/notification-rows";

function NotificationSection({
    title,
    icon: Icon,
    rows,
    settings,
    onChange,
    iconBg,
    iconColor,
    delay,
}: {
    title: string;
    icon: React.ElementType;
    rows: NotificationRow[];
    settings: Record<string, boolean>;
    onChange: (key: string, value: boolean) => void;
    iconBg: string;
    iconColor: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 200 }}
            className="rounded-2xl border border-gray-100 overflow-hidden"
        >
            <div className="flex items-center gap-3 px-5 py-4 bg-gray-50/60 border-b border-gray-100">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            </div>

            <div className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                    <motion.div
                        key={row.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: delay + i * 0.05 }}
                        className="flex items-center justify-between px-5 py-4 hover:bg-purple-50/20 transition-colors"
                    >
                        <div className="flex-1 mr-4">
                            <Label htmlFor={`notif-${row.key}`} className="text-sm font-medium text-gray-800 cursor-pointer">
                                {row.label}
                            </Label>
                            <p className="text-xs text-gray-500 mt-0.5">{row.description}</p>
                        </div>
                        <Switch
                            id={`notif-${row.key}`}
                            checked={settings[row.key] ?? false}
                            onCheckedChange={(checked) => onChange(row.key, checked)}
                            className="data-[state=checked]:bg-purple-600"
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export function NotificationsTab({ notifications, loading }: NotificationsTabProps) {
    const [emailSettings, setEmailSettings] = useState(notifications.email as Record<string, boolean>);
    const [aiSettings, setAiSettings] = useState(notifications.ai as Record<string, boolean>);

    const handleChange = (group: "email" | "ai", key: string, value: boolean) => {
        if (group === "email") setEmailSettings((prev) => ({ ...prev, [key]: value }));
        else setAiSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        toast.success("Notification preferences saved!", {
            description: "Your settings have been updated successfully.",
            icon: <Bell className="size-4 text-purple-600" />,
        });
    };

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-2">
                <Megaphone className="size-4 text-purple-500" />
                <p className="text-sm text-gray-500">Manage how and when you receive alerts.</p>
            </div>

            <NotificationSection
                title="Email Notifications"
                icon={Mail}
                rows={EMAIL_NOTIFICATIONS}
                settings={emailSettings}
                onChange={(key, val) => handleChange("email", key, val)}
                iconBg="bg-purple-100"
                iconColor="text-purple-600"
                delay={0.05}
            />

            <NotificationSection
                title="AI-Powered Alerts"
                icon={Bot}
                rows={AI_NOTIFICATIONS}
                settings={aiSettings}
                onChange={(key, val) => handleChange("ai", key, val)}
                iconBg="bg-violet-100"
                iconColor="text-violet-600"
                delay={0.15}
            />

            <div className="flex justify-end pt-2">
                <Button onClick={handleSave} className="kio-btn-ai-primary h-9 px-6 shadow-md">
                    Save Preferences
                </Button>
            </div>
        </div>
    );
}