'use client';

import { useState, useEffect } from 'react';
import TeamMemberForm from './components/TeamMemberForm';
import HeroBanner from './components/HeroBanner';
import { supabase } from '@/lib/supabaseClient';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  instagram: string;
  avatar_url: string;
  favorite_images: string[];
  created_at?: string;
}

export default function Home() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('id', { ascending: false }); // Use id instead of created_at in case created_at doesn't exist

      if (error) throw error;

      setTeamMembers(data || []);
      // Set the first team member as selected by default
      if (data && data.length > 0) {
        setSelectedMember(data[0]);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = () => {
    // Refresh the team members list after a new submission
    fetchTeamMembers();
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="text-center">
          <p>Loading team members...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <TeamMemberForm onSubmitSuccess={handleFormSubmit} />

      {teamMembers.length > 0 && (
        <div className="space-y-6 py-11">
          <div className="flex flex-wrap gap-4 justify-center pb-5">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`p-4 rounded-lg border-2 transition-colors ${selectedMember?.id === member.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-center">
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.position}</p>
                </div>
              </button>
            ))}
          </div>

          <HeroBanner teamMember={selectedMember} />
        </div>
      )}
    </main>
  );
}
