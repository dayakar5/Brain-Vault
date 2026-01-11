import { useEffect, useState } from 'react';
import { FileText, Upload, FolderOpen, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  notes: number;
  files: number;
  folders: number;
  publicItems: number;
}

export function DashboardView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ notes: 0, files: 0, folders: 0, publicItems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const [notesResult, filesResult, foldersResult, publicNotesResult, publicFilesResult] = await Promise.all([
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('files').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('folders').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', user.id).eq('is_public', true),
        supabase.from('files').select('id', { count: 'exact' }).eq('user_id', user.id).eq('is_public', true),
      ]);

      setStats({
        notes: notesResult.count || 0,
        files: filesResult.count || 0,
        folders: foldersResult.count || 0,
        publicItems: (publicNotesResult.count || 0) + (publicFilesResult.count || 0),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Notes', value: stats.notes, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Files', value: stats.files, icon: Upload, color: 'from-purple-500 to-purple-600' },
    { label: 'Folders', value: stats.folders, icon: FolderOpen, color: 'from-green-500 to-green-600' },
    { label: 'Public Items', value: stats.publicItems, icon: TrendingUp, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your vault overview</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02] cursor-pointer"
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
                <div className="text-sm text-gray-400">{card.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-8 border border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">Quick Tips</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-blue-400">•</span>
            <span>Create notes with rich formatting and organize them into folders</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-400">•</span>
            <span>Upload files and choose to make them public or keep them private</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">•</span>
            <span>Public files can be viewed and downloaded by anyone with the link</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-400">•</span>
            <span>Use tags to categorize your notes for easy searching</span>
          </li>
        </ul>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
