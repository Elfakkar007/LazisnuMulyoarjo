import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  // 1. Inisialisasi Supabase
  const supabase = await createClient()

  // 2. Ambil data dari tabel 'activities'
  const { data: activities } = await supabase.from('activities').select()

  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">LazisNU Malang</h1>
      
      <div className="grid gap-4 w-full max-w-2xl">
        {/* 3. Looping data (mirip map di React biasa) */}
        {activities?.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow hover:bg-gray-50">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.content}</p>
            <p className="text-xs text-gray-400 mt-4">
              Diposting: {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      
      {/* Jika data kosong */}
      {activities?.length === 0 && <p>Belum ada kegiatan.</p>}
    </div>
  )
}