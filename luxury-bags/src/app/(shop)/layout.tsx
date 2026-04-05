import Navbar from '@/components/navigation/navbar';
import CartDrawer from '@/components/cart/cart-drawer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <CartDrawer />
    </div>
  );
}
