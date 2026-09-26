import { Question, CodingProblem, CompanyTrack } from '../types';

export const CURATED_QUESTIONS: Record<string, Question[]> = {
  'Quantitative Aptitude': [
    {
      id: 'qa-1',
      category: 'Quantitative Aptitude',
      topic: 'Time and Work',
      difficulty: 'Intermediate',
      question: 'A can complete a piece of work in 12 days and B can do it in 16 days. They work together for 4 days. What fraction of the work remains unfinished?',
      options: ['7/12', '5/12', '1/3', '1/4'],
      correctAnswerIndex: 1,
      explanation: 'Work done by A in 1 day = 1/12. Work done by B in 1 day = 1/16. Combined work in 1 day = 1/12 + 1/16 = 7/48. In 4 days, work done = 4 * (7/48) = 7/12. Fraction remaining = 1 - 7/12 = 5/12.'
    },
    {
      id: 'qa-2',
      category: 'Quantitative Aptitude',
      topic: 'Percentages & Profit Loss',
      difficulty: 'Beginner',
      question: 'A shopkeeper marks an article at 25% above cost price and allows a discount of 10% on the marked price. What is his net profit percentage?',
      options: ['12.5%', '15%', '10%', '14.2%'],
      correctAnswerIndex: 0,
      explanation: 'Let CP = 100. MP = 125. Selling Price = 125 * (1 - 0.10) = 112.5. Profit = 112.5 - 100 = 12.5%.'
    },
    {
      id: 'qa-3',
      category: 'Quantitative Aptitude',
      topic: 'Permutations & Combinations',
      difficulty: 'Intermediate',
      question: 'In how many different ways can the letters of the word "ENGINEER" be arranged?',
      options: ['40320', '3360', '10080', '6720'],
      correctAnswerIndex: 1,
      explanation: '"ENGINEER" has 8 letters: E appears 3 times, N appears 2 times. Total permutations = 8! / (3! * 2!) = 40320 / (6 * 2) = 40320 / 12 = 3360.'
    },
    {
      id: 'qa-4',
      category: 'Quantitative Aptitude',
      topic: 'Speed, Time and Distance',
      difficulty: 'Intermediate',
      question: 'A train 150 meters long passes a telegraph post in 12 seconds. What is the speed of the train in km/hr?',
      options: ['45 km/h', '50 km/h', '40 km/h', '60 km/h'],
      correctAnswerIndex: 0,
      explanation: 'Speed = Distance / Time = 150 / 12 = 12.5 m/s. Converting to km/h: 12.5 * (18 / 5) = 45 km/h.'
    },
    {
      id: 'qa-5',
      category: 'Quantitative Aptitude',
      topic: 'Probability',
      difficulty: 'Advanced',
      question: 'Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?',
      options: ['1/4', '3/4', '1/2', '5/8'],
      correctAnswerIndex: 1,
      explanation: 'Total outcomes = 36. Product is odd only when both dice show odd numbers: 3 * 3 = 9 outcomes. Product is even in 36 - 9 = 27 outcomes. Probability = 27 / 36 = 3/4.'
    }
  ],
  'Logical Reasoning': [
    {
      id: 'lr-1',
      category: 'Logical Reasoning',
      topic: 'Syllogisms',
      difficulty: 'Intermediate',
      question: 'Statements: 1. All trees are leaves. 2. Some leaves are flowers. Conclusions: I. Some trees are flowers. II. Some flowers are leaves.',
      options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
      correctAnswerIndex: 1,
      explanation: 'Statement 2 directly converts to "Some flowers are leaves" (universal particular conversion), so II is guaranteed. I does not necessarily follow from the Venn overlap.'
    },
    {
      id: 'lr-2',
      category: 'Logical Reasoning',
      topic: 'Blood Relations',
      difficulty: 'Beginner',
      question: 'Pointing to a photograph, Rajesh said, "She is the daughter of my grandfather\'s only son." How is the woman related to Rajesh?',
      options: ['Mother', 'Sister', 'Aunt', 'Cousin'],
      correctAnswerIndex: 1,
      explanation: "Grandfather's only son is Rajesh's father. The daughter of Rajesh's father is Rajesh's sister."
    },
    {
      id: 'lr-3',
      category: 'Logical Reasoning',
      topic: 'Coding-Decoding',
      difficulty: 'Intermediate',
      question: 'If "CLOUD" is coded as "ENQWF", how will "PILOT" be coded in the same pattern?',
      options: ['RKNQV', 'RKNQW', 'RJMRV', 'QKMQU'],
      correctAnswerIndex: 0,
      explanation: 'Each letter is shifted by +2: C(+2)->E, L(+2)->N, O(+2)->Q, U(+2)->W, D(+2)->F. Similarly: P(+2)->R, I(+2)->K, L(+2)->N, O(+2)->Q, T(+2)->V -> RKNQV.'
    },
    {
      id: 'lr-4',
      category: 'Logical Reasoning',
      topic: 'Seating Arrangement',
      difficulty: 'Advanced',
      question: 'Six friends A, B, C, D, E, F are sitting in a circle facing the center. B is between A and C. E is between D and F. A is immediately left of D. Who is sitting opposite to B?',
      options: ['E', 'D', 'F', 'C'],
      correctAnswerIndex: 0,
      explanation: 'Arranging the circle with A at position 1 (facing center): D is to the right of A. Following the conditions, B sits directly opposite to E.'
    },
    {
      id: 'lr-5',
      category: 'Logical Reasoning',
      topic: 'Number Series',
      difficulty: 'Intermediate',
      question: 'Find the next number in the sequence: 4, 9, 25, 49, 121, 169, ?',
      options: ['196', '225', '289', '256'],
      correctAnswerIndex: 2,
      explanation: 'The numbers are squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169. Next prime is 17: 17^2 = 289.'
    }
  ],
  'Programming': [
    {
      id: 'prog-1',
      category: 'Programming',
      topic: 'Time Complexity',
      difficulty: 'Intermediate',
      question: 'What is the time complexity of the following code snippet?\nfor (int i = 1; i <= n; i *= 2) {\n    for (int j = 0; j < i; j++) {\n        sum++;\n    }\n}',
      options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
      correctAnswerIndex: 0,
      explanation: 'The inner loop runs 1 + 2 + 4 + ... + 2^k times, where 2^k <= n. This geometric series sum is 2^(k+1) - 1, which equals 2n - 1 = O(n).'
    },
    {
      id: 'prog-2',
      category: 'Programming',
      topic: 'Pointers & Memory',
      difficulty: 'Intermediate',
      question: 'In C, what is the effect of calling free(ptr) on a dynamically allocated pointer without setting ptr to NULL?',
      options: [
        'Memory is kept allocated in cache',
        'ptr becomes a dangling pointer pointing to deallocated memory',
        'A segmentation fault immediately occurs on the free call',
        'The compiler automatically resets ptr to 0'
      ],
      correctAnswerIndex: 1,
      explanation: 'free(ptr) returns the memory block to the heap allocator, but the variable ptr retains the old memory address. Accessing it subsequently creates undefined behavior known as a dangling pointer.'
    },
    {
      id: 'prog-3',
      category: 'Programming',
      topic: 'OOP Concepts',
      difficulty: 'Beginner',
      question: 'Which OOP principle is demonstrated when a subclass provides a specific implementation of a method that is already defined in its superclass?',
      options: ['Method Overloading', 'Method Overriding', 'Encapsulation', 'Abstraction'],
      correctAnswerIndex: 1,
      explanation: 'Method Overriding (runtime polymorphism) occurs when a subclass defines a method with the exact same signature as a method in its parent class.'
    },
    {
      id: 'prog-4',
      category: 'Programming',
      topic: 'Recursion & Call Stack',
      difficulty: 'Intermediate',
      question: 'What is the base condition risk in recursion when the termination check is missing or improperly formulated?',
      options: ['Memory fragmentation', 'Stack Overflow Error', 'Deadlock', 'Null Pointer Exception'],
      correctAnswerIndex: 1,
      explanation: 'Without a valid base condition, recursive function calls push activation frames onto the call stack continuously until available thread stack memory is exhausted, throwing a Stack Overflow.'
    },
    {
      id: 'prog-5',
      category: 'Programming',
      topic: 'Concurrency & Threads',
      difficulty: 'Advanced',
      question: 'What is a "race condition" in multi-threaded programming?',
      options: [
        'Two threads running at different CPU clock speeds',
        'When multiple threads access shared data concurrently and the final result depends on thread execution scheduling',
        'A thread waiting indefinitely for a resource held by another',
        'A CPU core running at 100% capacity'
      ],
      correctAnswerIndex: 1,
      explanation: 'A race condition occurs when concurrent threads access and mutate shared mutable state without proper synchronization, making the program output non-deterministic.'
    }
  ],
  'Data Structures and Algorithms': [
    {
      id: 'dsa-1',
      category: 'Data Structures and Algorithms',
      topic: 'Binary Search Trees',
      difficulty: 'Intermediate',
      question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree of n nodes?',
      options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(1)'],
      correctAnswerIndex: 1,
      explanation: 'If elements are inserted in sorted order, the BST degrades into a skewed linked list with height n, making search O(n) in the worst case.'
    },
    {
      id: 'dsa-2',
      category: 'Data Structures and Algorithms',
      topic: 'Hashing',
      difficulty: 'Intermediate',
      question: 'In a Hash Table with open addressing and linear probing, what phenomenon occurs when occupied slots group together in contiguous blocks?',
      options: ['Secondary Clustering', 'Primary Clustering', 'Rehashing Delay', 'Chaining Overflow'],
      correctAnswerIndex: 1,
      explanation: 'Linear probing suffers from primary clustering: once a collision occurs, adjacent occupied slots form a cluster, causing future collisions to search longer runs of occupied slots.'
    },
    {
      id: 'dsa-3',
      category: 'Data Structures and Algorithms',
      topic: 'Sorting Algorithms',
      difficulty: 'Intermediate',
      question: 'Which sorting algorithm has a worst-case time complexity of O(n log n) and is NOT in-place in its standard implementation?',
      options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Insertion Sort'],
      correctAnswerIndex: 1,
      explanation: 'Merge Sort always runs in O(n log n) in all cases (worst, average, best), but standard implementations require O(n) auxiliary memory for combining sorted subarrays.'
    },
    {
      id: 'dsa-4',
      category: 'Data Structures and Algorithms',
      topic: 'Graph Algorithms',
      difficulty: 'Advanced',
      question: 'Which algorithm is best suited for finding the shortest path from a single source node in a graph with non-negative edge weights?',
      options: ['Bellman-Ford Algorithm', "Dijkstra's Algorithm", 'Floyd-Warshall Algorithm', "Kruskal's Algorithm"],
      correctAnswerIndex: 1,
      explanation: "Dijkstra's algorithm efficiently computes single-source shortest paths in O((V + E) log V) with a priority queue when edge weights are strictly non-negative."
    },
    {
      id: 'dsa-5',
      category: 'Data Structures and Algorithms',
      topic: 'Dynamic Programming',
      difficulty: 'Advanced',
      question: 'What are the two core prerequisites that indicate a problem can be solved using Dynamic Programming?',
      options: [
        'Greedy choice property & Divide and Conquer',
        'Optimal substructure & Overlapping subproblems',
        'Sorted array inputs & Deterministic transitions',
        'Binary representation & Bitwise independence'
      ],
      correctAnswerIndex: 1,
      explanation: 'DP applies when an optimal solution to the problem contains optimal solutions to subproblems (Optimal Substructure) and the recursive breakdown re-evaluates the same subproblems repeatedly (Overlapping Subproblems).'
    }
  ],
  'Technical Knowledge': [
    {
      id: 'tech-1',
      category: 'Technical Knowledge',
      topic: 'Database Management Systems',
      difficulty: 'Intermediate',
      question: 'In DBMS transactions, what does the "I" in ACID stand for, and what does it ensure?',
      options: [
        'Integrity: Data values adhere to all relational schema constraints',
        'Isolation: Concurrent transactions execute independently without cross-transaction interference',
        'Indexing: B-tree indexes are updated synchronously during commits',
        'Idempotence: Replaying a transaction multiple times produces the identical state'
      ],
      correctAnswerIndex: 1,
      explanation: 'Isolation ensures that concurrently executing transactions cannot view uncommitted or intermediate states of one another, preventing dirty reads, non-repeatable reads, and phantom reads.'
    },
    {
      id: 'tech-2',
      category: 'Technical Knowledge',
      topic: 'Operating Systems',
      difficulty: 'Intermediate',
      question: 'Which of the following is NOT one of Coffman\'s four necessary conditions for a deadlock to occur in an operating system?',
      options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
      correctAnswerIndex: 2,
      explanation: 'The four Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly reclaimed), and 4. Circular Wait. "Preemption Allowed" actually prevents deadlocks.'
    },
    {
      id: 'tech-3',
      category: 'Technical Knowledge',
      topic: 'Computer Networks',
      difficulty: 'Intermediate',
      question: 'What is the primary role of the Three-Way Handshake in the TCP protocol?',
      options: [
        'To compress packet payloads before sending',
        'To establish a reliable connection by synchronizing Sequence Numbers (SYN, SYN-ACK, ACK)',
        'To encrypt payload data using asymmetric TLS keys',
        'To discover network router hops across WAN subnets'
      ],
      correctAnswerIndex: 1,
      explanation: 'The TCP 3-way handshake (SYN, SYN-ACK, ACK) verifies mutual communication ability and synchronizes initial sequence numbers (ISNs) between client and server.'
    },
    {
      id: 'tech-4',
      category: 'Technical Knowledge',
      topic: 'System Design & Web Architecture',
      difficulty: 'Advanced',
      question: 'What is the main benefit of using a Reverse Proxy (such as Nginx) in front of application backend servers?',
      options: [
        'It eliminates the need for database indexing',
        'Load balancing, SSL/TLS termination, caching, and IP masking for backend servers',
        'It converts synchronous REST requests into GraphQL automatically',
        'It replaces the client web browser DOM'
      ],
      correctAnswerIndex: 1,
      explanation: 'A reverse proxy sits between clients and internal microservices to distribute traffic across server pools, handle SSL termination, protect origin servers from direct public access, and cache static assets.'
    }
  ],
  'Communication': [
    {
      id: 'comm-1',
      category: 'Communication',
      topic: 'Behavioral Interviews (STAR Method)',
      difficulty: 'Intermediate',
      question: 'In behavioral interviews, what does the STAR framework stand for when structuring your answer?',
      options: [
        'Skills, Theory, Action, Result',
        'Situation, Task, Action, Result',
        'Strategy, Target, Assessment, Review',
        'Statement, Test, Application, Reflection'
      ],
      correctAnswerIndex: 1,
      explanation: 'The STAR framework (Situation, Task, Action, Result) is the gold standard for behavioral interviews, ensuring a clear narrative that emphasizes personal actions and quantifiable outcomes.'
    },
    {
      id: 'comm-2',
      category: 'Communication',
      topic: 'Professional Workplace Etiquette',
      difficulty: 'Beginner',
      question: 'When writing an update email to an engineering team lead about a delayed project deliverable, which approach is most effective?',
      options: [
        'Wait until the deadline has passed to see if you catch up',
        'Proactively communicate before the deadline with the reason, new timeline, and mitigation plan',
        'Blame external dependencies and request team reassignment',
        'Send a one-word message saying "Delayed"'
      ],
      correctAnswerIndex: 1,
      explanation: 'Professional workplace communication demands proactive transparency: identifying blockers early, providing a revised realistic timeline, and presenting constructive mitigation steps.'
    },
    {
      id: 'comm-3',
      category: 'Communication',
      topic: 'Technical Explanations',
      difficulty: 'Intermediate',
      question: 'When asked by a non-technical stakeholder to explain an API, which approach conveys clarity without jargon?',
      options: [
        'Recite RFC 7231 HTTP status specification codes',
        'Use an analogy like a restaurant waiter taking an order from the customer and delivering food from the kitchen',
        'Explain bytecode execution in the virtual machine',
        'Tell them it is too complex for business managers'
      ],
      correctAnswerIndex: 1,
      explanation: 'Effective technical communicators use relatable analogies (like a waiter acting as an intermediary between table and kitchen) to explain abstract interfaces without intimidating jargon.'
    }
  ]
};

