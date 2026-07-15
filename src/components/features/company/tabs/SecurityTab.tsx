"use client";

import React from "react";
import { KeyRound, Laptop, AlertTriangle, Loader2, Smartphone } from "lucide-react";
import { useSecurityTab } from "@/hooks/company/useSecurityTab";

export function SecurityTab() {
    const {
        passwords, setters, saving, isFormValid,
        handleUpdatePassword, handleDeleteWorkspace, handleLogoutSession
    } = useSecurityTab();

    return (
        <div className="px-8 py-6 space-y-8">
            {/* Login Credentials Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Login Credentials</h3>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                            <KeyRound className="size-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Change Password</p>
                            <p className="text-xs text-gray-500">Update your account password to keep it secure.</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Current Password</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setters.setCurrentPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setters.setNewPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setters.setConfirmPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="mt-2 flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-xs font-semibold text-white shadow-sm disabled:opacity-50 transition-colors kio-btn-ai-primary"
                        >
                            {saving && <Loader2 className="size-3.5 animate-spin" />}
                            Update Password
                        </button>
                    </form>
                </div>
            </div>

            {/* Active Sessions Section */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Active Sessions</h3>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                    <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-900">Manage Sessions</p>
                        <p className="text-xs text-gray-500">Manage and log out your active sessions on other devices.</p>
                    </div>

                    {/* Current Session */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="flex items-center gap-3">
                            <Laptop className="size-8 text-gray-400 p-1.5 rounded-md bg-white border border-gray-200" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                                <p className="text-xs text-gray-500 mt-0.5">Your current session</p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            Active Now
                        </span>
                    </div>

                    {/* Example Other Session */}
                    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 transition-colors hover:border-purple-200 hover:bg-purple-50/30">
                        <div className="flex items-center gap-3">
                            <Smartphone className="size-8 text-gray-400 p-1.5 rounded-md bg-white border border-gray-200" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Safari on iPhone 14</p>
                                <p className="text-xs text-gray-500 mt-0.5">Last active yesterday</p>
                            </div>
                        </div>
                        <button onClick={handleLogoutSession} className="h-8 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-50 bg-red-50/50 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <AlertTriangle className="size-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-800">Danger Zone</p>
                        <p className="text-xs text-red-600/80">Permanently delete your workspace.</p>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-red-100 pt-5">
                    <p className="text-xs leading-relaxed text-red-700 max-w-2xl">
                        Once you delete a workspace, there is no going back. Please be certain.
                    </p>
                    <button onClick={handleDeleteWorkspace} className="flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        Delete Workspace
                    </button>
                </div>
            </div>
        </div>
    );
}