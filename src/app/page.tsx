import Link from "next/link";







export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-4xl font-bold text-slate-900">
        DeeT-X Fashion
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Premium Garments. Coming soon.
      </p>
      <Link href="/admin">
        <button className="mt-8 px-6 py-3 bg-red-500 text-white rounded-md hover:bg-slate-800 transition-colors">
          Admin Dashboard
        </button>
      </Link>
    </div>
  );
}
