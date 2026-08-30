import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("ยังไม่ได้ตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY");
  }

  const normalizedUrl = supabaseUrl
    .replace(/\/rest\/v1\/?$/, "")
    .replace(/\/$/, "");

  return createClient(normalizedUrl, supabaseAnonKey);
};

export const addPost = async ({
  uid,
  email,
  photoURL,
  postType,
  imageFile,
  description,
}) => {
  const supabase = getSupabase();
  const extension = imageFile.name.split(".").pop() || "jpg";
  const imagePath = `${uid}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(imagePath, imageFile, {
      contentType: imageFile.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl: imageURL },
  } = supabase.storage.from("post-images").getPublicUrl(imagePath);

  const { data, error: insertError } = await supabase
    .from("users")
    .insert({
      uid,
      email: email || null,
      profile_image_url: photoURL || null,
      post_type: postType,
      image_url: imageURL,
      description: description.trim(),
    })
    .select()
    .single();

  if (insertError) {
    await supabase.storage.from("post-images").remove([imagePath]);
    throw insertError;
  }

  return data;
};

export const getPosts = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, uid, email, profile_image_url, post_type, image_url, description, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const getComments = async (postIds) => {
  if (postIds.length === 0) {
    return [];
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, uid, profile_image_url, content, created_at")
    .in("post_id", postIds)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};

export const deletePost = async ({ postId, uid }) => {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", postId)
    .eq("uid", uid);

  if (error) {
    throw error;
  }
};

export const addComment = async ({ postId, uid, profileImageURL, content }) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      uid,
      profile_image_url: profileImageURL || null,
      content: content.trim(),
    })
    .select("id, post_id, uid, profile_image_url, content, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
};
