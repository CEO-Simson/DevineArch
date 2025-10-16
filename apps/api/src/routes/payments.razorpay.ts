import { Router } from 'express'
import crypto from 'crypto'
import { getRazorpay } from '../payments/razorpay'

const router = Router()

// POST /api/payments/razorpay/order { amount: number, currency?: 'INR', receipt?: string }
router.post('/order', async (req, res) => {
  try {
    const rzp = getRazorpay()
    if (!rzp) return res.status(503).json({ error: 'Razorpay not configured' })
    const amount = Number(req.body?.amount)
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
    const currency = (req.body?.currency as string) || 'INR'
    const receipt = (req.body?.receipt as string) || `rcpt_${Date.now()}`
    const order = await rzp.orders.create({ amount: Math.round(amount * 100), currency, receipt })
    return res.status(201).json({ order, key: process.env.RAZORPAY_KEY_ID })
  } catch (e: any) {
    console.error('Razorpay order error', e)
    return res.status(500).json({ error: 'Failed to create order' })
  }
})

// POST /api/payments/razorpay/webhook - verify signature
router.post('/webhook', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) return res.status(503).json({ error: 'Webhook not configured' })
    const payload = JSON.stringify(req.body)
    const signature = req.headers['x-razorpay-signature'] as string | undefined
    if (!signature) return res.status(400).json({ error: 'Missing signature' })
    const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    if (hmac !== signature) return res.status(401).json({ error: 'Invalid signature' })
    // TODO: use event data to confirm payment and mark subscription active
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Razorpay webhook error', e)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
})

export { router as razorpayPaymentsRouter }
