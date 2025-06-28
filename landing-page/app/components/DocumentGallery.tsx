// landing-page/app/components/DocumentGallery.tsx
"use client";

import Image from 'next/image';

// --- IMPORTANT ---
// You must populate this array with your actual document details.
// I've added 3 placeholders as an example. Add one for each of your 15+ PDFs.
const documents = [
  {
    title: "Anomaly 1 - Geoglyph Lidar Scan",
    thumbnailUrl: "/assets/doc-thumb-1.jpg", // The screenshot you took
    pdfUrl: "[PASTE_SHAREABLE_LINK_TO_PDF_1_HERE]" // The link from Google Drive
  },
  {
    title: "Anomaly 2 - Courtyard Spectral Analysis",
    thumbnailUrl: "/assets/doc-thumb-2.jpg",
    pdfUrl: "[PASTE_SHAREABLE_LINK_TO_PDF_2_HERE]"
  },
  {
    title: "Anomaly 3 - Ring Ditch Topography Map",
    thumbnailUrl: "/assets/doc-thumb-3.jpg",
    pdfUrl: "[PASTE_SHAREABLE_LINK_TO_PDF_3_HERE]"
  },
  // ... add the rest of your 15+ documents here
];

export default function DocumentGallery() {
  return (
    <div className="document-gallery-grid">
      {documents.map((doc, index) => (
        <a key={index} href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="document-card">
          <div className="document-thumbnail">
            <Image src={doc.thumbnailUrl} alt={doc.title} width={300} height={400} />
          </div>
          <h4 className="document-title">{doc.title}</h4>
        </a>
      ))}
    </div>
  );
}