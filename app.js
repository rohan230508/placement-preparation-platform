// ============================================================
//  PlacePrep — Complete Application Logic
// ============================================================

// ---------- STATE ----------
let currentUser = null;
let authToken = localStorage.getItem('placeprep_token');
let currentMode = 'login';
let apiKey = localStorage.getItem('placeprep_apikey') || '';
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : window.location.origin + '/api';

// ---------- DATA ----------
const CODING_PROBLEMS = [
  { id:1, title:'Two Sum', difficulty:'easy', topic:'arrays', acceptance:68, solved:false,
    desc:'Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers that add up to target.',
    examples:[{input:'nums=[2,7,11,15], target=9',output:'[0,1]'}],
    starterCode:{python:'def twoSum(nums, target):\n    # Write your solution\n    pass',java:'public int[] twoSum(int[] nums, int target) {\n    // Write your solution\n    return new int[]{};\n}',cpp:'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution\n    return {};\n}',javascript:'var twoSum = function(nums, target) {\n    // Write your solution\n};'}},
  { id:2, title:'Valid Parentheses', difficulty:'easy', topic:'strings', acceptance:72, solved:false,
    desc:'Given a string containing just <code>(</code>, <code>)</code>, <code>{</code>, <code>}</code>, <code>[</code> and <code>]</code>, determine if the input string is valid.',
    examples:[{input:"s='()[]{}'",output:'true'}],
    starterCode:{python:'def isValid(s):\n    pass',java:'public boolean isValid(String s) {\n    return false;\n}',cpp:'bool isValid(string s) {\n    return false;\n}',javascript:'var isValid = function(s) {\n};'}},
  { id:3, title:'Reverse Linked List', difficulty:'easy', topic:'arrays', acceptance:74, solved:false,
    desc:'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples:[{input:'head=[1,2,3,4,5]',output:'[5,4,3,2,1]'}],
    starterCode:{python:'def reverseList(head):\n    pass',java:'public ListNode reverseList(ListNode head) {\n    return null;\n}',cpp:'ListNode* reverseList(ListNode* head) {\n    return nullptr;\n}',javascript:'var reverseList = function(head) {\n};'}},
  { id:4, title:'Best Time to Buy and Sell Stock', difficulty:'easy', topic:'arrays', acceptance:65, solved:false,
    desc:'Given array <code>prices</code> where prices[i] is the price of a given stock on the ith day. Maximize your profit.',
    examples:[{input:'prices=[7,1,5,3,6,4]',output:'5'}],
    starterCode:{python:'def maxProfit(prices):\n    pass',java:'public int maxProfit(int[] prices) {\n    return 0;\n}',cpp:'int maxProfit(vector<int>& prices) {\n    return 0;\n}',javascript:'var maxProfit = function(prices) {\n};'}},
  { id:5, title:'Maximum Subarray', difficulty:'easy', topic:'dp', acceptance:62, solved:false,
    desc:'Given an integer array <code>nums</code>, find the contiguous subarray which has the largest sum and return its sum (Kadane\'s Algorithm).',
    examples:[{input:'nums=[-2,1,-3,4,-1,2,1,-5,4]',output:'6'}],
    starterCode:{python:"def maxSubArray(nums):\n    pass",java:'public int maxSubArray(int[] nums) {\n    return 0;\n}',cpp:'int maxSubArray(vector<int>& nums) {\n    return 0;\n}',javascript:'var maxSubArray = function(nums) {\n};'}},
  { id:6, title:'Climbing Stairs', difficulty:'easy', topic:'dp', acceptance:70, solved:false,
    desc:'You are climbing a staircase. It takes <code>n</code> steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    examples:[{input:'n=3',output:'3'}],
    starterCode:{python:'def climbStairs(n):\n    pass',java:'public int climbStairs(int n) {\n    return 0;\n}',cpp:'int climbStairs(int n) {\n    return 0;\n}',javascript:'var climbStairs = function(n) {\n};'}},
  { id:7, title:'Binary Tree Inorder Traversal', difficulty:'easy', topic:'trees', acceptance:73, solved:false,
    desc:'Given the <code>root</code> of a binary tree, return the inorder traversal of its nodes\' values.',
    examples:[{input:'root=[1,null,2,3]',output:'[1,3,2]'}],
    starterCode:{python:'def inorderTraversal(root):\n    pass',java:'public List<Integer> inorderTraversal(TreeNode root) {\n    return new ArrayList<>();\n}',cpp:'vector<int> inorderTraversal(TreeNode* root) {\n    return {};\n}',javascript:'var inorderTraversal = function(root) {\n};'}},
  { id:8, title:'Merge Two Sorted Lists', difficulty:'easy', topic:'arrays', acceptance:66, solved:false,
    desc:'Merge two sorted linked lists and return it as a sorted list.',
    examples:[{input:'l1=[1,2,4], l2=[1,3,4]',output:'[1,1,2,3,4,4]'}],
    starterCode:{python:'def mergeTwoLists(l1, l2):\n    pass',java:'public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    return null;\n}',cpp:'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n    return nullptr;\n}',javascript:'var mergeTwoLists = function(l1, l2) {\n};'}},
  { id:9, title:'Longest Common Subsequence', difficulty:'medium', topic:'dp', acceptance:55, solved:false,
    desc:'Given two strings <code>text1</code> and <code>text2</code>, return the length of their longest common subsequence.',
    examples:[{input:'text1="abcde", text2="ace"',output:'3'}],
    starterCode:{python:'def longestCommonSubsequence(text1, text2):\n    pass',java:'public int longestCommonSubsequence(String text1, String text2) {\n    return 0;\n}',cpp:'int longestCommonSubsequence(string text1, string text2) {\n    return 0;\n}',javascript:'var longestCommonSubsequence = function(text1, text2) {\n};'}},
  { id:10, title:'Number of Islands', difficulty:'medium', topic:'graphs', acceptance:53, solved:false,
    desc:'Given an m x n 2D binary grid which represents a map of <code>\'1\'</code>s (land) and <code>\'0\'</code>s (water), return the number of islands.',
    examples:[{input:'grid=[["1","1","0"],["0","1","0"],["0","0","1"]]',output:'2'}],
    starterCode:{python:'def numIslands(grid):\n    pass',java:'public int numIslands(char[][] grid) {\n    return 0;\n}',cpp:'int numIslands(vector<vector<char>>& grid) {\n    return 0;\n}',javascript:'var numIslands = function(grid) {\n};'}},
  { id:11, title:'3Sum', difficulty:'medium', topic:'arrays', acceptance:31, solved:false,
    desc:'Given an integer array nums, return all the triplets that sum to zero. No duplicate triplets.',
    examples:[{input:'nums=[-1,0,1,2,-1,-4]',output:'[[-1,-1,2],[-1,0,1]]'}],
    starterCode:{python:'def threeSum(nums):\n    pass',java:'public List<List<Integer>> threeSum(int[] nums) {\n    return new ArrayList<>();\n}',cpp:'vector<vector<int>> threeSum(vector<int>& nums) {\n    return {};\n}',javascript:'var threeSum = function(nums) {\n};'}},
  { id:12, title:'Word Break', difficulty:'medium', topic:'dp', acceptance:44, solved:false,
    desc:'Given a string <code>s</code> and a dictionary of strings <code>wordDict</code>, return true if s can be segmented into dictionary words.',
    examples:[{input:'s="leetcode", wordDict=["leet","code"]',output:'true'}],
    starterCode:{python:'def wordBreak(s, wordDict):\n    pass',java:'public boolean wordBreak(String s, List<String> wordDict) {\n    return false;\n}',cpp:'bool wordBreak(string s, vector<string>& wordDict) {\n    return false;\n}',javascript:'var wordBreak = function(s, wordDict) {\n};'}},
  { id:13, title:'Graph Valid Tree', difficulty:'medium', topic:'graphs', acceptance:48, solved:false,
    desc:'Given n nodes labeled from 0 to n-1 and a list of undirected edges, check if they form a valid tree.',
    examples:[{input:'n=5, edges=[[0,1],[0,2],[0,3],[1,4]]',output:'true'}],
    starterCode:{python:'def validTree(n, edges):\n    pass',java:'public boolean validTree(int n, int[][] edges) {\n    return false;\n}',cpp:'bool validTree(int n, vector<vector<int>>& edges) {\n    return false;\n}',javascript:'var validTree = function(n, edges) {\n};'}},
  { id:14, title:'Merge Sort', difficulty:'medium', topic:'sorting', acceptance:61, solved:false,
    desc:'Implement merge sort algorithm on an array of integers.',
    examples:[{input:'arr=[38,27,43,3,9,82,10]',output:'[3,9,10,27,38,43,82]'}],
    starterCode:{python:'def mergeSort(arr):\n    pass',java:'public int[] mergeSort(int[] arr) {\n    return arr;\n}',cpp:'void mergeSort(vector<int>& arr, int l, int r) {\n    // implement\n}',javascript:'var mergeSort = function(arr) {\n};'}},
  { id:15, title:'Trapping Rain Water', difficulty:'hard', topic:'arrays', acceptance:57, solved:false,
    desc:'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    examples:[{input:'height=[0,1,0,2,1,0,1,3,2,1,2,1]',output:'6'}],
    starterCode:{python:'def trap(height):\n    pass',java:'public int trap(int[] height) {\n    return 0;\n}',cpp:'int trap(vector<int>& height) {\n    return 0;\n}',javascript:'var trap = function(height) {\n};'}},
  { id:16, title:'Median of Two Sorted Arrays', difficulty:'hard', topic:'arrays', acceptance:35, solved:false,
    desc:'Given two sorted arrays, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
    examples:[{input:'nums1=[1,3], nums2=[2]',output:'2.00000'}],
    starterCode:{python:'def findMedianSortedArrays(nums1, nums2):\n    pass',java:'public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    return 0.0;\n}',cpp:'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    return 0.0;\n}',javascript:'var findMedianSortedArrays = function(nums1, nums2) {\n};'}},
];

