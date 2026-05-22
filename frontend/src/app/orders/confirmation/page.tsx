import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center">
      <Card className="max-w-2xl w-full border-none shadow-2xl overflow-hidden rounded-3xl">
        <div className="bg-primary p-12 text-center text-white">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-inner">
            <CheckCircle2 className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Order Confirmed!</h1>
          <p className="mt-4 text-xl text-primary-foreground/80">
            Thank you for your purchase. We've sent a confirmation email to your inbox.
          </p>
        </div>
        <CardContent className="p-12 text-center space-y-8">
          <p className="text-gray-600 max-w-md mx-auto">
            Your items are being prepared for shipping and will be with you shortly. You can track the order in your account dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/account/orders" className="flex-1">
              <Button variant="outline" className="h-14 w-full text-lg font-bold">
                <Package className="mr-2 h-5 w-5" /> View My Orders
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button className="h-14 w-full text-lg font-bold shadow-lg shadow-primary/20">
                <ShoppingBag className="mr-2 h-5 w-5" /> Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
