'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faCheckCircle, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
import { PaymentAttemptSummary } from './payment-types'

function formatCurrency(amountCents: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountCents / 100)
}

function formatPaymentMethod(attempt: PaymentAttemptSummary) {
  if (attempt.cardBrand && attempt.cardLast4) {
    return `${attempt.cardBrand.toUpperCase()} •••• ${attempt.cardLast4}`
  }

  return 'Credit Card'
}

export function PaymentSuccessCard({
  attempt,
  onClose,
}: {
  attempt: PaymentAttemptSummary
  onClose: () => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.58 },
      })
    }, 900)

    return () => window.clearTimeout(timer)
  }, [attempt.id])

  return (
    <div className="mx-auto w-full max-w-[430px] rounded-[28px] bg-[#132033] p-6 text-white shadow-[0_28px_80px_rgba(10,25,47,0.34)] md:p-8">
      <div className="flex justify-center">
        <div className="relative flex h-[124px] w-[124px] items-center justify-center">
          <motion.svg viewBox="0 0 100 100" className="h-[124px] w-[124px]">
            <circle cx="50" cy="50" r="40" fill="#1de9a6" opacity="0.12" />
            <motion.circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="#1de9a6"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.path
              d="M38 52l8 8 18-18"
              fill="none"
              stroke="#1de9a6"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, delay: 0.78, ease: 'easeOut' }}
            />
          </motion.svg>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h3 className="text-[28px] font-semibold tracking-normal text-white">Payment Successful!</h3>
        <p className="mt-3 text-[14px] leading-6 text-[#bfd0e0]">
          Your invoice payment was processed successfully and recorded against the remaining balance.
        </p>
      </div>

      <div className="mt-6 rounded-[20px] border border-white/8 bg-white/6 p-5 text-left">
        {[
          ['Amount', formatCurrency(attempt.amountCents, attempt.currency)],
          ['Transaction ID', attempt.stripeChargeId ?? attempt.stripePaymentIntentId ?? attempt.id],
          ['Payment Method', formatPaymentMethod(attempt)],
          ['Invoice', attempt.invoiceIdentifier],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 py-2 text-[14px]">
            <span className="text-[#9bb0c5]">{label}</span>
            <span className="text-right font-medium text-white">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {attempt.receiptUrl ? (
          <a
            href={attempt.receiptUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#233851] bg-[#1a2c45] px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#223854]"
          >
            <span>Download Receipt</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[12px]" />
          </a>
        ) : (
          <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#233851] bg-[#1a2c45] px-4 py-3 text-[13px] font-medium text-[#d4e3ef]">
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-[12px]" />
            <span>Receipt available in Stripe</span>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1de9a6]/30 bg-[#1de9a6] px-4 py-3 text-[13px] font-semibold text-[#032b1b] transition-transform duration-200 hover:translate-y-[-1px]"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="text-[13px]" />
          <span>Done</span>
        </button>
      </div>
    </div>
  )
}
