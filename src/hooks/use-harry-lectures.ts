import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHarryPlaylist } from "@/lib/harry-playlists.functions";
import {
  type HarryLecture,
  type HarryTopic,
  HARRY_JAVA_LECTURES, HARRY_JAVA_TOPICS,
  HARRY_CPP_LECTURES,  HARRY_CPP_TOPICS,
  HARRY_DSA_LECTURES,  HARRY_DSA_TOPICS,
} from "@/lib/harry-content";

type Track = "java" | "cpp" | "dsa";

const FALLBACKS: Record<Track, HarryLecture[]> = {
  java: HARRY_JAVA_LECTURES.filter((l) => l.videoId !== "TODO"),
  cpp:  HARRY_CPP_LECTURES.filter((l)  => l.videoId !== "TODO"),
  dsa:  HARRY_DSA_LECTURES.filter((l)  => l.videoId !== "TODO"),
};

const TOPICS: Record<Track, HarryTopic[]> = {
  java: HARRY_JAVA_TOPICS,
  cpp:  HARRY_CPP_TOPICS,
  dsa:  HARRY_DSA_TOPICS,
};

export function useHarryLectures(track: Track) {
  const query = useQuery({
    queryKey: ["harry-playlist", track],
    queryFn: () => fetchHarryPlaylist({ data: { track } }),
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  const lectures: HarryLecture[] = useMemo(() => {
    if (query.data && query.data.length > 0) {
      return query.data.map((l) => ({
        id: l.id,
        videoId: l.videoId,
        title: l.title,
        duration: l.duration,
        topicId: l.topicId,
        section: l.section,
        wing: l.wing,
      }));
    }
    return FALLBACKS[track];
  }, [query.data, track]);

  const allTopics = TOPICS[track];

  const byTopic = useMemo<Record<string, HarryLecture[]>>(() => {
    return allTopics.reduce((acc, t) => {
      acc[t.id] = lectures.filter((l) => l.topicId === t.id);
      return acc;
    }, {} as Record<string, HarryLecture[]>);
  }, [lectures, allTopics]);

  const topics = useMemo(
    () => allTopics.filter((t) => (byTopic[t.id]?.length ?? 0) > 0),
    [allTopics, byTopic],
  );

  return {
    lectures,
    topics,
    byTopic,
    isLoading: query.isLoading && lectures.length === 0,
    isFromApi: !!query.data && query.data.length > 0,
  };
}
