'use client'

import { useEffect, useState } from 'react'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faLock } from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/cn'
import { InvoicePaymentPayload, PaymentAttemptSummary } from './payment-types'

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000').replace(/\/$/, '')

interface CreateStripeIntentResponse {
  paymentAttemptId: string
  paymentIntentId: string
  clientSecret: string
}

interface FinalizeStripeAttemptResponse {
  paymentAttempt: PaymentAttemptSummary
}

interface StripePaymentFormProps {
  formId: string
  payload: InvoicePaymentPayload
  amountLabel: string
  active: boolean
  onSubmittingChange: (isSubmitting: boolean) => void
  onCompletionChange: (isComplete: boolean) => void
  onSuccess: (attempt: PaymentAttemptSummary) => void
}

interface StripeApiError {
  code?: string
  message?: string
  type?: string
  payment_intent?: {
    id?: string
  }
}

async function requestApi<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok || !body?.success) {
    throw new Error(body?.error?.message ?? body?.message ?? 'Unable to complete the payment request.')
  }

  return body.data as T
}

async function finalizeAttempt(
  paymentAttemptId: string,
  options: {
    paymentIntentId?: string
    error?: StripeApiError
  }
): Promise<PaymentAttemptSummary | null> {
  try {
    const data = await requestApi<FinalizeStripeAttemptResponse>(
      `/payments/stripe/attempts/${paymentAttemptId}/finalize`,
      {
        method: 'POST',
        body: JSON.stringify({
          paymentIntentId: options.paymentIntentId,
          errorCode: options.error?.code,
          errorMessage: options.error?.message,
          errorType: options.error?.type,
        }),
      }
    )

    return data.paymentAttempt
  } catch {
    return null
  }
}

function InnerStripePaymentForm({
  formId,
  payload,
  amountLabel,
  active,
  onSubmittingChange,
  onCompletionChange,
  onSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    onCompletionChange(false)
  }, [onCompletionChange])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!active) {
      return
    }

    if (!stripe || !elements) {
      toast.info('Stripe is still loading. Please try again in a moment.')
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      toast.error('The card form is not ready yet.')
      return
    }

    setIsSubmitting(true)
    onSubmittingChange(true)

    try {
      const intent = await requestApi<CreateStripeIntentResponse>('/payments/stripe/intents', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const confirmation = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (confirmation.error) {
        const finalizedAttempt = await finalizeAttempt(intent.paymentAttemptId, {
          paymentIntentId: confirmation.error.payment_intent?.id,
          error: confirmation.error,
        })

        toast.error(
          finalizedAttempt?.failureMessage ?? confirmation.error.message ?? 'Your payment could not be processed.'
        )
        return
      }

      if (!confirmation.paymentIntent?.id) {
        throw new Error('Stripe did not return a payment intent.')
      }

      const finalizedAttempt = await finalizeAttempt(intent.paymentAttemptId, {
        paymentIntentId: confirmation.paymentIntent.id,
      })

      if (!finalizedAttempt) {
        throw new Error('The payment completed, but the local confirmation step failed.')
      }

      if (finalizedAttempt.status !== 'SUCCEEDED') {
        toast.error(finalizedAttempt.failureMessage ?? 'Stripe did not mark the payment as successful.')
        return
      }

      toast.success(`Payment of ${amountLabel} processed successfully.`)
      onSuccess(finalizedAttempt)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Your payment could not be processed.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
      onSubmittingChange(false)
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div
        className={cn(
          'rounded-2xl border border-[#d6e6ef] bg-white px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition-colors',
          cardError && 'border-red-300'
        )}
      >
        <CardElement
          options={{
            hidePostalCode: false,
            iconStyle: 'solid',
            style: {
              base: {
                color: '#1f2937',
                fontFamily: 'Arial, Helvetica, sans-serif',
                fontSize: '15px',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#dc2626',
                iconColor: '#dc2626',
              },
            },
          }}
          onChange={(event) => {
            setCardError(event.error?.message ?? null)
            onCompletionChange(Boolean(event.complete) && !isSubmitting)
          }}
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#dcebf1] bg-[#f6fbfd] px-4 py-3 text-[13px] text-[#55707d]">
        <FontAwesomeIcon icon={faLock} className="mt-0.5 text-[#09afdf]" />
        <p>Card details are sent directly to Stripe. The card form includes billing ZIP or postal code collection.</p>
      </div>

      {cardError ? <p className="text-[13px] text-red-600">{cardError}</p> : null}
    </form>
  )
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const [configLoaded, setConfigLoaded] = useState(false)
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null)

  useEffect(() => {
    let isMounted = true
    async function loadConfig() {
      try {
        const res = await fetch(`${API_BASE_URL}/payments/stripe/config`)
        const body = await res.json().catch(() => null)
        if (res.ok && body?.success && body?.data?.publishableKey) {
          const promise = loadStripe(body.data.publishableKey as string)
          if (isMounted) setStripePromise(promise)
        } else {
          if (isMounted) setStripePromise(null)
        }
      } catch {
        if (isMounted) setStripePromise(null)
      } finally {
        if (isMounted) setConfigLoaded(true)
      }
    }
    loadConfig()
    return () => {
      isMounted = false
    }
  }, [])

  if (!configLoaded) {
    return (
      <div className="rounded-2xl border border-[#d6e6ef] bg-white px-4 py-4 text-[14px] text-[#55707d]">
        Loading Stripe…
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-[14px] text-amber-900">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 text-[15px]" />
          <div>
            <p className="font-medium">Stripe publishable key missing</p>
            <p className="mt-1 text-[13px] text-amber-800">
              Configure Stripe in the API by setting <span className="font-mono">STRIPE_PUBLISHABLE_KEY</span> and{' '}
              <span className="font-mono">STRIPE_SECRET_KEY</span> in the backend environment.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <InnerStripePaymentForm {...props} />
    </Elements>
  )
}