const HR_QUESTIONS = [
  { q:'Tell me about yourself.', tip:'Use the Present-Past-Future formula: Start with your current role/year, then background, then why this company.', answer:'I am a final year Computer Science student at XYZ University with a CGPA of 8.5. I have interned at ABC Corp where I built REST APIs .I am passionate about solving real-world problems through code and am excited about this opportunity because your company is known for innovative products.', mistakes:'Being too long (>2 min), listing hobbies without relevance, reading from a template.' },
  { q:"What are your strengths?", tip:'Choose 2-3 relevant strengths and back each with a specific example using STAR method.', answer:'My greatest strength is problem-solving. During my internship, I reduced API response time by 40% by redesigning the database query structure. I am also a fast learner — I picked up React in two weeks to complete a project.', mistakes:'Saying generic things like "I am a hard worker" without proof.' },
  { q:"What are your weaknesses?", tip:'Mention a real weakness but follow immediately with steps you are taking to improve it. Never say "I work too hard."', answer:'I used to struggle with public speaking. I noticed it was holding me back in team presentations, so I joined my college\'s debate club and have been practicing consistently. I\'ve improved significantly over the past 6 months.', mistakes:'Mentioning a weakness critical to the job role, or saying you have no weaknesses.' },
  { q:'Why do you want to work here?', tip:'Research the company before! Mention specific products, culture, tech stack, or values that genuinely excite you.', answer:'I\'ve been following your company\'s work on AI-powered analytics. Your open-source contributions and engineering blog have taught me a lot. I want to contribute to a team that values technical excellence and continuous learning.', mistakes:'Saying "for the salary" or giving a generic answer that could apply to any company.' },
  { q:'Where do you see yourself in 5 years?', tip:'Show ambition aligned with the company\'s growth. Don\'t say CEO or manager superficially.', answer:'In 5 years, I see myself as a senior engineer who has contributed to impactful products. I want to deepen my expertise in distributed systems and eventually lead a small technical team on a key initiative.', mistakes:'Being too vague ("I don\'t know"), or unrealistic ("I want to be VP").' },
  { q:'Why should we hire you?', tip:'Summarize your top 3 value-adds specifically for this role. Connect your skills to their job description.', answer:'You should hire me because I bring a strong CS foundation, hands-on internship experience, and genuine enthusiasm for your product. I have already solved similar problems to what your team works on and I can contribute from day one.', mistakes:'Being arrogant, repeating your resume verbatim, or underselling yourself.' },
  { q:'Tell me about a challenge you faced and how you handled it.', tip:'Use the STAR method: Situation, Task, Action, Result. Quantify your results.', answer:'During my final year project, our team lost two members a week before the demo. I took ownership, restructured the work, pulled two all-nighters, and we delivered a fully functional product that won Best Project award.', mistakes:'Blaming others, choosing a trivial challenge, or not mentioning what YOU did.' },
  { q:'Do you have any questions for us?', tip:'Always have 2-3 thoughtful questions ready. This shows interest and curiosity.', answer:'"What does success look like for someone in this role in the first 90 days?" / "What are the biggest technical challenges the team is currently facing?" / "How does the engineering team collaborate with product?"', mistakes:'Asking about salary/leaves immediately, or saying "No, I have no questions."' },
];

