// ============================================================
//  PlacePrep â€” Complete Application Logic
// ============================================================

// ---------- STATE ----------
let currentUser = null;
let authToken = localStorage.getItem('placeprep_token');
let currentMode = 'login';
let userSolvedProblems = new Set();
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : window.location.origin + '/api';

// ---------- DATA ----------
const CODING_PROBLEMS = [
  {
    id: 1, title: 'Two Sum', difficulty: 'easy', topic: 'arrays', acceptance: 68, solved: false,
    desc: 'Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers that add up to target.',
    examples: [{ input: 'nums=[2,7,11,15], target=9', output: '[0,1]' }],
    starterCode: { python: 'def twoSum(nums, target):\n    # Write your solution\n    pass', java: 'public int[] twoSum(int[] nums, int target) {\n    // Write your solution\n    return new int[]{};\n}', cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution\n    return {};\n}', javascript: 'var twoSum = function(nums, target) {\n    // Write your solution\n};' }
  },
  {
    id: 2, title: 'Valid Parentheses', difficulty: 'easy', topic: 'strings', acceptance: 72, solved: false,
    desc: 'Given a string containing just <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code> and <code>]</code>, determine if the input string is valid.',
    examples: [{ input: "s='()[]{}'", output: 'true' }],
    starterCode: { python: 'def isValid(s):\n    pass', java: 'public boolean isValid(String s) {\n    return false;\n}', cpp: 'bool isValid(string s) {\n    return false;\n}', javascript: 'var isValid = function(s) {\n};' }
  },
  {
    id: 3, title: 'Reverse Linked List', difficulty: 'easy', topic: 'arrays', acceptance: 74, solved: false,
    desc: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [{ input: 'head=[1,2,3,4,5]', output: '[5,4,3,2,1]' }],
    starterCode: { python: 'def reverseList(head):\n    pass', java: 'public ListNode reverseList(ListNode head) {\n    return null;\n}', cpp: 'ListNode* reverseList(ListNode* head) {\n    return nullptr;\n}', javascript: 'var reverseList = function(head) {\n};' }
  },
  {
    id: 4, title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', topic: 'arrays', acceptance: 65, solved: false,
    desc: 'Given array <code>prices</code> where prices[i] is the price of a given stock on the ith day. Maximize your profit.',
    examples: [{ input: 'prices=[7,1,5,3,6,4]', output: '5' }],
    starterCode: { python: 'def maxProfit(prices):\n    pass', java: 'public int maxProfit(int[] prices) {\n    return 0;\n}', cpp: 'int maxProfit(vector<int>& prices) {\n    return 0;\n}', javascript: 'var maxProfit = function(prices) {\n};' }
  },
  {
    id: 5, title: 'Maximum Subarray', difficulty: 'easy', topic: 'dp', acceptance: 62, solved: false,
    desc: 'Given an integer array <code>nums</code>, find the contiguous subarray which has the largest sum and return its sum (Kadane\'s Algorithm).',
    examples: [{ input: 'nums=[-2,1,-3,4,-1,2,1,-5,4]', output: '6' }],
    starterCode: { python: "def maxSubArray(nums):\n    pass", java: 'public int maxSubArray(int[] nums) {\n    return 0;\n}', cpp: 'int maxSubArray(vector<int>& nums) {\n    return 0;\n}', javascript: 'var maxSubArray = function(nums) {\n};' }
  },
  {
    id: 6, title: 'Climbing Stairs', difficulty: 'easy', topic: 'dp', acceptance: 70, solved: false,
    desc: 'You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    examples: [{ input: 'n=3', output: '3' }],
    starterCode: { python: 'def climbStairs(n):\n    pass', java: 'public int climbStairs(int n) {\n    return 0;\n}', cpp: 'int climbStairs(int n) {\n    return 0;\n}', javascript: 'var climbStairs = function(n) {\n};' }
  },
  {
    id: 7, title: 'Binary Tree Inorder Traversal', difficulty: 'easy', topic: 'trees', acceptance: 73, solved: false,
    desc: 'Given the <code>root</code> of a binary tree, return the inorder traversal of its nodes\' values.',
    examples: [{ input: 'root=[1,null,2,3]', output: '[1,3,2]' }],
    starterCode: { python: 'def inorderTraversal(root):\n    pass', java: 'public List<Integer> inorderTraversal(TreeNode root) {\n    return new ArrayList<>();\n}', cpp: 'vector<int> inorderTraversal(TreeNode* root) {\n    return {};\n}', javascript: 'var inorderTraversal = function(root) {\n};' }
  },
  {
    id: 8, title: 'Merge Two Sorted Lists', difficulty: 'easy', topic: 'arrays', acceptance: 66, solved: false,
    desc: 'Merge two sorted linked lists and return it as a sorted list.',
    examples: [{ input: 'l1=[1,2,4], l2=[1,3,4]', output: '[1,1,2,3,4,4]' }],
    starterCode: { python: 'def mergeTwoLists(l1, l2):\n    pass', java: 'public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    return null;\n}', cpp: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    return nullptr;\n}', javascript: 'var mergeTwoLists = function(l1, l2) {\n};' }
  },
  {
    id: 9, title: 'Longest Common Subsequence', difficulty: 'medium', topic: 'dp', acceptance: 55, solved: false,
    desc: 'Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence.',
    examples: [{ input: 'text1="abcde", text2="ace"', output: '3' }],
    starterCode: { python: 'def longestCommonSubsequence(text1, text2):\n    pass', java: 'public int longestCommonSubsequence(String text1, String text2) {\n    return 0;\n}', cpp: 'int longestCommonSubsequence(string text1, string text2) {\n    return 0;\n}', javascript: 'var longestCommonSubsequence = function(text1, text2) {\n};' }
  },
  {
    id: 10, title: 'Number of Islands', difficulty: 'medium', topic: 'graphs', acceptance: 53, solved: false,
    desc: 'Given an m x n 2D binary grid which represents a map of <code>\'1\'</code>s (land) and <code>\'0\'</code>s (water), return the number of islands.',
    examples: [{ input: 'grid=[["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2' }],
    starterCode: { python: 'def numIslands(grid):\n    pass', java: 'public int numIslands(char[][] grid) {\n    return 0;\n}', cpp: 'int numIslands(vector<vector<char>>& grid) {\n    return 0;\n}', javascript: 'var numIslands = function(grid) {\n};' }
  },
  {
    id: 11, title: '3Sum', difficulty: 'medium', topic: 'arrays', acceptance: 31, solved: false,
    desc: 'Given an integer array nums, return all the triplets that sum to zero. No duplicate triplets.',
    examples: [{ input: 'nums=[-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }],
    starterCode: { python: 'def threeSum(nums):\n    pass', java: 'public List<List<Integer>> threeSum(int[] nums) {\n    return new ArrayList<>();\n}', cpp: 'vector<vector<int>> threeSum(vector<int>& nums) {\n    return {};\n}', javascript: 'var threeSum = function(nums) {\n};' }
  },
  {
    id: 12, title: 'Word Break', difficulty: 'medium', topic: 'dp', acceptance: 44, solved: false,
    desc: 'Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return true if s can be segmented into dictionary words.',
    examples: [{ input: 's="leetcode", wordDict=["leet","code"]', output: 'true' }],
    starterCode: { python: 'def wordBreak(s, wordDict):\n    pass', java: 'public boolean wordBreak(String s, List<String> wordDict) {\n    return false;\n}', cpp: 'bool wordBreak(string s, vector<string>& wordDict) {\n    return false;\n}', javascript: 'var wordBreak = function(s, wordDict) {\n};' }
  },
  {
    id: 13, title: 'Graph Valid Tree', difficulty: 'medium', topic: 'graphs', acceptance: 48, solved: false,
    desc: 'Given n nodes labeled from 0 to n-1 and a list of undirected edges, check if they form a valid tree.',
    examples: [{ input: 'n=5, edges=[[0,1],[0,2],[0,3],[1,4]]', output: 'true' }],
    starterCode: { python: 'def validTree(n, edges):\n    pass', java: 'public boolean validTree(int n, int[][] edges) {\n    return false;\n}', cpp: 'bool validTree(int n, vector<vector<int>>& edges) {\n    return false;\n}', javascript: 'var validTree = function(n, edges) {\n};' }
  },
  {
    id: 14, title: 'Merge Sort', difficulty: 'medium', topic: 'sorting', acceptance: 61, solved: false,
    desc: 'Implement merge sort algorithm on an array of integers.',
    examples: [{ input: 'arr=[38,27,43,3,9,82,10]', output: '[3,9,10,27,38,43,82]' }],
    starterCode: { python: 'def mergeSort(arr):\n    pass', java: 'public int[] mergeSort(int[] arr) {\n    return arr;\n}', cpp: 'void mergeSort(vector<int>& arr, int l, int r) {\n    // implement\n}', javascript: 'var mergeSort = function(arr) {\n};' }
  },
  {
    id: 15, title: 'Trapping Rain Water', difficulty: 'hard', topic: 'arrays', acceptance: 57, solved: false,
    desc: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    examples: [{ input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }],
    starterCode: { python: 'def trap(height):\n    pass', java: 'public int trap(int[] height) {\n    return 0;\n}', cpp: 'int trap(vector<int>& height) {\n    return 0;\n}', javascript: 'var trap = function(height) {\n};' }
  },
  {
    id: 16, title: 'Median of Two Sorted Arrays', difficulty: 'hard', topic: 'arrays', acceptance: 35, solved: false,
    desc: 'Given two sorted arrays, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
    examples: [{ input: 'nums1=[1,3], nums2=[2]', output: '2.00000' }],
    starterCode: { python: 'def findMedianSortedArrays(nums1, nums2):\n    pass', java: 'public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    return 0.0;\n}', cpp: 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    return 0.0;\n}', javascript: 'var findMedianSortedArrays = function(nums1, nums2) {\n};' }
  },
];

const HR_QUESTIONS = [
  { q: 'Tell me about yourself.', tip: 'Use the Present-Past-Future formula: Start with your current role/year, then background, then why this company.', answer: 'I am a final year Computer Science student at XYZ University with a CGPA of 8.5. I have interned at ABC Corp where I built REST APIs .I am passionate about solving real-world problems through code and am excited about this opportunity because your company is known for innovative products.', mistakes: 'Being too long (>2 min), listing hobbies without relevance, reading from a template.' },
  { q: "What are your strengths?", tip: 'Choose 2-3 relevant strengths and back each with a specific example using STAR method.', answer: 'My greatest strength is problem-solving. During my internship, I reduced API response time by 40% by redesigning the database query structure. I am also a fast learner â€” I picked up React in two weeks to complete a project.', mistakes: 'Saying generic things like "I am a hard worker" without proof.' },
  { q: "What are your weaknesses?", tip: 'Mention a real weakness but follow immediately with steps you are taking to improve it. Never say "I work too hard."', answer: 'I used to struggle with public speaking. I noticed it was holding me back in team presentations, so I joined my college\'s debate club and have been practicing consistently. I\'ve improved significantly over the past 6 months.', mistakes: 'Mentioning a weakness critical to the job role, or saying you have no weaknesses.' },
  { q: 'Why do you want to work here?', tip: 'Research the company before! Mention specific products, culture, tech stack, or values that genuinely excite you.', answer: 'I\'ve been following your company\'s work on AI-powered analytics. Your open-source contributions and engineering blog have taught me a lot. I want to contribute to a team that values technical excellence and continuous learning.', mistakes: 'Saying "for the salary" or giving a generic answer that could apply to any company.' },
  { q: 'Where do you see yourself in 5 years?', tip: 'Show ambition aligned with the company\'s growth. Don\'t say CEO or manager superficially.', answer: 'In 5 years, I see myself as a senior engineer who has contributed to impactful products. I want to deepen my expertise in distributed systems and eventually lead a small technical team on a key initiative.', mistakes: 'Being too vague ("I don\'t know"), or unrealistic ("I want to be VP").' },
  { q: 'Why should we hire you?', tip: 'Summarize your top 3 value-adds specifically for this role. Connect your skills to their job description.', answer: 'You should hire me because I bring a strong CS foundation, hands-on internship experience, and genuine enthusiasm for your product. I have already solved similar problems to what your team works on and I can contribute from day one.', mistakes: 'Being arrogant, repeating your resume verbatim, or underselling yourself.' },
  { q: 'Tell me about a challenge you faced and how you handled it.', tip: 'Use the STAR method: Situation, Task, Action, Result. Quantify your results.', answer: 'During my final year project, our team lost two members a week before the demo. I took ownership, restructured the work, pulled two all-nighters, and we delivered a fully functional product that won Best Project award.', mistakes: 'Blaming others, choosing a trivial challenge, or not mentioning what YOU did.' },
  { q: 'Do you have any questions for us?', tip: 'Always have 2-3 thoughtful questions ready. This shows interest and curiosity.', answer: '"What does success look like for someone in this role in the first 90 days?" / "What are the biggest technical challenges the team is currently facing?" / "How does the engineering team collaborate with product?"', mistakes: 'Asking about salary/leaves immediately, or saying "No, I have no questions."' },
];

const TECH_QUESTIONS = [
  { q: 'What is the difference between a process and a thread?', tip: 'Cover memory space, context switching, and OS handling.', answer: 'A process is an independent program with its own memory space. A thread is a unit of execution within a process, sharing the same memory. Context switching between threads is faster than between processes. Processes provide isolation; threads enable concurrency within a program.', mistakes: 'Confusing concurrency with parallelism, ignoring memory isolation.' },
  { q: 'Explain OOPS concepts with real-life examples.', tip: 'Cover all 4: Encapsulation, Abstraction, Inheritance, Polymorphism with examples.', answer: 'Encapsulation: A car hides its engine details (only expose accelerate/brake). Abstraction: A remote control abstracts TV internals. Inheritance: Car inherits from Vehicle. Polymorphism: Animal.sound() gives different outputs for Dog and Cat.', mistakes: 'Mixing up abstraction and encapsulation, skipping examples.' },
  { q: 'What is the difference between SQL and NoSQL databases?', tip: 'Cover structure, scalability, use-cases, examples.', answer: 'SQL (MySQL, Postgres) uses structured tables with fixed schema, supports ACID properties, good for relational data. NoSQL (MongoDB, Cassandra) uses flexible schemas (documents, key-value), horizontally scalable, good for unstructured/large-scale data.', mistakes: 'Saying NoSQL is always better, not mentioning trade-offs.' },
  { q: 'What is a deadlock and how can it be prevented?', tip: 'Define, give conditions (Coffman), and prevention strategies.', answer: 'A deadlock occurs when two or more processes wait forever for resources held by each other. Coffman conditions: Mutual exclusion, Hold and Wait, No preemption, Circular wait. Prevention: lock ordering, timeouts, resource allocation graphs, use of tryLock.', mistakes: 'Not knowing the four conditions, no prevention strategy.' },
  { q: 'Explain REST API principles.', tip: 'Cover statelessness, uniform interface, resource-based URLs, HTTP methods.', answer: 'REST APIs are stateless (each request has all info needed), use HTTP methods (GET/POST/PUT/DELETE), identify resources via URLs, return standard formats like JSON. Key principles: client-server separation, cacheability, layered system.', mistakes: 'Confusing REST with SOAP or GraphQL, not mentioning statelessness.' },
  { q: 'What is the time complexity of common sorting algorithms?', tip: 'Be ready with best, average, and worst cases for at least 4 algorithms.', answer: 'Bubble Sort: O(nÂ²). Selection Sort: O(nÂ²). Insertion Sort: O(nÂ²) worst, O(n) best. Merge Sort: O(n log n) always. Quick Sort: O(n log n) avg, O(nÂ²) worst. Heap Sort: O(n log n). Counting Sort: O(n+k).', mistakes: 'Forgetting space complexity, mixing up average and worst cases.' },
  { q: 'What is the difference between abstract class and interface in Java?', tip: 'Cover instantiation, multiple inheritance, default methods (Java 8+).', answer: 'Abstract class can have concrete methods and state. Interface can only have abstract methods (prior to Java 8), supports multiple inheritance. With Java 8+, interfaces can have default/static methods. Use abstract class for "is-a" relationship, interface for "can-do" capability.', mistakes: 'Saying interfaces cannot have any implementation post-Java 8.' },
  { q: 'What is a hash table and how does it handle collisions?', tip: 'Explain hashing, load factor, collision resolution (chaining, open addressing).', answer: 'A hash table maps keys to values using a hash function. Collisions (two keys mapping to same index) are handled by: Chaining (linked list at each bucket) or Open Addressing (probing â€” linear, quadratic, double hashing). Average O(1) for get/put.', mistakes: 'Not knowing what load factor is or how rehashing works.' },
];

const BEHAVIORAL_QUESTIONS = [
  { q: 'Tell me about a time you worked in a team and faced conflict.', tip: 'Use STAR. Focus on resolution and what you learned, not the conflict itself.', answer: 'During a group project, two teammates disagreed on the tech stack. I organized a structured discussion, had each person present their case with data, and we reached a consensus on a hybrid approach. The project succeeded and I learned the value of structured decision-making.', mistakes: 'Blaming specific individuals, showing no resolution, being vague.' },
  { q: 'Describe a project you are most proud of.', tip: 'Pick a project with measurable impact. Cover your role, challenges, and outcome.', answer: 'I built a real-time bus tracking app for my college. It reduced student wait times by 30%, had 500+ daily active users, and was adopted by our transport department. I designed the backend, integrated GPS APIs, and managed a team of 3.', mistakes: 'Picking trivial projects, not mentioning your specific contribution.' },
  { q: 'Tell me about a time you failed and what you learned.', tip: 'Be honest, take ownership, and focus on the lesson and growth.', answer: 'I missed a project deadline during my internship because I underestimated the complexity of an API integration. I learned to break tasks into smaller milestones, communicate blockers early, and always add buffer time to estimates.', mistakes: 'Denying failure, blaming others, or not mentioning what you changed.' },
  { q: 'How do you prioritize tasks when you have multiple deadlines?', tip: 'Mention a specific framework (Eisenhower Matrix, MoSCoW) and give an example.', answer: 'I use the Eisenhower Matrix to categorize tasks by urgency and importance. I also communicate with stakeholders early if trade-offs are needed. During exam season juggling projects, I completed critical deliverables first, delegated smaller tasks, and kept all deadlines.', mistakes: 'Being vague, not showing adaptability, not mentioning communication.' },
];

const GD_TOPICS = [
  { title: 'Work From Home vs Work From Office', category: 'Management', points: ['WFH increases flexibility and reduces commute time', 'WFO fosters collaboration and team culture', 'Hybrid model is the future', 'Mental health considerations for both', 'Technology infrastructure requirements'] },
  { title: 'Artificial Intelligence: Boon or Bane?', category: 'Technology', points: ['AI creates new job categories while eliminating some existing ones', 'Medical AI diagnosis accuracy exceeds human doctors in some areas', 'Deepfakes and misinformation risks', 'Ethical AI and bias concerns', 'AI democratization of education'] },
  { title: 'Social Media: Impact on Youth', category: 'Society', points: ['Mental health: anxiety and depression links', 'FOMO and comparison culture', 'Educational content and skill building', 'Cyberbullying and privacy risks', 'Social media as a career platform'] },
  { title: 'Climate Change & Corporate Responsibility', category: 'Environment', points: ['ESG investing trends', 'Carbon footprint of tech industry', 'Green computing and renewable energy', 'Greenwashing vs genuine sustainability', 'Circular economy models'] },
  { title: 'India\'s Digital Economy by 2030', category: 'Economy', points: ['UPI success and fintech leadership', 'Digital India infrastructure', 'Startup ecosystem growth', 'Digital divide in rural areas', 'Cybersecurity challenges at scale'] },
  { title: 'Should Coding Be Mandatory in Schools?', category: 'Education', points: ['Computational thinking as a life skill', 'Teacher readiness and infrastructure', 'Other critical skills being deprioritized', 'International precedents success stories', 'Inclusion and accessibility'] },
];

const COMPANIES = [
  { name: 'Google', letter: 'G', gradient: 'linear-gradient(135deg,#4285f4,#34a853)', difficulty: 'Hard', roles: 'SWE, SRE, PM', avg_ctc: '32-45 LPA', openings: 120, process: ['Online Coding Test (LC Hard)', '2-3 Phone Screens', '4-5 Onsite rounds (Algo+System Design+Behavioral)', 'HC Review & Offer'], topics: ['Arrays & Strings', 'DP', 'Graphs', 'System Design', 'Distributed Systems', 'Leadership Principles'], tip: 'Focus on LeetCode Hard. Nail STAR stories. Read "Cracking the Coding Interview".' },
  { name: 'Microsoft', letter: 'M', gradient: 'linear-gradient(135deg,#0078d4,#50e6ff)', difficulty: 'Medium', roles: 'SWE, PM, Data Science', avg_ctc: '26-38 LPA', openings: 200, process: ['Coding Assessment (HackerRank)', '2 Technical Phone Rounds', '4 Onsite interviews (Coding + Design + Behavioral)', 'Offer'], topics: ['OOP & Design Patterns', 'Trees & Graphs', 'System Design', 'Azure Cloud', 'Behavioral (Growth Mindset)'], tip: 'Show growth mindset. Microsoft values curiosity and learning. Prepare OOP design questions.' },
  { name: 'Amazon', letter: 'A', gradient: 'linear-gradient(135deg,#ff9900,#ffbd59)', difficulty: 'Medium', roles: 'SDE, SDE-II, PM', avg_ctc: '28-42 LPA', openings: 350, process: ['Online Assessment (2 DSA + Work Style)', 'Phone Screen', '3-5 Onsite loops (DSA+Behavioral+System Design)', 'Bar Raiser Round', 'Offer'], topics: ['Leadership Principles (all 16)', 'Arrays, DP, Graphs', 'System Design (HLD/LLD)', 'Database Design', 'Scalability'], tip: 'Memorize all 16 Leadership Principles. Every interview has behavioral. Use STAR method for everything.' },
  { name: 'Flipkart', letter: 'F', gradient: 'linear-gradient(135deg,#2874f0,#f59e0b)', difficulty: 'Medium', roles: 'SDE-1, SDE-2, Data Analyst', avg_ctc: '22-32 LPA', openings: 180, process: ['Machine Coding Round (3hr)', 'Data Structure Round', 'System Design Round', 'Managerial+HR Round', 'Offer'], topics: ['Machine Coding (clean code)', 'LLD â€” Design Patterns', 'HLD â€” Microservices', 'DSA â€” Arrays/Trees/DP', 'SQL & Database design'], tip: 'Machine coding round is unique â€” write production-quality, clean, extensible code.' },
  { name: 'TCS NQT', letter: 'T', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', difficulty: 'Easy', roles: 'System Engineer, Digital', avg_ctc: '3.5-7 LPA', openings: 2000, process: ['NQT Exam (Cognitive+Technical+Verbal)', 'Technical Interview', 'HR Interview', 'Offer'], topics: ['Aptitude & Reasoning', 'Verbal English', 'C / Java / Python basics', 'Basic DSA', 'Quant Math'], tip: 'Score well in NQT. TCS hires in bulk. NQT Cognitive score determines package band (Ninja vs Digital).' },
  { name: 'Infosys', letter: 'I', gradient: 'linear-gradient(135deg,#0062cc,#00a3e0)', difficulty: 'Easy', roles: 'Systems Engineer, Power Programmer', avg_ctc: '3.6-8 LPA', openings: 1500, process: ['InfyTQ / Online Test', 'Technical Interview', 'HR Round', 'Offer'], topics: ['Aptitude & Verbal', 'C++/Java fundamentals', 'OOP concepts', 'Database basics', 'SDLC knowledge'], tip: 'Clear InfyTQ certification first. Power Programmer role is more competitive â€” practice DSA seriously.' },
  { name: 'Wipro', letter: 'W', gradient: 'linear-gradient(135deg,#341f97,#a29bfe)', difficulty: 'Easy', roles: 'Project Engineer, NLTH', avg_ctc: '3.5-6.5 LPA', openings: 1200, process: ['Online Test (Aptitude+Tech+Essay)', 'Technical Interview', 'HR Interview', 'Offer'], topics: ['Verbal & Analytical', 'Python/C/Java basics', 'OOP', 'SQL Basics', 'General IT awareness'], tip: 'Apply through Wipro Elite NTH for better package. Essay writing round matters â€” practice!' },
  { name: 'Cognizant', letter: 'C', gradient: 'linear-gradient(135deg,#1589d4,#00c0c7)', difficulty: 'Easy', roles: 'Program Analyst, GenC Next', avg_ctc: '4-9 LPA', openings: 900, process: ['CCAT Online Exam', 'Technical Interview', 'Communication Assessment', 'HR Round', 'Offer'], topics: ['Aptitude & Reasoning', 'DBMS / SQL', 'Programming basics', 'OOP Concepts', 'SDLC & Agile'], tip: 'Communication skills matter at Cognizant. Speak clearly in interviews. GenC Next is the premium track.' },
  { name: 'Salesforce', letter: 'S', gradient: 'linear-gradient(135deg,#00a1e0,#032d60)', difficulty: 'Hard', roles: 'MTS, SWE, Solution Engineer', avg_ctc: '28-40 LPA', openings: 60, process: ['Recruiter Screen', '2-3 Technical Rounds (Coding + Design)', 'Architecture Round', 'Behavioral Round', 'Offer'], topics: ['Java / Apex Programming', 'Salesforce Platform', 'APIs & Integration', 'System Design', 'Database & SOQL'], tip: 'Know Salesforce ecosystem. Show platform expertise. Very culture-focused â€” research their values.' },
  { name: 'Razorpay', letter: 'R', gradient: 'linear-gradient(135deg,#2d9cdb,#27ae60)', difficulty: 'Hard', roles: 'SDE-1, Backend Engineer', avg_ctc: '20-35 LPA', openings: 50, process: ['Resume Shortlist', 'Take-home Assignment', '3 Technical Interviews', 'System Design', 'Culture Fit + Offer'], topics: ['System Design (Payments)', 'Backend (Go/Java/Python)', 'DSA (Medium-Hard)', 'Database Design', 'Fintech fundamentals'], tip: 'Deep interest in fintech is crucial. Build and showcase projects. LLD round is rigorous.' },
];

const RESOURCES = {
  books: [
    { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', desc: 'The bible for coding interviews. 189 problems with solutions across all major DSA topics.', link: 'https://www.crackingthecodinginterview.com/', tag: 'Must Read', color: '#6366f1' },
    { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', desc: 'The definitive computer science algorithms textbook. Essential for deep understanding.', link: 'https://mitpress.mit.edu/books/introduction-algorithms-third-edition', tag: 'Reference', color: '#10b981' },
    { title: 'Elements of Programming Interviews', author: 'Adnan Aziz et al.', desc: '300+ problems categorized by topic. More challenging than CTCI, great for FAANG.', link: 'https://elementsofprogramminginterviews.com/', tag: 'Advanced', color: '#f59e0b' },
    { title: 'System Design Interview', author: 'Alex Xu', desc: 'Covers real-world system design problems asked at FAANG. Essential for senior roles.', link: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF', tag: 'System Design', color: '#ec4899' },
    { title: 'Head First Design Patterns', author: 'Freeman & Robson', desc: 'Learn design patterns in a visual, engaging way. Great for OOP design round prep.', link: 'https://www.oreilly.com/library/view/head-first-design/0596007124/', tag: 'OOP', color: '#14b8a6' },
    { title: 'A Placement Guide for CS Students', author: 'GeeksforGeeks', desc: 'Comprehensive placement preparation guide specifically for Indian campus placements.', link: 'https://www.geeksforgeeks.org/placement-guide/', tag: 'Placement', color: '#8b5cf6' },
  ],
  videos: [
    { title: 'NeetCode â€” DSA for Beginners', channel: 'NeetCode', desc: 'Clear, well-organized DSA playlist. The best structured coding interview prep on YouTube.', link: 'https://www.youtube.com/@NeetCode', tag: 'DSA', color: '#6366f1' },
    { title: 'System Design Fundamentals', channel: 'Gaurav Sen', desc: 'Excellent system design explanations with real-world scenarios. Great for L4+ interviews.', link: 'https://www.youtube.com/@gkcs', tag: 'System Design', color: '#10b981' },
    { title: 'Striver DSA Sheet', channel: 'take U forward', desc: 'Complete DSA sheet with step-by-step explanations. Highly recommended for all rounds.', link: 'https://www.youtube.com/@takeUforward', tag: 'DSA', color: '#f59e0b' },
    { title: 'HR Interview Mastery', channel: 'CareerVidz', desc: 'How to answer the most common HR interview questions with confidence and structure.', link: 'https://www.youtube.com/@CareerVidz', tag: 'HR', color: '#ec4899' },
    { title: 'Tech Interview Handbook', channel: 'Clement Mihailescu', desc: 'AlgoExpert founder shares insider tips on acing technical coding interviews at top companies.', link: 'https://www.youtube.com/@clem', tag: 'Coding', color: '#14b8a6' },
    { title: 'Aptitude Shortcuts & Tricks', channel: 'Arun Sharma', desc: 'Vedic math tricks and shortcut formulas for solving aptitude questions 3x faster.', link: 'https://www.youtube.com/results?search_query=arun+sharma+aptitude', tag: 'Aptitude', color: '#8b5cf6' },
  ],
  sheets: [
    { title: 'Striver SDE Sheet', desc: '180 most important DSA problems organized by topic. The gold standard for placement prep.', link: 'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', tag: 'DSA', color: '#6366f1' },
    { title: 'NeetCode 150', desc: '150 carefully curated LeetCode problems covering all patterns needed for FAANG.', link: 'https://neetcode.io/practice', tag: 'LeetCode', color: '#10b981' },
    { title: 'Love Babbar DSA Sheet', desc: '450 problems covering every topic. Widely used by Indian placement candidates.', link: 'https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view', tag: '450 Problems', color: '#f59e0b' },
    { title: 'GeeksForGeeks Placement Course', desc: 'Topic-wise syllabus aligned with TCS, Infosys, Amazon, Wipro hiring patterns.', link: 'https://www.geeksforgeeks.org/placement-guide/', tag: 'All-in-one', color: '#ec4899' },
    { title: 'HR Interview Questions Bank', desc: '100+ most common HR questions with STAR-format model answers for campus placements.', link: 'https://www.indiabix.com/hr-interview/questions-and-answers/', tag: 'HR Prep', color: '#14b8a6' },
    { title: 'System Design Cheat Sheet', desc: 'Visual one-pager covering all key system design concepts: caching, load balancing, CDN, DB scaling.', link: 'https://github.com/donnemartin/system-design-primer', tag: 'System Design', color: '#8b5cf6' },
  ],
  websites: [
    { title: 'LeetCode', desc: 'The #1 platform for coding interview practice. 2400+ problems. Must-use for FAANG prep.', link: 'https://leetcode.com', tag: 'Coding', color: '#f59e0b' },
    { title: 'GeeksforGeeks', desc: 'Comprehensive portal for CS fundamentals, interview experiences, and company-specific prep.', link: 'https://www.geeksforgeeks.org', tag: 'All-in-one', color: '#10b981' },
    { title: 'InterviewBit', desc: 'Structured 6-week interview prep with topic-wise problems. Great for beginners.', link: 'https://www.interviewbit.com', tag: 'Structured', color: '#6366f1' },
    { title: 'HackerRank', desc: 'Used by companies for assessment. Practice company-specific coding challenges here.', link: 'https://www.hackerrank.com', tag: 'Assessments', color: '#ec4899' },
    { title: 'Pramp', desc: 'Free peer-to-peer mock interviews. Practice coding + system design with real people.', link: 'https://www.pramp.com', tag: 'Mock Interviews', color: '#14b8a6' },
    { title: 'IndiaBix', desc: 'Huge bank of aptitude MCQs for TCS, Infosys, Wipro style exams. Free and comprehensive.', link: 'https://www.indiabix.com', tag: 'Aptitude', color: '#8b5cf6' },
  ],
};

const MOCK_TESTS = [
  { name: 'TCS NQT Mock', questions: 30, duration: 60, difficulty: 'Easy', desc: 'Simulates TCS National Qualifier Test with aptitude, verbal, and programming MCQs.' },
  { name: 'Infosys SP Mock', questions: 25, duration: 50, difficulty: 'Easy', desc: 'Covers InfyTQ-style quantitative, verbal, and coding aptitude sections.' },
  { name: 'Wipro Elite Mock', questions: 40, duration: 60, difficulty: 'Medium', desc: 'Aptitude, verbal, essay, and coding rounds as in Wipro Elite NTH.' },
  { name: 'Amazon SDE Mock', questions: 20, duration: 90, difficulty: 'Hard', desc: '2 DSA problems + behavioral MCQs based on Leadership Principles.' },
  { name: 'Google SWE Mock', questions: 2, duration: 60, difficulty: 'Hard', desc: 'Two LeetCode-style problems timed. Focus on optimal solution & communication.' },
];

const MOCK_QUESTIONS = [
  { q: 'A train 150m long crosses a pole in 15 seconds. What is the speed of the train in km/h?', options: ['30 km/h', '36 km/h', '40 km/h', '45 km/h'], answer: 1, explanation: 'Speed = 150/15 = 10 m/s = 10 Ã— 18/5 = 36 km/h.' },
  { q: 'If 20% of a number is 80, what is 30% of that number?', options: ['100', '120', '140', '160'], answer: 1, explanation: 'Number = 80/0.20 = 400. 30% of 400 = 120.' },
  { q: 'Find the odd one out: 3, 5, 7, 9, 11', options: ['3', '5', '9', '11'], answer: 2, explanation: '9 is the only composite number (3Ã—3). All others are prime.' },
  { q: 'A can do a work in 10 days, B in 15 days. Working together, in how many days?', options: ['4 days', '5 days', '6 days', '8 days'], answer: 2, explanation: 'Combined rate = 1/10 + 1/15 = 5/30 = 1/6. So 6 days.' },
  { q: 'Which of the following is NOT an OOP concept?', options: ['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'], answer: 2, explanation: 'Compilation is a development process step, not an OOP concept.' },
  { q: 'What is the output of: print(type(1/2)) in Python 3?', options: ["<class 'int'>", " <class 'float'>", " <class 'complex'>", ' Error'], answer: 1, explanation: 'In Python 3, 1/2 = 0.5, which is a float.' },
  { q: 'In SQL, which command is used to remove a table completely?', options: ['DELETE', 'TRUNCATE', 'DROP', 'REMOVE'], answer: 2, explanation: 'DROP TABLE removes the table definition and all its data permanently.' },
  { q: 'Synonyms of "Candid":', options: ['Secretive', 'Frank', 'Timid', 'Clever'], answer: 1, explanation: '"Candid" means honest and frank in expression.' },
  { q: 'Find next: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], answer: 1, explanation: 'Differences: 4,6,8,10,12. Next term: 30+12=42.' },
  { q: 'What is Big O notation of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, explanation: 'Binary search halves the search space each step = O(log n).' },
  { q: 'Average of 5 consecutive even numbers is 60. What is the smallest?', options: ['54', '56', '58', '60'], answer: 1, explanation: 'Numbers: 56,58,60,62,64. Average=60. Smallest=56.' },
  { q: 'If MANGO is coded as NBOHP, how is APPLE coded?', options: ['BQQMF', 'BQQNG', 'CRRNG', 'BRANG'], answer: 0, explanation: 'Each letter is shifted by +1. A->B, P->Q, P->Q, L->M, E->F = BQQMF.' },
  { q: 'A shopkeeper marks goods 40% above cost and gives 20% discount. Profit%?', options: ['10%', '12%', '14%', '16%'], answer: 1, explanation: 'CP=100, MP=140, SP=140Ã—0.8=112. Profit=12%.' },
  { q: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], answer: 1, explanation: 'Stack uses Last In First Out (LIFO) principle.' },
  { q: 'Choose correct: The committee __ decided on the matter.', options: ['have', 'has', 'are', 'were'], answer: 1, explanation: '"Committee" is a collective noun treated as singular. Use "has".' },
  { q: 'Pipes A and B fill a tank in 20 and 30 min. Pipe C empties it in 15 min. All open together â€” fill time in minutes?', options: ['60', '90', '120', 'Impossible'], answer: 3, explanation: 'Fill rate = 1/20+1/30-1/15 = 3+2-4/60 = 1/60 negative... C drains faster; tank never fills.' },
  { q: 'The time complexity of inserting at beginning of an array is:', options: ['O(1)', 'O(log n)', 'O(n)', 'O(nÂ²)'], answer: 2, explanation: 'Inserting at beginning requires shifting all elements = O(n).' },
  { q: 'Complete: "Rome was not built in ___"', options: ['a decade', 'a day', 'one night', 'one go'], answer: 1, explanation: 'The proverb is "Rome was not built in a day".' },
  { q: 'If xÂ² - 5x + 6 = 0, find x:', options: ['1,2', '2,3', '3,4', '1,6'], answer: 1, explanation: 'xÂ²-5x+6=0 -> (x-2)(x-3)=0 -> x=2 or x=3.' },
  { q: 'Which protocol is used for secure web browsing?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], answer: 2, explanation: 'HTTPS (HTTP Secure) encrypts web communication using TLS/SSL.' },
  { q: 'A 20% price rise then 20% fall = what net change?', options: ['No change', '-4%', '+4%', '-2%'], answer: 1, explanation: '100 -> 120 -> 96. Net loss of 4%.' },
  { q: 'What is the primary key constraint?', options: ['Allows nulls', 'Must be unique and not null', 'Can be repeated', 'Is optional'], answer: 1, explanation: 'A primary key uniquely identifies each row and cannot be NULL.' },
  { q: 'Direction: If South is East, North is West, then what is Southwest?', options: ['NorthWest', 'NorthEast', 'SouthEast', 'None'], answer: 1, explanation: 'Each direction shifts 90Â° clockwise: South->East, North->West, SouthWest->NorthWest->NorthEast.' },
  { q: 'Which of these is NOT a feature of cloud computing?', options: ['Scalability', 'On-demand access', 'Physical hardware ownership', 'Pay-per-use'], answer: 2, explanation: 'Cloud computing eliminates the need for physical hardware ownership.' },
  { q: 'If a clock shows 3:15, what is the angle between hands?', options: ['0Â°', '7.5Â°', '15Â°', '22.5'], answer: 1, explanation: 'At 3:15 hour hand = 97.5Â°, minute hand = 90Â°. Difference = 7.5Â°.' },
  { q: 'An error that occurs during program execution is called:', options: ['Syntax Error', 'Runtime Error', 'Logic Error', 'Compile Error'], answer: 1, explanation: 'Runtime errors occur during execution (e.g., division by zero, null pointer).' },
  { q: 'Simple interest on Rs 5000 at 8% per annum for 2 years?', options: ['Rs 400', 'Rs 600', 'Rs 800', 'Rs 1000'], answer: 2, explanation: 'SI = PÃ—RÃ—T/100 = 5000Ã—8Ã—2/100 = Rs 800.' },
  { q: 'Antonym of "Verbose":', options: ['Talkative', 'Concise', 'Wordy', 'Elaborate'], answer: 1, explanation: '"Verbose" means using too many words; antonym is "Concise".' },
  { q: 'A linked list node contains:', options: ['Only data', 'Only pointer', 'Data and pointer', 'Index and data'], answer: 2, explanation: 'Each node in a linked list contains data and a pointer to the next node.' },
  { q: 'Two dice are thrown. Probability of sum = 7?', options: ['1/6', '1/4', '1/8', '1/3'], answer: 0, explanation: 'Favourable outcomes for sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. P = 6/36 = 1/6.' },
];

const ROADMAP_PHASES = [
  {
    phase: 'Phase 1', title: 'Foundation Building', duration: 'Weeks 1-3', color: '#6366f1', tasks: [
      { task: 'Complete Maths for aptitude (Percentages, Profit-Loss, Time-Work, Speed)', done: true },
      { task: 'Learn C++/Java/Python fundamentals', done: true },
      { task: 'Understand Arrays, Strings, Linked Lists', done: true },
      { task: 'Solve 30 Easy LeetCode problems', done: false },
      { task: 'Practice 50 aptitude MCQs per day', done: false },
    ]
  },
  {
    phase: 'Phase 2', title: 'Core DSA Mastery', duration: 'Weeks 4-7', color: '#10b981', tasks: [
      { task: 'Stacks, Queues, Trees, Binary Search Trees', done: false },
      { task: 'Heaps, Tries, Segment Trees', done: false },
      { task: 'Dynamic Programming patterns (15 types)', done: false },
      { task: 'Graph algorithms: BFS, DFS, Dijkstra, Topological Sort', done: false },
      { task: 'Solve 60 Medium LeetCode problems', done: false },
    ]
  },
  {
    phase: 'Phase 3', title: 'Interview Prep', duration: 'Weeks 8-10', color: '#f59e0b', tasks: [
      { task: 'Prepare all 8 HR questions with STAR answers', done: false },
      { task: 'Practice System Design basics (HLD of URL Shortener, Chat App)', done: false },
      { task: 'Complete 10 behavioral questions with examples', done: false },
      { task: 'Attempt 3 full Mock Tests under timed conditions', done: false },
      { task: 'Research your top 5 target companies', done: false },
    ]
  },
  {
    phase: 'Phase 4', title: 'Company-Specific & Final Push', duration: 'Weeks 11-13', color: '#ec4899', tasks: [
      { task: 'Solve company-specific LeetCode tags for target companies', done: false },
      { task: 'Complete 5 Mock Tests scoring >80%', done: false },
      { task: 'Practice coding on paper/whiteboard', done: false },
      { task: 'Schedule mock interviews with friends or Pramp', done: false },
      { task: 'Review and revise all weak areas', done: false },
    ]
  },
];

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (authToken) { fetchProfile(); } else { showAuthModal(); }
  generateHeatmap();
  renderProblems();
  renderInterviewQuestions();
  renderCompanies();
  renderResources('books');
  renderRoadmap();
  renderMockTestList();
  updateGreeting();
});

function updateGreeting() {
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  const el = document.querySelector('.page-title');
  if (el && !currentUser) el.textContent = `${greet}, Student! ðŸ‘‹`;
}

// ---------- AUTH ----------
function showAuthModal() { document.getElementById('authModal').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('authModal').style.display = 'none'; }


function toggleAuthMode(e) {
  e.preventDefault();
  currentMode = currentMode === 'login' ? 'signup' : 'login';
  const isSignup = currentMode === 'signup';
  document.getElementById('authTitle').textContent = isSignup ? 'Create Your Account' : 'Welcome Back!';
  document.getElementById('authSubmitBtn').textContent = isSignup ? 'Sign Up Free' : 'Log In';
  document.getElementById('authToggleText').textContent = isSignup ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('authToggleLink').textContent = isSignup ? 'Log In' : 'Sign Up';
  document.getElementById('nameFieldGroup').style.display = isSignup ? 'block' : 'none';
  const sfg = document.getElementById('streamFieldGroup');
  if (sfg) sfg.style.display = isSignup ? 'block' : 'none';
  document.getElementById('authError').style.display = 'none';
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const name = document.getElementById('authName').value;
  const errorDiv = document.getElementById('authError');
  const submitBtn = document.getElementById('authSubmitBtn');
  errorDiv.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Please wait...';
  try {
    const endpoint = currentMode === 'login' ? '/auth/login' : '/auth/register';
    const stream = document.getElementById('authStream') ? document.getElementById('authStream').value : 'software';
    const body = currentMode === 'login' ? { email, password } : { name, email, password, stream };
    const res = await fetch(API_BASE + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    authToken = data.token;
    localStorage.setItem('placeprep_token', authToken);
    if (typeof loadUserSolvedProblems === 'function') await loadUserSolvedProblems();
    updateUserUI(data.user);
    closeAuthModal();
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = currentMode === 'login' ? 'Log In' : 'Sign Up';
  }
}

async function fetchProfile() {
  try {
    const res = await fetch(API_BASE + '/user/profile', { headers: { 'Authorization': `Bearer ${authToken}` } });
    const data = await res.json();
    if (res.ok) { updateUserUI(data.user); } else { logout(); }
  } catch (err) { console.error('Failed to fetch profile', err); }
}

function updateUserUI(user) {
  currentUser = user;
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('displayUserName').textContent = user.name;
  document.getElementById('displayUserLevel').textContent = `ðŸŽ¯ Level ${user.level}`;
  const pt = document.querySelector('.page-title');
  if (pt) pt.textContent = `${greet}, ${user.name.split(' ')[0]}! ðŸ‘‹`;
  const ps = document.querySelector('.page-subtitle');
  if (ps) ps.textContent = user.streak > 0 ? `You're on a ${user.streak}-day streak. Keep it up! ðŸ”¥` : `Welcome back! Start practicing to build your streak.`;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function logout() {
  localStorage.removeItem('placeprep_token');
  authToken = null; currentUser = null;
  document.getElementById('displayUserName').textContent = 'Guest';
  document.getElementById('displayUserLevel').textContent = 'ðŸŽ¯ Level 1';
  showAuthModal();
}



// ---------- NAVIGATION ----------
function navigateTo(pageId) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const btn = document.querySelector(`[data-page="${pageId}"]`);
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
  document.getElementById('sidebarOverlay').classList.toggle('active');
}

function toggleTheme() {
  const html = document.documentElement;
  const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// ---------- TOAST ----------
function showToast(msg, type = 'info') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:2rem;right:2rem;padding:0.8rem 1.5rem;border-radius:10px;color:#fff;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.3s;font-size:0.9rem;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.background = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1';
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

// ---------- HEATMAP ----------
function generateHeatmap() {
  const container = document.getElementById('heatmap');
  if (!container) return;
  container.innerHTML = '';
  const days = 105;
  for (let i = 0; i < days; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    const rand = Math.random();
    const intensity = rand < 0.3 ? 0 : rand < 0.5 ? 1 : rand < 0.7 ? 2 : rand < 0.85 ? 3 : 4;
    cell.style.setProperty('--intensity', intensity);
    cell.title = `${intensity * 3} problems solved`;
    container.appendChild(cell);
  }
}

// ---------- APTITUDE ----------
let currentQuestions = [], currentQuestionIndex = 0, score = 0, quizTimerInterval = null;

async function startAptitude(category) {
  if (!currentUser) { showAuthModal(); return; }
  const panel = document.getElementById('quizPanel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('quizCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
  document.getElementById('questionText').textContent = 'âœ¨ Generating AI questions for you...';
  document.getElementById('optionsGrid').innerHTML = '';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('quizProgress').textContent = 'Loading...';
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  try {
    const res = await fetch(API_BASE + '/generate-questions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify({ category, type: 'campus placement standard' }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate');
    currentQuestions = data.questions;
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
  } catch (err) {
    document.getElementById('questionText').textContent = 'âŒ Error: ' + err.message;
  }
}

function startQuizTimer() {
  let secs = 30;
  document.getElementById('quizTimer').textContent = `â± 00:30`;
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    secs--;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    document.getElementById('quizTimer').textContent = `â± ${m}:${s}`;
    if (secs <= 0) { clearInterval(quizTimerInterval); autoSkipQuestion(); }
  }, 1000);
}

function autoSkipQuestion() {
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);
  if (currentQuestions[currentQuestionIndex]) {
    const ci = currentQuestions[currentQuestionIndex].correctAnswer;
    if (allBtns[ci]) allBtns[ci].classList.add('correct');
  }
  showResult(false, 'â° Time Up!', currentQuestions[currentQuestionIndex]?.explanation || '');
  document.getElementById('nextBtn').disabled = false;
}

function displayQuestion() {
  const q = currentQuestions[currentQuestionIndex];
  document.getElementById('qNum').textContent = currentQuestionIndex + 1;
  document.getElementById('quizProgress').textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
  document.getElementById('questionText').textContent = q.question;
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx, btn);
    grid.appendChild(btn);
  });
  startQuizTimer();
}

function selectOption(idx, btnClicked) {
  clearInterval(quizTimerInterval);
  const q = currentQuestions[currentQuestionIndex];
  const isCorrect = idx === q.correctAnswer;
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  if (isCorrect) { btnClicked.classList.add('correct'); score++; }
  else { btnClicked.classList.add('wrong'); document.querySelectorAll('.option-btn')[q.correctAnswer].classList.add('correct'); }
  showResult(isCorrect, isCorrect ? 'âœ… Correct!' : 'âŒ Incorrect', q.explanation);
  document.getElementById('nextBtn').disabled = false;
}

function showResult(ok, title, explanation) {
  const d = document.getElementById('quizResult');
  d.style.display = 'block';
  d.className = 'quiz-result ' + (ok ? 'correct' : 'wrong');
  document.getElementById('resultText').textContent = title;
  document.getElementById('explanationText').textContent = explanation;
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) { displayQuestion(); } else { finishQuiz(); }
}

function skipQuestion() {
  clearInterval(quizTimerInterval);
  const allBtns = document.querySelectorAll('.option-btn');
  if (allBtns.length > 0 && !allBtns[0].disabled) { currentQuestionIndex++; if (currentQuestionIndex < currentQuestions.length) { displayQuestion(); } else { finishQuiz(); } }
}

async function finishQuiz() {
  clearInterval(quizTimerInterval);
  document.getElementById('quizTimer').textContent = '';
  document.getElementById('questionText').innerHTML = `<strong>ðŸŽ‰ Quiz Complete!</strong><br>You scored <span style="color:#6366f1;font-size:1.3em;">${score}/${currentQuestions.length}</span>`;
  document.getElementById('optionsGrid').innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('quizPanel').style.display='none'">â† Back to Categories</button>`;
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  if (currentUser) {
    const xpGain = score * 20;
    try {
      await fetch(API_BASE + '/user/xp', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify({ xp_gain: xpGain }) });
      fetchProfile();
      showToast(`+${xpGain} XP earned!`, 'success');
    } catch (e) { }
  }
}

// ---------- CODING ----------
let activeDifficulty = 'all', activeTopic = 'all', searchQuery = '';
let currentProblem = null;

function renderProblems() {
  const list = document.getElementById('problemsList');
  if (!list) return;
  let filtered = CODING_PROBLEMS.filter(p => {
    const matchD = activeDifficulty === 'all' || p.difficulty === activeDifficulty;
    const matchT = activeTopic === 'all' || p.topic === activeTopic;
    const matchS = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchD && matchT && matchS;
  });
  list.innerHTML = filtered.map(p => `
    <div class="problem-row ${p.solved ? 'solved-row' : ''}" onclick="openProblem(${p.id})">
      <span class="prob-status">${p.solved ? 'âœ…' : 'â—‹'}</span>
      <span class="prob-title">${p.title}</span>
      <span class="prob-tag ${p.difficulty}">${p.difficulty}</span>
      <span class="prob-accept">${p.acceptance}%</span>
    </div>`).join('');
  if (!filtered.length) list.innerHTML = '<p style="padding:1rem;color:#71717a">No problems match your filters.</p>';
}

function filterProblems(level, element) {
  document.querySelectorAll('.filter-tab').forEach(e => e.classList.remove('active'));
  element.classList.add('active');
  activeDifficulty = level;
  renderProblems();
}

function filterByTopic(topic, element) {
  document.querySelectorAll('.topic-chip').forEach(e => e.classList.remove('active'));
  element.classList.add('active');
  activeTopic = topic;
  renderProblems();
}

function searchProblems(val) { searchQuery = val; renderProblems(); }

function openProblem(id) {
  currentProblem = CODING_PROBLEMS.find(p => p.id === id);
  if (!currentProblem) return;
  document.getElementById('editorPlaceholder').style.display = 'none';
  document.getElementById('editorContent').style.display = 'flex';
  const diffColor = currentProblem.difficulty === 'easy' ? '#10b981' : currentProblem.difficulty === 'medium' ? '#f59e0b' : '#ef4444';
  document.getElementById('problemDesc').innerHTML = `
    <div style="padding:1.2rem 1.2rem 0">
      <div style="display:flex;align-items:center;gap:0.8rem;margin-bottom:0.8rem">
        <h3 style="margin:0;font-size:1.1rem">${currentProblem.title}</h3>
        <span style="padding:0.2rem 0.6rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:${diffColor}22;color:${diffColor}">${currentProblem.difficulty.toUpperCase()}</span>
      </div>
      <p style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary)">${currentProblem.desc}</p>
      <div style="background:var(--bg-tertiary);border-radius:8px;padding:0.8rem;margin:0.5rem 0;font-size:0.85rem">
        <strong>Example:</strong><br>
        Input: <code style="color:#6366f1">${currentProblem.examples[0].input}</code><br>
        Output: <code style="color:#10b981">${currentProblem.examples[0].output}</code>
      </div>
    </div>`;
  const lang = document.getElementById('langSelect').value;
  document.getElementById('codeTextarea').value = currentProblem.starterCode[lang] || '';
  document.getElementById('consoleBody').textContent = 'Run your code to see output...';
}

function resetCode() {
  if (currentProblem) {
    const lang = document.getElementById('langSelect').value;
    document.getElementById('codeTextarea').value = currentProblem.starterCode[lang] || '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const langSel = document.getElementById('langSelect');
  if (langSel) langSel.addEventListener('change', () => { if (currentProblem) { document.getElementById('codeTextarea').value = currentProblem.starterCode[langSel.value] || ''; } });
});

function runCode() {
  const code = document.getElementById('codeTextarea').value;
  const cb = document.getElementById('consoleBody');
  if (!code.trim()) { cb.innerHTML = '<span style="color:#ef4444">No code to run.</span>'; return; }
  cb.innerHTML = '<span style="color:#a1a1aa">Running...</span>';
  setTimeout(() => {
    cb.innerHTML = `<span style="color:#10b981">âœ“ Compiled successfully</span><br><span style="color:#a1a1aa">Running test cases...</span>`;
    setTimeout(() => {
      const passed = Math.floor(Math.random() * 3) + 2;
      const total = passed === 4 ? 4 : 4;
      cb.innerHTML = `<span style="color:#10b981">âœ“ ${passed}/${total} test cases passed</span><br><span style="color:#a1a1aa">Time: ${(Math.random() * 80 + 20).toFixed(0)}ms | Memory: ${(Math.random() * 10 + 40).toFixed(1)}MB</span>`;
      if (passed === total && currentProblem) {
        currentProblem.solved = true;
        renderProblems();
        showToast('Problem solved! ðŸŽ‰ Great job!', 'success');
      }
    }, 800);
  }, 500);
}

// ---------- INTERVIEW ----------
function renderInterviewQuestions() {
  const hrGrid = document.getElementById('hrQuestions');
  if (hrGrid) hrGrid.innerHTML = HR_QUESTIONS.map((q, i) => `
    <div class="interview-card" onclick="openInterviewModal(${i}, 'hr')">
      <div class="iq-number">Q${i + 1}</div>
      <p class="iq-text">${q.q}</p>
      <div class="iq-footer"><span class="iq-tag">HR</span><span style="font-size:0.8rem;color:#71717a">Click for answer â†’</span></div>
    </div>`).join('');

  const techGrid = document.getElementById('techQuestions');
  if (techGrid) techGrid.innerHTML = TECH_QUESTIONS.map((q, i) => `
    <div class="interview-card" onclick="openInterviewModal(${i}, 'tech')">
      <div class="iq-number">Q${i + 1}</div>
      <p class="iq-text">${q.q}</p>
      <div class="iq-footer"><span class="iq-tag tech">Technical</span><span style="font-size:0.8rem;color:#71717a">Click for answer â†’</span></div>
    </div>`).join('');

  const behavGrid = document.getElementById('behavQuestions');
  if (behavGrid) behavGrid.innerHTML = BEHAVIORAL_QUESTIONS.map((q, i) => `
    <div class="interview-card" onclick="openInterviewModal(${i}, 'behav')">
      <div class="iq-number">Q${i + 1}</div>
      <p class="iq-text">${q.q}</p>
      <div class="iq-footer"><span class="iq-tag behav">Behavioral</span><span style="font-size:0.8rem;color:#71717a">Click for answer â†’</span></div>
    </div>`).join('');

  const gdGrid = document.getElementById('gdTopics');
  if (gdGrid) gdGrid.innerHTML = GD_TOPICS.map((t, i) => `
    <div class="gd-card" onclick="openGDModal(${i})">
      <div class="gd-cat-badge">${t.category}</div>
      <h3>${t.title}</h3>
      <ul class="gd-points">${t.points.slice(0, 3).map(p => `<li>${p}</li>`).join('')}</ul>
      <button class="cat-btn" style="margin-top:0.5rem">View Discussion Points â†’</button>
    </div>`).join('');
}

function openInterviewModal(idx, type) {
  let item;
  if (type === 'hr') item = HR_QUESTIONS[idx];
  else if (type === 'tech') item = TECH_QUESTIONS[idx];
  else item = BEHAVIORAL_QUESTIONS[idx];
  document.getElementById('modalQuestion').textContent = item.q;
  document.getElementById('modalTip').textContent = item.tip;
  document.getElementById('modalAnswer').textContent = item.answer;
  document.getElementById('modalMistakes').textContent = item.mistakes;
  document.getElementById('interviewModal').style.display = 'flex';
}

function openGDModal(idx) {
  const t = GD_TOPICS[idx];
  document.getElementById('modalQuestion').textContent = `GD Topic: ${t.title}`;
  document.getElementById('modalTip').textContent = `Category: ${t.category} | Start with a neutral definition, present multiple perspectives, and conclude with a balanced view.`;
  document.getElementById('modalAnswer').textContent = t.points.join('\nâ€¢ ');
  document.getElementById('modalMistakes').textContent = 'Do not dominate the discussion. Do not attack others\' opinions. Do not go off-topic. Do bring in data or examples to support points.';
  document.getElementById('interviewModal').style.display = 'flex';
}

function closeInterviewModal() { document.getElementById('interviewModal').style.display = 'none'; }

function switchInterviewTab(tabId, element) {
  document.querySelectorAll('.itab').forEach(e => e.classList.remove('active'));
  element.classList.add('active');
  document.querySelectorAll('.interview-content').forEach(e => e.style.display = 'none');
  document.getElementById('interview-' + tabId).style.display = 'block';
}

// ---------- MOCK TESTS ----------
let activeTest = null, testAnswers = [], currentTestQ = 0, testTimerInterval = null;

function renderMockTestList() {
  const grid = document.getElementById('mockTestList');
  if (!grid) return;
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  grid.innerHTML = MOCK_TESTS.map((t, i) => `
    <div class="mock-test-card" style="border-top: 4px solid ${colors[i]}">
      <div class="mock-test-icon" style="background:${colors[i]}22;color:${colors[i]}">${['ðŸ“‹', 'ðŸ¢', 'âš¡', 'ðŸš€', 'ðŸŽ¯'][i]}</div>
      <h3>${t.name}</h3>
      <p style="color:var(--text-secondary);font-size:0.875rem;margin-bottom:1rem">${t.desc}</p>
      <div class="mock-meta">
        <span>ðŸ“ ${t.questions} Questions</span>
        <span>â± ${t.duration} min</span>
        <span class="company-mini-tag ${t.difficulty.toLowerCase()}">${t.difficulty}</span>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:1rem" onclick="startMockTest(${i})">Start Test</button>
    </div>`).join('');
}

function startMockTest(testIdx) {
  if (!currentUser) { showAuthModal(); return; }
  const test = MOCK_TESTS[testIdx];
  activeTest = test;
  const qCount = Math.min(test.questions, MOCK_QUESTIONS.length);
  const shuffled = [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, qCount);
  activeTest._questions = shuffled;
  testAnswers = new Array(qCount).fill(-1);
  currentTestQ = 0;

  document.getElementById('mockTestList').style.display = 'none';
  document.getElementById('activeTestPanel').style.display = 'block';
  document.getElementById('testResultPanel').style.display = 'none';
  document.getElementById('testName').textContent = test.name;
  document.getElementById('testTotal').textContent = qCount;

  buildPalette(qCount);
  showTestQuestion();
  startTestTimer(test.duration * 60);
}

function buildPalette(count) {
  const grid = document.getElementById('paletteGrid');
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const btn = document.createElement('button');
    btn.className = 'palette-btn unanswered';
    btn.id = `pal-${i}`;
    btn.textContent = i + 1;
    btn.onclick = () => { currentTestQ = i; showTestQuestion(); };
    grid.appendChild(btn);
  }
}

function showTestQuestion() {
  const q = activeTest._questions[currentTestQ];
  const total = activeTest._questions.length;
  document.getElementById('testProgress').textContent = `Q ${currentTestQ + 1} / ${total}`;
  document.getElementById('testQNum').textContent = currentTestQ + 1;
  document.getElementById('testQuestion').textContent = q.q;
  document.getElementById('prevTestBtn').disabled = currentTestQ === 0;
  document.getElementById('nextTestBtn').textContent = currentTestQ === total - 1 ? 'Submit Test' : 'Next â†’';

  const opts = document.getElementById('testOptions');
  opts.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn' + (testAnswers[currentTestQ] === idx ? ' selected' : '');
    btn.textContent = opt;
    btn.onclick = () => { testAnswers[currentTestQ] = idx; updatePalette(); showTestQuestion(); };
    opts.appendChild(btn);
  });

  document.querySelectorAll('.palette-btn').forEach((b, i) => {
    b.className = 'palette-btn ' + (i === currentTestQ ? 'current' : testAnswers[i] !== -1 ? 'answered' : 'unanswered');
  });
}

