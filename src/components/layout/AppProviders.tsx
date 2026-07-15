"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { ProjectProvider } from '@/lib/contexts/ProjectContext'

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ProjectProvider>
                {children}
            </ProjectProvider>
        </SessionProvider>
    )
}