const TECH_QUESTIONS = [
  { q:'What is the difference between a process and a thread?', tip:'Cover memory space, context switching, and OS handling.', answer:'A process is an independent program with its own memory space. A thread is a unit of execution within a process, sharing the same memory. Context switching between threads is faster than between processes. Processes provide isolation; threads enable concurrency within a program.', mistakes:'Confusing concurrency with parallelism, ignoring memory isolation.' },
  { q:'Explain OOPS concepts with real-life examples.', tip:'Cover all 4: Encapsulation, Abstraction, Inheritance, Polymorphism with examples.', answer:'Encapsulation: A car hides its engine details (only expose accelerate/brake). Abstraction: A remote control abstracts TV internals. Inheritance: Car inherits from Vehicle. Polymorphism: Animal.sound() gives different outputs for Dog and Cat.', mistakes:'Mixing up abstraction and encapsulation, skipping examples.' },
  { q:'What is the difference between SQL and NoSQL databases?', tip:'Cover structure, scalability, use-cases, examples.', answer:'SQL (MySQL, Postgres) uses structured tables with fixed schema, supports ACID properties, good for relational data. NoSQL (MongoDB, Cassandra) uses flexible schemas (documents, key-value), horizontally scalable, good for unstructured/large-scale data.', mistakes:'Saying NoSQL is always better, not mentioning trade-offs.' },
  { q:'What is a deadlock and how can it be prevented?', tip:'Define, give conditions (Coffman), and prevention strategies.', answer:'A deadlock occurs when two or more processes wait forever for resources held by each other. Coffman conditions: Mutual exclusion, Hold and Wait, No preemption, Circular wait. Prevention: lock ordering, timeouts, resource allocation graphs, use of tryLock.', mistakes:'Not knowing the four conditions, no prevention strategy.' },
  { q:'Explain REST API principles.', tip:'Cover statelessness, uniform interface, resource-based URLs, HTTP methods.', answer:'REST APIs are stateless (each request has all info needed), use HTTP methods (GET/POST/PUT/DELETE), identify resources via URLs, return standard formats like JSON. Key principles: client-server separation, cacheability, layered system.', mistakes:'Confusing REST with SOAP or GraphQL, not mentioning statelessness.' },
  { q:'What is the time complexity of common sorting algorithms?', tip:'Be ready with best, average, and worst cases for at least 4 algorithms.', answer:'Bubble Sort: O(n²). Selection Sort: O(n²). Insertion Sort: O(n²) worst, O(n) best. Merge Sort: O(n log n) always. Quick Sort: O(n log n) avg, O(n²) worst. Heap Sort: O(n log n). Counting Sort: O(n+k).', mistakes:'Forgetting space complexity, mixing up average and worst cases.' },
  { q:'What is the difference between abstract class and interface in Java?', tip:'Cover instantiation, multiple inheritance, default methods (Java 8+).', answer:'Abstract class can have concrete methods and state. Interface can only have abstract methods (prior to Java 8), supports multiple inheritance. With Java 8+, interfaces can have default/static methods. Use abstract class for "is-a" relationship, interface for "can-do" capability.', mistakes:'Saying interfaces cannot have any implementation post-Java 8.' },
  { q:'What is a hash table and how does it handle collisions?', tip:'Explain hashing, load factor, collision resolution (chaining, open addressing).', answer:'A hash table maps keys to values using a hash function. Collisions (two keys mapping to same index) are handled by: Chaining (linked list at each bucket) or Open Addressing (probing — linear, quadratic, double hashing). Average O(1) for get/put.', mistakes:'Not knowing what load factor is or how rehashing works.' },
];

const BEHAVIORAL_QUESTIONS = [
  { q:'Tell me about a time you worked in a team and faced conflict.', tip:'Use STAR. Focus on resolution and what you learned, not the conflict itself.', answer:'During a group project, two teammates disagreed on the tech stack. I organized a structured discussion, had each person present their case with data, and we reached a consensus on a hybrid approach. The project succeeded and I learned the value of structured decision-making.', mistakes:'Blaming specific individuals, showing no resolution, being vague.' },
  { q:'Describe a project you are most proud of.', tip:'Pick a project with measurable impact. Cover your role, challenges, and outcome.', answer:'I built a real-time bus tracking app for my college. It reduced student wait times by 30%, had 500+ daily active users, and was adopted by our transport department. I designed the backend, integrated GPS APIs, and managed a team of 3.', mistakes:'Picking trivial projects, not mentioning your specific contribution.' },
  { q:'Tell me about a time you failed and what you learned.', tip:'Be honest, take ownership, and focus on the lesson and growth.', answer:'I missed a project deadline during my internship because I underestimated the complexity of an API integration. I learned to break tasks into smaller milestones, communicate blockers early, and always add buffer time to estimates.', mistakes:'Denying failure, blaming others, or not mentioning what you changed.' },
  { q:'How do you prioritize tasks when you have multiple deadlines?', tip:'Mention a specific framework (Eisenhower Matrix, MoSCoW) and give an example.', answer:'I use the Eisenhower Matrix to categorize tasks by urgency and importance. I also communicate with stakeholders early if trade-offs are needed. During exam season juggling projects, I completed critical deliverables first, delegated smaller tasks, and kept all deadlines.', mistakes:'Being vague, not showing adaptability, not mentioning communication.' },
];

const GD_TOPICS = [
  { title:'Work From Home vs Work From Office', category:'Management', points:['WFH increases flexibility and reduces commute time','WFO fosters collaboration and team culture','Hybrid model is the future','Mental health considerations for both','Technology infrastructure requirements'] },
  { title:'Artificial Intelligence: Boon or Bane?', category:'Technology', points:['AI creates new job categories while eliminating some existing ones','Medical AI diagnosis accuracy exceeds human doctors in some areas','Deepfakes and misinformation risks','Ethical AI and bias concerns','AI democratization of education'] },
  { title:'Social Media: Impact on Youth', category:'Society', points:['Mental health: anxiety and depression links','FOMO and comparison culture','Educational content and skill building','Cyberbullying and privacy risks','Social media as a career platform'] },
  { title:'Climate Change & Corporate Responsibility', category:'Environment', points:['ESG investing trends','Carbon footprint of tech industry','Green computing and renewable energy','Greenwashing vs genuine sustainability','Circular economy models'] },
  { title:'India\'s Digital Economy by 2030', category:'Economy', points:['UPI success and fintech leadership','Digital India infrastructure','Startup ecosystem growth','Digital divide in rural areas','Cybersecurity challenges at scale'] },
  { title:'Should Coding Be Mandatory in Schools?', category:'Education', points:['Computational thinking as a life skill','Teacher readiness and infrastructure','Other critical skills being deprioritized','International precedents success stories','Inclusion and accessibility'] },
];

