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
        <div className="team-card">
            <a href={primaryLink} target="_blank" rel="noopener noreferrer">
                <Image 
                  src={imageUrl} 
                  alt={name} 
                  className="team-avatar" 
                  width={150}
                  height={150}
                />
            </a>
            <h3 className="team-name">{name}</h3>
            <p className="team-role">{role}</p>
            <p className="team-headline">{headline}</p>
            <p className="team-bio">{bio}</p>
            <div className="team-socials">
                {socials.github && <a href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
            </div>
        </div>
    );
}