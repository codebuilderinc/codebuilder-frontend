'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
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
import { invoiceData } from './data'
import { cn } from '@/lib/cn'
import { Breadcrumbs, ActionButton, Separator } from '@/components/breadcrumbs'

function PaymentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full')
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'bitcoin'>('credit_card')
  const [partialAmount, setPartialAmount] = useState('0.00')

  useEffect(() => {
    if (!open) {
      setPaymentType('full')
      setPaymentMethod('credit_card')
      setPartialAmount('0.00')
    }
  }, [open])

  if (!open) return null

  const activeChooser =
    'border-[#09afdf] shadow-[inset_0_0_0_1px_#09afdf] bg-[linear-gradient(180deg,rgba(9,175,223,0.08)_0%,rgba(9,175,223,0.03)_100%)]'

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/[0.54] backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close payment modal"
      />
      <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] relative z-10 max-h-[90vh] w-full max-w-3xl overflow-auto">
        <div className="flex items-center justify-between border-b border-[#ececec] px-6 py-4">
          <h2 className="flex items-center gap-3 text-[24px] font-normal text-[#2f2f2f]">
            <FontAwesomeIcon icon={faDollarSign} />
            <span>Invoice Payment</span>
          </h2>
          <button type="button" onClick={onClose} className="text-[#888] hover:text-[#111]">
            <FontAwesomeIcon icon={faXmark} className="text-xl" />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6 text-[#555]">
          <table className="w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#ececec] text-[#666]">
                <th className="py-2">Hrs</th>
                <th className="py-2">Item</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.lineItems.map((item) => (
                <tr key={item.category} className="border-b border-[#f2f2f2]">
                  <td className="py-3">{item.hours}</td>
                  <td className="py-3">{item.category}</td>
                  <td className="py-3 text-right">${item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <section>
            <label className="mb-3 block text-[14px] font-medium text-[#444]">Payment Type</label>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentType('full')}
                className={cn(
                  'rounded-[3px] border p-4 text-left',
                  paymentType === 'full' ? activeChooser : 'border-[#e4e4e4]'
                )}
              >
                <div className="text-[15px] font-medium text-[#2f2f2f]">Full Payment</div>
                <div className="mt-1 text-[26px] font-light text-[#555]">${invoiceData.total} USD</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('partial')}
                className={cn(
                  'rounded-[3px] border p-4 text-left',
                  paymentType === 'partial' ? activeChooser : 'border-[#e4e4e4]'
                )}
              >
                <div className="text-[15px] font-medium text-[#2f2f2f]">Partial Payment</div>
                <div className="mt-3 flex items-center gap-2 text-[18px]">
                  <span>$</span>
                  <input
                    value={partialAmount}
                    onChange={(event) => setPartialAmount(event.target.value)}
                    className="w-32 rounded-[3px] border border-[#d5d5d5] px-3 py-2 outline-none"
                  />
                </div>
              </button>
            </div>
          </section>

          <section>
            <label className="mb-3 block text-[14px] font-medium text-[#444]">Payment Method</label>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { key: 'credit_card', label: 'Credit-Card', sublabel: 'Stripe.com', icon: faCreditCard, color: '#555' },
                { key: 'paypal', label: 'PayPal', sublabel: 'PayPal.com', icon: faPaypal, color: '#179BD7' },
                { key: 'bitcoin', label: 'Bitcoin', sublabel: 'Unique Address', icon: faBitcoin, color: '#F7931B' },
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setPaymentMethod(option.key as typeof paymentMethod)}
                  className={cn(
                    'rounded-[3px] border p-4 text-left',
                    paymentMethod === option.key ? activeChooser : 'border-[#e4e4e4]'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={option.icon} className="mt-1 text-[30px]" style={{ color: option.color }} />
                    <div>
                      <div className="text-[15px] font-medium text-[#2f2f2f]">{option.label}</div>
                      <div className="text-[13px] text-[#777]">{option.sublabel}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[3px] border border-[#ececec] bg-[#fafafa] p-5">
            {paymentMethod === 'credit_card' ? (
              <>
                <h3 className="text-[18px] font-normal text-[#666]">Credit Card</h3>
                <p className="mt-3 text-[13px] text-[#777]">Payment processed by Stripe.com.</p>
                <div className="mt-4 rounded-[3px] border border-[#dfdfdf] bg-white px-4 py-3 text-[14px] text-[#777]">
                  Card element placeholder
                </div>
              </>
            ) : null}

            {paymentMethod === 'paypal' ? (
              <>
                <h3 className="text-[18px] font-normal text-[#666]">PayPal Checkout</h3>
                <p className="mt-3 text-[13px] text-[#777]">You will be redirected to PayPal.com for checkout.</p>
              </>
            ) : null}

            {paymentMethod === 'bitcoin' ? (
              <div className="grid gap-4 md:grid-cols-[140px_1fr] md:items-center">
                <div className="flex justify-center">
                  <div className="flex h-[120px] w-[120px] items-center justify-center rounded-[3px] border border-[#d9d9d9] bg-white text-[12px] text-[#999]">
                    QR Code
                  </div>
                </div>
                <div>
                  <h3 className="text-[18px] font-normal text-[#666]">Bitcoin Address</h3>
                  <p className="mt-3 break-all rounded-[3px] border border-[#dfdfdf] bg-white px-4 py-3 text-[13px] text-[#777]">
                    bc1qcodebuilderlegacyinvoicepaymentaddressmocked
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-4 text-[13px] text-[#777]">
              <div>Total:</div>
              <div className="text-[16px] font-semibold text-[#555]">
                ${paymentType === 'full' ? invoiceData.total : partialAmount || '0.00'} USD
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <ActionButton onClick={onClose}>Close</ActionButton>
            <ActionButton variant="primary">Continue</ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InvoicePage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="text-[#323232] bg-[#fff] pb-16">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/', icon: <FontAwesomeIcon icon={faHome} className="text-[11px]" /> },
          { label: `Invoice #${invoiceData.identifier}` },
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <div className="border border-[#ececec] rounded bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)] p-6 lg:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-[34px] font-normal leading-[1.15] text-[#2a2a2a] flex items-center gap-3">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                <span>Client Invoice</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <ActionButton>
                Download <FontAwesomeIcon icon={faDownload} />
              </ActionButton>
              <ActionButton>
                Print <FontAwesomeIcon icon={faPrint} />
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
