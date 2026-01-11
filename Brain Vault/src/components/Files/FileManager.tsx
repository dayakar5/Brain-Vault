import { useState, useEffect } from 'react';
import { Upload, Download, Trash2, Eye, EyeOff, FileText, Image as ImageIcon, Plus, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/supabase';

type FileRow = Database['public']['Tables']['files']['Row'];

export function FileManager() {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRow | null>(null);

  useEffect(() => {
    loadFiles();
  }, [user]);

  const loadFiles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target.files?.[0];
    if (!fileInput || !user) return;

    setUploading(true);

    try {
      const fileName = `${user.id}/${Date.now()}_${fileInput.name}`;

      const { error: uploadError } = await supabase.storage
        .from('public-files')
        .upload(fileName, fileInput);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        name: fileInput.name,
        storage_path: fileName,
        file_type: fileInput.type,
        file_size: fileInput.size,
        is_public: false,
      });

      if (dbError) throw dbError;

      await loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const togglePublic = async (file: FileRow) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ is_public: !file.is_public })
        .eq('id', file.id);

      if (error) throw error;
      await loadFiles();
    } catch (error) {
      console.error('Error toggling public status:', error);
    }
  };

  const deleteFile = async (file: FileRow) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const { error: storageError } = await supabase.storage
        .from('public-files')
        .remove([file.storage_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      await loadFiles();
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    }
  };

  const downloadFile = async (file: FileRow) => {
    try {
      const { data, error } = await supabase.storage
        .from('public-files')
        .download(file.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await supabase
        .from('files')
        .update({ download_count: file.download_count + 1 })
        .eq('id', file.id);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">My Files</h1>
          <p className="text-gray-400">Upload and manage your documents</p>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            disabled={uploading}
          />
          <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Upload File
              </>
            )}
          </div>
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16">
          <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No files yet</h3>
          <p className="text-gray-500">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.file_type);
            return (
              <div
                key={file.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02]"
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{file.name}</h3>
                      <p className="text-xs text-gray-400">{formatFileSize(file.file_size)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    file.is_public
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {file.is_public ? 'Public' : 'Private'}
                  </span>
                  {file.download_count > 0 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {file.download_count} downloads
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublic(file)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition text-sm"
                    title={file.is_public ? 'Make Private' : 'Make Public'}
                  >
                    {file.is_public ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => downloadFile(file)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition text-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFile(file)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