export const CODING_PROBLEMS: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'Arrays',
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer in any order.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1, 2]'
      }
    ],
    starterCode: {
      Python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n`,
      Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
      C: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    return res;\n}`
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
      { input: '[3, 3], 6', expectedOutput: '[0, 1]' }
    ],
    hints: [
      'A brute force O(n^2) approach checks all pairs.',
      'Can you use a Hash Map to store elements and look up their complements in O(1) time?'
    ],
    solutionExplanation: 'By maintaining a Hash Map mapping value -> index, for each element `num`, we query if `target - num` has already been seen. This achieves O(n) time and O(n) space complexity.'
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    category: 'Stacks',
    difficulty: 'Easy',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    starterCode: {
      Python: `def is_valid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n`,
      Java: `class Solution {\n    public boolean isValid(String s) {\n        java.util.Stack<Character> stack = new java.util.Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
      C: `bool isValid(char* s) {\n    int len = strlen(s);\n    char* stack = (char*)malloc(len);\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        if (s[i] == '(' || s[i] == '{' || s[i] == '[') {\n            stack[++top] = s[i];\n        } else {\n            if (top == -1) return false;\n            char c = stack[top--];\n            if (s[i] == ')' && c != '(') return false;\n            if (s[i] == '}' && c != '{') return false;\n            if (s[i] == ']' && c != '[') return false;\n        }\n    }\n    return top == -1;\n}`
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' }
    ],
    hints: [
      'Use a LIFO Stack data structure to track unmatched opening brackets.',
      'When an opening bracket arrives, push it. When a closing bracket arrives, verify if top matches.'
    ],
    solutionExplanation: 'A stack accurately enforces the nested ordering of bracket scopes in O(n) time and O(n) space.'
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    category: 'Sorting',
    difficulty: 'Medium',
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
      }
    ],
    starterCode: {
      Python: `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for interval in intervals:\n        if not merged or merged[-1][1] < interval[0]:\n            merged.append(interval)\n        else:\n            merged[-1][1] = max(merged[-1][1], interval[1])\n    return merged\n`,
      Java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        java.util.Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        java.util.List<int[]> result = new java.util.ArrayList<>();\n        for (int[] interval : intervals) {\n            if (result.isEmpty() || result.get(result.size() - 1)[1] < interval[0]) {\n                result.add(interval);\n            } else {\n                result.get(result.size() - 1)[1] = Math.max(result.get(result.size() - 1)[1], interval[1]);\n            }\n        }\n        return result.toArray(new int[result.size()][]);\n    }\n}`,
      C: `// Standard interval merge algorithm implementation`
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' }
    ],
    hints: [
      'Sort the intervals by their start times first.',
      'Iterate through the sorted intervals. If the current interval overlaps with the last added merged interval, update its end time.'
    ],
    solutionExplanation: 'Sorting intervals by starting value takes O(n log n). Once sorted, a single linear pass merges overlapping intervals in O(n) time.'
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    category: 'Linked Lists',
    difficulty: 'Easy',
    description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' }
    ],
    starterCode: {
      Python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head: ListNode) -> ListNode:\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev\n`,
      Java: `public class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}`,
      C: `struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head, *next = NULL;\n    while (curr) {\n        next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: '[1,2]', expectedOutput: '[2,1]' }
    ],
    hints: [
      'Think about maintaining three pointers: previous, current, and next.',
      'Reverse the pointer direction at each step: `curr.next = prev`.'
    ],
    solutionExplanation: 'An iterative pointer reversal runs in O(n) time and O(1) auxiliary space.'
  },
  {
    id: 'binary-tree-inorder',
    title: 'Binary Tree Inorder Traversal',
    category: 'Trees',
    difficulty: 'Easy',
    description: 'Given the `root` of a binary tree, return the inorder traversal of its nodes\' values (Left, Root, Right).',
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    examples: [
      { input: 'root = [1,null,2,3]', output: '[1,3,2]' }
    ],
    starterCode: {
      Python: `def inorder_traversal(root):\n    res = []\n    def dfs(node):\n        if not node: return\n        dfs(node.left)\n        res.append(node.val)\n        dfs(node.right)\n    dfs(root)\n    return res\n`,
      Java: `class Solution {\n    public java.util.List<Integer> inorderTraversal(TreeNode root) {\n        java.util.List<Integer> res = new java.util.ArrayList<>();\n        helper(root, res);\n        return res;\n    }\n    private void helper(TreeNode node, java.util.List<Integer> res) {\n        if (node == null) return;\n        helper(node.left, res);\n        res.add(node.val);\n        helper(node.right, res);\n    }\n}`,
      C: `// Inorder traversal in C using recursion`
    },
    testCases: [
      { input: '[1,null,2,3]', expectedOutput: '[1,3,2]' }
    ],
    hints: ['Inorder traversal visits: Left Subtree -> Current Node -> Right Subtree.'],
    solutionExplanation: 'Standard recursive traversal traverses each node once in O(n) time.'
  }
];

