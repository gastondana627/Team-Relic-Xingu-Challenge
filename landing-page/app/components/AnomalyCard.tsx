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
        <img src={anomaly.image} alt={anomaly.title} className="anomaly-image" />
        <div className="anomaly-card-content">
          <h3>{anomaly.title}</h3>
          <p>{anomaly.description}</p>
          <a href={anomaly.video} target="_blank" rel="noopener noreferrer" className="video-link">
            Watch 1-Min Explanation
          </a>
        </div>
      </div>
    );
  }