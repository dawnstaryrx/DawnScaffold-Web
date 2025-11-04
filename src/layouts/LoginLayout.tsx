import Navbar from "@/components/common/navbar/Navbar";
import FooterSimple from "@/components/common/footer/FooterSimple";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部导航 */}
      <Navbar />
      {/* 主体部分自动填充剩余空间 */}
      <main className="flex-1 container mx-auto py-6">{children}</main>
      {/* 固定高度 Footer */}
      <FooterSimple />
    </div>
  );
}
