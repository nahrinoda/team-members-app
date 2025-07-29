'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface TeamMemberFormProps {
  onSubmitSuccess?: () => void;
}

export default function TeamMemberForm({ onSubmitSuccess }: TeamMemberFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    instagram: '',
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [favoritePics, setFavoritePics] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImage = async (file: File, bucket: string, path: string): Promise<string> => {
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!profilePic || favoritePics.length !== 3) {
        alert('Please upload 1 profile picture and exactly 3 favorite pictures.');
        return;
      }

      const timestamp = Date.now();

      const profilePath = `profile-${timestamp}-${profilePic.name}`;
      const avatarUrl = await uploadImage(profilePic, 'profile-pictures', profilePath);

      const favoriteUrls: string[] = [];
      for (let i = 0; i < 3; i++) {
        const path = `favorite-${timestamp}-${i}-${favoritePics[i].name}`;
        const url = await uploadImage(favoritePics[i], 'favorite-pictures', path);
        favoriteUrls.push(url);
      }

      const { error } = await supabase.from('team_members').insert([
        {
          ...formData,
          avatar_url: avatarUrl,
          favorite_images: favoriteUrls,
        },
      ]);

      if (error) throw error;

      alert('Team member added!');
      setFormData({ name: '', position: '', bio: '', instagram: '' });
      setProfilePic(null);
      setFavoritePics([]);
      onSubmitSuccess?.();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
      <h2 className="mb-5 text-4xl text-center font-semibold tracking-tight text-balance text-gray-900">
        Team Member Form
      </h2>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6">
        <div>
          <label htmlFor="name" className="block text-sm/6 font-semibold text-gray-900">Full Name</label>
          <input
            aria-label="Full Name"
            id="name"
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="position" className="block text-sm/6 font-semibold text-gray-900">Position / Location</label>
          <input
            aria-label="Position / Location"
            id="position"
            type="text"
            name="position"
            placeholder="Position / Location"
            onChange={handleChange}
            value={formData.position}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm/6 font-semibold text-gray-900">Bio</label>
          <textarea
            aria-label="bio"
            id="bio"
            name="bio"
            placeholder="Bio"
            rows={4}
            onChange={handleChange}
            value={formData.bio}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="instagram" className="block text-sm/6 font-semibold text-gray-900">Instagram Handle</label>
          <input
            aria-label="Instagram Handle"
            id="instagram"
            name="instagram"
            placeholder="Instagram Handle"
            onChange={handleChange}
            value={formData.instagram}
            className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          />
        </div>
        <div>
          <label htmlFor="profile-picture" className="block text-sm/6 font-semibold text-gray-900">Profile Picture:</label>
          <input
            id="profile-picture"
            aria-label="Profile Picture"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files?.[0] ?? null)}
            required
            className="block rounded-md border-1 border-gray-300 hover:border-gray-900 p-1 text-center text-sm font-semibold text-gray-300 shadow-xs hover:font-bold hover:text-gray-900 cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="favorite-pictures" className="block text-sm/6 font-semibold text-gray-900">3 Favorite Pictures:</label>
          <input
            id="favorite-pictures"
            aria-label="Favorite Pictures"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFavoritePics(Array.from(e.target.files ?? []))}
            required
            className="block rounded-md border-1 border-gray-300 hover:border-gray-900 p-1 text-center text-sm font-semibold text-gray-300 shadow-xs hover:font-bold hover:text-gray-900 cursor-pointer"
          />
        </div>

        <div>
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
