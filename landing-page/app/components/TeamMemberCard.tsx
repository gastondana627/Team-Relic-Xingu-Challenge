interface TeamMemberProps {
    name: string;
    role: string;
    imageUrl: string;
}

export default function TeamMemberCard({ name, role, imageUrl }: TeamMemberProps) {
    return (
        <div className="team-card">
            <img src={imageUrl} alt={name} className="team-avatar" />
            <h4>{name}</h4>
            <p>{role}</p>
        </div>
    );
}