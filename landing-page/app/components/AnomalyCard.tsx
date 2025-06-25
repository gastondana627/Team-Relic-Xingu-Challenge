import Image from 'next/image';

interface Anomaly {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string;
}

interface AnomalyCardProps {
  anomaly: Anomaly;
}

export default function AnomalyCard({ anomaly }: AnomalyCardProps) {
  return (
    <div className="anomaly-card">
      <Image 
        src={anomaly.image} 
        alt={anomaly.title} 
        className="anomaly-image" 
        width={400}
        height={250}
        priority={anomaly.id === 1}
      />
      <div className="anomaly-card-content">
        <h3>{anomaly.title}</h3>
        <p>{anomaly.description}</p>
        <a href={anomaly.video} target="_blank" rel="noopener noreferrer" className="video-link">
          Watch an Elevated 360 degree view
        </a>
      </div>
    </div>
  );
}