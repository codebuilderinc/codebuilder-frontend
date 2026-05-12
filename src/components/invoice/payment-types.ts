export type PaymentType = 'full' | 'partial'
export type PaymentMethod = 'credit_card' | 'paypal' | 'bitcoin'

export interface InvoicePaymentPayload {
  invoiceIdentifier: string
  paymentSelection: 'FULL' | 'PARTIAL'
  amountCents: number
  currency: string
  invoiceTotalCents: number
  invoiceBalanceCents: number
  clientName: string
  clientFirm?: string
  clientAddress?: string
  invoiceSnapshot: Record<string, unknown>
}

export interface PaymentAttemptSummary {
  id: string
  invoiceIdentifier: string
  provider: 'STRIPE' | 'PAYPAL' | 'BITCOIN'
  method: 'CREDIT_CARD' | 'PAYPAL' | 'BITCOIN'
  selection: 'FULL' | 'PARTIAL'
  status: 'INITIATED' | 'PROCESSING' | 'REQUIRES_ACTION' | 'SUCCEEDED' | 'FAILED' | 'CANCELED'
  currency: string
  amountCents: number
  stripePaymentIntentId?: string | null
  stripeChargeId?: string | null
  receiptUrl?: string | null
  cardBrand?: string | null
  cardLast4?: string | null
  billingPostalCode?: string | null
  failureCode?: string | null
  failureMessage?: string | null
  finalizedAt?: string | null
}
