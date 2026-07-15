"use client";

import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import { NotificationBell } from "@/components/features/dashboard/NotificationBell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/layout/tabs";
import { RetroGrid } from "@/components/vendors/magicui/retro-grid";
import { GeneralInfoTab, TeamMembersTab, BillingTab, NotificationsTab, SecurityTab } from "@/components/features/company/tabs";
import { TabKey } from "@/types";

import { useCompanyProfilePage } from "@/hooks/company/useCompanyProfilePage";
import { MagicSearchBar } from "./CompanySearchBar";
import { CompanySidebar } from "./CompanySidebar";
import { TABS, TAB_LABELS } from "@/lib/constants/company/tab-config";

export function CompanyProfilePage() {
    // Stripe success redirect provides ?tab=billing&session_id=cs_xxx
    // Deep-links may also provide ?tab=billing to land directly on that tab.
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const initialTab = searchParams.get("tab");

    const {
        activeTab,
        setActiveTab,
        companyData,
        loading,
        localData,
        savedProfile,          // read-only snapshot of the last confirmed save
        isSelectingPlan,
        handleUpdateProfile,
        handleSyncSuccess,
        handleFormChange,
        handleLogoChange,
        handlePlanSwitch,
        handleSelectPlan,
        handleCancel,
        handleDeleteMember,
        handleInviteMember,
        handleDeletePaymentMethod,
        handleAddPaymentMethod,
    } = useCompanyProfilePage(sessionId, initialTab);

    return (
        <div className="bg-transparent min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Workspace Settings
                </h1>
                <div className="flex items-center gap-3">
                    <MagicSearchBar />
                    {/* Wrap in motion.div to keep the Framer scale effect */}
                    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                        <NotificationBell
                            buttonClassName={[
                                "w-9 h-9 rounded-lg border border-gray-200 bg-white/80",
                                "flex items-center justify-center",
                                "hover:border-purple-300 hover:bg-purple-50 transition-colors",
                                "text-gray-600",
                            ].join(" ")}
                            dotClassName="top-1.5 right-1.5 bg-purple-600 border-0 ring-2 ring-white"
                            iconClassName="size-4"
                        />
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-9">
                    <div className="relative rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <RetroGrid
                            className="opacity-30"
                            angle={65}
                            cellSize={50}
                            opacity={0.3}
                            lightLineColor="rgba(147,51,234,0.12)"
                        />

                        <div className="relative z-10">
                            <Tabs
                                value={activeTab}
                                onValueChange={(v) => setActiveTab(v as TabKey)}
                                className="w-full"
                            >
                                <div className="px-6 pt-5 border-b border-gray-100">
                                    <div className="overflow-x-auto lg:overflow-visible">
                                        <TabsList
                                            variant="line"
                                            className="min-w-max justify-start gap-0 bg-transparent p-0 h-auto lg:w-full lg:min-w-0"
                                        >
                                            {TABS.map((tab) => (
                                                <TabsTrigger
                                                    key={tab}
                                                    value={tab}
                                                    className="flex-none px-4 py-2.5 text-sm font-medium rounded-none data-[state=active]:text-purple-600 data-[state=active]:bg-transparent hover:text-purple-500 transition-colors lg:flex-1"
                                                >
                                                    {TAB_LABELS[tab]}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="px-10 pb-6 pt-2"
                                    >
                                        <TabsContent value="general">
                                            {/*
                                             * key changes exactly once — from "loading" to "ready"
                                             * — when the API fetch completes.  This remounts the
                                             * hook with the correct defaultValues from localData,
                                             * eliminating the need for a useEffect form.reset()
                                             * inside the hook (which caused circular state loops).
                                             */}
                                            <GeneralInfoTab
                                                key={loading ? "loading" : "ready"}
                                                data={localData}
                                                loading={loading}
                                                onSave={handleUpdateProfile}
                                                onCancel={handleCancel}
                                                onSyncSuccess={handleSyncSuccess}
                                                onChange={handleFormChange}
                                                onLogoChange={handleLogoChange}
                                            />
                                        </TabsContent>
                                        <TabsContent value="team">
                                            {activeTab === "team" && (
                                                <TeamMembersTab
                                                    members={companyData.team}
                                                    loading={loading}
                                                    onDeleteMember={handleDeleteMember}
                                                    onInviteMember={handleInviteMember}
                                                />
                                            )}
                                        </TabsContent>
                                        <TabsContent value="billing">
                                            {activeTab === "billing" && (
                                                <BillingTab
                                                    plan={companyData.billing.currentPlan}
                                                    paymentMethods={companyData.paymentMethods}
                                                    history={companyData.billing.history}
                                                    loading={loading}
                                                    hasSubscription={
                                                        companyData.billing.hasActiveSubscription ?? false
                                                    }
                                                    onSelectPlan={handleSelectPlan}
                                                    isSelectingPlan={isSelectingPlan}
                                                    onDeletePaymentMethod={handleDeletePaymentMethod}
                                                    onAddPaymentMethod={handleAddPaymentMethod}
                                                    onPlanSwitch={handlePlanSwitch}
                                                />
                                            )}
                                        </TabsContent>
                                        <TabsContent value="notifications">
                                            {activeTab === "notifications" && (
                                                <NotificationsTab
                                                    notifications={companyData.notifications}
                                                    loading={loading}
                                                />
                                            )}
                                        </TabsContent>
                                        <TabsContent value="security">
                                            {activeTab === "security" && <SecurityTab />}
                                        </TabsContent>
                                    </motion.div>
                                </AnimatePresence>
                            </Tabs>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-3">
                    {/* Sidebar reads from savedProfile (last confirmed save),
                        NOT from localData (live form state).
                        This prevents the sidebar updating while the user types. */}
                    <CompanySidebar
                        data={{
                            ...savedProfile,
                            billing: companyData.billing,
                            team: companyData.team,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
