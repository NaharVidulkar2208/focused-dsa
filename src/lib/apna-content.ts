// Apna College DSA in C++ — by Shradha Khapra
// Playlist: https://www.youtube.com/playlist?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt
// 136 lectures from the official playlist, grouped by topic
// Progress: stored in localStorage under APNA_PROGRESS_KEY (no Supabase dependency)

export const APNA_PROGRESS_KEY = "apna-progress";
export const APNA_LAST_WATCHED_KEY = "apna-last-watched";

export type ApnaLecture = {
  id: string;
  videoId: string;
  title: string;
  duration: string;
  topicId: string;
};

export type ApnaTopic = {
  id: string;
  title: string;
  description: string;
  emoji: string;
};

export const APNA_TOPICS: ApnaTopic[] = [
  { id: "foundations", title: "C++ Foundations", description: "Variables, loops, functions, STL", emoji: "🚀" },
  { id: "bit-manip", title: "Bit Manipulation", description: "Binary systems & bitwise operators", emoji: "⚡" },
  { id: "complexity", title: "Time & Space Complexity", description: "Big-O analysis", emoji: "📊" },
  { id: "pointers", title: "Pointers & Memory", description: "Pointers, heap & stack model", emoji: "🔗" },
  { id: "arrays", title: "Arrays", description: "1D/2D arrays, vectors, hashing", emoji: "📦" },
  { id: "searching", title: "Searching", description: "Binary search & variants", emoji: "🔍" },
  { id: "sorting", title: "Sorting", description: "Selection, bubble, merge, quick sort", emoji: "🔀" },
  { id: "strings", title: "Strings", description: "String operations & problems", emoji: "📝" },
  { id: "math", title: "Math Fundamentals", description: "Sieve, GCD & number theory", emoji: "🧮" },
  { id: "recursion", title: "Recursion", description: "Recursive thinking & problems", emoji: "🔄" },
  { id: "backtracking", title: "Backtracking", description: "Permutations, N-Queens, Sudoku", emoji: "🌿" },
  { id: "oop", title: "OOP in C++", description: "Classes, inheritance, polymorphism", emoji: "🎯" },
  { id: "linked-list", title: "Linked List", description: "Singly, doubly & circular lists", emoji: "⛓️" },
  { id: "stack", title: "Stack", description: "Stack ops, monotonic stack", emoji: "📚" },
  { id: "queue", title: "Queue", description: "Queue, deque, sliding window", emoji: "🚦" },
  { id: "trees", title: "Trees & BST", description: "Binary trees, BST, traversals", emoji: "🌳" },
  { id: "graphs", title: "Graphs", description: "BFS/DFS, MST, shortest paths", emoji: "🕸️" },
];

