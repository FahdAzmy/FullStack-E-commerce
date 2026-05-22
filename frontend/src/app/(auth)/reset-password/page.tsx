'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, Loader2, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await authService.verifyResetCode(resetCode);
      await authService.resetPassword({ email, newPassword });
      toast.success('Password updated. Please sign in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Unable to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Choose a new password</CardTitle>
          <CardDescription>Use the code from your email to finish the reset.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resetCode">Reset code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input id="resetCode" value={resetCode} onChange={(event) => setResetCode(event.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input id="newPassword" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="pl-10" required minLength={6} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
            <p className="text-center text-sm text-gray-500">
              Need a code? <Link href="/forgot-password" className="font-medium text-primary hover:underline">Send another one</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
