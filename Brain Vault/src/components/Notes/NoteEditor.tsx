import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/supabase';

type NoteRow = Database['public']['Tables']['notes']['Row'];

interface NoteEditorProps {
  note: NoteRow;
  onBack: () => void;
}

export function NoteEditor({ note, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveNote = useCallback(async (newTitle: string, newContent: string) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: newTitle,
          content: newContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id);

      if (error) throw error;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  }, [note.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        saveNote(title, content);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, content, note.title, note.content, saveNote]);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="flex items-center gap-3">
          {saving && (
            <div className="flex items-center gap-2 text-blue-400">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}
          {lastSaved && !saving && (
            <span className="text-sm text-gray-400">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-white bg-transparent border-none outline-none placeholder-gray-500"
            placeholder="Note title..."
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 text-white bg-transparent border-none outline-none placeholder-gray-500 resize-none"
            placeholder="Start writing..."
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>
    </div>
  );
}
