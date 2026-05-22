'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Package, Receipt, ShieldAlert, Trash2, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { orderService } from '@/services/order.service';
import { productService } from '@/services/product.service';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';

export default function AdminPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userDraft, setUserDraft] = useState({ name: '', email: '', password: '', role: 'user' });
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const stats = useMemo(
    () => [
      { label: 'Products', value: products.length, icon: Package },
      { label: 'Orders', value: orders.length, icon: Receipt },
      { label: 'Users', value: users.length, icon: UserCog },
    ],
    [orders.length, products.length, users.length]
  );

  const loadAdminData = async () => {
    const [productResponse, orderResponse, userResponse] = await Promise.all([
      productService.getProducts({ limit: 50 }),
      orderService.getOrders({ limit: 50 }),
      userService.getUsers({ limit: 50 }),
    ]);
    setProducts(productResponse.data ?? []);
    setOrders(orderResponse.data ?? []);
    setUsers(userResponse.data ?? []);
  };

  useEffect(() => {
    if (canManage) {
      loadAdminData().catch((error: any) => {
        toast.error(error.response?.data?.message || 'Unable to load admin data.');
      });
    }
  }, [canManage]);

  if (!canManage) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <ShieldAlert className="h-16 w-16 text-gray-300" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Admin access required</h1>
        <p className="mt-2 max-w-md text-gray-500">Use an admin or manager account to manage catalog, orders, and users.</p>
        <Button asChild className="mt-8">
          <Link href="/">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const deleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    setProducts((current) => current.filter((product) => product._id !== productId));
    toast.success('Product deleted.');
  };

  const markPaid = async (orderId: string) => {
    const response = await orderService.markPaid(orderId);
    setOrders((current) => current.map((order) => (order._id === orderId ? response.data : order)));
    toast.success('Order marked paid.');
  };

  const markDelivered = async (orderId: string) => {
    const response = await orderService.markDelivered(orderId);
    setOrders((current) => current.map((order) => (order._id === orderId ? response.data : order)));
    toast.success('Order marked delivered.');
  };

  const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await userService.createUser({
      ...userDraft,
      passwordConfirm: userDraft.password,
    });
    setUsers((current) => [response.data, ...current]);
    setUserDraft({ name: '', email: '', password: '', role: 'user' });
    toast.success('User created.');
  };

  const deleteUser = async (userId: string) => {
    await userService.deleteUser(userId);
    setUsers((current) => current.filter((item) => item._id !== userId));
    toast.success('User deleted.');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">Manage the store resources backed by the Express API.</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="border-none shadow-md">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-3xl font-black text-gray-900">{item.value}</p>
              </div>
              <item.icon className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Review and remove catalog items. Product creation is available through the existing multipart API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {products.map((product) => (
                <div key={product._id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                  <div>
                    <p className="font-bold text-gray-900">{product.title}</p>
                    <p className="text-sm text-gray-500">${product.price} · {product.quantity ?? 0} in stock</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteProduct(product._id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>Mark payment and delivery status as orders progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center">
                  <div>
                    <p className="font-mono text-sm font-bold">{order._id}</p>
                    <p className="text-sm text-gray-500">${Number(order.totalOrderPrice ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={order.isPaid ? 'default' : 'secondary'}>{order.isPaid ? 'Paid' : 'Unpaid'}</Badge>
                    <Badge variant={order.isDelivered ? 'default' : 'secondary'}>{order.isDelivered ? 'Delivered' : 'Pending'}</Badge>
                    <Button size="sm" variant="outline" onClick={() => markPaid(order._id)} disabled={order.isPaid}>Mark Paid</Button>
                    <Button size="sm" onClick={() => markDelivered(order._id)} disabled={order.isDelivered}>Deliver</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="border-none shadow-lg lg:col-span-4">
              <CardHeader>
                <CardTitle>Create User</CardTitle>
                <CardDescription>Add a shopper, manager, or admin.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createUser} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={userDraft.name} onChange={(event) => setUserDraft((current) => ({ ...current, name: event.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userDraft.email} onChange={(event) => setUserDraft((current) => ({ ...current, email: event.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={userDraft.password} onChange={(event) => setUserDraft((current) => ({ ...current, password: event.target.value }))} required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={userDraft.role} onChange={(event) => setUserDraft((current) => ({ ...current, role: event.target.value }))} placeholder="user, manager, admin" />
                  </div>
                  <Button type="submit" className="w-full">Create User</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg lg:col-span-8">
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Remove accounts that should no longer access the store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.role}</Badge>
                      <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteUser(item._id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
