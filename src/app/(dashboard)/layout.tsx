import React from 'react';
import { Sidebar1 } from '@/components/layout/Sidebar';
import { CompanyProvider } from '@/lib/contexts/CompanyContext';
import { NavigationRegistrar } from '@/components/system/NavigationRegistrar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <CompanyProvider>
            <NavigationRegistrar />
            <div className="h-dvh w-full flex overflow-hidden">
                <Sidebar1>
                    <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-8">
                        {children}
                    </main>
                </Sidebar1>
            </div>
        </CompanyProvider>
    );
}
