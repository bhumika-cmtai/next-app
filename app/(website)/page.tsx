import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to GrowUp</h1>
      <Link href="/admin?view=users" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Go to Admin Dashboard
      </Link>
    </main>
  );
}