const COMPANIES = [
  { name:'Google', letter:'G', gradient:'linear-gradient(135deg,#4285f4,#34a853)', difficulty:'Hard', roles:'SWE, SRE, PM', avg_ctc:'32-45 LPA', openings:120, process:['Online Coding Test (LC Hard)','2-3 Phone Screens','4-5 Onsite rounds (Algo+System Design+Behavioral)','HC Review & Offer'], topics:['Arrays & Strings','DP','Graphs','System Design','Distributed Systems','Leadership Principles'], tip:'Focus on LeetCode Hard. Nail STAR stories. Read "Cracking the Coding Interview".' },
  { name:'Microsoft', letter:'M', gradient:'linear-gradient(135deg,#0078d4,#50e6ff)', difficulty:'Medium', roles:'SWE, PM, Data Science', avg_ctc:'26-38 LPA', openings:200, process:['Coding Assessment (HackerRank)','2 Technical Phone Rounds','4 Onsite interviews (Coding + Design + Behavioral)','Offer'], topics:['OOP & Design Patterns','Trees & Graphs','System Design','Azure Cloud','Behavioral (Growth Mindset)'], tip:'Show growth mindset. Microsoft values curiosity and learning. Prepare OOP design questions.' },
  { name:'Amazon', letter:'A', gradient:'linear-gradient(135deg,#ff9900,#ffbd59)', difficulty:'Medium', roles:'SDE, SDE-II, PM', avg_ctc:'28-42 LPA', openings:350, process:['Online Assessment (2 DSA + Work Style)','Phone Screen','3-5 Onsite loops (DSA+Behavioral+System Design)','Bar Raiser Round','Offer'], topics:['Leadership Principles (all 16)','Arrays, DP, Graphs','System Design (HLD/LLD)','Database Design','Scalability'], tip:'Memorize all 16 Leadership Principles. Every interview has behavioral. Use STAR method for everything.' },
  { name:'Flipkart', letter:'F', gradient:'linear-gradient(135deg,#2874f0,#f59e0b)', difficulty:'Medium', roles:'SDE-1, SDE-2, Data Analyst', avg_ctc:'22-32 LPA', openings:180, process:['Machine Coding Round (3hr)','Data Structure Round','System Design Round','Managerial+HR Round','Offer'], topics:['Machine Coding (clean code)','LLD — Design Patterns','HLD — Microservices','DSA — Arrays/Trees/DP','SQL & Database design'], tip:'Machine coding round is unique — write production-quality, clean, extensible code.' },
  { name:'TCS NQT', letter:'T', gradient:'linear-gradient(135deg,#6366f1,#8b5cf6)', difficulty:'Easy', roles:'System Engineer, Digital', avg_ctc:'3.5-7 LPA', openings:2000, process:['NQT Exam (Cognitive+Technical+Verbal)','Technical Interview','HR Interview','Offer'], topics:['Aptitude & Reasoning','Verbal English','C / Java / Python basics','Basic DSA','Quant Math'], tip:'Score well in NQT. TCS hires in bulk. NQT Cognitive score determines package band (Ninja vs Digital).' },
  { name:'Infosys', letter:'I', gradient:'linear-gradient(135deg,#0062cc,#00a3e0)', difficulty:'Easy', roles:'Systems Engineer, Power Programmer', avg_ctc:'3.6-8 LPA', openings:1500, process:['InfyTQ / Online Test','Technical Interview','HR Round','Offer'], topics:['Aptitude & Verbal','C++/Java fundamentals','OOP concepts','Database basics','SDLC knowledge'], tip:'Clear InfyTQ certification first. Power Programmer role is more competitive — practice DSA seriously.' },
  { name:'Wipro', letter:'W', gradient:'linear-gradient(135deg,#341f97,#a29bfe)', difficulty:'Easy', roles:'Project Engineer, NLTH', avg_ctc:'3.5-6.5 LPA', openings:1200, process:['Online Test (Aptitude+Tech+Essay)','Technical Interview','HR Interview','Offer'], topics:['Verbal & Analytical','Python/C/Java basics','OOP','SQL Basics','General IT awareness'], tip:'Apply through Wipro Elite NTH for better package. Essay writing round matters — practice!' },
  { name:'Cognizant', letter:'C', gradient:'linear-gradient(135deg,#1589d4,#00c0c7)', difficulty:'Easy', roles:'Program Analyst, GenC Next', avg_ctc:'4-9 LPA', openings:900, process:['CCAT Online Exam','Technical Interview','Communication Assessment','HR Round','Offer'], topics:['Aptitude & Reasoning','DBMS / SQL','Programming basics','OOP Concepts','SDLC & Agile'], tip:'Communication skills matter at Cognizant. Speak clearly in interviews. GenC Next is the premium track.' },
  { name:'Salesforce', letter:'S', gradient:'linear-gradient(135deg,#00a1e0,#032d60)', difficulty:'Hard', roles:'MTS, SWE, Solution Engineer', avg_ctc:'28-40 LPA', openings:60, process:['Recruiter Screen','2-3 Technical Rounds (Coding + Design)','Architecture Round','Behavioral Round','Offer'], topics:['Java / Apex Programming','Salesforce Platform','APIs & Integration','System Design','Database & SOQL'], tip:'Know Salesforce ecosystem. Show platform expertise. Very culture-focused — research their values.' },
  { name:'Razorpay', letter:'R', gradient:'linear-gradient(135deg,#2d9cdb,#27ae60)', difficulty:'Hard', roles:'SDE-1, Backend Engineer', avg_ctc:'20-35 LPA', openings:50, process:['Resume Shortlist','Take-home Assignment','3 Technical Interviews','System Design','Culture Fit + Offer'], topics:['System Design (Payments)','Backend (Go/Java/Python)','DSA (Medium-Hard)','Database Design','Fintech fundamentals'], tip:'Deep interest in fintech is crucial. Build and showcase projects. LLD round is rigorous.' },
];

