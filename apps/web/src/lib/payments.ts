export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'imps' | 'wallet'

export interface PaymentIntent {
  provider: 'razorpay'
  method: PaymentMethod
  amount: number
  currency: 'INR'
  transactionId: string
  redirectUrl?: string
  upiQrData?: string
  orderId?: string
  key?: string
}
