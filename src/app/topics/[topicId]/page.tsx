import { notFound } from "next/navigation";

import { TopicDetail } from "@/components/topics/TopicDetail";
import { getAllTopics, getTopicById } from "@/lib/content";
import type { TopicId } from "@/types/content";

type TopicDetailPageProps = {
  params: Promise<{
    topicId: string;
  }>;
};

export function generateStaticParams() {
  return getAllTopics().map((topic) => ({
    topicId: topic.id,
  }));
}

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const { topicId } = await params;
  const topic = getTopicById(topicId as TopicId);

  if (!topic) {
    notFound();
  }

  return <TopicDetail topic={topic} />;
}
