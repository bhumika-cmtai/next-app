import Header from "@/components/(website)/Header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50  to-sea-green-100/30 font-sans">
        <div className="w-1/4 hidden lg:block"></div>
        <Header />
      <div className="flex flex-col">
        <main className="p-20">
          {children}
        </main>

      </div>
    </div>
  );
}
