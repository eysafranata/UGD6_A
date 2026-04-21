'use client';

import { useState, useEffect, useCallback } from 'react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  UserPlusIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  Bars3Icon,
  UserIcon
} from '@heroicons/react/24/outline';
import { fetchFilteredUsers, deleteUser } from '@/app/lib/actions';
import AdminSidebar from '@/app/ui/dashboard/admin-sidebar';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function ManageUsersPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchFilteredUsers(searchQuery);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user "${name}"?`)) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div className={`min-h-screen bg-[#f4fcf7] pb-10 ${poppins.className}`}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Top Navbar */}
      <nav className="flex items-center px-6 md:px-10 py-4 w-full bg-[#f4fcf7] sticky top-0 z-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="mr-5 text-[#24a173] hover:bg-[#e6fce5] p-2 rounded-lg transition-colors"
        >
          <Bars3Icon className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-[#e6fce5] p-2.5 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-[#1b8555] stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold text-[#0c5132] tracking-tight block leading-none mb-0.5 shadow-sm">KirimAja</span>
            <span className="text-[11px] md:text-xs text-[#24a173] font-bold uppercase tracking-wider block">Admin</span>
          </div>
        </div>
      </nav>
      <div className="px-6 md:px-10 py-8 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/dashboard-admin" 
              className="inline-flex items-center text-[#24a173] font-bold text-sm mb-4 hover:underline gap-1.5"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-[#0c5132] flex items-center gap-2">
              Kelola Pengguna 👥
            </h1>
            <p className="text-gray-500 font-medium">Lihat dan atur akun pelanggan/admin</p>
          </div>
          
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center gap-2 bg-[#24a173] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#1b8555] transition-all shadow-sm hover:shadow-md"
          >
            <UserPlusIcon className="w-5 h-5" />
            Tambah User
          </Link>
        </div>

        {/* Search & Table Card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#e6fce5] p-2 rounded-xl">
                 <UserIcon className="w-5 h-5 text-[#24a173]" />
              </div>
              <h2 className="font-extrabold text-[#0c5132]">Daftar Pengguna</h2>
            </div>
            
            <div className="relative w-full md:w-80">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari nama/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#f8faf9] border-none rounded-2xl focus:ring-2 focus:ring-[#24a173]/20 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Nama</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Peran</th>
                  <th className="px-8 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                      <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-full w-16"></div></td>
                      <td className="px-8 py-6"><div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div></td>
                    </tr>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#fcfdfc] transition-colors group">
                      <td className="px-8 py-6">
                        <span className="font-bold text-[#0c5132]">{user.name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-gray-500 font-medium">{user.email}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          user.role === 'Admin' 
                            ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="text-gray-400 hover:text-[#24a173] font-bold text-sm transition-colors"
                          >
                            Detail
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-[#0c5132]/20 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          ></div>
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-[#0c5132]">Detail Pengguna</h3>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[#f8faf9] rounded-2xl">
                  <div className="w-14 h-14 bg-[#e6fce5] rounded-full flex items-center justify-center text-[#24a173] text-xl font-bold">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Nama Lengkap</p>
                    <p className="font-extrabold text-[#0c5132] text-lg leading-tight">{selectedUser.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 px-2">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-[#0c5132] font-semibold">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Nomor Telepon</p>
                    <p className="text-[#0c5132] font-semibold">{selectedUser.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Peran Akses</p>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      selectedUser.role === 'Admin' 
                        ? 'bg-purple-50 text-purple-600' 
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {selectedUser.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Terdaftar Pada</p>
                    <p className="text-gray-500 font-medium">
                      {new Date(selectedUser.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedUser(null)}
                  className="w-full bg-[#24a173] text-white py-4 rounded-[20px] font-bold hover:bg-[#1b8555] transition-all shadow-sm mt-4"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