export const COMPANY_TRACKS: CompanyTrack[] = [
  {
    id: 'google',
    companyName: 'Google',
    category: 'Product Based',
    cutoffAptitudeScore: 85,
    hiringRounds: [
      {
        roundNumber: 1,
        roundName: 'Online Coding Assessment (OA)',
        description: '2 challenging algorithmic problems testing Graph theory, Dynamic Programming, or Tree transformations with strict runtime constraints.',
        commonTopics: ['Graphs (DFS/BFS, Dijkstra)', 'Dynamic Programming', 'Trie / Segment Tree', 'Sliding Window']
      },
      {
        roundNumber: 2,
        roundName: 'Technical Interview Rounds (4 rounds)',
        description: '45-minute live coding sessions on Google Meet using Google Docs / Code editor. Focus on clarity of thought, time/space complexity proof, clean edge case handling, and scalable architecture.',
        commonTopics: ['Recursion & Memoization', 'Advanced Graph Algorithms', 'System Architecture & Concurrency', 'Object-Oriented Design']
      },
      {
        roundNumber: 3,
        roundName: 'Googleyness & Leadership',
        description: 'Assesses cultural fit, intellectual humility, bias for action, collaboration, and ethical decision-making using behavioral prompts.',
        commonTopics: ['Navigating ambiguity', 'Handling interpersonal friction', 'Bias for action & feedback loops']
      }
    ],
    frequentlyAskedDSA: ['Word Break II', 'Alien Dictionary', 'Number of Islands', 'Course Schedule', 'LRU Cache'],
    sampleQuestions: [
      {
        type: 'Coding',
        question: 'Design an algorithm to serialize and deserialize a binary tree efficiently.'
      },
      {
        type: 'Behavioral',
        question: 'Tell me about a time you worked on a project with ambiguous requirements and how you drove clarity.'
      }
    ],
    prepTips: [
      'Always clarify requirements and edge cases before typing code.',
      'State time and space complexities explicitly before writing the implementation.',
      'Practice thinking out loud and explaining trade-offs between space and time.'
    ]
  },
  {
    id: 'amazon',
    companyName: 'Amazon',
    category: 'Product Based',
    cutoffAptitudeScore: 80,
    hiringRounds: [
      {
        roundNumber: 1,
        roundName: 'Online Assessment (OA 1 & 2)',
        description: 'OA 1: Coding (2 medium-hard questions) + Work Style Assessment. OA 2: System logic & behavioral simulation.',
        commonTopics: ['Arrays & Hash Maps', 'Breadth-First Search', 'Priority Queues / Heaps', 'Trees']
      },
      {
        roundNumber: 2,
        roundName: 'Virtual Onsite (Technical & Leadership Principles)',
        description: 'Every single technical round combines DSA coding with 1-2 questions evaluating Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action, Deliver Results).',
        commonTopics: ['Heaps / Priority Queue', 'Graph Traversal', 'Tree Serialization', '16 Leadership Principles']
      },
      {
        roundNumber: 3,
        roundName: 'Bar Raiser Round',
        description: 'Independent interviewer outside the hiring team who evaluates long-term potential and cultural bar.',
        commonTopics: ['Deep dive into past projects', 'Handling failure and disagreement', 'Scale bottlenecks']
      }
    ],
    frequentlyAskedDSA: ['Top K Frequent Elements', 'Course Schedule II', 'Rotting Oranges', 'Copy List with Random Pointer', 'K Closest Points to Origin'],
    sampleQuestions: [
      {
        type: 'Coding',
        question: 'Given an m x n grid where each cell is empty, fresh orange, or rotten orange, return the minimum minutes until no fresh orange remains.'
      },
      {
        type: 'Behavioral',
        question: 'Tell me about a time you had a fundamental disagreement with a teammate or lead and how you handled it.'
      }
    ],
    prepTips: [
      'Structure every behavioral answer using STAR and explicitly reference Amazon Leadership Principles.',
      'Bring concrete metrics in past results ("reduced latency by 35%").'
    ]
  },
  {
    id: 'qualcomm',
    companyName: 'Qualcomm',
    category: 'Core Hardware / Semiconductor',
    cutoffAptitudeScore: 78,
    hiringRounds: [
      {
        roundNumber: 1,
        roundName: 'Written Technical & Aptitude Test',
        description: 'Sections on C programming, pointers, bit manipulation, computer architecture, digital logic, and basic aptitude.',
        commonTopics: ['C Pointers & Memory Layout', 'Bitwise Operators & Masking', 'Digital Electronics (Flip Flops, FSM)', 'Operating Systems & Mutexes']
      },
      {
        roundNumber: 2,
        roundName: 'Technical Interview 1 (Low-Level Systems / C)',
        description: 'Live coding in C, explaining cache coherency, memory-mapped I/O, volatile keyword, interrupt service routines (ISR), and embedded RTOS concepts.',
        commonTopics: ['volatile vs const in C', 'Bit reversal & parity check', 'Interrupt latency & ISR guidelines', 'Circular ring buffers']
      },
      {
        roundNumber: 3,
        roundName: 'Technical Interview 2 (VLSI / Embedded Architecture)',
        description: 'Focuses on pipeline hazards, cache architectures, bus protocols (I2C, SPI, UART, PCIe), and timing constraints (setup and hold times).',
        commonTopics: ['Setup & Hold time violations', 'Bus arbitration & protocols', 'ARM architecture registers']
      }
    ],
    frequentlyAskedDSA: ['Bitwise operations (count set bits)', 'Implement circular buffer in C', 'Detect cycle in linked list', 'Endianness check code'],
    sampleQuestions: [
      {
        type: 'Technical MCQs',
        question: 'Write a C macro or inline function to toggle the nth bit of a 32-bit register without affecting other bits.'
      },
      {
        type: 'Technical MCQs',
        question: 'Explain what happens during a context switch in an RTOS and how register states are preserved.'
      }
    ],
    prepTips: [
      'Master pointer arithmetic, memory layout (stack, heap, bss, text), and bit manipulation in C.',
      'Be thoroughly prepared for setup/hold time questions if applying for VLSI.'
    ]
  },
  {
    id: 'tcs',
    companyName: 'TCS (Tata Consultancy Services)',
    category: 'Service Based',
    cutoffAptitudeScore: 70,
    hiringRounds: [
      {
        roundNumber: 1,
        roundName: 'TCS NQT (National Qualifier Test)',
        description: 'Comprehensive assessment comprising Numerical Ability, Verbal Ability, Reasoning Ability, and Advanced Coding (Ninja / Digital / Prime tiers).',
        commonTopics: ['Profit & Loss, Time & Work', 'Syllogisms & Data Sufficiency', 'String manipulation & Arrays in Java/Python']
      },
      {
        roundNumber: 2,
        roundName: 'Technical Interview',
        description: 'Questions on OOP concepts, DBMS joins and normalization, core Java / Python fundamentals, and academic final year project deep dive.',
        commonTopics: ['Polymorphism, Inheritance', 'SQL Joins, Group By, Indexes', 'Final Year Engineering Project']
      },
      {
        roundNumber: 3,
        roundName: 'Managerial & HR Interview',
        description: 'Relocation willingness, shift flexibility, communication skills, and situational adaptability questions.',
        commonTopics: ['Willingness to learn new tech stack', 'Team conflict resolution', 'Company values']
      }
    ],
    frequentlyAskedDSA: ['Array rotation', 'Palindrome substring', 'Fibonacci sequence optimizations', 'Matrix diagonal sum'],
    sampleQuestions: [
      {
        type: 'Coding',
        question: 'Write a program to remove all duplicate characters from a string while preserving original order.'
      },
      {
        type: 'Behavioral',
        question: 'Are you comfortable working in different technology stacks and operating shifts as required by international clients?'
      }
    ],
    prepTips: [
      'Time management during the NQT aptitude section is critical.',
      'Be ready to explain every diagram and database table in your college project.'
    ]
  }
];