export const APNA_LECTURES: ApnaLecture[] = [

  // ── foundations ──
  { id: "apna-f1", videoId: "VTLCoHnyACE", title: "Flowchart & Pseudocode + Installation", duration: "1:25:52", topicId: "foundations" },
  { id: "apna-f2", videoId: "Dxu7GKtdbnA", title: "Variable, Data Types & Operators", duration: "1:16:44", topicId: "foundations" },
  { id: "apna-f3", videoId: "qR9U6bKxJ7g", title: "Conditional Statements & Loops", duration: "1:34:39", topicId: "foundations" },
  { id: "apna-f4", videoId: "rga_q2N7vU8", title: "Patterns", duration: "1:31:07", topicId: "foundations" },
  { id: "apna-f5", videoId: "P08Z_NC8GuY", title: "Functions", duration: "49:13", topicId: "foundations" },
  { id: "apna-f6", videoId: "okhdtEk1iKk", title: "Standard Template Library - One Shot", duration: "1:27:20", topicId: "foundations" },
  { id: "apna-f7", videoId: "varXreLWPRo", title: "How to setup C++ compiler on Mac ? — Software Installation for Mac users", duration: "1:40", topicId: "foundations" },
  { id: "apna-f8", videoId: "SBQfXK7q5K4", title: "One Major update & reaching 1000M views", duration: "3:50", topicId: "foundations" },
  { id: "apna-f9", videoId: "YlmU4gBgePA", title: "New DSA Sheet — DP, Heaps, Tries etc", duration: "6:24", topicId: "foundations" },

  // ── bit-manip ──
  { id: "apna-b1", videoId: "xpy5NXiBFvA", title: "Binary Number System", duration: "37:20", topicId: "bit-manip" },
  { id: "apna-b2", videoId: "r-u4uh3QvsQ", title: "Bitwise Operators, Data Type Modifiers & more", duration: "38:33", topicId: "bit-manip" },

  // ── complexity ──
  { id: "apna-c1", videoId: "PwKv8fOcriM", title: "Time & Space Complexity - DSA Series by Shradha Ma'am", duration: "1:25:41", topicId: "complexity" },

  // ── pointers ──
  { id: "apna-p1", videoId: "qYEjR6M0wSk", title: "Pointers in C++ — In Detail", duration: "46:08", topicId: "pointers" },

  // ── arrays ──
  { id: "apna-a1", videoId: "8wmn7k1TTcI", title: "Array Data Structure - Part1", duration: "54:07", topicId: "arrays" },
  { id: "apna-a2", videoId: "NWg38xWYzEg", title: "Vectors in C++ — Arrays Part 2", duration: "40:06", topicId: "arrays" },
  { id: "apna-a3", videoId: "9IZYqostl2M", title: "Kadane's Algorithm — Maximum Subarray Sum", duration: "23:29", topicId: "arrays" },
  { id: "apna-a4", videoId: "_xqIp2rj8bo", title: "Majority Element — Brute- Better-Best Approach — Moore's Voting Algorithm — & Pair Sum", duration: "39:10", topicId: "arrays" },
  { id: "apna-a5", videoId: "WBzZCm46mFo", title: "Buy and Sell Stock Problem and Pow(X,N) Power exponential Problem - Leetcode", duration: "29:10", topicId: "arrays" },
  { id: "apna-a6", videoId: "EbkMABpP52U", title: "Container with Most Water Problem — Brute & Optimal Solution — Two Pointer Approach - Leetcode 11", duration: "32:00", topicId: "arrays" },
  { id: "apna-a7", videoId: "TW2m8m_FNJE", title: "Product of Array Except Self — Brute to Optimal Solution", duration: "29:30", topicId: "arrays" },
  { id: "apna-a8", videoId: "lBL8327gq8I", title: "2D Arrays in C++ — Part 1", duration: "37:31", topicId: "arrays" },
  { id: "apna-a9", videoId: "LEFFjgt5i6w", title: "Search a 2D Matrix - Variation I & II — 2D Arrays - Part 2", duration: "37:43", topicId: "arrays" },
  { id: "apna-a10", videoId: "XMpdvwUObho", title: "Spiral Matrix — 2D Arrays - Part 3", duration: "24:33", topicId: "arrays" },
  { id: "apna-a11", videoId: "0Fxc_jKj2vo", title: "Two Sum — Find Duplicate — Find Repeating & Missing Values — Hashing Problems", duration: "53:30", topicId: "arrays" },
  { id: "apna-a12", videoId: "K-RsltkN63w", title: "3 Sum — Brute, Better & Optimized Approach with Codes", duration: "43:43", topicId: "arrays" },
  { id: "apna-a13", videoId: "X6sL8JTROLY", title: "4 Sum Problem — Optimal Approach", duration: "23:02", topicId: "arrays" },
  { id: "apna-a14", videoId: "KDH4mhFVvHw", title: "Subarray Sum Equals K — Brute-Better-Optimal approach", duration: "34:45", topicId: "arrays" },

  // ── searching ──
  { id: "apna-s1", videoId: "TbbSJrY5GqQ", title: "Binary Search Algorithm - Iterative and Recursive Method — [Theory + Code] with Example", duration: "44:16", topicId: "searching" },
  { id: "apna-s2", videoId: "6WNZQBHWQJs", title: "Search in Rotated Sorted Array — Binary Search", duration: "19:30", topicId: "searching" },
  { id: "apna-s3", videoId: "RjxD6UXGlhc", title: "Peak Index in Mountain Array — Binary Search", duration: "23:34", topicId: "searching" },
  { id: "apna-s4", videoId: "qsbCBduIs40", title: "Single Element in Sorted Array — Binary Search", duration: "27:33", topicId: "searching" },
  { id: "apna-s5", videoId: "JRAByolWqhw", title: "Book Allocation or Allocate Books Problem", duration: "32:59", topicId: "searching" },
  { id: "apna-s6", videoId: "srsFN5OHBgw", title: "Painter's Partition Problem", duration: "27:44", topicId: "searching" },
  { id: "apna-s7", videoId: "7wOzDqsfXy0", title: "Aggressive Cows Problem", duration: "30:12", topicId: "searching" },

  // ── sorting ──
  { id: "apna-so1", videoId: "1jCFUv-Xlqo", title: "Sorting Algorithms — Bubble Sort, Selection Sort & Insertion Sort", duration: "34:33", topicId: "sorting" },
  { id: "apna-so2", videoId: "J48aGjfjYTI", title: "Sort an Array of 0s, 1s & 2s — DNF Sorting Algorithm", duration: "33:39", topicId: "sorting" },
  { id: "apna-so3", videoId: "-1cLK6PaLsQ", title: "Merge Sorted Arrays Problem and Next Permutation Problem", duration: "43:49", topicId: "sorting" },
  { id: "apna-so4", videoId: "cQDtOBTy7_Y", title: "Merge Sort Algorithm — Recursion & Backtracking", duration: "32:04", topicId: "sorting" },
  { id: "apna-so5", videoId: "8MNB0Mba_Dc", title: "Quick Sort Algorithm - Lecture 51 of Complete DSA Placement Series", duration: "26:23", topicId: "sorting" },
  { id: "apna-so6", videoId: "ynnWDBTdVi0", title: "Count Inversions Problem — Brute and Optimal", duration: "24:33", topicId: "sorting" },

  // ── strings ──
  { id: "apna-str1", videoId: "MOSjYaVymcU", title: "Strings & Character Arrays in C++  -  Part 1", duration: "30:03", topicId: "strings" },
  { id: "apna-str2", videoId: "dSRFgEs3a6A", title: "Valid Palindrome & Remove all Occurrences — Strings Part 2", duration: "24:02", topicId: "strings" },
  { id: "apna-str3", videoId: "VXewy91P0S4", title: "Strings - Part 3 — Permutation in String", duration: "21:41", topicId: "strings" },
  { id: "apna-str4", videoId: "RitppzIdMCo", title: "Strings - Part 4 — Reverse Words in String", duration: "14:42", topicId: "strings" },
  { id: "apna-str5", videoId: "cAB15h6-sWA", title: "String Compression problem - Lecture 32", duration: "19:29", topicId: "strings" },

  // ── math ──
  { id: "apna-m1", videoId: "Y4KdgqV1IqA", title: "Maths for DSA - One Shot — Euclid's Algorithm — Sieve of Eratosthenes — Modular Arithmetics", duration: "55:48", topicId: "math" },

  // ── recursion ──
  { id: "apna-r1", videoId: "9OsMG4fI4OY", title: "Recursion Tutorial - Basics to Advanced — Part 1", duration: "46:22", topicId: "recursion" },
  { id: "apna-r2", videoId: "4iT-GhvSKzc", title: "Recursion Part 2 : Fibonacci numbers problem, Binary search problem, Find if array sorted problem", duration: "41:30", topicId: "recursion" },

  // ── backtracking ──
  { id: "apna-bt1", videoId: "pNzljlzDCiI", title: "Recursion Part 3 : Backtracking in Detail — Print all Subsets — Subsets II", duration: "42:20", topicId: "backtracking" },
  { id: "apna-bt2", videoId: "N4gJDGdhpLw", title: "Permutations of an Array/String — Recursion & Backtracking", duration: "22:55", topicId: "backtracking" },
  { id: "apna-bt3", videoId: "BdSJnIdR-4s", title: "N-Queens Problem — using Backtracking", duration: "24:26", topicId: "backtracking" },
  { id: "apna-bt4", videoId: "70cP3qtJp-s", title: "Sudoku Solver Problem — using Backtracking", duration: "26:58", topicId: "backtracking" },
  { id: "apna-bt5", videoId: "D8Yze9CDDAw", title: "Rat in a Maze Problem — Backtracking", duration: "32:45", topicId: "backtracking" },
  { id: "apna-bt6", videoId: "jkgZw2WEaqA", title: "Combination Sum Problem — Recursion & Backtracking", duration: "23:35", topicId: "backtracking" },
  { id: "apna-bt7", videoId: "aZ0B1eWkSVU", title: "Palindrome Partitioning Problem — Recursion & Backtracking", duration: "20:44", topicId: "backtracking" },
  { id: "apna-bt8", videoId: "Sp1jzttFVdE", title: "KNIGHTS TOUR Problem - Backtracking", duration: "22:32", topicId: "backtracking" },

  // ── oop ──
  { id: "apna-oop1", videoId: "mlIUKyZIUUU", title: "OOPs Tutorial in One Shot — Object Oriented Programming — in C++ Language — for Placement Interviews", duration: "2:04:23", topicId: "oop" },

  // ── linked-list ──
  { id: "apna-ll1", videoId: "LyuuqCVkP5I", title: "Introduction to Linked List", duration: "50:43", topicId: "linked-list" },
  { id: "apna-ll2", videoId: "R-CKBYnOv1U", title: "Reverse a Linked List", duration: "10:29", topicId: "linked-list" },
  { id: "apna-ll3", videoId: "nzaHG0dme4g", title: "Middle of a Linked List", duration: "10:32", topicId: "linked-list" },
  { id: "apna-ll4", videoId: "-1E8ZMS0gSs", title: "Detect & Remove Cycle in Linked List", duration: "30:24", topicId: "linked-list" },
  { id: "apna-ll5", videoId: "f8RPIb-0DDE", title: "Merge Two Sorted Lists", duration: "12:41", topicId: "linked-list" },
  { id: "apna-ll6", videoId: "8ze7Zopdsaw", title: "Copy List with Random Pointer", duration: "20:52", topicId: "linked-list" },
  { id: "apna-ll7", videoId: "bO5DasTsaRQ", title: "Doubly Linked List Tutorial", duration: "32:16", topicId: "linked-list" },
  { id: "apna-ll8", videoId: "e6lZY5Yha8U", title: "Circular Linked List in Data Structures", duration: "33:56", topicId: "linked-list" },
  { id: "apna-ll9", videoId: "I8b0rff5F9M", title: "Flatten a Doubly Linked List", duration: "24:47", topicId: "linked-list" },
  { id: "apna-ll10", videoId: "-swgIiMIlJo", title: "Reverse Nodes in K-Group — Linked List", duration: "20:39", topicId: "linked-list" },
  { id: "apna-ll11", videoId: "wwbTMNVlFHQ", title: "Swap Nodes in Pairs — Linked List", duration: "20:06", topicId: "linked-list" },

  // ── stack ──
  { id: "apna-stk1", videoId: "0X-fV-1ir9c", title: "Introduction to STACKS", duration: "22:11", topicId: "stack" },
  { id: "apna-stk2", videoId: "NlHupEeDXzY", title: "Valid Parentheses", duration: "16:25", topicId: "stack" },
  { id: "apna-stk3", videoId: "01vBuZyMfqk", title: "Stock Span Problem — Optimal Solution", duration: "26:29", topicId: "stack" },
  { id: "apna-stk4", videoId: "NKbExYwvjb0", title: "Next Greater Element — Optimal Solution & Code", duration: "23:32", topicId: "stack" },
  { id: "apna-stk5", videoId: "WnjUfBn9nZM", title: "Previous Smaller Element — Optimal Solution & Code", duration: "9:24", topicId: "stack" },
  { id: "apna-stk6", videoId: "wHDm-N2m2XY", title: "Design a Min Stack — Optimal Solution & Code", duration: "24:34", topicId: "stack" },
  { id: "apna-stk7", videoId: "ysy1o-QEj3k", title: "Largest Rectangle in Histogram — Best Solution & Code", duration: "32:56", topicId: "stack" },
  { id: "apna-stk8", videoId: "If--3pm9K3U", title: "Next Greater Element - II — Stack & Queue", duration: "20:04", topicId: "stack" },
  { id: "apna-stk9", videoId: "UHHp8USwx4M", title: "Trapping Rainwater Problem — Optimal Solution & Code", duration: "30:50", topicId: "stack" },
  { id: "apna-stk10", videoId: "OZPmEA_8FM8", title: "The Celebrity Problem — Stack & Queue", duration: "15:11", topicId: "stack" },
  { id: "apna-stk11", videoId: "GsY6y0iPaHw", title: "Implement LRU Cache — Linked List", duration: "35:34", topicId: "stack" },

  // ── queue ──
  { id: "apna-q1", videoId: "Khf9v67Ya30", title: "New Chapter : Queue Data Structure", duration: "18:55", topicId: "queue" },
  { id: "apna-q2", videoId: "4mKKolshFD0", title: "Circular Queue in Data Strucuture", duration: "18:37", topicId: "queue" },
  { id: "apna-q3", videoId: "sFvP5Ois0CE", title: "Implement Queue using Stack & Stack using Queue", duration: "15:47", topicId: "queue" },
  { id: "apna-q4", videoId: "sqyCBvEQN9c", title: "First Unique Character in String — Easy - Leetcode387", duration: "13:23", topicId: "queue" },
  { id: "apna-q5", videoId: "XwG5cozqfaM", title: "Sliding Window Maximum", duration: "31:22", topicId: "queue" },
  { id: "apna-q6", videoId: "SmTow5Ht4iU", title: "Gas Station — Greedy Approach", duration: "22:16", topicId: "queue" },

  // ── trees ──
  { id: "apna-tree1", videoId: "eKJrXBCRuNQ", title: "Binary Trees in Data Structures — Tree Traversal", duration: "1:14:15", topicId: "trees" },
  { id: "apna-tree2", videoId: "7tzHzN_Ehus", title: "Count of Nodes in a Binary Tree", duration: "23:09", topicId: "trees" },
  { id: "apna-tree3", videoId: "tumW7jsjv68", title: "Subtree of another Tree", duration: "23:28", topicId: "trees" },
  { id: "apna-tree4", videoId: "aPyDPImR5UM", title: "Diameter of Binary Tree", duration: "19:29", topicId: "trees" },
  { id: "apna-tree5", videoId: "FGr-syrhvOA", title: "Top View of a Binary Tree", duration: "19:39", topicId: "trees" },
  { id: "apna-tree6", videoId: "ze4JO_ODl3w", title: "Kth Level of a Binary Tree", duration: "7:59", topicId: "trees" },
  { id: "apna-tree7", videoId: "oX5D0uKOMck", title: "Lowest Common Ancestor in Binary Tree", duration: "18:20", topicId: "trees" },
  { id: "apna-tree8", videoId: "33b1M980cCA", title: "Build Tree from Preorder & Inorder", duration: "20:59", topicId: "trees" },
  { id: "apna-tree9", videoId: "TY6kEejJEM0", title: "Transform to Sum Tree", duration: "8:41", topicId: "trees" },
  { id: "apna-tree10", videoId: "AWJD__CfM6A", title: "Binary Tree Paths", duration: "10:01", topicId: "trees" },
  { id: "apna-tree11", videoId: "rhz-csskg_A", title: "Maximum Width of Binary Tree", duration: "21:09", topicId: "trees" },
  { id: "apna-tree12", videoId: "PUfADhkq1LI", title: "Morris Inorder Traversal", duration: "17:52", topicId: "trees" },
  { id: "apna-tree13", videoId: "dU2Z5HWSGM0", title: "Flatten Binary Tree to Linked List", duration: "15:43", topicId: "trees" },
  { id: "apna-tree14", videoId: "RuF7dPfj27Q", title: "Binary Search Trees (BSTs)", duration: "43:16", topicId: "trees" },
  { id: "apna-tree15", videoId: "0s6sCjs_4g0", title: "Sorted Array to Balanced BST", duration: "8:44", topicId: "trees" },
  { id: "apna-tree16", videoId: "dSBcCynP1nA", title: "Validate Binary Search Tree", duration: "12:41", topicId: "trees" },
  { id: "apna-tree17", videoId: "WZmjRXF_Zi4", title: "Min Distance between BST Nodes", duration: "14:16", topicId: "trees" },
  { id: "apna-tree18", videoId: "Kq4BbvIhj44", title: "Kth Smallest in BST", duration: "12:42", topicId: "trees" },
  { id: "apna-tree19", videoId: "ORxkZ12FrU4", title: "Lowest Common Ancestor in BST", duration: "12:29", topicId: "trees" },
  { id: "apna-tree20", videoId: "-n5Ur1wE5Jc", title: "Construct BST from Preorder", duration: "19:10", topicId: "trees" },
  { id: "apna-tree21", videoId: "AiKZjCuy2k4", title: "Merge Two Binary Search Trees", duration: "16:39", topicId: "trees" },
  { id: "apna-tree22", videoId: "0KGzfij_SCk", title: "Recover BST", duration: "24:03", topicId: "trees" },
  { id: "apna-tree23", videoId: "Pr-HFxp7npk", title: "Largest BST in Binary Tree", duration: "24:56", topicId: "trees" },
  { id: "apna-tree24", videoId: "a8VKpW1DsD8", title: "Populate Next Right Pointers in Each Node", duration: "11:12", topicId: "trees" },
  { id: "apna-tree25", videoId: "dS1bKglre3A", title: "BST Iterator", duration: "17:16", topicId: "trees" },
  { id: "apna-tree26", videoId: "IHNkql1tAnk", title: "Inorder Predecessor & Successor in BST", duration: "19:50", topicId: "trees" },

  // ── graphs ──
  { id: "apna-graph1", videoId: "RpgyCJBbl5E", title: "Introduction to Graphs", duration: "26:08", topicId: "graphs" },
  { id: "apna-graph2", videoId: "scQITTLgFJo", title: "BFS Traversal in Graphs", duration: "18:31", topicId: "graphs" },
  { id: "apna-graph3", videoId: "3czYbhac160", title: "DFS Traversal in Graphs", duration: "14:03", topicId: "graphs" },
  { id: "apna-graph4", videoId: "OZClCpPQDR4", title: "Detect a Cycle in Undirected Graph using DFS", duration: "19:45", topicId: "graphs" },
  { id: "apna-graph5", videoId: "MIjOkApZ39g", title: "Detect a Cycle in Undirected Graph using BFS", duration: "18:23", topicId: "graphs" },
  { id: "apna-graph6", videoId: "AME6baBpswY", title: "Number of Islands — Connected Components in Matrix", duration: "17:05", topicId: "graphs" },
  { id: "apna-graph7", videoId: "RmXo5SWkhCs", title: "Rotting Oranges — Multi-source BFS", duration: "26:22", topicId: "graphs" },
  { id: "apna-graph8", videoId: "AcppN5XFt24", title: "Detect a Cycle in Directed Graph using DFS", duration: "15:59", topicId: "graphs" },
  { id: "apna-graph9", videoId: "0WIINUY12Yg", title: "Topological Sorting in Graph — using DFS", duration: "15:58", topicId: "graphs" },
  { id: "apna-graph10", videoId: "37cJ38HadM4", title: "Course Schedule Problem — using Graph & Topological Sort", duration: "17:54", topicId: "graphs" },
  { id: "apna-graph11", videoId: "rZsgWxodGmM", title: "Course Schedule II Problem — using Graph & Topological Sort", duration: "19:33", topicId: "graphs" },
  { id: "apna-graph12", videoId: "JI_e2RzARbM", title: "Flood Fill Algorithm — Graph Problem", duration: "15:10", topicId: "graphs" },
  { id: "apna-graph13", videoId: "BnQpaTZg6Sc", title: "Topological Sorting using Kahn's Algorithm", duration: "18:47", topicId: "graphs" },
  { id: "apna-graph14", videoId: "8gYBHjtjWBI", title: "Dijkstra's Algorithm - Single Source Shortest Path - Greedy Method", duration: "35:20", topicId: "graphs" },
  { id: "apna-graph15", videoId: "3rFHlbJ7qKc", title: "Bellman Ford Algorithm - Single Source Shortest Path - Dynamic Programming", duration: "23:38", topicId: "graphs" },
  { id: "apna-graph16", videoId: "Sflh1z6cIMk", title: "Prim's Algorithm - Minimum Spanning Tree in Graph", duration: "26:07", topicId: "graphs" },
  { id: "apna-graph17", videoId: "nnrjWxWMo3E", title: "Disjoint Set Union — With Rank/Size & Path Compression — Union Find", duration: "34:04", topicId: "graphs" },
  { id: "apna-graph18", videoId: "inoM6jwj1CA", title: "Kruskal's Algorithm - Minimum Spanning Tree in Graph", duration: "29:07", topicId: "graphs" },
  { id: "apna-graph19", videoId: "J1yCPIP-K8s", title: "Number of Provinces — Graph Problem", duration: "12:35", topicId: "graphs" },
  { id: "apna-graph20", videoId: "mEx8JJQJUs8", title: "Min Cost to Connect All Points — Graph Problem", duration: "21:16", topicId: "graphs" },
  { id: "apna-graph21", videoId: "CLmykzpeCCs", title: "Cheapest Flights Within K Stops — Graph Problem", duration: "30:29", topicId: "graphs" },
  { id: "apna-graph22", videoId: "6h1SucBNxgc", title: "Bridge in Graph using Tarjan's Algorithm — Critical Connections", duration: "32:36", topicId: "graphs" },
  { id: "apna-graph23", videoId: "cn7pov3BEmg", title: "Articulation Point in Graph using Tarjan's Algorithm — Critical Points", duration: "36:53", topicId: "graphs" },
  { id: "apna-graph24", videoId: "lqY8TE0P1S8", title: "Strongly Connected Components - Kosaraju's Algorithm — Graphs", duration: "26:26", topicId: "graphs" },
  { id: "apna-graph25", videoId: "iZBXd-vjHUA", title: "Floyd Warshall Algorithm — All Pairs Shortest Path in Graph", duration: "27:36", topicId: "graphs" },
];

/** Lectures grouped by topic, in the same order as APNA_TOPICS */
export const APNA_LECTURES_BY_TOPIC: Record<string, ApnaLecture[]> = APNA_TOPICS.reduce(
  (acc, t) => {
    acc[t.id] = APNA_LECTURES.filter((l) => l.topicId === t.id);
    return acc;
  },
  {} as Record<string, ApnaLecture[]>,
);
