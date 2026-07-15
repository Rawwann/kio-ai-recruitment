"use client"

import { FaEnvelope, FaLock, FaShieldAlt, FaStar } from "react-icons/fa"

function FeatureItem({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/10 text-purple-800">{icon}</div>
            <span className="text-sm font-medium text-slate-700">{children}</span>
        </div>
    )
}

export function InfoPanel() {
    return (
        <div className="relative flex flex-col justify-between bg-purple-50 p-10 md:p-12">
            <div className="relative">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-purple-600/10 text-purple-800">
                    <FaLock className="h-12 w-12" />
                </div>
                <div className="absolute -top-6 -left-6 flex items-center justify-center rounded-full bg-white/80 p-2 shadow-sm">
                    <FaShieldAlt className="h-5 w-5 text-purple-800" />
                </div>
                <div className="absolute -top-10 right-10 flex items-center justify-center rounded-full bg-white/80 p-2 shadow-sm">
                    <FaEnvelope className="h-5 w-5 text-purple-800" />
                </div>
                <div className="absolute bottom-10 right-0 flex items-center justify-center rounded-full bg-white/80 p-2 shadow-sm">
                    <FaStar className="h-5 w-5 text-purple-800" />
                </div>
                <h1 className="mt-10 text-3xl font-semibold text-slate-900 text-center">Reset Your Password</h1>
                <p className="mt-3 text-center text-sm text-slate-600">
                    Don’t worry, it happens to the best of us. We'll help you get back into your account in no time.
                </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 text-sm text-slate-700">
                <FeatureItem icon={<FaEnvelope className="h-4 w-4" />}>Email Verification</FeatureItem>
                <FeatureItem icon={<FaShieldAlt className="h-4 w-4" />}>Secure Reset</FeatureItem>
                <FeatureItem icon={<FaLock className="h-4 w-4" />}>Encrypted</FeatureItem>
            </div>
        </div>
    )
}


