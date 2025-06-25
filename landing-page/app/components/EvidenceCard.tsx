// This is the only code that should be in EvidenceCard.tsx

interface EvidenceCardProps {
    title: string;
    description: string;
    link: string;
    buttonText: string;
  }
  
  export default function EvidenceCard({ title, description, link, buttonText }: EvidenceCardProps) {
    return (
      <div className="evidence-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="cta-button-secondary">
          {buttonText}
        </a>
      </div>
    );
  }



