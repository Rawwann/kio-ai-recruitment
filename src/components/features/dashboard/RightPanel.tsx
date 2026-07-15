"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { UserCheck } from "lucide-react";
import { TIMELINE_EVENTS, SYSTEM_LOGS } from "@/lib/constants/dashboard/right-panel-data";
import { DashboardCalendar } from "./DashboardCalendar";

export function RightPanel() {
    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Calendar Section — functional: navigation, today highlight, event dots */}
            <Card className="border-none bg-transparent shadow-none">
                <CardContent className="p-0">
                    <DashboardCalendar />
                </CardContent>
            </Card>

            {/* Campaign Timeline */}
            <Card className="border-none bg-transparent shadow-none mt-2">
                <CardHeader className="flex flex-row justify-between items-center pb-4 px-0 pt-0">
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Campaign Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                    {TIMELINE_EVENTS.map((event, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 transition-colors hover:bg-slate-50">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${event.tagColor}`}>
                                    {event.date}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                    {event.time}
                                </span>
                            </div>
                            <h4 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                                {event.title}
                            </h4>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* System Logs */}
            <Card className="border-none bg-transparent shadow-none mt-2">
                <CardHeader className="flex flex-row justify-between items-center pb-4 px-0 pt-0">
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">System Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-4">
                    {SYSTEM_LOGS.map((log) => (
                        <div key={log.id} className="flex gap-3 group items-start cursor-pointer">
                            <div className="flex items-center justify-center shrink-0 w-9 h-9 rounded-full bg-[#f3e8ff] dark:bg-purple-900/30">
                                <span className="text-purple-600 font-bold text-sm">
                                    <UserCheck className="w-4 h-4 opacity-50" />
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight mb-0.5 flex items-center gap-1">
                                    <span className="leading-none shrink-0 border-[3.5px] border-transparent border-l-[#10b981] w-0 h-0 inline-block mr-0.5" style={{ borderLeftColor: log.id === 1 ? '#10b981' : log.id === 2 ? '#8b5cf6' : log.id === 3 ? '#f43f5e' : '#f59e0b' }} />
                                    {log.title} <span className="font-normal text-slate-500">{log.desc.substring(0, 25)}...</span>
                                </h4>
                                <p className="text-[11px] text-slate-400">
                                    {log.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}