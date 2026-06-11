export type HarryTrack = "java" | "cpp" | "dsa";

export type HarryWing = "java-dsa" | "cpp-dsa" | "shared-dsa";

export type HarrySection = "core-java" | "core-cpp" | "dsa";

export type HarryTopic = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  section: HarrySection;
  wing: HarryWing;
};

export type HarryTopicMapping = {
  topicId: string;
  section: HarrySection;
  wing: HarryWing;
};

export const YOUTUBE_API_ENV_VAR = "YOUTUBE_API_KEY";

export const HARRY_PLAYLIST_IDS: Record<HarryTrack, string> = {
  java: "PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q",
  cpp: "PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL",
  dsa: "PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi",
};

export const HARRY_TOPICS: Record<HarryTrack, HarryTopic[]> = {
  java: [
    { id: "java-basics", title: "Java Basics", description: "Setup, JDK, first program", emoji: "☕", section: "core-java", wing: "java-dsa" },
    { id: "java-io", title: "Input Output", description: "Input, output and Scanner", emoji: "⌨️", section: "core-java", wing: "java-dsa" },
    { id: "java-operators", title: "Operators", description: "Operators, expressions and precedence", emoji: "➗", section: "core-java", wing: "java-dsa" },
    { id: "java-conditionals", title: "Conditionals", description: "if/else and switch", emoji: "🔀", section: "core-java", wing: "java-dsa" },
    { id: "java-loops", title: "Loops", description: "while, do-while, for, break and continue", emoji: "🔁", section: "core-java", wing: "java-dsa" },
    { id: "java-arrays", title: "Arrays", description: "1D, 2D and multidimensional arrays", emoji: "🗂️", section: "core-java", wing: "java-dsa" },
    { id: "java-strings", title: "Strings", description: "String class and methods", emoji: "📝", section: "core-java", wing: "java-dsa" },
    { id: "java-functions", title: "Functions", description: "Methods, overloading, varargs and recursion", emoji: "⚙️", section: "core-java", wing: "java-dsa" },
    { id: "java-oop", title: "OOP", description: "Classes, constructors, inheritance and polymorphism", emoji: "🎯", section: "core-java", wing: "java-dsa" },
    { id: "java-collections", title: "Collections", description: "Collections framework and common containers", emoji: "🧰", section: "core-java", wing: "java-dsa" },
    { id: "java-exceptions", title: "Exception Handling", description: "Errors, exceptions, try/catch and finally", emoji: "🛡️", section: "core-java", wing: "java-dsa" },
    { id: "java-multithreading", title: "Multithreading", description: "Threads and concurrency basics", emoji: "🧵", section: "core-java", wing: "java-dsa" },
  ],
  cpp: [
    { id: "cpp-basics", title: "Basics", description: "Setup, compiler and first program", emoji: "⚡", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-io", title: "Input Output", description: "cin, cout and iostream", emoji: "⌨️", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-operators", title: "Operators", description: "Operators and expressions", emoji: "➗", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-conditionals", title: "Conditionals", description: "if/else and switch", emoji: "🔀", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-loops", title: "Loops", description: "while, for, break and continue", emoji: "🔁", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-arrays", title: "Arrays", description: "Arrays and 2D arrays", emoji: "🗂️", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-strings", title: "Strings", description: "Strings and character arrays", emoji: "📝", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-functions", title: "Functions", description: "Functions and recursion", emoji: "⚙️", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-pointers", title: "Pointers", description: "Pointers, references and memory", emoji: "🔗", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-oop", title: "OOP", description: "Classes, objects, constructors and inheritance", emoji: "🎯", section: "core-cpp", wing: "cpp-dsa" },
    { id: "cpp-stl", title: "STL", description: "Templates, STL containers and algorithms", emoji: "🧰", section: "core-cpp", wing: "cpp-dsa" },
  ],
  dsa: [
    { id: "dsa-basics", title: "DSA Basics", description: "Introduction and complexity", emoji: "📊", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-arrays", title: "Arrays", description: "Array operations and problems", emoji: "📦", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-searching", title: "Searching", description: "Linear and binary search", emoji: "🔎", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-sorting", title: "Sorting", description: "Major sorting algorithms", emoji: "🔀", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-strings", title: "Strings", description: "String problems and algorithms", emoji: "📝", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-recursion", title: "Recursion", description: "Recursive problem solving", emoji: "🌀", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-linked-lists", title: "Linked Lists", description: "Singly, doubly and circular lists", emoji: "⛓️", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-stacks", title: "Stacks", description: "Stack operations and applications", emoji: "📚", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-queues", title: "Queues", description: "Queues, circular queues and deque", emoji: "🚶", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-trees", title: "Trees", description: "Binary trees and traversals", emoji: "🌳", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-bst", title: "BST", description: "Binary search trees", emoji: "🌲", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-heaps", title: "Heaps", description: "Heap and priority queue", emoji: "🔷", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-graphs", title: "Graphs", description: "BFS, DFS, MST and shortest paths", emoji: "🕸️", section: "dsa", wing: "shared-dsa" },
    { id: "dsa-dp", title: "Dynamic Programming", description: "Memoization and tabulation", emoji: "💡", section: "dsa", wing: "shared-dsa" },
  ],
};

const TOPIC_META = Object.fromEntries(
  Object.values(HARRY_TOPICS).flat().map((topic) => [topic.id, topic]),
) as Record<string, HarryTopic>;

function mapping(topicId: string, track: HarryTrack): HarryTopicMapping {
  const topic = TOPIC_META[topicId] ?? HARRY_TOPICS[track][0];
  return { topicId: topic.id, section: topic.section, wing: topic.wing };
}

export function getHarryTopics(track: HarryTrack): HarryTopic[] {
  return HARRY_TOPICS[track];
}

export function getHarryTopicMapping(topicId: string, track: HarryTrack): HarryTopicMapping {
  return mapping(topicId, track);
}

export function classifyHarryLecture(title: string, track: HarryTrack): HarryTopicMapping {
  const text = title.toLowerCase();

  if (track === "java") {
    if (/\b(thread|multithread|concurren)/i.test(text)) return mapping("java-multithreading", track);
    if (/\b(exception|error|try|catch|finally|throw|throws)\b/i.test(text)) return mapping("java-exceptions", track);
    if (/\b(collection|arraylist|linkedlist|hashmap|hashset|list|map|set interface)\b/i.test(text)) return mapping("java-collections", track);
    if (/\b(oop|class|object|constructor|inherit|polymorphism|override|super|this keyword|abstract|interface|encapsulat|access modifier|package)\b/i.test(text)) return mapping("java-oop", track);
    if (/\b(method|function|recursion|recursive|varargs|overload)\b/i.test(text)) return mapping("java-functions", track);
    if (/\bstring\b/i.test(text)) return mapping("java-strings", track);
    if (/\b(array|arrays|multidimensional|2d array)\b/i.test(text)) return mapping("java-arrays", track);
    if (/\b(loop|loops|while|do while|for loop|break|continue|pattern)\b/i.test(text)) return mapping("java-loops", track);
    if (/\b(if|else|switch|conditional|conditionals|relational|logical)\b/i.test(text)) return mapping("java-conditionals", track);
    if (/\b(operator|operators|expression|precedence|associativity|increment|decrement)\b/i.test(text)) return mapping("java-operators", track);
    if (/\b(input|output|scanner|println|printf|read)\b/i.test(text)) return mapping("java-io", track);
    return mapping("java-basics", track);
  }

  if (track === "cpp") {
    if (/\b(stl|standard template|template|vector|map|set|pair|iterator|algorithm)\b/i.test(text)) return mapping("cpp-stl", track);
    if (/\b(oop|class|object|constructor|inherit|polymorphism|encapsulat|friend|virtual)\b/i.test(text)) return mapping("cpp-oop", track);
    if (/\b(pointer|pointers|reference|memory|address|new\b|delete\b|dynamic memory)\b/i.test(text)) return mapping("cpp-pointers", track);
    if (/\b(function|functions|recursion|recursive|inline function)\b/i.test(text)) return mapping("cpp-functions", track);
    if (/\bstring|character array|char array\b/i.test(text)) return mapping("cpp-strings", track);
    if (/\b(array|arrays|2d array)\b/i.test(text)) return mapping("cpp-arrays", track);
    if (/\b(loop|loops|while|for loop|break|continue|pattern)\b/i.test(text)) return mapping("cpp-loops", track);
    if (/\b(if|else|switch|conditional|conditionals)\b/i.test(text)) return mapping("cpp-conditionals", track);
    if (/\b(operator|operators|expression|precedence)\b/i.test(text)) return mapping("cpp-operators", track);
    if (/\b(input|output|cin|cout|iostream)\b/i.test(text)) return mapping("cpp-io", track);
    return mapping("cpp-basics", track);
  }

  if (/\b(dynamic programming|\bdp\b|memoization|tabulation)\b/i.test(text)) return mapping("dsa-dp", track);
  if (/\b(graph|bfs|dfs|dijkstra|kruskal|prim|mst|topological|shortest path)\b/i.test(text)) return mapping("dsa-graphs", track);
  if (/\b(heap|priority queue)\b/i.test(text)) return mapping("dsa-heaps", track);
  if (/\b(bst|binary search tree)\b/i.test(text)) return mapping("dsa-bst", track);
  if (/\b(tree|binary tree|traversal|avl|trie)\b/i.test(text)) return mapping("dsa-trees", track);
  if (/\b(queue|deque|circular queue)\b/i.test(text)) return mapping("dsa-queues", track);
  if (/\bstack\b/i.test(text)) return mapping("dsa-stacks", track);
  if (/\b(linked list|linked lists|singly|doubly|circular list)\b/i.test(text)) return mapping("dsa-linked-lists", track);
  if (/\b(recursion|recursive|backtracking|backtrack)\b/i.test(text)) return mapping("dsa-recursion", track);
  if (/\bstring|kmp|rabin|pattern matching\b/i.test(text)) return mapping("dsa-strings", track);
  if (/\b(sort|sorting|bubble|merge sort|quick sort|insertion|selection|count sort)\b/i.test(text)) return mapping("dsa-sorting", track);
  if (/\b(search|searching|binary search|linear search)\b/i.test(text)) return mapping("dsa-searching", track);
  if (/\b(array|arrays|two pointer|sliding window)\b/i.test(text)) return mapping("dsa-arrays", track);
  return mapping("dsa-basics", track);
}