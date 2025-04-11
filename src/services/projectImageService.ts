
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const STORAGE_BUCKET = 'project_images';

/**
 * Upload a project image to Supabase Storage
 */
export async function uploadProjectImage(file: File): Promise<string> {
  try {
    // First check if the bucket exists, if not, create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${STORAGE_BUCKET}`);
      const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true, // Make the bucket public so images are accessible
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        throw new Error(error.message);
      }
      console.log('Bucket created successfully:', data);
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading image:', error);
      throw new Error(error.message);
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error in uploadProjectImage:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete a project image from Supabase Storage
 */
export async function deleteProjectImage(imageUrl: string): Promise<void> {
  try {
    // Extract the file path from the public URL
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const fileName = pathSegments[pathSegments.length - 1];
    
    // Only delete if it's from our bucket
    if (pathSegments.includes(STORAGE_BUCKET)) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([fileName]);
        
      if (error) {
        console.error('Error deleting image:', error);
        throw new Error(error.message);
      }
    }
  } catch (error: any) {
    console.error('Error in deleteProjectImage:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Extracts file name from image URL
 */
export function getFileNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  } catch (error) {
    return null;
  }
}

/**
 * Check if image URL is from our project bucket
 */
export function isProjectImage(url: string): boolean {
  try {
    return url.includes(STORAGE_BUCKET);
  } catch {
    return false;
  }
}
