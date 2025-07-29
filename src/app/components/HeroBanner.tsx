import React from 'react';
import Image from 'next/image';

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

const HeroBanner = ({ teamMember }: { teamMember: TeamMember | null }) => {
  if (!teamMember) {
    return (
      <div className="relative w-full max-h-[400px] grid grid-cols-2 gap-14 items-center justify-center">
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-semibold">No team member selected</h3>
          <p>Add a team member using the form above</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-50 rounded-lg p-8">
      <div className="flex gap-8 items-start">
        {/* Left side - Profile information */}
        <div className="flex gap-4">
          <div className="relative">
            <Image
              src={teamMember.avatar_url}
              alt={`${teamMember.name} profile`}
              width={82}
              height={82}
              className="rounded-full object-cover border-[6px] border-[#D9D9D9]"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-[#0D0D0D]">{teamMember.name}</h3>
            <p className="text-lg text-gray-700">{teamMember.position}</p>
            <p className="text-gray-600">{teamMember.bio}</p>
            <div className="flex items-center gap-2">
              <Image src="/insta-icon.svg" alt="Instagram" width={20} height={20} />
              <p className="text-blue-600 hover:underline">
                @{teamMember.instagram}
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Brick grid images */}
        <div className="grid grid-cols-2 gap-2 ml-auto max-h-[373px]">
          {teamMember.favorite_images && teamMember.favorite_images.length > 0 ? (
            <>
              {/* First column - two smaller images */}
              <div className="space-y-2">
                <div className="relative">
                  <Image
                    src={teamMember.favorite_images[0]}
                    alt="Favorite pic 1"
                    width={114}
                    height={114}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
                <div className="relative">
                  <Image
                    src={teamMember.favorite_images[1]}
                    alt="Favorite pic 2"
                    width={163}
                    height={163}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              </div>

              {/* Second column - one larger image */}
              <div className="relative">
                <Image
                  src={teamMember.favorite_images[2]}
                  alt="Favorite pic 3"
                  width={280}
                  height={373}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-8 col-span-2">
              <p>No favorite pictures available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;