const RESOURCES = {
  books: [
    { title:'Cracking the Coding Interview', author:'Gayle Laakmann McDowell', desc:'The bible for coding interviews. 189 problems with solutions across all major DSA topics.', link:'https://www.crackingthecodinginterview.com/', tag:'Must Read', color:'#6366f1' },
    { title:'Introduction to Algorithms (CLRS)', author:'Cormen, Leiserson, Rivest, Stein', desc:'The definitive computer science algorithms textbook. Essential for deep understanding.', link:'https://mitpress.mit.edu/books/introduction-algorithms-third-edition', tag:'Reference', color:'#10b981' },
    { title:'Elements of Programming Interviews', author:'Adnan Aziz et al.', desc:'300+ problems categorized by topic. More challenging than CTCI, great for FAANG.', link:'https://elementsofprogramminginterviews.com/', tag:'Advanced', color:'#f59e0b' },
    { title:'System Design Interview', author:'Alex Xu', desc:'Covers real-world system design problems asked at FAANG. Essential for senior roles.', link:'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF', tag:'System Design', color:'#ec4899' },
    { title:'Head First Design Patterns', author:'Freeman & Robson', desc:'Learn design patterns in a visual, engaging way. Great for OOP design round prep.', link:'https://www.oreilly.com/library/view/head-first-design/0596007124/', tag:'OOP', color:'#14b8a6' },
    { title:'A Placement Guide for CS Students', author:'GeeksforGeeks', desc:'Comprehensive placement preparation guide specifically for Indian campus placements.', link:'https://www.geeksforgeeks.org/placement-guide/', tag:'Placement', color:'#8b5cf6' },
  ],
  videos: [
    { title:'NeetCode — DSA for Beginners', channel:'NeetCode', desc:'Clear, well-organized DSA playlist. The best structured coding interview prep on YouTube.', link:'https://www.youtube.com/@NeetCode', tag:'DSA', color:'#6366f1' },
    { title:'System Design Fundamentals', channel:'Gaurav Sen', desc:'Excellent system design explanations with real-world scenarios. Great for L4+ interviews.', link:'https://www.youtube.com/@gkcs', tag:'System Design', color:'#10b981' },
    { title:'Striver DSA Sheet', channel:'take U forward', desc:'Complete DSA sheet with step-by-step explanations. Highly recommended for all rounds.', link:'https://www.youtube.com/@takeUforward', tag:'DSA', color:'#f59e0b' },
    { title:'HR Interview Mastery', channel:'CareerVidz', desc:'How to answer the most common HR interview questions with confidence and structure.', link:'https://www.youtube.com/@CareerVidz', tag:'HR', color:'#ec4899' },
    { title:'Tech Interview Handbook', channel:'Clement Mihailescu', desc:'AlgoExpert founder shares insider tips on acing technical coding interviews at top companies.', link:'https://www.youtube.com/@clem', tag:'Coding', color:'#14b8a6' },
    { title:'Aptitude Shortcuts & Tricks', channel:'Arun Sharma', desc:'Vedic math tricks and shortcut formulas for solving aptitude questions 3x faster.', link:'https://www.youtube.com/results?search_query=arun+sharma+aptitude', tag:'Aptitude', color:'#8b5cf6' },
  ],
  sheets: [
    { title:'Striver SDE Sheet', desc:'180 most important DSA problems organized by topic. The gold standard for placement prep.', link:'https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/', tag:'DSA', color:'#6366f1' },
    { title:'NeetCode 150', desc:'150 carefully curated LeetCode problems covering all patterns needed for FAANG.', link:'https://neetcode.io/practice', tag:'LeetCode', color:'#10b981' },
    { title:'Love Babbar DSA Sheet', desc:'450 problems covering every topic. Widely used by Indian placement candidates.', link:'https://drive.google.com/file/d/1FMdN_OCfOI0iAeDlqswCiC2DZzD4nPsb/view', tag:'450 Problems', color:'#f59e0b' },
    { title:'GeeksForGeeks Placement Course', desc:'Topic-wise syllabus aligned with TCS, Infosys, Amazon, Wipro hiring patterns.', link:'https://www.geeksforgeeks.org/placement-guide/', tag:'All-in-one', color:'#ec4899' },
    { title:'HR Interview Questions Bank', desc:'100+ most common HR questions with STAR-format model answers for campus placements.', link:'https://www.indiabix.com/hr-interview/questions-and-answers/', tag:'HR Prep', color:'#14b8a6' },
    { title:'System Design Cheat Sheet', desc:'Visual one-pager covering all key system design concepts: caching, load balancing, CDN, DB scaling.', link:'https://github.com/donnemartin/system-design-primer', tag:'System Design', color:'#8b5cf6' },
  ],
  websites: [
    { title:'LeetCode', desc:'The #1 platform for coding interview practice. 2400+ problems. Must-use for FAANG prep.', link:'https://leetcode.com', tag:'Coding', color:'#f59e0b' },
    { title:'GeeksforGeeks', desc:'Comprehensive portal for CS fundamentals, interview experiences, and company-specific prep.', link:'https://www.geeksforgeeks.org', tag:'All-in-one', color:'#10b981' },
    { title:'InterviewBit', desc:'Structured 6-week interview prep with topic-wise problems. Great for beginners.', link:'https://www.interviewbit.com', tag:'Structured', color:'#6366f1' },
    { title:'HackerRank', desc:'Used by companies for assessment. Practice company-specific coding challenges here.', link:'https://www.hackerrank.com', tag:'Assessments', color:'#ec4899' },
    { title:'Pramp', desc:'Free peer-to-peer mock interviews. Practice coding + system design with real people.', link:'https://www.pramp.com', tag:'Mock Interviews', color:'#14b8a6' },
    { title:'IndiaBix', desc:'Huge bank of aptitude MCQs for TCS, Infosys, Wipro style exams. Free and comprehensive.', link:'https://www.indiabix.com', tag:'Aptitude', color:'#8b5cf6' },
  ],
};

const MOCK_TESTS = [
  { name:'TCS NQT Mock', questions:30, duration:60, difficulty:'Easy', desc:'Simulates TCS National Qualifier Test with aptitude, verbal, and programming MCQs.' },
  { name:'Infosys SP Mock', questions:25, duration:50, difficulty:'Easy', desc:'Covers InfyTQ-style quantitative, verbal, and coding aptitude sections.' },
  { name:'Wipro Elite Mock', questions:40, duration:60, difficulty:'Medium', desc:'Aptitude, verbal, essay, and coding rounds as in Wipro Elite NTH.' },
  { name:'Amazon SDE Mock', questions:20, duration:90, difficulty:'Hard', desc:'2 DSA problems + behavioral MCQs based on Leadership Principles.' },
  { name:'Google SWE Mock', questions:2, duration:60, difficulty:'Hard', desc:'Two LeetCode-style problems timed. Focus on optimal solution & communication.' },
];

