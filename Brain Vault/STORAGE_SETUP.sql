-- BrainVault Storage Bucket Setup
-- Run this in Supabase SQL Editor to create the storage bucket

-- Create the public-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-files', 'public-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload files to their folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'public-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to read public files (bucket is public)
CREATE POLICY "Anyone can read public files"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-files');
