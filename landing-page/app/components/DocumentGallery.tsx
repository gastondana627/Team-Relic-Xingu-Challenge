// landing-page/app/components/DocumentGallery.tsx
"use client";

// --- IMPORTANT ---
// You must populate this array with your actual document titles and links.
// I have used your 16 PDF links and created placeholder titles.
const documents = [
  // Group 1-3
  { title: "Upland Plateau - Lidar Scan", pdfUrl: "https://drive.google.com/file/d/1xrJp5j9sTwBiuUZRDpd07AvOT1Sin8Xb/view?usp=sharing" },
  { title: "Upland Plateau - Spectral Analysis", pdfUrl: "https://drive.google.com/file/d/1VlJ9ct2DT7A2rN7glb4fm0yS6vOUImun/view?usp=sharing" },
  { title: "Secondary Outposts - Site Plan", pdfUrl: "https://drive.google.com/file/d/1VEc3stu0ICvL_dDZkP1usHOYUup-_nEk/view?usp=sharing" },
  { title: "Elevated Corridor - Topography", pdfUrl: "https://drive.google.com/file/d/1dW3KXn4ncPqz3falqYheOxuA-jPIDgNe/view?usp=sharing" },
  { title: "Elevated Corridor - GPR Data", pdfUrl: "https://drive.google.com/file/d/1ONJ2Hccn_5q_5AlfRWePBtoNl7j2bDiZ/view?usp=sharing" },
  
  // Group 4-5
  { title: "Terrace Settlement - Site Overview", pdfUrl: "https://drive.google.com/file/d/1bINMKbAcpLkHmmLJHEW7V9BLD3IMVuhC/view?usp=sharing" },
  { title: "Terrace Settlement - Structure A", pdfUrl: "https://drive.google.com/file/d/19gy10VsKPZOdp7TwVlhdE1ZaFYB8_X_x/view?usp=sharing" },
  { title: "Terrace Settlement - Structure B", pdfUrl: "https://drive.google.com/file/d/1v1f_Y0AXUd9GxqhshdQwvTRQCwN34-lZ/view?usp=sharing" },
  { title: "Terrace Settlement - Pottery Analysis", pdfUrl: "https://drive.google.com/file/d/1rkts0pCnBSygghlEdOpfwN2EUW0Y0zqP/view?usp=sharing" },
  { title: "Artificial Shoreline - Lidar Scan", pdfUrl: "https://drive.google.com/file/d/1WolFu4EKT92wtKG7U8X7yLJZJsqfNPdi/view?usp=sharing" },
  { title: "Artificial Shoreline - Water Model", pdfUrl: "https://drive.google.com/file/d/1qQg3C83bLs0FhtjwvV-cOIq9qq8iYL0i/view?usp=sharing" },
  { title: "Artificial Shoreline - Cross Section", pdfUrl: "https://drive.google.com/file/d/1WpIkgaHQ9sI3LVmKb_tYea0EAPgdV56m/view?usp=sharing" },
  { title: "Comparative Analysis: A4 vs Kuhikugu", pdfUrl: "https://drive.google.com/file/d/18fjMYHqc8bebOE1wq4U7xQZjt7KdwIsl/view?usp=sharing" },
  { title: "Source Text: Colonial Diary", pdfUrl: "https://drive.google.com/file/d/1Extu74R6JF-0MVFAK57cbQSlD3c9evWI/view?usp=sharing" },
  { title: "Source Text: Heckenberger (2003)", pdfUrl: "https://drive.google.com/file/d/1r__ZpZF7FRSGP_umXOP-DSeoQHbGqdAn/view?usp=sharing" },
  { title: "Methodology: Blob Detection", pdfUrl: "https://drive.google.com/file/d/18dcFU6DK24ldIs4egBBDrJCgqchhDqj3/view?usp=sharing" }
];

export default function DocumentGallery() {
  return (
    <div className="document-gallery-grid">
      {documents.map((doc, index) => (
        <a key={index} href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" className="document-card-link">
          <div className="document-card-content">
            {/* PDF Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="document-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h4 className="document-title">{doc.title}</h4>
          </div>
        </a>
      ))}
    </div>
  );
}