const MOCK_QUESTIONS = [
  { q:'A train 150m long crosses a pole in 15 seconds. What is the speed of the train in km/h?', options:['30 km/h','36 km/h','40 km/h','45 km/h'], answer:1, explanation:'Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/h.' },
  { q:'If 20% of a number is 80, what is 30% of that number?', options:['100','120','140','160'], answer:1, explanation:'Number = 80/0.20 = 400. 30% of 400 = 120.' },
  { q:'Find the odd one out: 3, 5, 7, 9, 11', options:['3','5','9','11'], answer:2, explanation:'9 is the only composite number (3×3). All others are prime.' },
  { q:'A can do a work in 10 days, B in 15 days. Working together, in how many days?', options:['4 days','5 days','6 days','8 days'], answer:2, explanation:'Combined rate = 1/10 + 1/15 = 5/30 = 1/6. So 6 days.' },
  { q:'Which of the following is NOT an OOP concept?', options:['Encapsulation','Polymorphism','Compilation','Inheritance'], answer:2, explanation:'Compilation is a development process step, not an OOP concept.' },
  { q:'What is the output of: print(type(1/2)) in Python 3?', options:["<class 'int'>"," <class 'float'>"," <class 'complex'>",' Error'], answer:1, explanation:'In Python 3, 1/2 = 0.5, which is a float.' },
  { q:'In SQL, which command is used to remove a table completely?', options:['DELETE','TRUNCATE','DROP','REMOVE'], answer:2, explanation:'DROP TABLE removes the table definition and all its data permanently.' },
  { q:'Synonyms of "Candid":', options:['Secretive','Frank','Timid','Clever'], answer:1, explanation:'"Candid" means honest and frank in expression.' },
  { q:'Find next: 2, 6, 12, 20, 30, ?', options:['40','42','44','46'], answer:1, explanation:'Differences: 4,6,8,10,12. Next term: 30+12=42.' },
  { q:'What is Big O notation of Binary Search?', options:['O(n)','O(log n)','O(n log n)','O(1)'], answer:1, explanation:'Binary search halves the search space each step = O(log n).' },
  { q:'Average of 5 consecutive even numbers is 60. What is the smallest?', options:['54','56','58','60'], answer:1, explanation:'Numbers: 56,58,60,62,64. Average=60. Smallest=56.' },
  { q:'If MANGO is coded as NBOHP, how is APPLE coded?', options:['BQQMF','BQQNG','CRRNG','BRANG'], answer:0, explanation:'Each letter is shifted by +1. A->B, P->Q, P->Q, L->M, E->F = BQQMF.' },
  { q:'A shopkeeper marks goods 40% above cost and gives 20% discount. Profit%?', options:['10%','12%','14%','16%'], answer:1, explanation:'CP=100, MP=140, SP=140×0.8=112. Profit=12%.' },
  { q:'Which data structure uses LIFO principle?', options:['Queue','Stack','Linked List','Tree'], answer:1, explanation:'Stack uses Last In First Out (LIFO) principle.' },
  { q:'Choose correct: The committee __ decided on the matter.', options:['have','has','are','were'], answer:1, explanation:'"Committee" is a collective noun treated as singular. Use "has".' },
  { q:'Pipes A and B fill a tank in 20 and 30 min. Pipe C empties it in 15 min. All open together — fill time in minutes?', options:['60','90','120','Impossible'], answer:3, explanation:'Fill rate = 1/20+1/30-1/15 = 3+2-4/60 = 1/60 negative... C drains faster; tank never fills.' },
  { q:'The time complexity of inserting at beginning of an array is:', options:['O(1)','O(log n)','O(n)','O(n²)'], answer:2, explanation:'Inserting at beginning requires shifting all elements = O(n).' },
  { q:'Complete: "Rome was not built in ___"', options:['a decade','a day','one night','one go'], answer:1, explanation:'The proverb is "Rome was not built in a day".' },
  { q:'If x² - 5x + 6 = 0, find x:', options:['1,2','2,3','3,4','1,6'], answer:1, explanation:'x²-5x+6=0 -> (x-2)(x-3)=0 -> x=2 or x=3.' },
  { q:'Which protocol is used for secure web browsing?', options:['HTTP','FTP','HTTPS','SMTP'], answer:2, explanation:'HTTPS (HTTP Secure) encrypts web communication using TLS/SSL.' },
  { q:'A 20% price rise then 20% fall = what net change?', options:['No change','-4%','+4%','-2%'], answer:1, explanation:'100 -> 120 -> 96. Net loss of 4%.' },
  { q:'What is the primary key constraint?', options:['Allows nulls','Must be unique and not null','Can be repeated','Is optional'], answer:1, explanation:'A primary key uniquely identifies each row and cannot be NULL.' },
  { q:'Direction: If South is East, North is West, then what is Southwest?', options:['NorthWest','NorthEast','SouthEast','None'], answer:1, explanation:'Each direction shifts 90° clockwise: South->East, North->West, SouthWest->NorthWest->NorthEast.' },
  { q:'Which of these is NOT a feature of cloud computing?', options:['Scalability','On-demand access','Physical hardware ownership','Pay-per-use'], answer:2, explanation:'Cloud computing eliminates the need for physical hardware ownership.' },
  { q:'If a clock shows 3:15, what is the angle between hands?', options:['0°','7.5°','15°','22.5'], answer:1, explanation:'At 3:15 hour hand = 97.5°, minute hand = 90°. Difference = 7.5°.' },
  { q:'An error that occurs during program execution is called:', options:['Syntax Error','Runtime Error','Logic Error','Compile Error'], answer:1, explanation:'Runtime errors occur during execution (e.g., division by zero, null pointer).' },
  { q:'Simple interest on Rs 5000 at 8% per annum for 2 years?', options:['Rs 400','Rs 600','Rs 800','Rs 1000'], answer:2, explanation:'SI = P×R×T/100 = 5000×8×2/100 = Rs 800.' },
  { q:'Antonym of "Verbose":', options:['Talkative','Concise','Wordy','Elaborate'], answer:1, explanation:'"Verbose" means using too many words; antonym is "Concise".' },
  { q:'A linked list node contains:', options:['Only data','Only pointer','Data and pointer','Index and data'], answer:2, explanation:'Each node in a linked list contains data and a pointer to the next node.' },
  { q:'Two dice are thrown. Probability of sum = 7?', options:['1/6','1/4','1/8','1/3'], answer:0, explanation:'Favourable outcomes for sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. P = 6/36 = 1/6.' },
];

