import { getHarryTopics, type HarrySection, type HarryWing, type HarryTopic as ConfigHarryTopic } from "./harry-config";

// CodeWithHarry course content.
// Only confirmed videoIds are included; the rest are "TODO" placeholders to
// be filled in manually from the official playlists. Do NOT invent IDs.

export type HarryLecture = {
  id: string;
  videoId: string;
  title: string;
  duration: string;
  topicId: string;
  section?: HarrySection;
  wing?: HarryWing;
};

export type HarryTopic = ConfigHarryTopic;

// ── Progress / last-watched localStorage keys ────────────────────────────────

export const HARRY_JAVA_PROGRESS_KEY = "harry-java-progress";
export const HARRY_CPP_PROGRESS_KEY  = "harry-cpp-progress";
export const HARRY_DSA_PROGRESS_KEY  = "harry-dsa-progress";
export const HARRY_JAVA_LAST_KEY     = "harry-java-last";
export const HARRY_CPP_LAST_KEY      = "harry-cpp-last";
export const HARRY_DSA_LAST_KEY      = "harry-dsa-last";

// ── Topics ───────────────────────────────────────────────────────────────────

export const HARRY_JAVA_TOPICS: HarryTopic[] = getHarryTopics("java");
export const HARRY_CPP_TOPICS: HarryTopic[] = getHarryTopics("cpp");
export const HARRY_DSA_TOPICS: HarryTopic[] = getHarryTopics("dsa");

// ── Lectures ─────────────────────────────────────────────────────────────────
// videoId === "TODO" means it still needs to be filled in by hand from the
// official playlist. Never invent 11-char IDs that look real.

export const HARRY_JAVA_LECTURES: HarryLecture[] = [
  // Playlist: https://youtube.com/playlist?list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q
  { id: "hwj-1",  videoId: "ntLJmHOJ0ME", title: "Introduction to Java",            duration: "", topicId: "java-intro" },
  { id: "hwj-2",  videoId: "TODO",        title: "Basic Structure of Java Program", duration: "", topicId: "java-intro" },
  { id: "hwj-3",  videoId: "TODO",        title: "Variables and Data Types",        duration: "", topicId: "java-vars" },
  { id: "hwj-4",  videoId: "TODO",        title: "Literals in Java",                duration: "", topicId: "java-vars" },
  { id: "hwj-5",  videoId: "TODO",        title: "Getting User Input",              duration: "", topicId: "java-vars" },
  { id: "hwj-6",  videoId: "TODO",        title: "Java Exercise 1",                 duration: "", topicId: "java-vars" },
  { id: "hwj-7",  videoId: "TODO",        title: "Chapter 1 Practice Set",          duration: "", topicId: "java-vars" },
  { id: "hwj-8",  videoId: "TODO",        title: "Operators and Expressions",       duration: "", topicId: "java-vars" },
  { id: "hwj-9",  videoId: "TODO",        title: "Associativity of Operators",      duration: "", topicId: "java-vars" },
  { id: "hwj-10", videoId: "TODO",        title: "Expressions & Increment/Decrement", duration: "", topicId: "java-vars" },
  { id: "hwj-11", videoId: "TODO",        title: "Exercise 1 Solution",             duration: "", topicId: "java-vars" },
  { id: "hwj-12", videoId: "TODO",        title: "Chapter 2 Practice Set",          duration: "", topicId: "java-vars" },
  { id: "hwj-13", videoId: "TODO",        title: "Introduction to Strings",         duration: "", topicId: "java-strings" },
  { id: "hwj-14", videoId: "TODO",        title: "String Methods",                  duration: "", topicId: "java-strings" },
  { id: "hwj-15", videoId: "TODO",        title: "Chapter 3 Practice Set",          duration: "", topicId: "java-strings" },
  { id: "hwj-16", videoId: "TODO",        title: "Conditionals — if/else",          duration: "", topicId: "java-control" },
  { id: "hwj-17", videoId: "TODO",        title: "Relational and Logical Operators", duration: "", topicId: "java-control" },
  { id: "hwj-18", videoId: "TODO",        title: "Switch Case Statements",          duration: "", topicId: "java-control" },
  { id: "hwj-19", videoId: "TODO",        title: "Chapter 4 Practice Set",          duration: "", topicId: "java-control" },
  { id: "hwj-20", videoId: "TODO",        title: "Java Exercise 2",                 duration: "", topicId: "java-control" },
  { id: "hwj-21", videoId: "TODO",        title: "While Loops",                     duration: "", topicId: "java-control" },
  { id: "hwj-22", videoId: "TODO",        title: "Do While Loop",                   duration: "", topicId: "java-control" },
  { id: "hwj-23", videoId: "TODO",        title: "For Loops",                       duration: "", topicId: "java-control" },
  { id: "hwj-24", videoId: "TODO",        title: "Break and Continue",              duration: "", topicId: "java-control" },
  { id: "hwj-25", videoId: "TODO",        title: "Chapter 5 Practice Set",          duration: "", topicId: "java-control" },
  { id: "hwj-26", videoId: "TODO",        title: "Introduction to Arrays",          duration: "", topicId: "java-arrays" },
  { id: "hwj-27", videoId: "TODO",        title: "For Each Loop",                   duration: "", topicId: "java-arrays" },
  { id: "hwj-28", videoId: "TODO",        title: "Multidimensional Arrays",         duration: "", topicId: "java-arrays" },
  { id: "hwj-29", videoId: "TODO",        title: "Chapter 6 Practice Set",          duration: "", topicId: "java-arrays" },
  { id: "hwj-30", videoId: "TODO",        title: "Overview of IntelliJ IDEA",       duration: "", topicId: "java-arrays" },
  { id: "hwj-31", videoId: "TODO",        title: "Methods in Java",                 duration: "", topicId: "java-methods" },
  { id: "hwj-32", videoId: "TODO",        title: "Method Overloading",              duration: "", topicId: "java-methods" },
  { id: "hwj-33", videoId: "TODO",        title: "Variable Arguments (Varargs)",    duration: "", topicId: "java-methods" },
  { id: "hwj-34", videoId: "TODO",        title: "Recursion",                       duration: "", topicId: "java-methods" },
  { id: "hwj-35", videoId: "TODO",        title: "Chapter 7 Practice Set",          duration: "", topicId: "java-methods" },
  { id: "hwj-36", videoId: "TODO",        title: "Introduction to OOP",             duration: "", topicId: "java-oop" },
  { id: "hwj-37", videoId: "TODO",        title: "Basic Terminologies in OOP",      duration: "", topicId: "java-oop" },
  { id: "hwj-38", videoId: "TODO",        title: "Custom Class",                    duration: "", topicId: "java-oop" },
  { id: "hwj-39", videoId: "TODO",        title: "Chapter 8 Practice Set",          duration: "", topicId: "java-oop" },
  { id: "hwj-40", videoId: "TODO",        title: "Access Modifiers",                duration: "", topicId: "java-oop" },
  { id: "hwj-41", videoId: "TODO",        title: "Exercise 2 Solution",             duration: "", topicId: "java-oop" },
  { id: "hwj-42", videoId: "TODO",        title: "Constructors",                    duration: "", topicId: "java-oop" },
  { id: "hwj-43", videoId: "TODO",        title: "Java Exercise 3",                 duration: "", topicId: "java-oop" },
  { id: "hwj-44", videoId: "TODO",        title: "Chapter 9 Practice Set",          duration: "", topicId: "java-oop" },
  { id: "hwj-45", videoId: "TODO",        title: "Inheritance",                     duration: "", topicId: "java-advanced" },
  { id: "hwj-46", videoId: "TODO",        title: "Constructors in Inheritance",     duration: "", topicId: "java-advanced" },
  { id: "hwj-47", videoId: "TODO",        title: "this and super Keyword",          duration: "", topicId: "java-advanced" },
  { id: "hwj-48", videoId: "TODO",        title: "Method Overriding",               duration: "", topicId: "java-advanced" },
  { id: "hwj-49", videoId: "TODO",        title: "Dynamic Method Dispatch",         duration: "", topicId: "java-advanced" },
  { id: "hwj-50", videoId: "TODO",        title: "Exercise 3 Solution",             duration: "", topicId: "java-advanced" },
];

