"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/forms/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/overlays/dialog";
import { PaymentMethod } from "@/types";

// ──────────────────────────────────────────────────────────────────
// Add Card Form (inside a dialog)
// ──────────────────────────────────────────────────────────────────
export function AddCardDialog({
    open,
    onClose,
    onAdd,
}: {
    open: boolean;
    onClose: () => void;
    onAdd: (card: PaymentMethod) => void;
}) {
    const [number, setNumber] = useState("");
    const [holder, setHolder] = useState("");
    const [expiry, setExpiry] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!number || !holder || !expiry) return;
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 900));

        const last4 = number.replace(/\s/g, "").slice(-4);
        const newCard: PaymentMethod = {
            id: `pm-${Date.now()}`,
            last4,
            brand: "visa",
            expiry,
            isDefault: false,
            holderName: holder,
        };
        onAdd(newCard);
        toast.success("Card added successfully!");
        setSubmitting(false);
        onClose();
        setNumber("");
        setHolder("");
        setExpiry("");
    };

    const formatCardNumber = (val: string) =>
        val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

    const formatExpiry = (val: string) =>
        val.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="">
                    <DialogTitle className="flex items-center gap-2 text-gray-800">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <CreditCard className="size-4 text-purple-600" />
                        </div>
                        Add New Card
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Card Number</Label>
                        <Input
                            value={number}
                            onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            className="h-10 font-mono tracking-widest bg-purple-50/40 border-purple-100"
                            maxLength={19}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Cardholder Name</Label>
                        <Input
                            value={holder}
                            onChange={(e) => setHolder(e.target.value)}
                            placeholder="Full name on card"
                            className="h-10 bg-purple-50/40 border-purple-100"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                        <Input
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="h-10 bg-purple-50/40 border-purple-100"
                            maxLength={5}
                        />
                    </div>
                </div>
                <DialogFooter className="">
                    <Button variant="outline" onClick={onClose} className="h-9">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || !number || !holder || !expiry}
                        className="bg-purple-600 hover:bg-purple-700 text-white h-9"
                    >
                        {submitting ? "Adding..." : "Add Card"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}