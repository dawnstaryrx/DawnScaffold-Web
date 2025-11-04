import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/common/footer/Footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container">{children}</main>
      <Footer />
    </div>
  );
}
