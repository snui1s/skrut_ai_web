import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Latest Results",
  description: "View the latest AI analysis and evaluation results for your candidates.",
};

export default function LatestResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
