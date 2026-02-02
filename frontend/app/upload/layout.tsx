import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Start Evaluation",
  description: "Upload resumes and job descriptions for AI-multi-agent candidate screening.",
};

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