export const HARRY_CPP_LECTURES: HarryLecture[] = [
  // TODO: Populate from https://youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL
  // Format: { id: "hwc-1", videoId: "REAL_11_CHAR_ID", title: "...", duration: "mm:ss", topicId: "cpp-intro" }
];

export const HARRY_DSA_LECTURES: HarryLecture[] = [
  { id: "hwd-1", videoId: "5_5oE5lgrhw", title: "Introduction to DSA", duration: "", topicId: "dsa-intro" },
  // TODO: Add remaining ~179 entries from https://youtube.com/playlist?list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi
  // Format: { id: "hwd-2", videoId: "REAL_11_CHAR_ID", title: "...", duration: "mm:ss", topicId: "dsa-arrays" }
];

// ── By-topic maps ────────────────────────────────────────────────────────────

export const HARRY_JAVA_BY_TOPIC: Record<string, HarryLecture[]> =
  HARRY_JAVA_TOPICS.reduce((acc, t) => {
    acc[t.id] = HARRY_JAVA_LECTURES.filter((l) => l.topicId === t.id);
    return acc;
  }, {} as Record<string, HarryLecture[]>);

export const HARRY_CPP_BY_TOPIC: Record<string, HarryLecture[]> =
  HARRY_CPP_TOPICS.reduce((acc, t) => {
    acc[t.id] = HARRY_CPP_LECTURES.filter((l) => l.topicId === t.id);
    return acc;
  }, {} as Record<string, HarryLecture[]>);

export const HARRY_DSA_BY_TOPIC: Record<string, HarryLecture[]> =
  HARRY_DSA_TOPICS.reduce((acc, t) => {
    acc[t.id] = HARRY_DSA_LECTURES.filter((l) => l.topicId === t.id);
    return acc;
  }, {} as Record<string, HarryLecture[]>);
