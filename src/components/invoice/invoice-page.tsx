'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faCreditCard,
  faDollarSign,
  faDownload,
  faFileInvoiceDollar,
  faHome,
  faPrint,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { faBitcoin, faPaypal } from '@fortawesome/free-brands-svg-icons'
import { toast } from 'react-toastify'
import { invoiceData } from './data'
import { cn } from '@/lib/cn'
import { Breadcrumbs, ActionButton, Separator } from '@/components/breadcrumbs'
import { PaymentSuccessCard } from './payment-success-card'
import { InvoicePaymentPayload, PaymentAttemptSummary, PaymentMethod, PaymentType } from './payment-types'
import { StripePaymentForm } from './stripe-payment-form'
import { downloadInvoicePdf, printInvoicePdf } from './invoice-pdf'

function parseAmountToCents(value: string) {
  const normalized = value.replace(/[^0-9.]/g, '')
  const parsed = Number(normalized)

  if (!normalized || Number.isNaN(parsed) || parsed < 0) {
    return 0
  }

  return Math.round(parsed * 100)
}

function formatCurrency(amountCents: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountCents / 100)
}

const invoiceTotalCents = parseAmountToCents(invoiceData.total)
const remainingBalanceCents = parseAmountToCents(invoiceData.totalUnpaid)
const totalPaidCents = parseAmountToCents(invoiceData.totalPaid)

function PaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [paymentType, setPaymentType] = useState<PaymentType>('full')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card')
  const [partialAmount, setPartialAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [successfulAttempt, setSuccessfulAttempt] = useState<PaymentAttemptSummary | null>(null)

  useEffect(() => {
    if (!open) {
      setPaymentType('full')
      setPaymentMethod('credit_card')
      setPartialAmount('')
      setIsSubmitting(false)
      setCardComplete(false)
      setSuccessfulAttempt(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isSubmitting, onClose, open])

  const activeChooser =
    'rounded-2xl border-[#09afdf] shadow-[inset_0_0_0_1px_#09afdf,0_16px_40px_rgba(9,175,223,0.08)] bg-[linear-gradient(180deg,rgba(9,175,223,0.12)_0%,rgba(9,175,223,0.04)_100%)]'
  const selectedAmountCents = paymentType === 'full' ? remainingBalanceCents : parseAmountToCents(partialAmount)
  const amountIsValid =
    paymentType === 'full'
      ? remainingBalanceCents > 0
      : selectedAmountCents > 0 && selectedAmountCents <= remainingBalanceCents
  const partialAmountTooLarge = paymentType === 'partial' && selectedAmountCents > remainingBalanceCents
  const amountLabel = formatCurrency(selectedAmountCents)
  const stripeFormId = 'invoice-stripe-payment-form'

  const paymentPayload: InvoicePaymentPayload = {
    invoiceIdentifier: invoiceData.identifier,
    paymentSelection: paymentType === 'full' ? 'FULL' : 'PARTIAL',
    amountCents: selectedAmountCents,
    currency: 'USD',
    invoiceTotalCents,
    invoiceBalanceCents: remainingBalanceCents,
    clientName: invoiceData.client.name,
    clientFirm: invoiceData.client.firm,
    clientAddress: invoiceData.client.address,
    invoiceSnapshot: {
      ...invoiceData,
      totalCents: invoiceTotalCents,
      totalPaidCents,
      remainingBalanceCents,
      requestedAmountCents: selectedAmountCents,
      requestedPaymentMethod: paymentMethod,
    },
  }

  const closeModal = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 top-[74px] z-[1200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/[0.56] backdrop-blur-[3px]"
            onClick={closeModal}
            aria-label="Close payment modal"
            disabled={isSubmitting}
          />

          <div className="relative flex h-full items-start justify-center overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <motion.div
              initial={{ opacity: 0, y: -28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-[#dbe7ef] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            >
              <div className="flex items-center justify-between border-b border-[#e8eef2] px-5 py-4 sm:px-6">
                <h2 className="flex items-center gap-3 text-[22px] font-normal text-[#22313f] sm:text-[24px]">
                  <FontAwesomeIcon icon={successfulAttempt ? faCreditCard : faDollarSign} />
                  <span>{successfulAttempt ? 'Payment Complete' : 'Invoice Payment'}</span>
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#7e8b95] transition-colors hover:bg-[#f4f7f9] hover:text-[#253341] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xl" />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto">
                {successfulAttempt ? (
                  <div className="px-4 py-6 sm:px-6 sm:py-8">
                    <PaymentSuccessCard attempt={successfulAttempt} onClose={onClose} />
                  </div>
                ) : (
                  <div className="space-y-7 px-4 py-5 text-[#4d5b65] sm:px-6 sm:py-6">
                    <section className="overflow-hidden rounded-[22px] border border-[#e7eef3] bg-[#fbfcfd]">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-[14px]">
                          <thead className="bg-white text-[#62717d]">
                            <tr>
                              <th className="px-4 py-3">Hrs</th>
                              <th className="px-4 py-3">Item</th>
                              <th className="px-4 py-3 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceData.lineItems.map((item) => (
                              <tr key={item.category} className="border-t border-[#edf3f6]">
                                <td className="px-4 py-3">{item.hours}</td>
                                <td className="px-4 py-3">{item.category}</td>
                                <td className="px-4 py-3 text-right">${item.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="grid gap-2 border-t border-[#edf3f6] bg-white px-4 py-4 text-[13px] sm:grid-cols-3">
                        <div>
                          <div className="text-[#7a8994]">Invoice Total</div>
                          <div className="mt-1 font-semibold text-[#22313f]">{formatCurrency(invoiceTotalCents)}</div>
                        </div>
                        <div>
                          <div className="text-[#7a8994]">Already Paid</div>
                          <div className="mt-1 font-semibold text-[#22313f]">{formatCurrency(totalPaidCents)}</div>
                        </div>
                        <div>
                          <div className="text-[#7a8994]">Remaining Balance</div>
                          <div className="mt-1 font-semibold text-[#22313f]">{formatCurrency(remainingBalanceCents)}</div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <label className="mb-3 block text-[14px] font-medium text-[#34424e]">Payment Type</label>
                      <div className="grid gap-3 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setPaymentType('full')}
                          className={cn(
                            'rounded-2xl border border-[#dbe6ed] bg-white p-5 text-left transition-all hover:border-[#b8d9e6]',
                            paymentType === 'full' && activeChooser
                          )}
                        >
                          <div className="text-[15px] font-medium text-[#243340]">Full Balance Payment</div>
                          <div className="mt-2 text-[28px] font-light text-[#253341]">
                            {formatCurrency(remainingBalanceCents)}
                          </div>
                          <p className="mt-2 text-[13px] text-[#6b7a86]">Pays the remaining unpaid balance on this invoice.</p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentType('partial')}
                          className={cn(
                            'rounded-2xl border border-[#dbe6ed] bg-white p-5 text-left transition-all hover:border-[#b8d9e6]',
                            paymentType === 'partial' && activeChooser
                          )}
                        >
                          <div className="text-[15px] font-medium text-[#243340]">Partial Payment</div>
                          <div className="mt-3 flex items-center gap-2 text-[18px] text-[#253341]">
                            <span>$</span>
                            <input
                              value={partialAmount}
                              onChange={(event) => setPartialAmount(event.target.value)}
                              inputMode="decimal"
                              placeholder="250.00"
                              className="w-40 rounded-xl border border-[#cfe0e8] px-3 py-2 text-[16px] outline-none transition-colors focus:border-[#09afdf]"
                            />
                          </div>
                          <p className="mt-2 text-[13px] text-[#6b7a86]">Choose a custom amount up to the remaining balance.</p>
                        </button>
                      </div>
                      {partialAmountTooLarge ? (
                        <p className="mt-3 text-[13px] text-red-600">
                          Partial payments cannot exceed the remaining balance of {formatCurrency(remainingBalanceCents)}.
                        </p>
                      ) : null}
                    </section>

                    <section>
                      <label className="mb-3 block text-[14px] font-medium text-[#34424e]">Payment Method</label>
                      <div className="grid gap-3 md:grid-cols-3">
                        {[
                          {
                            key: 'credit_card',
                            label: 'Credit Card',
                            sublabel: 'Embedded Stripe checkout',
                            icon: faCreditCard,
                            color: '#34526b',
                          },
                          {
                            key: 'paypal',
                            label: 'PayPal',
                            sublabel: 'API endpoint scaffolded next',
                            icon: faPaypal,
                            color: '#179BD7',
                          },
                          {
                            key: 'bitcoin',
                            label: 'Bitcoin',
                            sublabel: 'Crypto flow queued next',
                            icon: faBitcoin,
                            color: '#F7931B',
                          },
                        ].map((option) => (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => setPaymentMethod(option.key as PaymentMethod)}
                            className={cn(
                              'rounded-2xl border border-[#dbe6ed] bg-white p-5 text-left transition-all hover:border-[#b8d9e6]',
                              paymentMethod === option.key && activeChooser
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <FontAwesomeIcon icon={option.icon} className="mt-1 text-[28px]" style={{ color: option.color }} />
                              <div>
                                <div className="text-[15px] font-medium text-[#243340]">{option.label}</div>
                                <div className="text-[13px] text-[#6b7a86]">{option.sublabel}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[24px] border border-[#e5edf2] bg-[#f9fbfc] p-5 sm:p-6">
                      {paymentMethod === 'credit_card' ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-[18px] font-medium text-[#243340]">Credit Card</h3>
                            <p className="mt-2 text-[13px] text-[#6f7f8b]">
                              Card processing is handled by Stripe directly inside this modal.
                            </p>
                          </div>

                          <StripePaymentForm
                            formId={stripeFormId}
                            payload={paymentPayload}
                            amountLabel={amountLabel}
                            active={paymentMethod === 'credit_card' && amountIsValid}
                            onSubmittingChange={setIsSubmitting}
                            onCompletionChange={setCardComplete}
                            onSuccess={setSuccessfulAttempt}
                          />
                        </div>
                      ) : null}

                      {paymentMethod === 'paypal' ? (
                        <div className="rounded-2xl border border-[#dbe6ed] bg-white px-5 py-5">
                          <h3 className="text-[18px] font-medium text-[#243340]">PayPal</h3>
                          <p className="mt-3 text-[13px] leading-6 text-[#6f7f8b]">
                            The database and API structure are being prepared to handle PayPal with the same payment-attempt tracking.
                            Stripe card payments are live first in this modal.
                          </p>
                        </div>
                      ) : null}

                      {paymentMethod === 'bitcoin' ? (
                        <div className="rounded-2xl border border-[#dbe6ed] bg-white px-5 py-5">
                          <h3 className="text-[18px] font-medium text-[#243340]">Bitcoin / Crypto</h3>
                          <p className="mt-3 text-[13px] leading-6 text-[#6f7f8b]">
                            The payment-attempt model and provider enum already leave room for crypto settlement. The wallet
                            address and blockchain confirmation flow are the next step after Stripe.
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white bg-white px-4 py-4 text-[13px] text-[#6f7f8b]">
                        <div>
                          <div>Total Due Now</div>
                          <div className="mt-1 text-[20px] font-semibold text-[#253341]">{amountLabel}</div>
                        </div>
                        <div className="text-right">
                          <div>Invoice</div>
                          <div className="mt-1 font-semibold text-[#253341]">#{invoiceData.identifier}</div>
                        </div>
                      </div>
                    </section>

                    <div className="flex flex-col-reverse gap-3 border-t border-[#e8eef2] pt-5 sm:flex-row sm:items-center sm:justify-end">
                      <ActionButton onClick={closeModal}>Close</ActionButton>

                      {paymentMethod === 'credit_card' ? (
                        <button
                          type="submit"
                          form={stripeFormId}
                          disabled={!amountIsValid || !cardComplete || isSubmitting}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#09afdf] bg-[#09afdf] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0898c3] disabled:cursor-not-allowed disabled:border-[#a2d8ea] disabled:bg-[#a2d8ea]"
                        >
                          <span>{isSubmitting ? 'Processing...' : `Pay ${amountLabel}`}</span>
                          <FontAwesomeIcon icon={faCreditCard} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toast.info('Stripe card payments are ready first. PayPal and Bitcoin are next.')}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.04)] px-5 py-3 text-[13px] font-medium text-[#44535d] transition-colors hover:bg-[rgba(0,0,0,0.08)]"
                        >
                          <span>Coming Next</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function InvoicePage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [pdfBusy, setPdfBusy] = useState<'download' | 'print' | null>(null)

  const handleDownload = async () => {
    if (pdfBusy) return
    setPdfBusy('download')
    try {
      await downloadInvoicePdf(invoiceData)
    } catch (error) {
      console.error('Failed to generate invoice PDF', error)
      toast.error('Could not generate the invoice PDF. Please try again.')
    } finally {
      setPdfBusy(null)
    }
  }

  const handlePrint = async () => {
    if (pdfBusy) return
    setPdfBusy('print')
    try {
      await printInvoicePdf(invoiceData)
    } catch (error) {
      console.error('Failed to print invoice PDF', error)
      toast.error('Could not open the invoice for printing. Please try again.')
    } finally {
      setPdfBusy(null)
    }
  }

  return (
    <div className="bg-white pb-16 pt-[74px] text-[#323232]">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <FontAwesomeIcon icon={faHome} className="text-[11px]" /> },
          { label: `Invoice #${invoiceData.identifier}` },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <div className="rounded border border-[#ececec] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] lg:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="flex items-center gap-3 text-[34px] font-normal leading-[1.15] text-[#2a2a2a]">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                <span>Client Invoice</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <ActionButton onClick={handleDownload}>
                {pdfBusy === 'download' ? 'Preparing…' : 'Download'} <FontAwesomeIcon icon={faDownload} />
              </ActionButton>
              <ActionButton onClick={handlePrint}>
                {pdfBusy === 'print' ? 'Preparing…' : 'Print'} <FontAwesomeIcon icon={faPrint} />
              </ActionButton>
            </div>
          </div>

          <Separator />

          <div id="invoice-container" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-[1fr_260px]">
              <div>
                <Image src="/images/mandala4_75.png" alt="CodeBuilder" width={75} height={75} />
                <address className="mt-4 not-italic text-[14px] leading-7 text-[#666]">
                  <strong>CodeBuilder Inc.</strong>
                  <br />
                  1211 22nd Ave NE
                  <br />
                  Minneapolis, MN 55418
                  <br />
                  <abbr title="Phone">P:</abbr> (612) 567-2633
                  <br />
                  E-mail:{' '}
                  <a href="mailto:info@codebuilder.us" className="text-[#09afdf]">
                    info@codebuilder.us
                  </a>
                </address>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[14px] leading-7 text-[#666]">
                  <strong>Invoice #{invoiceData.identifier}</strong>
                  <br />
                  Created At: {invoiceData.createdAt}
                  <br />
                  Due Date: {invoiceData.dueDate}
                </p>
                <h5 className="mt-4 text-[18px] font-normal text-[#444]">Bill To</h5>
                <p className="mt-2 whitespace-pre-line text-[14px] leading-7 text-[#666]">
                  <span>{invoiceData.client.name}</span>
                  <br />
                  {invoiceData.client.firm}
                  <br />
                  {invoiceData.client.address}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[13px] text-[#666] md:flex-row md:items-center md:justify-between">
              <p>
                <strong>Comments:</strong> N/A.
              </p>
              <button type="button" className="inline-flex items-center gap-2 text-[#09afdf] hover:underline">
                <FontAwesomeIcon icon={faClock} />
                <span>View Timesheet</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border border-[#e5e5e5] text-left text-[14px]">
                <thead className="bg-[#fafafa] text-[#555]">
                  <tr>
                    <th className="border border-[#e5e5e5] px-4 py-3">Description</th>
                    <th className="border border-[#e5e5e5] px-4 py-3">Price</th>
                    <th className="border border-[#e5e5e5] px-4 py-3">Hours</th>
                    <th className="border border-[#e5e5e5] px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.lineItems.map((item) => (
                    <tr key={item.category}>
                      <td className="border border-[#e5e5e5] px-4 py-4 text-[#666]">
                        <div className="text-[#09afdf]">{item.category}</div>
                        <small className="text-[12px] text-[#777]">{item.description}</small>
                      </td>
                      <td className="border border-[#e5e5e5] px-4 py-4">${item.rate}</td>
                      <td className="border border-[#e5e5e5] px-4 py-4">{item.hours}</td>
                      <td className="border border-[#e5e5e5] px-4 py-4">${item.total}</td>
                    </tr>
                  ))}
                  {[
                    ['Total Paid', `$${invoiceData.totalPaid}`],
                    ['Late Fees', '$0.00'],
                    ['Remaining Balance', `$${invoiceData.totalUnpaid}`],
                    ['Invoice Total', `$${invoiceData.total}`],
                  ].map(([label, value], index) => (
                    <tr key={label}>
                      <td colSpan={3} className="border border-[#e5e5e5] px-4 py-3 text-right font-medium text-[#555]">
                        {label}
                      </td>
                      <td
                        className={cn('border border-[#e5e5e5] px-4 py-3', index === 3 && 'font-semibold text-[#333]')}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="max-w-3xl text-[14px] leading-7 text-[#666]">
                If you have any questions concerning this invoice, please contact <strong>CodeBuilder, Inc.</strong>,
                tel: <strong>+1 (612) 567-2633</strong>, email: <strong>info@codebuilder.us</strong>
              </p>
              <div className="flex flex-col items-start gap-4 md:items-end">
                <Image
                  src="/images/payment.png"
                  alt="Payment methods"
                  width={220}
                  height={60}
                  className="h-auto w-[220px]"
                />
                <ActionButton onClick={() => setModalOpen(true)} variant="primary">
                  Make A Payment <FontAwesomeIcon icon={faCreditCard} />
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