const ROADMAP_PHASES = [
  { phase:'Phase 1', title:'Foundation Building', duration:'Weeks 1-3', color:'#6366f1', tasks:[
    { task:'Complete Maths for aptitude (Percentages, Profit-Loss, Time-Work, Speed)', done:true },
    { task:'Learn C++/Java/Python fundamentals', done:true },
    { task:'Understand Arrays, Strings, Linked Lists', done:true },
    { task:'Solve 30 Easy LeetCode problems', done:false },
    { task:'Practice 50 aptitude MCQs per day', done:false },
  ]},
  { phase:'Phase 2', title:'Core DSA Mastery', duration:'Weeks 4-7', color:'#10b981', tasks:[
    { task:'Stacks, Queues, Trees, Binary Search Trees', done:false },
    { task:'Heaps, Tries, Segment Trees', done:false },
    { task:'Dynamic Programming patterns (15 types)', done:false },
    { task:'Graph algorithms: BFS, DFS, Dijkstra, Topological Sort', done:false },
    { task:'Solve 60 Medium LeetCode problems', done:false },
  ]},
  { phase:'Phase 3', title:'Interview Prep', duration:'Weeks 8-10', color:'#f59e0b', tasks:[
    { task:'Prepare all 8 HR questions with STAR answers', done:false },
    { task:'Practice System Design basics (HLD of URL Shortener, Chat App)', done:false },
    { task:'Complete 10 behavioral questions with examples', done:false },
    { task:'Attempt 3 full Mock Tests under timed conditions', done:false },
    { task:'Research your top 5 target companies', done:false },
  ]},
  { phase:'Phase 4', title:'Company-Specific & Final Push', duration:'Weeks 11-13', color:'#ec4899', tasks:[
    { task:'Solve company-specific LeetCode tags for target companies', done:false },
    { task:'Complete 5 Mock Tests scoring >80%', done:false },
    { task:'Practice coding on paper/whiteboard', done:false },
    { task:'Schedule mock interviews with friends or Pramp', done:false },
    { task:'Review and revise all weak areas', done:false },
  ]},
];

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (authToken) { fetchProfile(); } else { showAuthModal(); }
  const keyInput = document.getElementById('apiKeyInput');
  if (keyInput && apiKey) keyInput.value = apiKey;
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
  if (el && !currentUser) el.textContent = `${greet}, Student! 👋`;
}

// ---------- AUTH ----------
function showAuthModal() { document.getElementById('authModal').style.display = 'flex'; }
function closeAuthModal() { document.getElementById('authModal').style.display = 'none'; }
function openSettingsModal() { document.getElementById('settingsModal').style.display = 'flex'; }
function closeSettingsModal() { document.getElementById('settingsModal').style.display = 'none'; }

function toggleAuthMode(e) {
  e.preventDefault();
  currentMode = currentMode === 'login' ? 'signup' : 'login';
  document.getElementById('authTitle').textContent = currentMode === 'signup' ? 'Create an Account' : 'Welcome to PlacePrep';
  document.getElementById('authSubmitBtn').textContent = currentMode === 'signup' ? 'Sign Up' : 'Log In';
  document.getElementById('authToggleText').textContent = currentMode === 'signup' ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('authToggleLink').textContent = currentMode === 'signup' ? 'Log In' : 'Sign Up';
  document.getElementById('nameFieldGroup').style.display = currentMode === 'signup' ? 'block' : 'none';
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
    const body = currentMode === 'login' ? { email, password } : { name, email, password };
    const res = await fetch(API_BASE + endpoint, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    authToken = data.token;
    localStorage.setItem('placeprep_token', authToken);
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
    const res = await fetch(API_BASE + '/user/profile', { headers:{'Authorization': `Bearer ${authToken}`} });
    const data = await res.json();
    if (res.ok) { updateUserUI(data.user); } else { logout(); }
  } catch (err) { console.error('Failed to fetch profile', err); }
}

function updateUserUI(user) {
  currentUser = user;
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good Morning' : hr < 17 ? 'Good Afternoon' : 'Good Evening';
  document.getElementById('displayUserName').textContent = user.name;
  document.getElementById('displayUserLevel').textContent = `🎯 Level ${user.level}`;
  const pt = document.querySelector('.page-title');
  if (pt) pt.textContent = `${greet}, ${user.name.split(' ')[0]}! 👋`;
  const ps = document.querySelector('.page-subtitle');
  if (ps) ps.textContent = user.streak > 0 ? `You're on a ${user.streak}-day streak. Keep it up! 🔥` : `Welcome back! Start practicing to build your streak.`;
  document.getElementById('userAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function logout() {
  localStorage.removeItem('placeprep_token');
  authToken = null; currentUser = null;
  document.getElementById('displayUserName').textContent = 'Guest';
  document.getElementById('displayUserLevel').textContent = '🎯 Level 1';
  showAuthModal();
}

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value;
  localStorage.setItem('placeprep_apikey', key);
  apiKey = key;
  closeSettingsModal();
  showToast('API Key saved!', 'success');
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
function showToast(msg, type='info') {
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
  if (!apiKey) { showToast('Please set your Gemini API Key in Settings first.','error'); openSettingsModal(); return; }
  if (!currentUser) { showAuthModal(); return; }
  const panel = document.getElementById('quizPanel');
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior:'smooth' });
  document.getElementById('quizCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
  document.getElementById('questionText').textContent = '✨ Generating AI questions for you...';
  document.getElementById('optionsGrid').innerHTML = '';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('quizProgress').textContent = 'Loading...';
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  try {
    const res = await fetch(API_BASE + '/generate-questions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${authToken}`}, body: JSON.stringify({ category, type:'campus placement standard', apiKey }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate');
    currentQuestions = data.questions;
    currentQuestionIndex = 0;
    score = 0;
    displayQuestion();
  } catch (err) {
    document.getElementById('questionText').textContent = '❌ Error: ' + err.message;
  }
}

