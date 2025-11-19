import React, { useState, useEffect } from 'react'
import axios from '../api'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePublishable = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishable ? loadStripe(stripePublishable) : null

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1e293b',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#94a3b8'
      }
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444'
    }
  },
  hidePostalCode: true
}

function CheckoutForm({ clientSecret, txId, onSuccess }){
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return
    
    setLoading(true)
    setError('')
    
    const card = elements.getElement(CardElement)
    const res = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card }
    })
    
    if (res.error) {
      setError(res.error.message)
      setLoading(false)
    } else if (res.paymentIntent && res.paymentIntent.status === 'succeeded') {
      setSuccess(true)
      setLoading(false)
      if (onSuccess) onSuccess(res.paymentIntent)
    } else {
      setError('Payment status: ' + (res.paymentIntent?.status || 'unknown'))
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mt-6 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 text-lg">Payment Successful!</h3>
            <p className="text-sm text-emerald-700">Your transaction has been completed</p>
          </div>
        </div>
        {txId && <p className="text-sm text-emerald-600 mt-2">Transaction ID: {txId}</p>}
        <p className="text-sm text-emerald-600 mt-2">The backend webhook will finalize your transaction shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handlePay} className="mt-6">
      <div className="card">
        <label className="block text-sm font-medium text-slate-700 mb-3">Card Details</label>
        <div className="p-4 border-2 border-slate-200 rounded-lg focus-within:border-sky-500 transition-colors">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button 
          type="submit"
          disabled={!stripe || loading} 
          className="mt-6 w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Complete Payment
            </>
          )}
        </button>

        {txId && <p className="text-sm text-slate-500 mt-3 text-center">Transaction: {txId}</p>}
      </div>
    </form>
  )
}

export default function Payments(){
  const [amount, setAmount] = useState('50')
  const [clientSecret, setClientSecret] = useState(null)
  const [txId, setTxId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if (!stripePublishable) {
      setError('Stripe publishable key not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.')
    }
  }, [])

  const createIntent = async ()=>{
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setLoading(true)
    setError('')
    
    try{
      const res = await axios.post('/api/payments/create-intent', { amount: parseFloat(amount) })
      setClientSecret(res.data.clientSecret)
      setTxId(res.data.txId)
    }catch(err){
      setError(err.response?.data?.msg || err.message || 'Failed to create payment intent')
    } finally {
      setLoading(false)
    }
  }

  const resetPayment = () => {
    setClientSecret(null)
    setTxId(null)
    setAmount('50')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-12">
      <div className="container-max max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Payments</h1>
          <p className="text-slate-600">Securely process your medical service payments</p>
        </div>

        {/* Payment Form */}
        <div className="card">
          {!clientSecret ? (
            <>
              <div className="flex items-center gap-3 mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                <svg className="w-6 h-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-sky-900">Secure Payment</h3>
                  <p className="text-sm text-sky-700">Your payment information is encrypted and secure</p>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">$</span>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-lg"
                    placeholder="0.00"
                    value={amount}
                    onChange={e=>setAmount(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">Enter the consultation or service fee amount</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                onClick={createIntent}
                disabled={loading || !stripePublishable}
                className="w-full px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Continue to Payment
                  </>
                )}
              </button>

              {/* Test Card Info */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-900 text-sm mb-2">Test Mode</h4>
                <p className="text-xs text-amber-700 mb-2">Use test card: <code className="bg-amber-100 px-1 py-0.5 rounded">4242 4242 4242 4242</code></p>
                <p className="text-xs text-amber-700">Exp: Any future date | CVC: Any 3 digits</p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">${amount}</h3>
                  <p className="text-sm text-slate-600">Payment amount</p>
                </div>
                <button 
                  onClick={resetPayment}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Change amount
                </button>
              </div>

              {stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm clientSecret={clientSecret} txId={txId} onSuccess={() => {}} />
                </Elements>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">Stripe is not configured properly. Please check your environment variables.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
