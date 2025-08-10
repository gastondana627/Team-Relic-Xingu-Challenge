// app/components/TeamMemberCard.tsx
import Image from 'next/image';

interface TeamMemberProps {
    name: string;
    role: string;
    imageUrl: string;
    headline: string;
    bio: string;
    socials: {
        linkedin?: string;
        github?: string;
        twitter?: string;
    }
}

export default function TeamMemberCard({ name, role, imageUrl, headline, bio, socials }: TeamMemberProps) {
    const primaryLink = socials.linkedin || socials.github || socials.twitter || "#";

    return (
        // The outer element is now a non-linking div, but keeps the .team-card styles.
        <div className="team-card">
            {/* The image is a link. */}
            <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                <Image 
                  src={imageUrl} 
                  alt={name} 
                  className="team-avatar" 
                  width={150}
                  height={150}
                />
            </a>
            {/* The name is also a link. */}
            <h3 className="team-name">
              <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </h3>
            <p className="team-role">{role}</p>
            <p className="team-headline">{headline}</p>
            <p className="team-bio">{bio}</p>
            {/* These links are no longer nested and will function correctly. */}
            <div className="team-socials">
                {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
        </div>
    );
}