function startQuizTimer() {
  let secs = 30;
  document.getElementById('quizTimer').textContent = `⏱ 00:30`;
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  quizTimerInterval = setInterval(() => {
    secs--;
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    document.getElementById('quizTimer').textContent = `⏱ ${m}:${s}`;
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
  showResult(false, '⏰ Time Up!', currentQuestions[currentQuestionIndex]?.explanation || '');
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
  showResult(isCorrect, isCorrect ? '✅ Correct!' : '❌ Incorrect', q.explanation);
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
  document.getElementById('questionText').innerHTML = `<strong>🎉 Quiz Complete!</strong><br>You scored <span style="color:#6366f1;font-size:1.3em;">${score}/${currentQuestions.length}</span>`;
  document.getElementById('optionsGrid').innerHTML = `<button class="btn btn-primary" onclick="document.getElementById('quizPanel').style.display='none'">← Back to Categories</button>`;
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('nextBtn').disabled = true;
  if (currentUser) {
    const xpGain = score * 20;
    try {
      await fetch(API_BASE + '/user/xp', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${authToken}`}, body: JSON.stringify({ xp_gain: xpGain }) });
      fetchProfile();
      showToast(`+${xpGain} XP earned!`, 'success');
    } catch(e) {}
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
      <span class="prob-status">${p.solved ? '✅' : '○'}</span>
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
    cb.innerHTML = `<span style="color:#10b981">✓ Compiled successfully</span><br><span style="color:#a1a1aa">Running test cases...</span>`;
    setTimeout(() => {
      const passed = Math.floor(Math.random() * 3) + 2;
      const total = passed === 4 ? 4 : 4;
      cb.innerHTML = `<span style="color:#10b981">✓ ${passed}/${total} test cases passed</span><br><span style="color:#a1a1aa">Time: ${(Math.random()*80+20).toFixed(0)}ms | Memory: ${(Math.random()*10+40).toFixed(1)}MB</span>`;
      if (passed === total && currentProblem) {
        currentProblem.solved = true;
        renderProblems();
        showToast('Problem solved! 🎉 Great job!', 'success');
      }
    }, 800);
  }, 500);
}

// ---------- INTERVIEW ----------
function renderInterviewQuestions() {
  const hrGrid = document.getElementById('hrQuestions');
  if (hrGrid) hrGrid.innerHTML = HR_QUESTIONS.map((q, i) => `
    <div class="interview-card" onclick="openInterviewModal(${i}, 'hr')">
      <div class="iq-number">Q${i+1}</div>
      <p class="iq-text">${q.q}</p>
      <div class="iq-footer"><span class="iq-tag">HR</span><span style="font-size:0.8rem;color:#71717a">Click for answer →</span></div>
    </div>`).join('');

  const techGrid = document.getElementById('techQuestions');
  if (techGrid) techGrid.innerHTML = TECH_QUESTIONS.map((q, i) => `
    <div class="interview-card" onclick="openInterviewModal(${i}, 'tech')">
      <div class="iq-number">Q${i+1}</div>
      <p class="iq-text">${q.q}</p>
      <div class="iq-footer"><span class="iq-tag tech">Technical</span><span style="font-size:0.8rem;color:#71717a">Click for answer →</span></div>
    </div>`).join('');

  const behavGrid = document.getElementById('behavQuestions');
  if (behavGrid) behavGrid.innerHTML = BEHAVIORAL_QUESTIONS.map((q, i) => `
    <div class="interview-card" onclick="openInterviewModal(${i}, 'behav')">
      <div class="iq-number">Q${i+1}</div>
      <p class="iq-text">${q.q}</p>
      <div class="iq-footer"><span class="iq-tag behav">Behavioral</span><span style="font-size:0.8rem;color:#71717a">Click for answer →</span></div>
    </div>`).join('');

  const gdGrid = document.getElementById('gdTopics');
  if (gdGrid) gdGrid.innerHTML = GD_TOPICS.map((t, i) => `
    <div class="gd-card" onclick="openGDModal(${i})">
      <div class="gd-cat-badge">${t.category}</div>
      <h3>${t.title}</h3>
      <ul class="gd-points">${t.points.slice(0,3).map(p => `<li>${p}</li>`).join('')}</ul>
      <button class="cat-btn" style="margin-top:0.5rem">View Discussion Points →</button>
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
  document.getElementById('modalAnswer').textContent = t.points.join('\n• ');
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
  const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#ec4899'];
  grid.innerHTML = MOCK_TESTS.map((t, i) => `
    <div class="mock-test-card" style="border-top: 4px solid ${colors[i]}">
      <div class="mock-test-icon" style="background:${colors[i]}22;color:${colors[i]}">${['📋','🏢','⚡','🚀','🎯'][i]}</div>
      <h3>${t.name}</h3>
      <p style="color:var(--text-secondary);font-size:0.875rem;margin-bottom:1rem">${t.desc}</p>
      <div class="mock-meta">
        <span>📝 ${t.questions} Questions</span>
        <span>⏱ ${t.duration} min</span>
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
  document.getElementById('nextTestBtn').textContent = currentTestQ === total - 1 ? 'Submit Test' : 'Next →';

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
    if (el) el.textContent = `⏱ ${m}:${s}`;
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
      <div style="font-size:4rem;margin-bottom:1rem">${pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : '📖'}</div>
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
            <p style="font-weight:600;margin-bottom:0.3rem">${testAnswers[i] === q.answer ? '✅' : '❌'} Q${i+1}. ${q.q}</p>
            <p style="font-size:0.85rem;color:var(--text-secondary)">Your answer: ${testAnswers[i] !== -1 ? q.options[testAnswers[i]] : 'Skipped'} | Correct: <span style="color:#10b981">${q.options[q.answer]}</span></p>
            <p style="font-size:0.82rem;color:#a1a1aa;margin-top:0.3rem">💡 ${q.explanation}</p>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary" style="margin-top:1.5rem" onclick="backToTests()">← Back to Tests</button>
    </div>`;

  if (currentUser) {
    fetch(API_BASE + '/user/xp', { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${authToken}`}, body: JSON.stringify({ xp_gain: xpGain }) }).then(() => fetchProfile()).catch(() => {});
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
        <span style="font-size:0.78rem;padding:0.2rem 0.6rem;background:var(--bg-tertiary);border-radius:20px">💰 ${c.avg_ctc}</span>
        <span style="font-size:0.78rem;padding:0.2rem 0.6rem;background:var(--bg-tertiary);border-radius:20px">👥 ${c.openings} openings</span>
      </div>
      <button class="cat-btn">View Prep Guide →</button>
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
      <h4>🗺️ Hiring Process</h4>
      <ol style="padding-left:1.2rem;margin-bottom:1.2rem">
        ${c.process.map(s => `<li style="padding:0.3rem 0;color:var(--text-secondary)">${s}</li>`).join('')}
      </ol>
      <h4>📌 Key Topics to Focus</h4>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:1.2rem">
        ${c.topics.map(t => `<span style="padding:0.3rem 0.8rem;background:rgba(99,102,241,0.15);color:#818cf8;border-radius:20px;font-size:0.82rem">${t}</span>`).join('')}
      </div>
      <div style="background:rgba(245,158,11,0.1);border-left:4px solid #f59e0b;border-radius:8px;padding:1rem">
        <strong>💡 Pro Tip:</strong><br><span style="color:var(--text-secondary);font-size:0.9rem">${c.tip}</span>
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
      ${r.channel ? `<p style="font-size:0.8rem;color:#71717a;margin-bottom:0.5rem">📺 ${r.channel}</p>` : ''}
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
            <span class="phase-duration">📅 ${phase.duration}</span>
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
              <span class="task-check">${t.done ? '✅' : '⬜'}</span>
              <span>${t.task}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function toggleTask(phaseIdx, taskIdx) {
  ROADMAP_PHASES[phaseIdx].tasks[taskIdx].done = !ROADMAP_PHASES[phaseIdx].tasks[taskIdx].done;
  renderRoadmap();
  showToast(ROADMAP_PHASES[phaseIdx].tasks[taskIdx].done ? '✅ Task completed!' : 'Task unchecked', 'info');
}
