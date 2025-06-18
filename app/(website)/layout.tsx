import Footer from "@/components/(website)/Footer";
import Header from "@/components/(website)/Header";
import { Noto_Sans } from 'next/font/google';

  const notoSans = Noto_Sans({
  subsets: ['latin'], // Specify the subsets you need
  weight: ['400', '500', '700', '900'], // Specify the weights you need
  variable: '--font-noto-sans', // Assign a CSS variable name
  display: 'swap',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className={`min-h-screen bg-gradient-to-r from-pink-50  to-sea-green-100/30 font-sans overflow-x-hidden ${notoSans.variable}`}>
        <div className="w-1/4 hidden lg:block"></div>
        <Header />
      <div className="flex flex-col">
        <main className="py-20 px-10">
          {children}
        </main>
      <Footer />
      </div>
    </div>
  );
}

