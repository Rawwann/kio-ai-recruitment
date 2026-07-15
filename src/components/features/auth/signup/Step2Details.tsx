"use client";
import * as RHF from "react-hook-form";
import Link from "next/link";
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/forms/field";
import { Input } from "@/components/ui/forms/input";
import { PasswordInput } from "@/components/ui/forms/password-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/forms/radio-group";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/forms/label";
import { ITEM_VARIANTS } from "@/lib/constants/auth/animation-variants";

export default function Step2Details({ role }: { role: 'candidate' | 'recruiter' | null }) {
    const { useFormContext, Controller } = RHF as any;
    const { register, control, formState: { errors } } = useFormContext();

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {role === "candidate" && (
                    <motion.div
                        key="candidate-names"
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={ITEM_VARIANTS}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                        <Field>
                            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                            <Input id="firstName" placeholder="Rawan" className="bg-white/80" {...register("firstName")} />
                            {errors.firstName && <FieldError errors={[errors.firstName]} />}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                            <Input id="lastName" placeholder="Hany" className="bg-white/80" {...register("lastName")} />
                            {errors.lastName && <FieldError errors={[errors.lastName]} />}
                        </Field>
                    </motion.div>
                )}

                {role === "recruiter" && (
                    <motion.div
                        key="recruiter-company"
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={ITEM_VARIANTS}
                    >
                        <Field>
                            <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
                            <Input id="companyName" placeholder="Company Name" className="bg-white/80" {...register("companyName")} />
                            {errors.companyName && <FieldError errors={[errors.companyName]} />}
                        </Field>
                    </motion.div>
                )}

                <motion.div layout key="email-field">
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input id="email" type="email" placeholder="r@example.com" className="bg-white/80" {...register("email")} />
                        {errors.email && <FieldError errors={[errors.email]} />}
                    </Field>
                </motion.div>

                <motion.div layout key="phone-field">
                    <Field>
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>
                        <Input id="phone" type="tel" placeholder="+201552906411" className="bg-white/80" {...register("phone")} />
                        {errors.phone && <FieldError errors={[errors.phone]} />}
                    </Field>
                </motion.div>

                <motion.div layout key="password-field" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <PasswordInput id="password" placeholder="Rawan@123" className="bg-white/80" {...register("password")} />
                        {errors.password && <FieldError errors={[errors.password]} />}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="rePassword">Confirm Password</FieldLabel>
                        <PasswordInput id="rePassword" placeholder="Rawan@123" className="bg-white/80" {...register("rePassword")} />
                        {errors.rePassword && <FieldError errors={[errors.rePassword]} />}
                    </Field>
                </motion.div>

                {role === "candidate" && (
                    <motion.div
                        key="candidate-additional"
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={ITEM_VARIANTS}
                        className="space-y-4 pt-4"
                    >
                        <Field>
                            <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
                            <Input id="dateOfBirth" type="date" className="bg-white/80" {...register("dateOfBirth")} />
                            {errors.dateOfBirth && <FieldError errors={[errors.dateOfBirth]} />}
                        </Field>

                        <Field>
                            <FieldLabel>Gender</FieldLabel>
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }: { field: any }) => (
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-8">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" className="bg-white/80" />
                                            <Label htmlFor="male" className="font-medium cursor-pointer">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" className="bg-white/80" />
                                            <Label htmlFor="female" className="font-medium cursor-pointer">Female</Label>
                                        </div>
                                    </RadioGroup>
                                )}
                            />
                            {errors.gender && <FieldError errors={[errors.gender]} />}
                        </Field>
                    </motion.div>
                )}

                <motion.div layout key="terms-field" className="pt-2">
                    <div className="flex items-center gap-2">
                        <Controller
                            name="terms"
                            control={control}
                            render={({ field }: { field: { value: boolean; onChange: (v: boolean) => void } }) => (
                                <Checkbox
                                    id="terms"
                                    checked={field.value === true}
                                    onCheckedChange={(v) => field.onChange(v === true)}
                                    className="bg-white/80"
                                />
                            )}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                            <Label htmlFor="terms" className="text-sm font-medium leading-snug cursor-pointer text-purple-950/90">
                                I agree to the{" "}
                                <Link href="/terms-and-conditions" className="text-purple-700 underline underline-offset-2 hover:text-purple-900">
                                    Terms &amp; Conditions
                                </Link>
                            </Label>
                            {errors.terms && <FieldError errors={[errors.terms]} />}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
