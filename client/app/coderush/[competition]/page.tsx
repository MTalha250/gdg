import CompetitionDetailClient from "./CompetitionDetailClient";

const COMPETITION_SLUGS = [
  "competitive-programming",
  "web-development",
  "app-development",
  "ui-ux",
  "robotics",
  "game-jam",
  "machine-learning",
  "ctf",
];

export function generateStaticParams() {
  return COMPETITION_SLUGS.map((competition) => ({ competition }));
}

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ competition: string }>;
}) {
  const { competition } = await params;
  return <CompetitionDetailClient competition={competition} />;
}
