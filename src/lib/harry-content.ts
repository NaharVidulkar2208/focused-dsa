// Legacy shim — preserved for existing imports of progress/last-watched keys
// and the HarryLecture type. The full content source of truth now lives in
// src/lib/harry-data.ts (driven by the curriculum-mapped generated JSON).

export type { HarryLecture, HarryTopic } from "./harry-data";

export const HARRY_JAVA_PROGRESS_KEY = "harry-java-progress";
export const HARRY_CPP_PROGRESS_KEY = "harry-cpp-progress";
export const HARRY_JAVA_LAST_KEY = "harry-java-last";
export const HARRY_CPP_LAST_KEY = "harry-cpp-last";