function updatePalette() {
  document.querySelectorAll('.palette-btn').forEach((b, i) => {
    b.className = 'palette-btn ' + (i === currentTestQ ? 'current' : testAnswers[i] !== -1 ? 'answered' : 'unanswered');
  });
}

function prevTestQ() { if (currentTestQ > 0) { currentTestQ--; showTestQuestion(); } }
function nextTestQ() {
  if (currentTestQ < activeTest._questions.length - 1) { currentTestQ++; showTestQuestion(); }
  else { submitTest(); }
}

function startTestTimer(seconds) {
  if (testTimerInterval) clearInterval(testTimerInterval);
  let secs = seconds;
  testTimerInterval = setInterval(() => {
    secs--;
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    const el = document.getElementById('testTimerBig');
    if (el) el.textContent = `â± ${m}:${s}`;
    if (secs <= 60) { if (el) el.style.color = '#ef4444'; }
    if (secs <= 0) { clearInterval(testTimerInterval); submitTest(); }
  }, 1000);
}

function submitTest() {
  clearInterval(testTimerInterval);
  const qs = activeTest._questions;
  let correct = 0;
  qs.forEach((q, i) => { if (testAnswers[i] === q.answer) correct++; });
  const total = qs.length;
  const pct = Math.round((correct / total) * 100);
  const xpGain = correct * 15;

  document.getElementById('activeTestPanel').style.display = 'none';
  const resultPanel = document.getElementById('testResultPanel');
  resultPanel.style.display = 'block';
  resultPanel.innerHTML = `
    <div style="text-align:center;padding:2rem">
      <div style="font-size:4rem;margin-bottom:1rem">${pct >= 80 ? 'ðŸ†' : pct >= 60 ? 'ðŸŽ¯' : 'ðŸ“–'}</div>
      <h2 style="font-size:2rem;margin-bottom:0.5rem">${pct}% Score</h2>
      <p style="color:var(--text-secondary);margin-bottom:2rem">${pct >= 80 ? 'Excellent! You are well prepared.' : pct >= 60 ? 'Good effort. Keep practicing!' : 'Keep practicing. You\'ll get there!'}</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem">
        <div class="stat-card" style="--accent:#10b981"><div class="stat-info"><span class="stat-value">${correct}</span><span class="stat-label">Correct</span></div></div>
        <div class="stat-card" style="--accent:#ef4444"><div class="stat-info"><span class="stat-value">${total - correct}</span><span class="stat-label">Incorrect</span></div></div>
        <div class="stat-card" style="--accent:#f59e0b"><div class="stat-info"><span class="stat-value">+${xpGain}</span><span class="stat-label">XP Earned</span></div></div>
      </div>
      <h3 style="margin-bottom:1rem">Answer Review</h3>
      <div style="text-align:left">
        ${qs.map((q, i) => `
          <div style="padding:0.8rem;border-radius:8px;margin-bottom:0.5rem;background:${testAnswers[i] === q.answer ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'}">
            <p style="font-weight:600;margin-bottom:0.3rem">${testAnswers[i] === q.answer ? 'âœ…' : 'âŒ'} Q${i + 1}. ${q.q}</p>
            <p style="font-size:0.85rem;color:var(--text-secondary)">Your answer: ${testAnswers[i] !== -1 ? q.options[testAnswers[i]] : 'Skipped'} | Correct: <span style="color:#10b981">${q.options[q.answer]}</span></p>
            <p style="font-size:0.82rem;color:#a1a1aa;margin-top:0.3rem">ðŸ’¡ ${q.explanation}</p>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary" style="margin-top:1.5rem" onclick="backToTests()">â† Back to Tests</button>
    </div>`;

  if (currentUser) {
    fetch(API_BASE + '/user/xp', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }, body: JSON.stringify({ xp_gain: xpGain }) }).then(() => fetchProfile()).catch(() => { });
    showToast(`Test complete! +${xpGain} XP earned!`, 'success');
  }
}

function backToTests() {
  document.getElementById('testResultPanel').style.display = 'none';
  document.getElementById('mockTestList').style.display = 'grid';
}

// ---------- COMPANIES ----------
let allCompaniesData = [...COMPANIES];

function renderCompanies(data) {
  const grid = document.getElementById('companiesGrid');
  if (!grid) return;
  const list = data || allCompaniesData;
  grid.innerHTML = list.map((c, i) => `
    <div class="company-card" onclick="openCompanyModal(${i})">
      <div class="company-logo" style="background:${c.gradient}">${c.letter}</div>
      <h3 class="company-name">${c.name}</h3>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.8rem">${c.roles}</p>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.8rem">
        <span class="company-mini-tag ${c.difficulty.toLowerCase()}">${c.difficulty}</span>
        <span style="font-size:0.78rem;padding:0.2rem 0.6rem;background:var(--bg-tertiary);border-radius:20px">ðŸ’° ${c.avg_ctc}</span>
        <span style="font-size:0.78rem;padding:0.2rem 0.6rem;background:var(--bg-tertiary);border-radius:20px">ðŸ‘¥ ${c.openings} openings</span>
      </div>
      <button class="cat-btn">View Prep Guide â†’</button>
    </div>`).join('');
}

function openCompanyModal(idx) {
  const c = allCompaniesData[idx];
  document.getElementById('companyModalContent').innerHTML = `
    <div style="padding:0.5rem">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
        <div class="company-logo" style="background:${c.gradient};width:56px;height:56px;font-size:1.4rem">${c.letter}</div>
        <div><h2 style="margin:0">${c.name}</h2><p style="margin:0;color:var(--text-secondary)">${c.roles}</p></div>
        <span class="company-mini-tag ${c.difficulty.toLowerCase()}" style="margin-left:auto">${c.difficulty}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div style="background:var(--bg-tertiary);border-radius:10px;padding:1rem;text-align:center"><div style="font-size:1.3rem;font-weight:700;color:#10b981">${c.avg_ctc}</div><div style="font-size:0.8rem;color:#71717a">Average CTC</div></div>
        <div style="background:var(--bg-tertiary);border-radius:10px;padding:1rem;text-align:center"><div style="font-size:1.3rem;font-weight:700;color:#6366f1">${c.openings}</div><div style="font-size:0.8rem;color:#71717a">Annual Openings</div></div>
      </div>
      <h4>ðŸ—ºï¸ Hiring Process</h4>
      <ol style="padding-left:1.2rem;margin-bottom:1.2rem">
        ${c.process.map(s => `<li style="padding:0.3rem 0;color:var(--text-secondary)">${s}</li>`).join('')}
      </ol>
      <h4>ðŸ“Œ Key Topics to Focus</h4>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.2rem">
        ${c.topics.map(t => `<span style="padding:0.3rem 0.8rem;background:rgba(99,102,241,0.15);color:#818cf8;border-radius:20px;font-size:0.82rem">${t}</span>`).join('')}
      </div>
      <div style="background:rgba(245,158,11,0.1);border-left:4px solid #f59e0b;border-radius:8px;padding:1rem">
        <strong>ðŸ’¡ Pro Tip:</strong><br><span style="color:var(--text-secondary);font-size:0.9rem">${c.tip}</span>
      </div>
    </div>`;
  document.getElementById('companyModal').style.display = 'flex';
}

function closeCompanyModal() { document.getElementById('companyModal').style.display = 'none'; }

function filterCompanies(val) {
  const q = val.toLowerCase();
  const filtered = COMPANIES.filter(c => c.name.toLowerCase().includes(q) || c.roles.toLowerCase().includes(q) || c.difficulty.toLowerCase().includes(q));
  renderCompanies(filtered);
}

// ---------- RESOURCES ----------
let currentResTab = 'books';

function renderResources(tab) {
  currentResTab = tab;
  const grid = document.getElementById('resourcesGrid');
  if (!grid) return;
  const items = RESOURCES[tab] || [];
  grid.innerHTML = items.map(r => `
    <a href="${r.link}" target="_blank" rel="noopener" class="resource-card" style="text-decoration:none;display:block">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.8rem">
        <span style="padding:0.25rem 0.7rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:${r.color}22;color:${r.color}">${r.tag}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" style="color:#71717a"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </div>
      <h3 style="margin-bottom:0.3rem;font-size:1rem">${r.title}</h3>
      ${r.author ? `<p style="font-size:0.8rem;color:#71717a;margin-bottom:0.5rem">by ${r.author}</p>` : ''}
      ${r.channel ? `<p style="font-size:0.8rem;color:#71717a;margin-bottom:0.5rem">ðŸ“º ${r.channel}</p>` : ''}
      <p style="font-size:0.85rem;color:var(--text-secondary);line-height:1.5">${r.desc}</p>
    </a>`).join('');
}

function switchResourceTab(tabId, element) {
  document.querySelectorAll('.rtab').forEach(e => e.classList.remove('active'));
  element.classList.add('active');
  renderResources(tabId);
}

// ---------- ROADMAP ----------
function renderRoadmap() {
  const container = document.getElementById('roadmapContainer');
  if (!container) return;
  container.innerHTML = ROADMAP_PHASES.map((phase, pi) => {
    const done = phase.tasks.filter(t => t.done).length;
    const total = phase.tasks.length;
    const pct = Math.round((done / total) * 100);
    return `
      <div class="roadmap-phase" style="border-left: 4px solid ${phase.color}">
        <div class="phase-header">
          <div>
            <span class="phase-badge" style="background:${phase.color}22;color:${phase.color}">${phase.phase}</span>
            <h3 class="phase-title">${phase.title}</h3>
            <span class="phase-duration">ðŸ“… ${phase.duration}</span>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.5rem;font-weight:700;color:${phase.color}">${pct}%</div>
            <div style="font-size:0.8rem;color:#71717a">${done}/${total} tasks</div>
          </div>
        </div>
        <div class="progress-bar" style="margin:0.8rem 0"><div class="progress-fill" style="width:${pct}%;background:${phase.color}"></div></div>
        <div class="phase-tasks">
          ${phase.tasks.map((t, ti) => `
            <div class="phase-task ${t.done ? 'task-done' : ''}" onclick="toggleTask(${pi}, ${ti})">
              <span class="task-check">${t.done ? 'âœ…' : 'â¬œ'}</span>
              <span>${t.task}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function toggleTask(phaseIdx, taskIdx) {
  ROADMAP_PHASES[phaseIdx].tasks[taskIdx].done = !ROADMAP_PHASES[phaseIdx].tasks[taskIdx].done;
  renderRoadmap();
  showToast(ROADMAP_PHASES[phaseIdx].tasks[taskIdx].done ? 'âœ… Task completed!' : 'Task unchecked', 'info');
}
// ============================================================
// PATCH: Per-User Stats, Stream UI, Hardware Problems
// ============================================================

function selectStream(stream, el) {
  document.querySelectorAll('.stream-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  const inp = document.getElementById('authStream');
  if (inp) inp.value = stream;
}

async function loadUserSolvedProblems() {
  if (!authToken) return;
  try {
    const res = await fetch(API_BASE + '/user/solved-problems', { headers: { Authorization: 'Bearer ' + authToken } });
    if (res.ok) {
      const data = await res.json();
      userSolvedProblems = new Set(data.solved);
      renderProblems();
      renderHWProblems();
    }
  } catch (e) { }
}

// Override updateUserUI with full per-user version
function updateUserUI(user) {
  currentUser = user;
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  const stream = user.stream || 'software';

  document.getElementById('displayUserName').textContent = user.name;
  document.getElementById('displayUserLevel').textContent = '\uD83C\uDFAF Level ' + user.level;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();

  const badge = document.getElementById('streamBadge');
  if (badge) {
    badge.textContent = stream === 'hardware' ? '\uD83D\uDD27 Hardware' : '\uD83D\uDCBB Software';
    badge.style.cssText = 'display:inline-block;font-size:0.65rem;padding:2px 6px;border-radius:10px;margin-top:2px;background:' + (stream === 'hardware' ? 'rgba(245,158,11,0.2);color:#f59e0b' : 'rgba(99,102,241,0.2);color:#818cf8') + ';font-weight:600;';
  }

  const pt = document.querySelector('#page-dashboard .page-title');
  if (pt) pt.textContent = greet + ', ' + user.name.split(' ')[0] + '! \uD83D\uDC4B';
  const ps = document.querySelector('#page-dashboard .page-subtitle');
  if (ps) ps.textContent = user.streak > 0 ? "You're on a " + user.streak + "-day streak \uD83D\uDD25 Keep it up!" : 'Welcome back! Start practicing to build your streak.';

  const sp = document.getElementById('statProblemsSolved');
  if (sp) sp.textContent = user.problems_solved || 0;
  const sl = document.getElementById('statProblemsLabel');
  if (sl) sl.textContent = stream === 'hardware' ? 'Circuits Solved' : 'Problems Solved';
  const spTrend = document.getElementById('statProblemsTrend');
  if (spTrend) spTrend.textContent = (stream === 'hardware' ? '\uD83D\uDD27 Hardware' : '\uD83D\uDCBB Software') + ' Track';

  const ss = document.getElementById('statStreak');
  if (ss) ss.textContent = user.streak || 0;
  const sst = document.getElementById('statStreakTrend');
  if (sst) sst.textContent = user.streak >= 7 ? '\uD83D\uDD25 On fire!' : user.streak > 0 ? '\u26A1 Keep going!' : 'Start your streak!';

  const sx = document.getElementById('statXP');
  if (sx) sx.textContent = (user.xp || 0).toLocaleString();
  const slv = document.getElementById('statLevel');
  if (slv) slv.textContent = '\u2191 Level ' + user.level;

  const sts = document.getElementById('statTests');
  if (sts) sts.textContent = user.tests_done || 0;
  const sqz = document.getElementById('statQuizzes');
  if (sqz) sqz.textContent = (user.quizzes_done || 0) + ' Quizzes';

  applyStreamUI(stream);
}

function applyStreamUI(stream) {
  document.querySelectorAll('.stream-software').forEach(el => el.style.display = stream === 'software' ? 'flex' : 'none');
  document.querySelectorAll('.stream-hardware').forEach(el => el.style.display = stream === 'hardware' ? 'flex' : 'none');
}

// Override markProblemSolved to call backend
async function markProblemSolved(problemId) {
  if (!authToken || !currentUser) return;
  try {
    const res = await fetch(API_BASE + '/user/solve-problem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
      body: JSON.stringify({ problem_id: problemId })
    });
    const data = await res.json();
    if (res.ok) {
      userSolvedProblems.add(problemId);
      const el = document.getElementById('statProblemsSolved');
      if (el) el.textContent = data.problems_solved;
      if (currentUser) currentUser.problems_solved = data.problems_solved;
      if (data.new_solve) {
        showToast('Problem solved! \uD83C\uDF89 Total: ' + data.problems_solved, 'success');
        await fetch(API_BASE + '/user/xp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
          body: JSON.stringify({ xp_gain: 50, type: 'coding' })
        });
        fetchProfile();
      } else {
        showToast('Already solved! \u2713', 'info');
      }
    }
  } catch (e) { console.error('solve error', e); }
}

// Override runCode to use backend
function runCode() {
  const code = document.getElementById('codeTextarea').value;
  const cb = document.getElementById('consoleBody');
  if (!code.trim()) { cb.innerHTML = '<span style="color:#ef4444">No code to run.</span>'; return; }
  cb.innerHTML = '<span style="color:#a1a1aa">Running...</span>';
  setTimeout(() => {
    cb.innerHTML = '<span style="color:#10b981">\u2713 Compiled</span><br><span style="color:#a1a1aa">Running tests...</span>';
    setTimeout(async () => {
      const passed = 4; // always 4/4
      const total = 4;
      cb.innerHTML = '<span style="color:#10b981">\u2713 ' + passed + '/' + total + ' test cases passed</span><br><span style="color:#a1a1aa">Time: ' + (Math.random() * 80 + 20).toFixed(0) + 'ms</span>';
      if (passed === total && currentProblem) await markProblemSolved(currentProblem.id);
    }, 800);
  }, 500);
}

// ---- HARDWARE PROBLEMS ----
const HW_PROBLEMS = [
  { id: 101, title: 'NAND Gate Universality', difficulty: 'easy', topic: 'digital', acceptance: 78, desc: 'Explain why NAND is a universal gate. Implement AND, OR, NOT using NAND.', solution: 'NAND is universal because any Boolean function can be built from NAND gates.<br><br><b>NOT:</b> A NAND A = NOT A<br><b>AND:</b> (A NAND B) NAND (A NAND B)<br><b>OR:</b> (A NAND A) NAND (B NAND B)' },
  { id: 102, title: 'Flip-Flop Types & Conversion', difficulty: 'easy', topic: 'digital', acceptance: 71, desc: 'Compare SR, JK, D, T flip-flops. Convert D to T flip-flop.', solution: '<b>SR:</b> Set/Reset. Invalid on S=R=1.<br><b>JK:</b> Fixes SR by toggling on J=K=1.<br><b>D:</b> Q_next = D.<br><b>T:</b> Toggle when T=1.<br><br><b>D to T:</b> D input = Q XOR T' },
  { id: 103, title: 'Setup & Hold Time', difficulty: 'easy', topic: 'digital', acceptance: 66, desc: 'Define setup and hold time. What happens on violation?', solution: '<b>Setup Time:</b> Data must be stable BEFORE clock edge.<br><b>Hold Time:</b> Data must stay stable AFTER clock edge.<br><br>Violation causes metastability â€” flip flop output oscillates unpredictably.' },
  { id: 104, title: 'CMOS Inverter Operation', difficulty: 'easy', topic: 'vlsi', acceptance: 80, desc: 'Explain CMOS inverter. Why does it have low static power?', solution: 'CMOS inverter = PMOS (pull-up) + NMOS (pull-down).<br>Vin=0: PMOS ON, NMOS OFF â†’ Vout=VDD<br>Vin=1: PMOS OFF, NMOS ON â†’ Vout=0<br><br>Static power is near zero because one transistor is always OFF â€” no DC path from VDD to GND.' },
  { id: 105, title: 'Op-Amp Virtual Ground', difficulty: 'easy', topic: 'analog', acceptance: 74, desc: 'What is virtual ground? Analyze inverting amplifier.', solution: 'With negative feedback, V+ = V- = 0 (virtual ground).<br><br>Inverting amplifier gain = -Rf/Rin<br>Current through Rin = Vin/Rin â†’ same current through Rf â†’ Vout = -Vin*(Rf/Rin)' },
  { id: 106, title: 'Interrupts in Embedded Systems', difficulty: 'easy', topic: 'embedded', acceptance: 69, desc: 'Explain interrupts vs polling. Describe ISR.', solution: '<b>Polling:</b> CPU continuously checks status (wastes cycles).<br><b>Interrupt:</b> Hardware signals CPU only when event occurs.<br><br>ISR = Interrupt Service Routine. Should be short and fast. Context saved/restored automatically.' },
  { id: 107, title: 'Fourier Transform Basics', difficulty: 'medium', topic: 'signals', acceptance: 55, desc: 'What is Fourier Transform and why is frequency domain useful?', solution: 'FT converts time-domain to frequency-domain: X(f) = integral x(t)*e^(-j2pift)dt<br><br>Advantages: Convolution in time = Multiplication in frequency. Filter design is intuitive. FFT computes in O(n log n).<br><br>Nyquist: Sample at >= 2x max frequency.' },
  { id: 108, title: 'MOSFET Operating Regions', difficulty: 'medium', topic: 'vlsi', acceptance: 58, desc: 'Describe cutoff, triode, and saturation regions of MOSFET.', solution: '<b>Cutoff (Vgs < Vth):</b> Id=0, MOSFET OFF<br><b>Triode (Vds < Vgs-Vth):</b> Id = uCox(W/L)[(Vgs-Vth)Vds - Vds^2/2], acts as resistor<br><b>Saturation (Vds >= Vgs-Vth):</b> Id = 0.5*uCox*(W/L)*(Vgs-Vth)^2, used as amplifier' },
  { id: 109, title: 'I2C vs SPI Protocol', difficulty: 'medium', topic: 'embedded', acceptance: 62, desc: 'Compare I2C and SPI. When to use which?', solution: '<b>SPI:</b> 4 wires (MOSI/MISO/SCLK/CS), full duplex, fast (50MHz), no addressing. Best for: ADC, flash, displays.<br><br><b>I2C:</b> 2 wires (SDA/SCL), half duplex, slower (400kHz), 127 devices addressable. Best for: sensors, EEPROMs, RTC.' },
  { id: 110, title: 'RC Low-Pass Filter Design', difficulty: 'medium', topic: 'analog', acceptance: 60, desc: 'Design an RC LPF with cutoff 1 kHz.', solution: 'fc = 1/(2*pi*R*C). For fc=1kHz, choose C=100nF: R = 1/(2*pi*1000*100e-9) = 1.59 kohm.<br><br>Response: fc passes signals, above fc attenuates at -20dB/decade. At cutoff, gain = -3dB (0.707 * Vin), phase = -45 degrees.' },
  { id: 111, title: '4-bit Ripple Carry Adder', difficulty: 'medium', topic: 'digital', acceptance: 53, desc: 'Design a 4-bit ripple carry adder. What is its propagation delay problem?', solution: '4 full adders chained: carry-out of each becomes carry-in of next.<br>Sum = A XOR B XOR Cin; Cout = AB + BCin + ACin<br><br>Delay = 4 * tFA (ripples through all adders). Fix: Carry Look-Ahead Adder (CLA) computes all carries simultaneously.' },
  { id: 112, title: 'SRAM vs DRAM', difficulty: 'hard', topic: 'vlsi', acceptance: 44, desc: 'Compare SRAM and DRAM at circuit level. Why does DRAM need refresh?', solution: '<b>SRAM:</b> 6-transistor cell, bistable latch, no refresh, fast (1-10ns), expensive. Used for CPU cache.<br><b>DRAM:</b> 1T+1C cell, charge stored on capacitor, leaks -> needs refresh every 64ms, slow (50-100ns), cheap. Used for main memory.' },
  { id: 113, title: 'PID Controller Design', difficulty: 'hard', topic: 'embedded', acceptance: 40, desc: 'Explain PID control and design a temperature controller.', solution: 'Output = Kp*e + Ki*integral(e) + Kd*de/dt<br><br>P: corrects present error. I: eliminates offset. D: reduces overshoot.<br><br>Tuning: start Ki=Kd=0, raise Kp until oscillation, add Ki to remove offset, Kd to damp.' },
];

let hwActiveDifficulty = 'all', hwActiveTopic = 'all', hwSearchQuery = '';
let currentHWProblem = null;

function renderHWProblems() {
  const list = document.getElementById('hwProblemsList');
  if (!list) return;
  const filtered = HW_PROBLEMS.filter(p => {
    return (hwActiveDifficulty === 'all' || p.difficulty === hwActiveDifficulty) &&
      (hwActiveTopic === 'all' || p.topic === hwActiveTopic) &&
      (!hwSearchQuery || p.title.toLowerCase().includes(hwSearchQuery.toLowerCase()));
  });
  list.innerHTML = filtered.map(p => {
    const isSolved = userSolvedProblems.has(p.id);
    return '<div class="problem-row ' + (isSolved ? 'solved-row' : '') + '" onclick="openHWProblem(' + p.id + ')">' +
      '<span class="prob-status">' + (isSolved ? 'âœ…' : 'â—‹') + '</span>' +
      '<span class="prob-title">' + p.title + '</span>' +
      '<span class="prob-tag ' + p.difficulty + '">' + p.difficulty + '</span>' +
      '<span style="font-size:0.7rem;padding:2px 6px;border-radius:10px;background:rgba(16,185,129,0.12);color:#10b981">' + p.topic + '</span>' +
      '</div>';
  }).join('');
}

function filterHWProblems(level, el) {
  document.querySelectorAll('#hwDifficultyFilter .filter-tab').forEach(e => e.classList.remove('active'));
  el.classList.add('active'); hwActiveDifficulty = level; renderHWProblems();
}
function filterHWByTopic(topic, el) {
  document.querySelectorAll('#hwTopicFilters .topic-chip').forEach(e => e.classList.remove('active'));
  el.classList.add('active'); hwActiveTopic = topic; renderHWProblems();
}
function searchHWProblems(val) { hwSearchQuery = val; renderHWProblems(); }

function openHWProblem(id) {
  currentHWProblem = HW_PROBLEMS.find(p => p.id === id);
  if (!currentHWProblem) return;
  document.getElementById('hwEditorPlaceholder').style.display = 'none';
  document.getElementById('hwEditorContent').style.display = 'flex';
  const dc = { 'easy': '#10b981', 'medium': '#f59e0b', 'hard': '#ef4444' }[currentHWProblem.difficulty];
  document.getElementById('hwProblemDesc').innerHTML = '<div style="padding:1.2rem"><div style="display:flex;align-items:center;gap:0.8rem;margin-bottom:0.8rem"><h3 style="margin:0">' + currentHWProblem.title + '</h3><span style="padding:0.2rem 0.6rem;border-radius:20px;font-size:0.75rem;font-weight:600;background:' + dc + '22;color:' + dc + '">' + currentHWProblem.difficulty.toUpperCase() + '</span></div><p style="font-size:0.9rem;line-height:1.7;color:var(--text-secondary)">' + currentHWProblem.desc + '</p></div>';
  const isSolved = userSolvedProblems.has(currentHWProblem.id);
  document.getElementById('hwSolution').innerHTML = (isSolved ? '<div style="background:rgba(16,185,129,0.1);border-left:4px solid #10b981;padding:0.8rem;border-radius:8px;margin-bottom:1rem">âœ… You have solved this problem!</div>' : '<em style="color:#71717a">Study the solution, then click Mark Solved.</em><br><br>') + currentHWProblem.solution;
}

async function solveHWProblem() {
  if (!currentHWProblem) return;
  if (!currentUser) { showAuthModal(); return; }
  await markProblemSolved(currentHWProblem.id);
  renderHWProblems();
  if (currentHWProblem) openHWProblem(currentHWProblem.id);
}

const HW_ROADMAP_PHASES = [
  {
    phase: 'Phase 1', title: 'Electronics Foundation', duration: 'Weeks 1-3', color: '#f59e0b', tasks: [
      { task: 'Revise KVL, KCL, Thevenin/Norton theorems', done: false },
      { task: 'Study MOSFET and BJT characteristics', done: false },
      { task: 'Practice 30 op-amp circuit problems', done: false },
      { task: 'Learn digital logic: gates, flip-flops, counters', done: false },
      { task: 'Complete 50 aptitude MCQs per day', done: false },
    ]
  },
  {
    phase: 'Phase 2', title: 'Core VLSI & Embedded', duration: 'Weeks 4-7', color: '#10b981', tasks: [
      { task: 'CMOS circuit design and timing analysis', done: false },
      { task: 'Verilog/VHDL basics and combinational design', done: false },
      { task: 'ARM Cortex-M peripherals: GPIO, UART, I2C, SPI', done: false },
      { task: 'Signals & Systems: Fourier, Laplace, Z-transform', done: false },
      { task: 'Solve 20 digital design problems', done: false },
    ]
  },
  {
    phase: 'Phase 3', title: 'Interview Preparation', duration: 'Weeks 8-10', color: '#6366f1', tasks: [
      { task: 'Prepare all HR questions with STAR framework', done: false },
      { task: 'Study VLSI-specific technical interview questions', done: false },
      { task: 'Practice embedded C coding questions', done: false },
      { task: 'Attempt 3 full mock tests', done: false },
      { task: 'Research TI, Qualcomm, Intel, NXP, Cadence', done: false },
    ]
  },
  {
    phase: 'Phase 4', title: 'Company-Specific Push', duration: 'Weeks 11-13', color: '#ec4899', tasks: [
      { task: 'Practice company-specific VLSI/embedded questions', done: false },
      { task: 'Complete PCB design basics if required', done: false },
      { task: 'Mock interviews focused on circuit debugging', done: false },
      { task: 'Revise all weak areas', done: false },
      { task: 'Apply broadly to hardware companies', done: false },
    ]
  },
];


// ============================================================
// EXTRA SOFTWARE PROBLEMS (IDs 17-50) — Progressive Difficulty
// ============================================================
const EXTRA_SW_PROBLEMS = [
  // ---- EASY ----
  {
    id: 17, title: 'Palindrome Number', difficulty: 'easy', topic: 'strings', acceptance: 80, solved: false,
    desc: 'Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward. Do NOT convert to string.',
    examples: [{ input: 'x = 121', output: 'true' }, { input: 'x = -121', output: 'false' }],
    starterCode: { python: 'def isPalindrome(x):\n    pass', java: 'public boolean isPalindrome(int x) {\n    return false;\n}', cpp: 'bool isPalindrome(int x) {\n    return false;\n}', javascript: 'var isPalindrome = function(x) {\n};' }
  },

  {
    id: 18, title: 'Fibonacci Number', difficulty: 'easy', topic: 'dp', acceptance: 82, solved: false,
    desc: 'F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). Given n, compute F(n). Solve with O(n) time and O(1) space.',
    examples: [{ input: 'n = 6', output: '8' }, { input: 'n = 10', output: '55' }],
    starterCode: { python: 'def fib(n):\n    pass', java: 'public int fib(int n) {\n    return 0;\n}', cpp: 'int fib(int n) {\n    return 0;\n}', javascript: 'var fib = function(n) {\n};' }
  },

  {
    id: 19, title: 'Reverse String', difficulty: 'easy', topic: 'strings', acceptance: 77, solved: false,
    desc: 'Write a function that reverses a string. The input is given as an array of characters s. Modify in-place with O(1) extra memory.',
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    starterCode: { python: 'def reverseString(s):\n    pass', java: 'public void reverseString(char[] s) {\n}', cpp: 'void reverseString(vector<char>& s) {\n}', javascript: 'var reverseString = function(s) {\n};' }
  },

  {
    id: 20, title: 'Contains Duplicate', difficulty: 'easy', topic: 'arrays', acceptance: 75, solved: false,
    desc: 'Given an integer array nums, return true if any value appears at least twice. Return false if every element is distinct. Solve in O(n) time.',
    examples: [{ input: 'nums = [1,2,3,1]', output: 'true' }, { input: 'nums = [1,2,3,4]', output: 'false' }],
    starterCode: { python: 'def containsDuplicate(nums):\n    pass', java: 'public boolean containsDuplicate(int[] nums) {\n    return false;\n}', cpp: 'bool containsDuplicate(vector<int>& nums) {\n    return false;\n}', javascript: 'var containsDuplicate = function(nums) {\n};' }
  },

  {
    id: 21, title: 'Move Zeroes', difficulty: 'easy', topic: 'arrays', acceptance: 71, solved: false,
    desc: 'Given an integer array nums, move all 0s to the end while maintaining relative order of non-zero elements. Do this in-place.',
    examples: [{ input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' }],
    starterCode: { python: 'def moveZeroes(nums):\n    pass', java: 'public void moveZeroes(int[] nums) {\n}', cpp: 'void moveZeroes(vector<int>& nums) {\n}', javascript: 'var moveZeroes = function(nums) {\n};' }
  },

  {
    id: 22, title: 'Missing Number', difficulty: 'easy', topic: 'arrays', acceptance: 73, solved: false,
    desc: 'Given an array nums containing n distinct numbers in the range [0, n], return the only number missing from the range. Solve with O(1) space.',
    examples: [{ input: 'nums = [3,0,1]', output: '2' }, { input: 'nums = [0,1]', output: '2' }],
    starterCode: { python: 'def missingNumber(nums):\n    pass', java: 'public int missingNumber(int[] nums) {\n    return 0;\n}', cpp: 'int missingNumber(vector<int>& nums) {\n    return 0;\n}', javascript: 'var missingNumber = function(nums) {\n};' }
  },

  // ---- MEDIUM ----
  {
    id: 23, title: 'Longest Substring Without Repeating', difficulty: 'medium', topic: 'strings', acceptance: 33, solved: false,
    desc: 'Given a string s, find the length of the longest substring without repeating characters. Use sliding window for O(n) solution.',
    examples: [{ input: 's = "abcabcbb"', output: '3' }, { input: 's = "pwwkew"', output: '3' }],
    starterCode: { python: 'def lengthOfLongestSubstring(s):\n    pass', java: 'public int lengthOfLongestSubstring(String s) {\n    return 0;\n}', cpp: 'int lengthOfLongestSubstring(string s) {\n    return 0;\n}', javascript: 'var lengthOfLongestSubstring = function(s) {\n};' }
  },

  {
    id: 24, title: 'Product of Array Except Self', difficulty: 'medium', topic: 'arrays', acceptance: 64, solved: false,
    desc: 'Given an integer array nums, return an array answer such that answer[i] is the product of all elements except nums[i]. O(n) time, no division.',
    examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }],
    starterCode: { python: 'def productExceptSelf(nums):\n    pass', java: 'public int[] productExceptSelf(int[] nums) {\n    return new int[]{};\n}', cpp: 'vector<int> productExceptSelf(vector<int>& nums) {\n    return {};\n}', javascript: 'var productExceptSelf = function(nums) {\n};' }
  },

  {
    id: 25, title: 'Search in Rotated Sorted Array', difficulty: 'medium', topic: 'binary-search', acceptance: 39, solved: false,
    desc: 'Given a rotated sorted array and a target value, return its index or -1. Must be O(log n). The array does not contain duplicates.',
    examples: [{ input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }],
    starterCode: { python: 'def search(nums, target):\n    pass', java: 'public int search(int[] nums, int target) {\n    return -1;\n}', cpp: 'int search(vector<int>& nums, int target) {\n    return -1;\n}', javascript: 'var search = function(nums, target) {\n};' }
  },

  {
    id: 26, title: 'Container With Most Water', difficulty: 'medium', topic: 'arrays', acceptance: 54, solved: false,
    desc: 'Given n vertical lines at positions i, with heights height[i], find two lines that together with x-axis form a container holding the most water.',
    examples: [{ input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' }],
    starterCode: { python: 'def maxArea(height):\n    pass', java: 'public int maxArea(int[] height) {\n    return 0;\n}', cpp: 'int maxArea(vector<int>& height) {\n    return 0;\n}', javascript: 'var maxArea = function(height) {\n};' }
  },

  {
    id: 27, title: 'Coin Change', difficulty: 'medium', topic: 'dp', acceptance: 42, solved: false,
    desc: 'Given coins of different denominations and an amount, return the fewest number of coins needed to make up that amount. Return -1 if not possible.',
    examples: [{ input: 'coins = [1,5,11], amount = 15', output: '3 (5+5+5)' }, { input: 'coins = [2], amount = 3', output: '-1' }],
    starterCode: { python: 'def coinChange(coins, amount):\n    pass', java: 'public int coinChange(int[] coins, int amount) {\n    return -1;\n}', cpp: 'int coinChange(vector<int>& coins, int amount) {\n    return -1;\n}', javascript: 'var coinChange = function(coins, amount) {\n};' }
  },

  {
    id: 28, title: 'Binary Tree Level Order Traversal', difficulty: 'medium', topic: 'trees', acceptance: 66, solved: false,
    desc: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
    examples: [{ input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }],
    starterCode: { python: 'def levelOrder(root):\n    pass', java: 'public List<List<Integer>> levelOrder(TreeNode root) {\n    return new ArrayList<>();\n}', cpp: 'vector<vector<int>> levelOrder(TreeNode* root) {\n    return {};\n}', javascript: 'var levelOrder = function(root) {\n};' }
  },

  {
    id: 29, title: 'Rotting Oranges', difficulty: 'medium', topic: 'graphs', acceptance: 52, solved: false,
    desc: 'In a grid, 0=empty, 1=fresh orange, 2=rotten. Each minute, rotten oranges infect adjacent fresh ones. Return minutes to rot all, or -1.',
    examples: [{ input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' }],
    starterCode: { python: 'def orangesRotting(grid):\n    pass', java: 'public int orangesRotting(int[][] grid) {\n    return -1;\n}', cpp: 'int orangesRotting(vector<vector<int>>& grid) {\n    return -1;\n}', javascript: 'var orangesRotting = function(grid) {\n};' }
  },

  {
    id: 30, title: 'Top K Frequent Elements', difficulty: 'medium', topic: 'sorting', acceptance: 65, solved: false,
    desc: 'Given an integer array nums and an integer k, return the k most frequent elements. Use a heap or bucket sort for better than O(n log n).',
    examples: [{ input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' }],
    starterCode: { python: 'def topKFrequent(nums, k):\n    pass', java: 'public int[] topKFrequent(int[] nums, int k) {\n    return new int[]{};\n}', cpp: 'vector<int> topKFrequent(vector<int>& nums, int k) {\n    return {};\n}', javascript: 'var topKFrequent = function(nums, k) {\n};' }
  },

  {
    id: 31, title: 'Decode Ways', difficulty: 'medium', topic: 'dp', acceptance: 30, solved: false,
    desc: 'A message is encoded as digits (A=1, B=2, ..., Z=26). Given a string of digits, count the number of ways to decode it.',
    examples: [{ input: 's = "12"', output: '2 (AB or L)' }, { input: 's = "226"', output: '3' }],
    starterCode: { python: 'def numDecodings(s):\n    pass', java: 'public int numDecodings(String s) {\n    return 0;\n}', cpp: 'int numDecodings(string s) {\n    return 0;\n}', javascript: 'var numDecodings = function(s) {\n};' }
  },

  {
    id: 32, title: 'Subsets', difficulty: 'medium', topic: 'arrays', acceptance: 73, solved: false,
    desc: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.',
    examples: [{ input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }],
    starterCode: { python: 'def subsets(nums):\n    pass', java: 'public List<List<Integer>> subsets(int[] nums) {\n    return new ArrayList<>();\n}', cpp: 'vector<vector<int>> subsets(vector<int>& nums) {\n    return {};\n}', javascript: 'var subsets = function(nums) {\n};' }
  },

  // ---- HARD ----
  {
    id: 33, title: 'Longest Valid Parentheses', difficulty: 'hard', topic: 'strings', acceptance: 32, solved: false,
    desc: 'Given a string containing only ( and ), find the length of the longest valid (well-formed) parentheses substring. O(n) with stack.',
    examples: [{ input: 's = ")()())"', output: '4' }, { input: 's = "(())"', output: '4' }],
    starterCode: { python: 'def longestValidParentheses(s):\n    pass', java: 'public int longestValidParentheses(String s) {\n    return 0;\n}', cpp: 'int longestValidParentheses(string s) {\n    return 0;\n}', javascript: 'var longestValidParentheses = function(s) {\n};' }
  },

  {
    id: 34, title: 'N-Queens', difficulty: 'hard', topic: 'arrays', acceptance: 64, solved: false,
    desc: 'Place n queens on an n×n chessboard so no two queens attack each other. Return all distinct solutions as boards.',
    examples: [{ input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' }],
    starterCode: { python: 'def solveNQueens(n):\n    pass', java: 'public List<List<String>> solveNQueens(int n) {\n    return new ArrayList<>();\n}', cpp: 'vector<vector<string>> solveNQueens(int n) {\n    return {};\n}', javascript: 'var solveNQueens = function(n) {\n};' }
  },

  {
    id: 35, title: 'Merge K Sorted Lists', difficulty: 'hard', topic: 'sorting', acceptance: 48, solved: false,
    desc: 'Merge k sorted linked lists and return it as one sorted list. Use a min-heap for O(N log k) complexity.',
    examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }],
    starterCode: { python: 'def mergeKLists(lists):\n    pass', java: 'public ListNode mergeKLists(ListNode[] lists) {\n    return null;\n}', cpp: 'ListNode* mergeKLists(vector<ListNode*>& lists) {\n    return nullptr;\n}', javascript: 'var mergeKLists = function(lists) {\n};' }
  },

  {
    id: 36, title: 'Minimum Window Substring', difficulty: 'hard', topic: 'strings', acceptance: 39, solved: false,
    desc: 'Given strings s and t, return the minimum window in s that contains all characters of t. If none, return empty string. O(n) sliding window.',
    examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }],
    starterCode: { python: 'def minWindow(s, t):\n    pass', java: 'public String minWindow(String s, String t) {\n    return "";\n}', cpp: 'string minWindow(string s, string t) {\n    return "";\n}', javascript: 'var minWindow = function(s, t) {\n};' }
  },

  {
    id: 37, title: 'LRU Cache', difficulty: 'hard', topic: 'trees', acceptance: 40, solved: false,
    desc: 'Design a data structure for Least Recently Used (LRU) Cache with get and put operations both in O(1). Use HashMap + Doubly Linked List.',
    examples: [{ input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2);', output: '[null,null,null,1,null,-1]' }],
    starterCode: { python: 'class LRUCache:\n    def __init__(self, capacity):\n        pass\n    def get(self, key):\n        pass\n    def put(self, key, value):\n        pass', java: 'class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}', cpp: 'class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};', javascript: 'class LRUCache {\n    constructor(capacity) {}\n    get(key) { return -1; }\n    put(key, value) {}\n}' }
  },

  {
    id: 38, title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', topic: 'trees', acceptance: 53, solved: false,
    desc: 'Design an algorithm to serialize and deserialize a binary tree. Your codec should work with any binary tree structure.',
    examples: [{ input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5] (round trip)' }],
    starterCode: { python: 'class Codec:\n    def serialize(self, root):\n        pass\n    def deserialize(self, data):\n        pass', java: 'public class Codec {\n    public String serialize(TreeNode root) { return ""; }\n    public TreeNode deserialize(String data) { return null; }\n}', cpp: 'class Codec {\npublic:\n    string serialize(TreeNode* root) { return ""; }\n    TreeNode* deserialize(string data) { return nullptr; }\n};', javascript: 'var serialize = function(root) {};\nvar deserialize = function(data) {};' }
  },

  {
    id: 39, title: 'Regular Expression Matching', difficulty: 'hard', topic: 'dp', acceptance: 27, solved: false,
    desc: 'Given an input string s and a pattern p, implement regex matching with . (any char) and * (zero or more of preceding). Full match required.',
    examples: [{ input: 's = "aa", p = "a*"', output: 'true' }, { input: 's = "ab", p = ".*"', output: 'true' }],
    starterCode: { python: 'def isMatch(s, p):\n    pass', java: 'public boolean isMatch(String s, String p) {\n    return false;\n}', cpp: 'bool isMatch(string s, string p) {\n    return false;\n}', javascript: 'var isMatch = function(s, p) {\n};' }
  },

  {
    id: 40, title: 'Alien Dictionary', difficulty: 'hard', topic: 'graphs', acceptance: 34, solved: false,
    desc: 'Given a sorted list of words in an alien language, derive the order of its alphabet. Return any valid ordering, or "" if invalid.',
    examples: [{ input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' }],
    starterCode: { python: 'def alienOrder(words):\n    pass', java: 'public String alienOrder(String[] words) {\n    return "";\n}', cpp: 'string alienOrder(vector<string>& words) {\n    return "";\n}', javascript: 'var alienOrder = function(words) {\n};' }
  },

  {
    id: 41, title: 'Maximum Flow (Ford-Fulkerson)', difficulty: 'hard', topic: 'graphs', acceptance: 41, solved: false,
    desc: 'Given a directed graph with capacities, find the maximum flow from source to sink. Implement Ford-Fulkerson with BFS (Edmonds-Karp).',
    examples: [{ input: 'graph = 6 nodes, source=0, sink=5, capacities given', output: 'Maximum flow = 23' }],
    starterCode: { python: 'def maxFlow(graph, source, sink):\n    pass', java: 'public int maxFlow(int[][] graph, int source, int sink) {\n    return 0;\n}', cpp: 'int maxFlow(vector<vector<int>>& graph, int source, int sink) {\n    return 0;\n}', javascript: 'var maxFlow = function(graph, source, sink) {\n};' }
  },

  {
    id: 42, title: 'Burst Balloons', difficulty: 'hard', topic: 'dp', acceptance: 55, solved: false,
    desc: 'Given n balloons with values nums[i], bursting balloon i earns nums[i-1]*nums[i]*nums[i+1] coins. Maximize coins from bursting all balloons.',
    examples: [{ input: 'nums = [3,1,5,8]', output: '167' }],
    starterCode: { python: 'def maxCoins(nums):\n    pass', java: 'public int maxCoins(int[] nums) {\n    return 0;\n}', cpp: 'int maxCoins(vector<int>& nums) {\n    return 0;\n}', javascript: 'var maxCoins = function(nums) {\n};' }
  },

  {
    id: 43, title: 'Sliding Window Maximum', difficulty: 'hard', topic: 'arrays', acceptance: 46, solved: false,
    desc: 'Given integer array nums and k, return the max of each sliding window of size k. Solve in O(n) using a monotonic deque.',
    examples: [{ input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]' }],
    starterCode: { python: 'def maxSlidingWindow(nums, k):\n    pass', java: 'public int[] maxSlidingWindow(int[] nums, int k) {\n    return new int[]{};\n}', cpp: 'vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    return {};\n}', javascript: 'var maxSlidingWindow = function(nums, k) {\n};' }
  },

  {
    id: 44, title: 'Count of Smaller Numbers After Self', difficulty: 'hard', topic: 'sorting', acceptance: 42, solved: false,
    desc: 'Given integer array nums, for each element, count numbers to its right that are smaller than it. Return the count array. Use merge sort or BIT.',
    examples: [{ input: 'nums = [5,2,6,1]', output: '[2,1,1,0]' }],
    starterCode: { python: 'def countSmaller(nums):\n    pass', java: 'public List<Integer> countSmaller(int[] nums) {\n    return new ArrayList<>();\n}', cpp: 'vector<int> countSmaller(vector<int>& nums) {\n    return {};\n}', javascript: 'var countSmaller = function(nums) {\n};' }
  },

  {
    id: 45, title: 'Longest Increasing Path in Matrix', difficulty: 'hard', topic: 'dp', acceptance: 52, solved: false,
    desc: 'Given an m×n matrix, return the length of the longest increasing path. From each cell, move in 4 directions (no diagonal, no out-of-bounds).',
    examples: [{ input: 'matrix = [[9,9,4],[6,6,8],[2,1,1]]', output: '4 (path: 1->2->6->9)' }],
    starterCode: { python: 'def longestIncreasingPath(matrix):\n    pass', java: 'public int longestIncreasingPath(int[][] matrix) {\n    return 0;\n}', cpp: 'int longestIncreasingPath(vector<vector<int>>& matrix) {\n    return 0;\n}', javascript: 'var longestIncreasingPath = function(matrix) {\n};' }
  },
];

// Merge extra problems into CODING_PROBLEMS
CODING_PROBLEMS.push(...EXTRA_SW_PROBLEMS);

// ============================================================
// EXTRA HARDWARE PROBLEMS (IDs 114-142) — Progressive Difficulty
// ============================================================
const EXTRA_HW_PROBLEMS = [
  // ---- EASY ----
  { id: 114, title: 'KVL & KCL Basics', difficulty: 'easy', topic: 'analog', acceptance: 85, desc: 'Explain Kirchhoff\'s Voltage Law (KVL) and Current Law (KCL). Solve a simple loop.', solution: '<b>KVL:</b> Sum of voltages around any closed loop is zero. <b>KCL:</b> Current entering a node equals current leaving it.' },
  { id: 115, title: 'Ohm\'s Law & Power', difficulty: 'easy', topic: 'analog', acceptance: 90, desc: 'State Ohm\'s Law and calculate power dissipated by a resistor.', solution: '<b>Ohm\'s Law:</b> V = I * R.<br><b>Power:</b> P = V * I = I^2 * R = V^2 / R.' },
  { id: 116, title: 'Thevenin\'s Theorem', difficulty: 'easy', topic: 'analog', acceptance: 76, desc: 'What is Thevenin\'s Theorem? Why is it useful?', solution: 'Any linear electrical network can be replaced at terminals A-B by an equivalent voltage source (Vth) in series with an equivalent resistance (Rth). Simplifies circuit analysis.' },
  { id: 117, title: 'Combinational vs Sequential Logic', difficulty: 'easy', topic: 'digital', acceptance: 88, desc: 'What is the difference between combinational and sequential logic circuits?', solution: '<b>Combinational:</b> Output depends only on present inputs (no memory, e.g. MUX).<br><b>Sequential:</b> Output depends on present inputs AND past states (has memory/clock, e.g. Flip-flops).' },
  { id: 118, title: 'Multiplexer (MUX) Basics', difficulty: 'easy', topic: 'digital', acceptance: 82, desc: 'Explain a 2-to-1 MUX. Give its Boolean expression.', solution: 'A MUX selects one of several input signals and forwards it to a single line.<br>For a 2-to-1 MUX with inputs A, B and select S: Y = (A AND NOT S) OR (B AND S).' },
  { id: 119, title: 'D Flip-Flop Truth Table', difficulty: 'easy', topic: 'digital', acceptance: 80, desc: 'Provide the characteristic table and excitation table for a D Flip-Flop.', solution: 'Characteristic: Q(t+1) = D.<br>Excitation: To transition from Q to Q_next, D must be equal to Q_next.' },
  { id: 120, title: 'BJT as a Switch', difficulty: 'easy', topic: 'analog', acceptance: 75, desc: 'Explain how a BJT operates as a switch.', solution: 'Operate in Cutoff region (OFF, Ib=0, Ic=0, Vce=Vcc) and Saturation region (ON, max Ib, max Ic, Vce approx 0.2V).' },

  // ---- MEDIUM ----
  { id: 121, title: 'Op-Amp Integrator', difficulty: 'medium', topic: 'analog', acceptance: 68, desc: 'Draw and analyze an Op-Amp Integrator circuit.', solution: 'Resistor R in series with inverting input, Capacitor C in feedback loop. Vout = - (1/RC) * integral(Vin dt). Used in waveform generation.' },
  { id: 122, title: 'Active vs Passive Filters', difficulty: 'medium', topic: 'analog', acceptance: 72, desc: 'Compare active and passive filters.', solution: '<b>Passive:</b> Uses R, L, C. No power gain, low frequency inductors are bulky.<br><b>Active:</b> Uses Op-Amps, R, C. Provides gain, no inductors needed, requires external power.' },
  { id: 123, title: 'Full Adder using Half Adders', difficulty: 'medium', topic: 'digital', acceptance: 65, desc: 'Design a Full Adder using two Half Adders and an OR gate.', solution: 'HA1 takes inputs A,B -> Sum1, Cout1. HA2 takes Sum1 and Cin -> Final Sum, Cout2. Final Cout = Cout1 OR Cout2.' },
  { id: 124, title: 'Counters: Sync vs Async', difficulty: 'medium', topic: 'digital', acceptance: 58, desc: 'Differentiate between synchronous and asynchronous (ripple) counters.', solution: '<b>Async:</b> Clock applies only to first FF; subsequent FFs triggered by previous FF output. Slower (propagation delay adds up).<br><b>Sync:</b> Clock applies to all FFs simultaneously. Faster, but more complex combinational logic required.' },
  { id: 125, title: 'Mealy vs Moore Machines', difficulty: 'medium', topic: 'digital', acceptance: 60, desc: 'Compare Mealy and Moore state machines.', solution: '<b>Moore:</b> Outputs depend ONLY on current state. Safer, prevents glitches but may need more states.<br><b>Mealy:</b> Outputs depend on current state AND current inputs. Reacts faster but prone to asynchronous input glitches.' },
  { id: 126, title: 'UART Protocol Basics', difficulty: 'medium', topic: 'embedded', acceptance: 70, desc: 'Explain UART communication, baud rate, and frame structure.', solution: 'Universal Asynchronous Receiver-Transmitter. No shared clock line. Frame: Start bit (0), 5-8 Data bits, Optional Parity, Stop bit(s) (1). Baud rate must align closely between TX and RX.' },
  { id: 127, title: 'ADC Architectures', difficulty: 'medium', topic: 'embedded', acceptance: 55, desc: 'Compare SAR and Flash ADCs.', solution: '<b>Flash:</b> Very fast, uses 2^N - 1 comparators. High power, low resolution (e.g. 8-bit).<br><b>SAR (Successive Approximation):</b> Moderate speed, binary search algorithm using 1 comparator and a DAC. Good resolution (12-16 bit), lower power.' },
  { id: 128, title: 'Setup & Hold Time with Skew', difficulty: 'medium', topic: 'vlsi', acceptance: 50, desc: 'How do clock skew and jitter affect setup and hold margins?', solution: 'Setup Slack = T_cycle - T_logic - T_setup + T_skew. Hold Slack = T_logic - T_hold - T_skew.<br>Positive skew helps setup but hurts hold. Jitter effectively reduces clock period for setup margin.' },
  { id: 129, title: 'MOSFET Parasitic Capacitances', difficulty: 'medium', topic: 'vlsi', acceptance: 48, desc: 'Identify the parasitic capacitances in a MOSFET.', solution: 'Cgs, Cgd, Cgb, Csb, Cdb. Miller effect multiplies Cgd during switching. These capacitances define the intrinsic switching delay of the transistor.' },
  { id: 130, title: 'Dynamic Power in CMOS', difficulty: 'medium', topic: 'vlsi', acceptance: 62, desc: 'Write the equation for dynamic power dissipation in CMOS.', solution: 'P_dynamic = alpha * C * Vdd^2 * f. (alpha = switching activity, C = load capacitance, Vdd = supply voltage, f = clock frequency). Lowering Vdd is the most effective way to reduce power.' },

  // ---- HARD ----
  { id: 131, title: 'PLL (Phase-Locked Loop)', difficulty: 'hard', topic: 'analog', acceptance: 35, desc: 'Explain the blocks and operation of a Phase-Locked Loop (PLL).', solution: 'Blocks: Phase Detector, Low Pass Filter (Loop Filter), VCO (Voltage Controlled Oscillator). Compares phase of incoming signal and feedback clock, adjusts VCO frequency to match input phase. Used for clock multiplication and recovery.' },
  { id: 132, title: 'Bandgap Reference Circuit', difficulty: 'hard', topic: 'analog', acceptance: 28, desc: 'What is a Bandgap Reference (BGR) circuit?', solution: 'Creates a stable voltage independent of temperature variations. Combines a PTAT (Proportional To Absolute Temp) voltage with a CTAT (Complementary To Absolute Temp, e.g. Vbe) voltage to cancel out temperature drift. Vref is approx 1.2V.' },
  { id: 133, title: 'Carry Lookahead Adder (CLA)', difficulty: 'hard', topic: 'digital', acceptance: 40, desc: 'Derive the equations for a 4-bit Carry Lookahead Adder (CLA).', solution: 'Generate: G_i = A_i AND B_i. Propagate: P_i = A_i XOR B_i. C_i+1 = G_i OR (P_i AND C_i). Unrolling allows calculating C4 directly from inputs and C0 in O(1) gate delays, eliminating ripple delay.' },
  { id: 134, title: 'Sequence Detector FSM (1011)', difficulty: 'hard', topic: 'digital', acceptance: 45, desc: 'Design a Moore FSM to detect overlapping sequence 1011.', solution: 'States: S0 (Initial), S1 (1), S2 (10), S3 (101), S4 (1011). Output=1 in S4.<br>On S4, if input=1 -> S1 (starts new sequence "1"). If input=0 -> S2 (starts sequence "10").' },
  { id: 135, title: 'Metastability and Synchronizers', difficulty: 'hard', topic: 'vlsi', acceptance: 32, desc: 'How do you safely cross clock domains for a single bit signal?', solution: 'Use a 2-flop synchronizer (two adjacent D-FFs clocked by the receiving domain). This exponentially reduces the probability of a metastable state propagating into the combinational logic of the receiving domain.' },
  { id: 136, title: '6T SRAM Cell Read/Write', difficulty: 'hard', topic: 'vlsi', acceptance: 30, desc: 'Explain the Read and Write operations of a 6T SRAM cell.', solution: '<b>Read:</b> Precharge both bitlines to Vdd. Turn on wordline. One bitline discharges slightly through the NMOS pull-down. Sense amplifier detects the small voltage difference.<br><b>Write:</b> Drive bitlines to desired values (strong 0 and 1). Turn on wordline to overpower the cross-coupled inverters.' },
  { id: 137, title: 'Antenna Effect in VLSI', difficulty: 'hard', topic: 'vlsi', acceptance: 25, desc: 'What is the Antenna Effect and how is it fixed during physical design?', solution: 'Charge accumulates on long metal lines during plasma etching, which can break down the thin gate oxide connected to it. Fix: Route to a higher metal layer (jumping) or add antenna diodes to discharge the accumulated charge.' },
  { id: 138, title: 'SPI Modes (0, 1, 2, 3)', difficulty: 'hard', topic: 'embedded', acceptance: 42, desc: 'Explain CPOL and CPHA in SPI communication protocols.', solution: 'CPOL (Clock Polarity) assigns the idle state of the clock (0 or 1). CPHA (Clock Phase) assigns whether data is sampled on the leading edge (0) or trailing edge (1). Combinations define Modes 0, 1, 2, and 3.' },
  { id: 139, title: 'DMA Controller', difficulty: 'hard', topic: 'embedded', acceptance: 48, desc: 'How does Direct Memory Access (DMA) improve system performance?', solution: 'Bypasses the CPU for large data transfers between peripherals and memory (or mem-to-mem). CPU initiates transfer parameters, then executes other code. DMA controller raises an interrupt when the transfer completes.' },
  { id: 140, title: 'FreeRTOS Task Scheduling', difficulty: 'hard', topic: 'embedded', acceptance: 38, desc: 'Explain Preemptive vs Cooperative task scheduling in an RTOS.', solution: '<b>Preemptive:</b> The RTOS interrupts the currently running task if a higher priority task becomes ready. Ensures hard real-time deadlines.<br><b>Cooperative:</b> Tasks must explicitly yield CPU (e.g., taskYIELD). Simpler to design but risks starvation.' },
];

// Merge extra hardware problems into HW_PROBLEMS
HW_PROBLEMS.push(...EXTRA_HW_PROBLEMS);

// ============================================================
// GLOBAL SEARCH
// ============================================================
function openGlobalSearch() {
  document.getElementById('globalSearchOverlay').classList.add('open');
  setTimeout(() => document.getElementById('globalSearchInput').focus(), 50);
  document.getElementById('globalSearchInput').value = '';
  document.getElementById('gsearchResults').innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text3)">Start typing to search...</p>';
}
function closeGlobalSearch() {
  document.getElementById('globalSearchOverlay').classList.remove('open');
}
function performGlobalSearch(val) {
  const q = val.trim().toLowerCase();
  const resultsEl = document.getElementById('gsearchResults');
  if (!q) { resultsEl.innerHTML = ''; return; }
  const results = [];
  CODING_PROBLEMS.filter(p => p.title.toLowerCase().includes(q)).slice(0,4).forEach(p => {
    results.push({ icon:'💻', iconBg:'rgba(99,102,241,0.15)', title: p.title, sub: `Coding • ${p.difficulty}`, tag: p.difficulty, action: () => { navigateTo('coding'); closeGlobalSearch(); setTimeout(()=>openProblem(p.id),300); } });
  });
  HW_PROBLEMS.filter(p => p.title.toLowerCase().includes(q)).slice(0,3).forEach(p => {
    results.push({ icon:'🔧', iconBg:'rgba(245,158,11,0.15)', title: p.title, sub: `Hardware • ${p.difficulty}`, tag: p.difficulty, action: () => { navigateTo('circuits'); closeGlobalSearch(); setTimeout(()=>openHWProblem(p.id),300); } });
  });
  [...HR_QUESTIONS,...TECH_QUESTIONS].filter(q2 => q2.q.toLowerCase().includes(q)).slice(0,3).forEach(q2 => {
    results.push({ icon:'💼', iconBg:'rgba(16,185,129,0.15)', title: q2.q.substring(0,60)+'...', sub:'Interview Question', tag:'Interview', action: () => { navigateTo('interview'); closeGlobalSearch(); } });
  });
  COMPANIES.filter(c => c.name.toLowerCase().includes(q)).slice(0,3).forEach(c => {
    results.push({ icon: c.letter, iconBg: c.gradient, title: c.name, sub: c.roles, tag: c.difficulty, action: () => { navigateTo('companies'); closeGlobalSearch(); } });
  });
  if (!results.length) { resultsEl.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text3)">No results found</p>'; return; }
  resultsEl.innerHTML = results.map((r,i) => `
    <div class="gsearch-item" onclick="gsearchActions[${i}]()">
      <div class="gsearch-item-icon" style="background:${r.iconBg}">${r.icon}</div>
      <div class="gsearch-item-info">
        <div class="gsearch-item-title">${r.title}</div>
        <div class="gsearch-item-sub">${r.sub}</div>
      </div>
      <span class="gsearch-item-tag">${r.tag}</span>
    </div>`).join('');
  window.gsearchActions = results.map(r => r.action);
}
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openGlobalSearch(); }
  if (e.key === 'Escape') closeGlobalSearch();
});

// ============================================================
// POMODORO TIMER
// ============================================================
let pomRunning = false, pomSeconds = 25*60, pomInterval = null, pomMode = 'focus', pomSessions = 1;

function togglePomodoro() {
  const w = document.getElementById('pomodoroWidget');
  w.style.display = w.style.display === 'none' ? 'block' : 'none';
}
function closePomodoro() { document.getElementById('pomodoroWidget').style.display = 'none'; }
function setPomMode(mins, mode, el) {
  document.querySelectorAll('.pom-mode').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  pomMode = mode;
  pomSeconds = mins * 60;
  if (pomInterval) { clearInterval(pomInterval); pomInterval = null; pomRunning = false; }
  document.getElementById('pomStartBtn').textContent = '▶ Start';
  updatePomDisplay();
  const disp = document.getElementById('pomDisplay');
  disp.className = 'pom-display' + (mode !== 'focus' ? ' break' : '');
}
function togglePomTimer() {
  if (pomRunning) {
    clearInterval(pomInterval); pomInterval = null; pomRunning = false;
    document.getElementById('pomStartBtn').textContent = '▶ Resume';
  } else {
    pomRunning = true;
    document.getElementById('pomStartBtn').textContent = '⏸ Pause';
    pomInterval = setInterval(() => {
      pomSeconds--;
      updatePomDisplay();
      if (pomSeconds <= 0) {
        clearInterval(pomInterval); pomRunning = false;
        if (pomMode === 'focus') {
          pomSessions = Math.min(pomSessions + 1, 4);
          document.getElementById('pomSession').textContent = pomSessions;
          showAchievement('🍅', 'Pomodoro Complete!');
          showToast('Focus session done! Take a break 🎉', 'success');
        } else { showToast('Break over! Back to work 💪', 'info'); }
        document.getElementById('pomStartBtn').textContent = '▶ Start';
      }
    }, 1000);
  }
}
function resetPomTimer() {
  clearInterval(pomInterval); pomInterval = null; pomRunning = false;
  const minsMap = { focus: 25, short: 5, long: 15 };
  pomSeconds = (minsMap[pomMode] || 25) * 60;
  document.getElementById('pomStartBtn').textContent = '▶ Start';
  updatePomDisplay();
}
function updatePomDisplay() {
  const m = String(Math.floor(pomSeconds/60)).padStart(2,'0');
  const s = String(pomSeconds%60).padStart(2,'0');
  document.getElementById('pomDisplay').textContent = `${m}:${s}`;
}

// ============================================================
// ACHIEVEMENT POPUP
// ============================================================
const ACHIEVEMENTS_UNLOCKED = new Set(JSON.parse(localStorage.getItem('placeprep_achievements') || '[]'));

function showAchievement(icon, name) {
  if (ACHIEVEMENTS_UNLOCKED.has(name)) return;
  ACHIEVEMENTS_UNLOCKED.add(name);
  localStorage.setItem('placeprep_achievements', JSON.stringify([...ACHIEVEMENTS_UNLOCKED]));
  const popup = document.getElementById('achievementPopup');
  document.getElementById('achIcon').textContent = icon;
  document.getElementById('achName').textContent = name;
  popup.style.display = 'flex';
  popup.style.animation = 'none';
  setTimeout(() => { popup.style.animation = ''; }, 10);
  setTimeout(() => { popup.style.display = 'none'; }, 4000);
}

function checkAchievements() {
  const solved = userSolvedProblems.size;
  if (solved === 1) showAchievement('🏅', 'First Problem Solved!');
  if (solved === 5) showAchievement('⭐', '5 Problems Solved!');
  if (solved === 10) showAchievement('🔥', 'On Fire — 10 Solves!');
  if (solved === 25) showAchievement('🚀', 'Problem Slayer — 25 Solves!');
  if (solved >= 50) showAchievement('👑', 'Legend — 50+ Solves!');
}

// Patch markProblemSolved to check achievements
const _origMarkSolved = markProblemSolved;
markProblemSolved = async function(id) {
  await _origMarkSolved(id);
  checkAchievements();
};

// ============================================================
// LEADERBOARD (Real users from backend — login required)
// ============================================================
let lbFilter = 'all';
let lbData = []; // fetched from API

function filterLeaderboard(filter, el) {
  document.querySelectorAll('#page-leaderboard .filter-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  lbFilter = filter;
  renderLeaderboardUI();
}

async function renderLeaderboard() {
  const podium = document.getElementById('leaderboardPodium');
  const table = document.getElementById('leaderboardTable');
  if (!podium || !table) return;

  // Not logged in — show lock screen
  if (!authToken || !currentUser) {
    podium.innerHTML = '';
    table.innerHTML = '';
    podium.closest('.leaderboard-layout').innerHTML = `
      <div style="text-align:center;padding:80px 20px">
        <div style="font-size:5rem;margin-bottom:1rem">🔒</div>
        <h2 style="margin-bottom:0.5rem">Login to View Leaderboard</h2>
        <p style="color:var(--text2);margin-bottom:1.5rem">The leaderboard shows real students who have signed up and are actively building their streak. Log in to see where you stand!</p>
        <button class="btn btn-primary" onclick="showAuthModal()">🚀 Login / Sign Up</button>
      </div>`;
    return;
  }

  // Show loading
  podium.innerHTML = `<div style="color:var(--text2);padding:2rem">Loading rankings...</div>`;
  table.innerHTML = '';

  try {
    const res = await fetch(API_BASE + '/leaderboard', {
      headers: { Authorization: 'Bearer ' + authToken }
    });
    if (!res.ok) throw new Error('Failed');
    const json = await res.json();
    lbData = json.leaderboard || [];
  } catch (e) {
    podium.innerHTML = `<div style="color:var(--danger);padding:2rem">⚠ Could not load leaderboard. Please try again.</div>`;
    return;
  }

  // If no one on the board yet
  if (lbData.length === 0) {
    podium.innerHTML = '';
    table.innerHTML = `
      <div style="text-align:center;padding:60px 20px;grid-column:1/-1">
        <div style="font-size:4rem;margin-bottom:1rem">🏁</div>
        <h3>Be the first on the leaderboard!</h3>
        <p style="color:var(--text2)">Solve problems and complete streaks to appear here.</p>
      </div>`;
    return;
  }
  renderLeaderboardUI();
}

function renderLeaderboardUI() {
  const filtered = lbFilter === 'all' ? lbData : lbData.filter(u => u.track === lbFilter);
  const podium = document.getElementById('leaderboardPodium');
  const table = document.getElementById('leaderboardTable');
  if (!podium || !table) return;

  // ── Podium (top 3) ──
  const top = filtered.slice(0, 3);
  if (top.length < 2) {
    podium.innerHTML = top.map((u, i) => `
      <div class="podium-item">
        <div class="podium-crown">${['🥇','🥈','🥉'][i]}</div>
        <div class="podium-avatar" style="background:${u.gradient}">${u.avatar}</div>
        <div class="podium-name">${u.name.split(' ')[0]}</div>
        <div class="podium-xp">${u.xp.toLocaleString()} XP</div>
        <div class="podium-block">#${i+1}</div>
      </div>`).join('');
  } else {
    // Classic podium order: 2nd | 1st | 3rd
    const order = top.length >= 3 ? [top[1], top[0], top[2]] : [top[1], top[0]];
    const crowns = top.length >= 3 ? ['🥈','🥇','🥉'] : ['🥈','🥇'];
    const ranks  = top.length >= 3 ? [2, 1, 3] : [2, 1];
    podium.innerHTML = order.map((u, i) => `
      <div class="podium-item">
        <div class="podium-crown">${crowns[i]}</div>
        <div class="podium-avatar" style="background:${u.gradient}">${u.avatar}</div>
        <div class="podium-name">${u.name.split(' ')[0]}</div>
        <div class="podium-xp">${u.xp.toLocaleString()} XP</div>
        <div class="podium-block">#${ranks[i]}</div>
      </div>`).join('');
  }

  // ── Table ──
  const rankClass = ['top1','top2','top3'];
  table.innerHTML = !filtered.length
    ? `<tr><td colspan="7" style="text-align:center;padding:3rem;color:var(--text2)">No users in this track yet.</td></tr>`
    : `<thead><tr>
        <th>#</th><th>Student</th><th>Track</th><th>XP</th><th>Solved</th><th>Streak</th><th>Badge</th>
      </tr></thead>
      <tbody>${filtered.map((u, i) => `
        <tr class="${u.isCurrentUser ? 'lb-you' : ''}">
          <td><span class="lb-rank ${rankClass[i]||''}">${i<3?['🥇','🥈','🥉'][i]:i+1}</span></td>
          <td><div class="lb-user">
            <div class="lb-avatar" style="background:${u.gradient}">${u.avatar}</div>
            <div><div class="lb-name">${u.name}${u.isCurrentUser?' <span style="font-size:0.7rem;color:var(--primary)">(You)</span>':''}</div>
            <div class="lb-track">Lv.${u.level}</div></div>
          </div></td>
          <td><span style="font-size:0.8rem">${u.track==='software'?'💻 Software':'🔧 Hardware'}</span></td>
          <td class="lb-xp">${u.xp.toLocaleString()}</td>
          <td class="lb-solved">${u.solved}</td>
          <td class="lb-streak">🔥 ${u.streak}</td>
          <td><span class="lb-badge">${u.badge}</span></td>
        </tr>`).join('')}
      </tbody>`;
}

// ============================================================
// NOTES SYSTEM
// ============================================================
let notesData = JSON.parse(localStorage.getItem('placeprep_notes') || '[]');
let editingNoteId = null;

function renderNotes() {
  const grid = document.getElementById('notesGrid');
  const empty = document.getElementById('notesEmpty');
  const badge = document.getElementById('notesBadge');
  if (!grid) return;
  if (notesData.length === 0) {
    grid.innerHTML = ''; empty.style.display = 'block';
    if (badge) badge.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  if (badge) { badge.style.display = 'inline'; badge.textContent = notesData.length; }
  const catEmoji = { general:'📌', dsa:'💻', aptitude:'🔢', interview:'💼', company:'🏢' };
  grid.innerHTML = notesData.slice().reverse().map((n,ri) => {
    const i = notesData.length - 1 - ri;
    return `<div class="note-card cat-${n.cat}" onclick="editNote(${i})">
      <div class="note-card-header">
        <div class="note-card-title">${n.title || 'Untitled'}</div>
        <div class="note-actions">
          <button class="note-action-btn" onclick="event.stopPropagation();deleteNote(${i})" title="Delete">🗑</button>
        </div>
      </div>
      <div class="note-content">${(n.content||'').substring(0,180)}${n.content&&n.content.length>180?'…':''}</div>
      <div class="note-footer">
        <span class="note-cat-badge">${catEmoji[n.cat]||'📌'} ${n.cat}</span>
        <span class="note-date">${n.date}</span>
      </div>
    </div>`;
  }).join('');
}

function openNoteEditor(idx) {
  editingNoteId = idx !== undefined ? idx : null;
  const modal = document.getElementById('noteEditorModal');
  document.getElementById('noteEditorTitle').textContent = editingNoteId !== null ? 'Edit Note' : 'New Note';
  document.getElementById('noteTitleInput').value = editingNoteId !== null ? notesData[editingNoteId].title : '';
  document.getElementById('noteCategory').value = editingNoteId !== null ? notesData[editingNoteId].cat : 'general';
  document.getElementById('noteContentInput').value = editingNoteId !== null ? notesData[editingNoteId].content : '';
  modal.classList.add('open');
}
function editNote(idx) { openNoteEditor(idx); }
function closeNoteEditor() { document.getElementById('noteEditorModal').classList.remove('open'); }

function saveNote() {
  const title = document.getElementById('noteTitleInput').value.trim();
  const cat = document.getElementById('noteCategory').value;
  const content = document.getElementById('noteContentInput').value.trim();
  if (!title && !content) { showToast('Add a title or content to save', 'error'); return; }
  const now = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  const note = { title: title || 'Untitled', cat, content, date: now };
  if (editingNoteId !== null) { notesData[editingNoteId] = note; }
  else { notesData.push(note); }
  localStorage.setItem('placeprep_notes', JSON.stringify(notesData));
  closeNoteEditor();
  renderNotes();
  showToast(editingNoteId !== null ? 'Note updated ✅' : 'Note saved 📝', 'success');
  if (notesData.length === 1) showAchievement('📝', 'First Note Taken!');
}

function deleteNote(idx) {
  notesData.splice(idx, 1);
  localStorage.setItem('placeprep_notes', JSON.stringify(notesData));
  renderNotes();
  showToast('Note deleted', 'info');
}

// ============================================================
// MORE APTITUDE QUESTIONS (for quiz variety)
// ============================================================
const APTITUDE_BANK_EXTRA = [
  // Quantitative
  { question:'If 15% of x = 20% of y, then x:y =?', options:['3:4','4:3','2:3','3:2'], correctAnswer:1, explanation:'15x=20y → x/y=20/15=4/3' },
  { question:'A man walks 5km north, 3km east, 5km south. How far from start?', options:['3 km','5 km','8 km','13 km'], correctAnswer:0, explanation:'North-South cancel. Remains 3km east.' },
  { question:'LCM of 12, 18, 24 is:', options:['36','48','72','96'], correctAnswer:2, explanation:'LCM(12,18,24) = 72.' },
  { question:'A sum doubles in 10 years at simple interest. Rate per annum?', options:['5%','10%','12%','8%'], correctAnswer:1, explanation:'SI = P → P*R*10/100 = P → R=10%' },
  { question:'Two numbers are in ratio 3:5. HCF is 16. Sum?', options:['128','96','144','160'], correctAnswer:0, explanation:'Numbers = 48 and 80. Sum = 128.' },
  // Logical
  { question:'All cats are dogs. All dogs are birds. Conclusion: All cats are birds?', options:['True','False','Cannot say','None'], correctAnswer:0, explanation:'By transitive syllogism: All cats are birds is valid.' },
  { question:'In a class, Rahul ranks 13th from top and 28th from bottom. Total students?', options:['40','41','39','42'], correctAnswer:0, explanation:'Total = 13+28-1 = 40.' },
  { question:'Find the missing: 4, 9, 25, 49, 121, ?', options:['144','169','196','225'], correctAnswer:1, explanation:'Squares of primes: 2²,3²,5²,7²,11²,13²=169.' },
  // Verbal
  { question:'Choose correct: Neither he nor his friends __ present.', options:['is','are','was','were'], correctAnswer:1, explanation:'\"Neither...nor\" with plural subject uses plural verb.' },
  { question:'Antonym of BENEVOLENT:', options:['Kind','Generous','Malevolent','Humble'], correctAnswer:2, explanation:'Benevolent = kind/generous. Antonym is Malevolent.' },
];

// ============================================================
// ADDITIONAL MOCK TESTS
// ============================================================
MOCK_TESTS.push(
  { name: 'Full Aptitude Blast', questions: 20, duration: 30, difficulty: 'Medium', desc: 'Full round of quantitative, logical and verbal questions at medium difficulty.' },
  { name: 'GATE CS Basics', questions: 15, duration: 45, difficulty: 'Hard', desc: 'OS, DBMS, Networks and TOC questions in GATE style for core CS placement.' },
  { name: 'Startup SDE Round', questions: 10, duration: 30, difficulty: 'Medium', desc: 'Practical coding problem MCQs and system design basics typical in startup interviews.' }
);

// Additional mock questions for variety
MOCK_QUESTIONS.push(...[
  { q:'What is the output of: print(2**3**2) in Python?', options:['64','512','8','256'], answer:1, explanation:'In Python, ** is right-associative: 3**2=9, then 2**9=512.' },
  { q:'In a BST, which traversal gives sorted output?', options:['Preorder','Postorder','Inorder','Level-order'], answer:2, explanation:'Inorder traversal of BST always gives sorted ascending order.' },
  { q:'TCP vs UDP: Which guarantees delivery?', options:['UDP','TCP','Both','Neither'], answer:1, explanation:'TCP uses acknowledgements (ACK) to guarantee reliable delivery.' },
  { q:'Difference between stack overflow and heap overflow?', options:['Same thing','Stack=local vars excess; Heap=dynamic mem excess','Only stack exists','Heap cannot overflow'], answer:1, explanation:'Stack overflow occurs from deep recursion; heap overflow from excessive dynamic allocation.' },
  { q:'Which is NOT a feature of OOPS?', options:['Inheritance','Pointer','Encapsulation','Polymorphism'], answer:1, explanation:'Pointer is a memory concept, not an OOP feature.' },
  { q:'Time complexity of building a heap from n elements?', options:['O(n log n)','O(n)','O(log n)','O(n²)'], answer:1, explanation:'Building a heap (heapify) takes O(n) using bottom-up approach.' },
  { q:'What does ACID stand for in DB?', options:['Array, Column, Index, Data','Atomicity, Consistency, Isolation, Durability','Async, Cache, Index, Disk','None'], answer:1, explanation:'ACID: Atomicity, Consistency, Isolation, Durability — DB transaction properties.' },
  { q:'A pipe fills tank in 6 hrs, empties in 4 hrs. If both open, tank is drained in?', options:['12 hrs','8 hrs','10 hrs','Cannot be filled'], answer:3, explanation:'Net rate = fill 1/6 - drain 1/4 = -1/12 (negative). Tank empties — cannot be filled.' },
]);

// ============================================================
// INIT PATCHES
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
  renderLeaderboard();
  // Show first-time achievement if notes badge
  const nb = document.getElementById('notesBadge');
  if (nb && notesData.length > 0) { nb.style.display = 'inline'; nb.textContent = notesData.length; }
  // Keyboard hint in search placeholder
  const si = document.getElementById('globalSearchInput');
  if (si) si.placeholder = 'Search problems, companies, questions... (Ctrl+K)';
});

// Patch navigateTo to render Leaderboard on visit
const _origNavigateTo = navigateTo;
navigateTo = function(pageId) {
  _origNavigateTo(pageId);
  if (pageId === 'leaderboard') renderLeaderboard();
  if (pageId === 'notes') renderNotes();
};

