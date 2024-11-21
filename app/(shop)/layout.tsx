import { Footer, Sidebar, TopMenu } from "../components";

export default function ShopLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen max-w-[1366px] my-0 mx-auto">
      <TopMenu />
      <Sidebar />
      <div className="sm:px-10">
        {children}
      </div>
      <Footer />
    </main>
  );
}