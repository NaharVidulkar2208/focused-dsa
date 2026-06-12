import { useMemo } from "react";
import {
  getWingData,
  type HarryLecture,
  type HarryTopic,
  type HarryWing,
} from "@/lib/harry-data";

/**
 * Returns the wing (Core language + DSA) reading entirely from local
 * generated metadata. No network calls — re-run `scripts/sync-harry-content.mjs`
 * to refresh content.
 */
export function useHarryLectures(wing: HarryWing) {
  const { lectures, topics: allTopics } = useMemo(() => getWingData(wing), [wing]);

  const byTopic = useMemo<Record<string, HarryLecture[]>>(
    () =>
      allTopics.reduce((acc, t) => {
        acc[t.id] = lectures.filter((l) => l.topicId === t.id);
        return acc;
      }, {} as Record<string, HarryLecture[]>),
    [lectures, allTopics],
  );

  const topics: HarryTopic[] = useMemo(
    () => allTopics.filter((t) => (byTopic[t.id]?.length ?? 0) > 0),
    [allTopics, byTopic],
  );

  return { lectures, topics, byTopic, isLoading: false, isFromApi: false };
}