export const CAREER_PROFILES = [
  {
    id: 'swe',
    role: 'Software Developer',
    description: 'Designs, develops, tests, and deploys high-scale software applications and web backends.',
    skills: ['Data Structures & Algorithms', 'System Design', 'REST APIs', 'SQL & NoSQL Databases', 'Git & CI/CD', 'Java / Python / TypeScript'],
    averagePackage: '6.5 - 24 LPA',
    prerequisites: 'Strong algorithmic problem solving, Object-Oriented Programming, and database modeling.',
    suggestedProjects: [
      { title: 'Full-Stack E-Commerce Platform', difficulty: 'Intermediate', tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'] },
      { title: 'Distributed Rate Limiter & Cache', difficulty: 'Advanced', tech: ['Go or Java', 'Redis', 'Docker'] }
    ]
  },
  {
    id: 'vlsi',
    role: 'VLSI Engineer',
    description: 'Designs and verifies microchips, ASICs, FPGAs, and integrated circuits powering modern computing hardware.',
    skills: ['Verilog / SystemVerilog', 'Digital Electronics', 'Static Timing Analysis (STA)', 'CMOS Physics', 'FPGA Prototyping', 'UVM Verification'],
    averagePackage: '8.0 - 28 LPA',
    prerequisites: 'Deep mastery of Boolean logic, state machines, setup/hold constraints, and hardware description languages.',
    suggestedProjects: [
      { title: '5-Stage Pipelined RISC-V Core in Verilog', difficulty: 'Advanced', tech: ['Verilog', 'ModelSim', 'FPGA'] },
      { title: 'UART Protocol Controller with FIFO', difficulty: 'Intermediate', tech: ['SystemVerilog', 'Quartus Prime'] }
    ]
  },
  {
    id: 'embedded',
    role: 'Embedded Systems Engineer',
    description: 'Develops low-level firmware and device drivers running on microcontrollers and real-time operating systems.',
    skills: ['Embedded C / Modern C++', 'RTOS (FreeRTOS)', 'Microcontrollers (ARM Cortex, STM32, ESP32)', 'Communication Protocols (I2C, SPI, CAN, UART)', 'Device Drivers'],
    averagePackage: '5.5 - 20 LPA',
    prerequisites: 'Firmware development, interrupt handling, register-level hardware interfacing, and memory optimization.',
    suggestedProjects: [
      { title: 'FreeRTOS Smart Sensor Node with BLE', difficulty: 'Intermediate', tech: ['STM32', 'FreeRTOS', 'C'] },
      { title: 'Automotive CAN Bus Telemetry Logger', difficulty: 'Advanced', tech: ['ESP32', 'CAN Transceiver', 'C++'] }
    ]
  },
  {
    id: 'data-scientist',
    role: 'Data Scientist',
    description: 'Builds predictive models, extracts actionable insights from complex datasets, and deploys machine learning pipelines.',
    skills: ['Python', 'Statistical Inference & Linear Algebra', 'Scikit-Learn & PyTorch', 'SQL Data Warehousing', 'Data Wrangling (Pandas/NumPy)', 'Model Evaluation'],
    averagePackage: '7.0 - 22 LPA',
    prerequisites: 'Strong mathematical statistics, exploratory data analysis, and predictive modeling.',
    suggestedProjects: [
      { title: 'Customer Churn Predictor with SHAP Explainability', difficulty: 'Intermediate', tech: ['Python', 'XGBoost', 'FastAPI'] },
      { title: 'End-to-End Multimodal Recommendation Engine', difficulty: 'Advanced', tech: ['PyTorch', 'Vector DB', 'Docker'] }
    ]
  }
];
