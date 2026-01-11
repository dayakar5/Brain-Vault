import { useState, useEffect } from 'react';
import { Download, FileText, Image as ImageIcon, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/supabase';

type FileRow = Database['public']['Tables']['files']['Row'];

export function PublicGallery() {
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRow | null>(null);

  useEffect(() => {
    loadPublicFiles();
  }, []);

  const loadPublicFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error loading public files:', error);
    } finally {
      setLoading(false);
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

      loadPublicFiles();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const viewFile = async (file: FileRow) => {
    setSelectedFile(file);
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

  const getFileUrl = (storagePath: string) => {
    const { data } = supabase.storage
      .from('public-files')
      .getPublicUrl(storagePath);
    return data.publicUrl;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8 text-blue-400" />
          <h1 className="text-4xl font-bold text-white">Public Gallery</h1>
        </div>
        <p className="text-gray-400">Browse and download publicly shared files</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No public files yet</h3>
          <p className="text-gray-500">Be the first to share something with the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file, index) => {
            const Icon = getFileIcon(file.file_type);
            const fileUrl = getFileUrl(file.storage_path);

            return (
              <div
                key={file.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all transform hover:scale-[1.02] cursor-pointer"
                style={{
                  animation: `slideUp 0.3s ease-out ${index * 0.05}s both`,
                }}
                onClick={() => viewFile(file)}
              >
                {file.file_type.startsWith('image/') ? (
                  <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 overflow-hidden">
                    <img
                      src={fileUrl}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white/50" />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-white font-semibold truncate mb-2">{file.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>{formatFileSize(file.file_size)}</span>
                    <span>{file.download_count} downloads</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFile(file);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedFile && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFile(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedFile.name}</h2>
                <p className="text-sm text-gray-400">{formatFileSize(selectedFile.file_size)} • {selectedFile.download_count} downloads</p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedFile.file_type.startsWith('image/') ? (
                <img
                  src={getFileUrl(selectedFile.storage_path)}
                  alt={selectedFile.name}
                  className="w-full rounded-lg"
                />
              ) : selectedFile.file_type === 'application/pdf' ? (
                <iframe
                  src={getFileUrl(selectedFile.storage_path)}
                  className="w-full h-[600px] rounded-lg"
                  title={selectedFile.name}
                />
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Preview not available for this file type</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => downloadFile(selectedFile)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition"
              >
                <Download className="w-5 h-5" />
                Download File
              </button>
            </div>
          </div>
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
