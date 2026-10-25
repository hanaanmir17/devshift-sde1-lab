// Curated practice data. All tests run locally in an isolated Web Worker.
export const TRACKS = [
  { name:'Arrays & Hashing', tag:'Arrays', color:'#8bc5ff' },
  { name:'Two Pointers', tag:'Two Pointers', color:'#a3e9d8' },
  { name:'Stack & Strings', tag:'Stack', color:'#d5acff' },
  { name:'Binary Search', tag:'Binary Search', color:'#ffd494' },
  { name:'Sliding Window', tag:'Sliding Window', color:'#ffadbd' },
  { name:'Dynamic Programming', tag:'DP', color:'#b6db9b' },
  { name:'Graphs & Matrix', tag:'Graphs', color:'#f5bae0' },
];

export const PROBLEMS = [
{
 id:'two-sum',title:'Two Sum',level:'Easy',track:'Arrays',mins:15,fn:'twoSum',points:40,
 description:'Given an array of integers nums and an integer target, return the indices of two distinct numbers that add up to target. You may assume exactly one solution exists.',
 example:'twoSum([2, 7, 11, 15], 9) → [0, 1]',
 starter:'function twoSum(nums, target) {\n  // Build a map from value to index.\n  \n}',
 solution:'function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}',
 hints:['Ask whether you need two nested loops, or can remember what you have seen.','For each value x, check whether target - x is already in a Map.'],
 complexity:'Time O(n) · Space O(n)',tests:[{args:[[2,7,11,15],9],expected:[0,1]},{args:[[3,2,4],6],expected:[1,2]},{args:[[3,3],6],expected:[0,1]},{args:[[-1,0,4,6],5],expected:[0,3],hidden:true}]
},
{
 id:'valid-parentheses',title:'Valid Parentheses',level:'Easy',track:'Stack',mins:15,fn:'isValid',points:40,
 description:'Given a string containing only (), {} and [], return true when every opening bracket is closed by the correct bracket in the correct order.',
 example:'isValid("()[]{}") → true',starter:'function isValid(s) {\n  // Use a stack.\n  \n}',
 solution:'function isValid(s) {\n  const match = { ")": "(", "]": "[", "}": "{" };\n  const stack = [];\n  for (const ch of s) {\n    if ("([{ ".includes(ch) && ch !== " ") stack.push(ch);\n    else if (stack.pop() !== match[ch]) return false;\n  }\n  return stack.length === 0;\n}',
 hints:['The last opened bracket must close first.','Push openings, pop when closing; use a map from closing to opening.'],complexity:'Time O(n) · Space O(n)',
 tests:[{args:['()[]{}'],expected:true},{args:['(]'],expected:false},{args:['([{}])'],expected:true},{args:['((('],expected:false},{args:['{[]}'],expected:true,hidden:true}]
},
{
 id:'contains-duplicate',title:'Contains Duplicate',level:'Easy',track:'Arrays',mins:10,fn:'containsDuplicate',points:30,
 description:'Return true if any integer appears at least twice in the input array.',example:'containsDuplicate([1, 2, 3, 1]) → true',starter:'function containsDuplicate(nums) {\n  \n}',
 solution:'function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}',hints:['How can you track unique elements?','Compare the size of a Set to the array length.'],complexity:'Time O(n) · Space O(n)',tests:[{args:[[1,2,3,1]],expected:true},{args:[[1,2,3,4]],expected:false},{args:[[0]],expected:false},{args:[[2,2,2]],expected:true,hidden:true}]
},
{
 id:'stock-profit',title:'Best Time to Buy and Sell Stock',level:'Easy',track:'Two Pointers',mins:20,fn:'maxProfit',points:50,
 description:'Given prices, find the maximum profit from buying one day and selling on a later day. Return zero when no profit is possible.',example:'maxProfit([7, 1, 5, 3, 6, 4]) → 5',starter:'function maxProfit(prices) {\n  \n}',
 solution:'function maxProfit(prices) {\n  let low = Infinity, profit = 0;\n  for (const price of prices) {\n    low = Math.min(low, price);\n    profit = Math.max(profit, price - low);\n  }\n  return profit;\n}',hints:['Keep the cheapest purchase price seen so far.','At every price, compare it with the minimum earlier price.'],complexity:'Time O(n) · Space O(1)',tests:[{args:[[7,1,5,3,6,4]],expected:5},{args:[[7,6,4,3,1]],expected:0},{args:[[1,2]],expected:1},{args:[[2,4,1,7]],expected:6,hidden:true}]
},
{
 id:'valid-anagram',title:'Valid Anagram',level:'Easy',track:'Arrays',mins:15,fn:'isAnagram',points:40,
 description:'Return true when strings s and t contain exactly the same letters with the same frequencies. Inputs contain lowercase English letters.',example:'isAnagram("anagram", "nagaram") → true',starter:'function isAnagram(s, t) {\n  \n}',
 solution:'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Map();\n  for (const c of s) count.set(c, (count.get(c) || 0) + 1);\n  for (const c of t) {\n    const next = (count.get(c) || 0) - 1;\n    if (next < 0) return false;\n    count.set(c, next);\n  }\n  return true;\n}',hints:['Sorting works; a frequency table is faster.','Count the letters in s, then decrement using t.'],complexity:'Time O(n) · Space O(1) for fixed alphabet',tests:[{args:['anagram','nagaram'],expected:true},{args:['rat','car'],expected:false},{args:['aacc','ccac'],expected:false},{args:['',''],expected:true,hidden:true}]
},
{
 id:'binary-search',title:'Binary Search',level:'Easy',track:'Binary Search',mins:15,fn:'search',points:40,
 description:'Given a sorted array of distinct integers nums and target, return the index of target or -1 if absent. Solve in O(log n) time.',example:'search([-1, 0, 3, 5, 9, 12], 9) → 4',starter:'function search(nums, target) {\n  \n}',
 solution:'function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',hints:['Cut your search space in half at each step.','Maintain inclusive left and right boundaries; compare the midpoint.'],complexity:'Time O(log n) · Space O(1)',tests:[{args:[[-1,0,3,5,9,12],9],expected:4},{args:[[-1,0,3,5,9,12],2],expected:-1},{args:[[5],5],expected:0},{args:[[],1],expected:-1,hidden:true}]
},
{
 id:'max-subarray',title:'Maximum Subarray',level:'Medium',track:'DP',mins:25,fn:'maxSubArray',points:65,
 description:'Find the largest possible sum of a non-empty contiguous subarray.',example:'maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) → 6',starter:'function maxSubArray(nums) {\n  \n}',
 solution:'function maxSubArray(nums) {\n  let current = nums[0], best = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    current = Math.max(nums[i], current + nums[i]);\n    best = Math.max(best, current);\n  }\n  return best;\n}',hints:['At each index, decide whether to extend your current subarray or start over.','Use Kadane’s algorithm: current = max(num, current + num).'],complexity:'Time O(n) · Space O(1)',tests:[{args:[[-2,1,-3,4,-1,2,1,-5,4]],expected:6},{args:[[1]],expected:1},{args:[[5,4,-1,7,8]],expected:23},{args:[[-4,-2,-7]],expected:-2,hidden:true}]
},
{
 id:'longest-substring',title:'Longest Unique Substring',level:'Medium',track:'Sliding Window',mins:30,fn:'lengthOfLongestSubstring',points:65,
 description:'Return the length of the longest substring without repeating characters.',example:'lengthOfLongestSubstring("abcabcbb") → 3',starter:'function lengthOfLongestSubstring(s) {\n  \n}',
 solution:'function lengthOfLongestSubstring(s) {\n  const last = new Map();\n  let left = 0, best = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (last.has(s[right])) left = Math.max(left, last.get(s[right]) + 1);\n    last.set(s[right], right);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',hints:['Consider a window that grows rightward.','When a character repeats, move the left boundary past its prior index.'],complexity:'Time O(n) · Space O(min(n, alphabet))',tests:[{args:['abcabcbb'],expected:3},{args:['bbbbb'],expected:1},{args:['pwwkew'],expected:3},{args:[''],expected:0},{args:['abba'],expected:2,hidden:true}]
},
{
 id:'product-except-self',title:'Product Except Self',level:'Medium',track:'Arrays',mins:30,fn:'productExceptSelf',points:70,
 description:'Return an array where result[i] is the product of all numbers except nums[i]. Do not use division, and aim for O(n) time.',example:'productExceptSelf([1, 2, 3, 4]) → [24, 12, 8, 6]',starter:'function productExceptSelf(nums) {\n  \n}',
 solution:'function productExceptSelf(nums) {\n  const out = Array(nums.length).fill(1);\n  let left = 1;\n  for (let i = 0; i < nums.length; i++) { out[i] = left; left *= nums[i]; }\n  let right = 1;\n  for (let i = nums.length - 1; i >= 0; i--) { out[i] *= right; right *= nums[i]; }\n  return out;\n}',hints:['Think prefix products and suffix products.','Store prefix products in output, then sweep from the right multiplying suffix products.'],complexity:'Time O(n) · Extra space O(1), excluding output',tests:[{args:[[1,2,3,4]],expected:[24,12,8,6]},{args:[[-1,1,0,-3,3]],expected:[0,0,9,0,0]},{args:[[2,3]],expected:[3,2]},{args:[[0,0,4]],expected:[0,0,0],hidden:true}]
},
{
 id:'move-zeroes',title:'Move Zeroes',level:'Easy',track:'Two Pointers',mins:15,fn:'moveZeroes',points:40,
 description:'Move every zero to the end of nums while preserving the order of non-zero elements. Return the rearranged array (do not mutate the original input for this exercise).',example:'moveZeroes([0,1,0,3,12]) → [1,3,12,0,0]',starter:'function moveZeroes(nums) {\n  \n}',
 solution:'function moveZeroes(nums) {\n  const out = nums.filter(n => n !== 0);\n  return out.concat(Array(nums.length - out.length).fill(0));\n}',hints:['Collect non-zero elements, then add zeros.','Or use two pointers to perform in-place swaps on a cloned array.'],complexity:'Time O(n) · Space O(n) for returned copy',tests:[{args:[[0,1,0,3,12]],expected:[1,3,12,0,0]},{args:[[0]],expected:[0]},{args:[[1,2,3]],expected:[1,2,3]},{args:[[0,0,1]],expected:[1,0,0],hidden:true}]
},
{
 id:'palindrome',title:'Valid Palindrome',level:'Easy',track:'Two Pointers',mins:15,fn:'isPalindrome',points:40,
 description:'Return true if a string reads the same forward and backward after removing non-alphanumeric characters and ignoring case.',example:'isPalindrome("A man, a plan, a canal: Panama") → true',starter:'function isPalindrome(s) {\n  \n}',
 solution:'function isPalindrome(s) {\n  const text = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  let left = 0, right = text.length - 1;\n  while (left < right) {\n    if (text[left++] !== text[right--]) return false;\n  }\n  return true;\n}',hints:['Normalize the string first.','Use left and right pointers to compare characters.'],complexity:'Time O(n) · Space O(n)',tests:[{args:['A man, a plan, a canal: Panama'],expected:true},{args:['race a car'],expected:false},{args:[' '],expected:true},{args:['0P'],expected:false,hidden:true}]
},
{
 id:'climbing-stairs',title:'Climbing Stairs',level:'Easy',track:'DP',mins:20,fn:'climbStairs',points:45,
 description:'You can climb one or two steps at a time. How many distinct ways are there to climb n steps?',example:'climbStairs(4) → 5',starter:'function climbStairs(n) {\n  \n}',
 solution:'function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) { [a, b] = [b, a + b]; }\n  return b;\n}',hints:['Think about the last step: one step or two steps.','ways(n) = ways(n-1) + ways(n-2).'],complexity:'Time O(n) · Space O(1)',tests:[{args:[1],expected:1},{args:[2],expected:2},{args:[4],expected:5},{args:[6],expected:13},{args:[10],expected:89,hidden:true}]
},
{
 id:'search-insert',title:'Search Insert Position',level:'Easy',track:'Binary Search',mins:15,fn:'searchInsert',points:40,
 description:'Return the index of target in a sorted array of distinct integers; otherwise return the index where it should be inserted in sorted order.',example:'searchInsert([1, 3, 5, 6], 2) → 1',starter:'function searchInsert(nums, target) {\n  \n}',
 solution:'function searchInsert(nums, target) {\n  let lo = 0, hi = nums.length;\n  while (lo < hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (nums[mid] < target) lo = mid + 1;\n    else hi = mid;\n  }\n  return lo;\n}',hints:['Use binary search, but return the left insertion boundary.','Use a half-open [lo, hi) interval.'],complexity:'Time O(log n) · Space O(1)',tests:[{args:[[1,3,5,6],5],expected:2},{args:[[1,3,5,6],2],expected:1},{args:[[1,3,5,6],7],expected:4},{args:[[],2],expected:0,hidden:true}]
},
{
 id:'coin-change',title:'Coin Change',level:'Medium',track:'DP',mins:35,fn:'coinChange',points:80,
 description:'Given positive integer coin denominations and an amount, return the fewest coins needed to make exactly that amount. Return -1 if impossible. Coins may be reused.',example:'coinChange([1, 2, 5], 11) → 3',starter:'function coinChange(coins, amount) {\n  \n}',
 solution:'function coinChange(coins, amount) {\n  const dp = Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (a >= coin) dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',hints:['Build answers from amount zero upward.','dp[a] = min(1 + dp[a - coin]) over valid coins.'],complexity:'Time O(amount × coins) · Space O(amount)',tests:[{args:[[1,2,5],11],expected:3},{args:[[2],3],expected:-1},{args:[[1],0],expected:0},{args:[[1,3,4],6],expected:2,hidden:true}]
},
{
 id:'first-unique',title:'First Unique Character',level:'Easy',track:'Arrays',mins:15,fn:'firstUniqChar',points:40,
 description:'Find the index of the first non-repeating character in a lowercase string, or -1 if none exists.',example:'firstUniqChar("leetcode") → 0',starter:'function firstUniqChar(s) {\n  \n}',
 solution:'function firstUniqChar(s) {\n  const counts = new Map();\n  for (const c of s) counts.set(c, (counts.get(c) || 0) + 1);\n  for (let i = 0; i < s.length; i++) if (counts.get(s[i]) === 1) return i;\n  return -1;\n}',hints:['Count the frequency of each character first.','Then scan from left to right for the first character with frequency 1.'],complexity:'Time O(n) · Space O(1) for fixed alphabet',tests:[{args:['leetcode'],expected:0},{args:['loveleetcode'],expected:2},{args:['aabb'],expected:-1},{args:['z'],expected:0,hidden:true}]
},
{
 id:'flood-fill',title:'Flood Fill',level:'Medium',track:'Graphs',mins:30,fn:'floodFill',points:75,
 description:'Given a 2D integer image, a start coordinate (sr, sc), and a new color, return a new image with the start pixel and all 4-directionally connected same-color pixels recolored.',example:'floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2) → [[2,2,2],[2,2,0],[2,0,1]]',starter:'function floodFill(image, sr, sc, color) {\n  \n}',
 solution:'function floodFill(image, sr, sc, color) {\n  const out = image.map(row => [...row]);\n  const original = out[sr][sc];\n  if (original === color) return out;\n  const stack = [[sr, sc]];\n  while (stack.length) {\n    const [r, c] = stack.pop();\n    if (r < 0 || c < 0 || r >= out.length || c >= out[0].length || out[r][c] !== original) continue;\n    out[r][c] = color;\n    stack.push([r+1,c],[r-1,c],[r,c+1],[r,c-1]);\n  }\n  return out;\n}',hints:['Treat every pixel as a node in a grid graph.','Use DFS or BFS, checking four neighboring positions.'],complexity:'Time O(rows × cols) · Space O(rows × cols)',tests:[{args:[[[1,1,1],[1,1,0],[1,0,1]],1,1,2],expected:[[2,2,2],[2,2,0],[2,0,1]]},{args:[[[0,0,0],[0,0,0]],0,0,0],expected:[[0,0,0],[0,0,0]]},{args:[[[1,0],[0,1]],0,0,3],expected:[[3,0],[0,1]],hidden:true}]
},
{
 id:'merge-intervals',title:'Merge Intervals',level:'Medium',track:'Arrays',mins:30,fn:'merge',points:70,
 description:'Given an array of [start, end] intervals, merge all overlapping intervals and return the non-overlapping intervals in ascending order.',example:'merge([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]',starter:'function merge(intervals) {\n  \n}',
 solution:'function merge(intervals) {\n  if (!intervals.length) return [];\n  const sorted = intervals.map(i => [...i]).sort((a,b) => a[0]-b[0]);\n  const out = [sorted[0]];\n  for (let i = 1; i < sorted.length; i++) {\n    const last = out[out.length-1];\n    if (sorted[i][0] <= last[1]) last[1] = Math.max(last[1], sorted[i][1]);\n    else out.push(sorted[i]);\n  }\n  return out;\n}',hints:['Sort by the beginning of each interval.','Compare each interval with the last merged one.'],complexity:'Time O(n log n) · Space O(n)',tests:[{args:[[[1,3],[2,6],[8,10],[15,18]]],expected:[[1,6],[8,10],[15,18]]},{args:[[[1,4],[4,5]]],expected:[[1,5]]},{args:[[]],expected:[]},{args:[[[8,10],[1,2],[2,5]]],expected:[[1,5],[8,10]],hidden:true}]
},
{
 id:'num-islands',title:'Number of Islands',level:'Medium',track:'Graphs',mins:35,fn:'numIslands',points:80,
 description:'Given a rectangular grid of "1" (land) and "0" (water), count the number of connected islands. Cells connect horizontally or vertically.',example:'numIslands([["1","1","0"],["0","1","0"],["0","0","1"]]) → 2',starter:'function numIslands(grid) {\n  \n}',
 solution:'function numIslands(grid) {\n  if (!grid.length) return 0;\n  const seen = new Set();\n  let count = 0;\n  for (let r=0; r<grid.length; r++) for (let c=0; c<grid[0].length; c++) {\n    const id = r+","+c;\n    if (grid[r][c] !== "1" || seen.has(id)) continue;\n    count++;\n    const stack = [[r,c]];\n    while (stack.length) {\n      const [x,y] = stack.pop(), key = x+","+y;\n      if (x<0 || y<0 || x>=grid.length || y>=grid[0].length || grid[x][y]!=="1" || seen.has(key)) continue;\n      seen.add(key);\n      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);\n    }\n  }\n  return count;\n}',hints:['Count connected components, not individual land cells.','Perform flood fill from each unvisited land cell.'],complexity:'Time O(rows × cols) · Space O(rows × cols)',tests:[{args:[[ ['1','1','0'],['0','1','0'],['0','0','1'] ]],expected:2},{args:[[ ['1','0'],['0','1'] ]],expected:2},{args:[[ ['0','0'],['0','0'] ]],expected:0},{args:[[]],expected:0,hidden:true}]
},
];

export const INTERVIEW = [
 {id:'b1',kind:'Behavioral',time:120,question:'Tell me about a time you debugged a difficult production issue.',context:'Use your SAP support and network troubleshooting experience. Show how you narrowed down root cause using logs or reproducible steps.',points:['Situation: explain the user impact and urgency.','Task: clarify your responsibility and priority.','Action: describe the exact diagnostics you performed and trade-offs.','Result: use a verifiable outcome, then share what you learned.'],keywords:['situation','action','result','learned']},
 {id:'b2',kind:'Behavioral',time:120,question:'Why are you moving from technical support to SDE-1?',context:'Make the transition credible: troubleshooting is already engineering thinking, and you want to own design, code, tests and releases.',points:['Highlight debugging and systems exposure.','Give evidence of actual code you built.','Explain why software ownership motivates you.','Avoid dismissing support as lesser work.'],keywords:['support','code','build','engineering']},
 {id:'b3',kind:'Behavioral',time:120,question:'Tell me about a disagreement with a teammate and how you resolved it.',context:'Choose a real example where you listened, aligned on facts and agreed on a plan.',points:['Set context without blaming anyone.','Explain competing goals.','Describe your communication and decision.','Share outcome and reflection.'],keywords:['team','listen','agreed','result']},
 {id:'b4',kind:'Behavioral',time:120,question:'Describe a time you had to learn a new technology quickly.',context:'Think about unfamiliar SAP workflows, networking, scripting or troubleshooting tools.',points:['Define the short timeline and objective.','Show your learning approach and hands-on practice.','Explain how you validated understanding.','Measure improvement if you can support it.'],keywords:['learn','practice','test','result']},
 {id:'b5',kind:'Behavioral',time:120,question:'Explain a mistake you made and what you changed afterward.',context:'Choose a genuine but recoverable mistake, not a disguised strength.',points:['Be accountable without oversharing.','Explain how you identified and fixed it.','Highlight your preventive process.','Describe what improved.'],keywords:['mistake','fixed','changed','learned']},
 {id:'b6',kind:'Behavioral',time:120,question:'Walk me through a project you built end to end.',context:'Discuss a real repository you can demonstrate; describe architecture, testing, trade-offs, obstacles and ownership.',points:['State the user problem and scope.','Explain your tech choices and data flow.','Share one hard bug and how you solved it.','Say what you would improve next.'],keywords:['problem','built','test','improve']},
 {id:'t1',kind:'Technical',time:150,question:'What happens when a user enters a URL in the browser?',context:'This is a great bridge from networking to development.',points:['DNS resolution and TCP/TLS connection.','HTTP request, server routing and response.','HTML parsing, CSS/JS loading and rendering.','Discuss caches and observability.'],keywords:['dns','http','server','render']},
 {id:'t2',kind:'Technical',time:150,question:'Explain the difference between an array, hash map and linked list.',context:'Give lookup, insert and memory trade-offs with example use cases.',points:['Arrays index quickly, middle insert costly.','Hash maps average O(1) lookup, extra memory.','Linked lists offer pointer-based insertion after a node.','Choose a structure based on operation frequency.'],keywords:['array','hash','linked','complexity']},
 {id:'t3',kind:'Technical',time:150,question:'How would you design a simple URL shortener?',context:'Keep this at SDE-1 level: endpoints, storage model, ID generation and collision handling.',points:['POST /links and GET /:code endpoints.','Mapping of code to long URL in persistent storage.','Random/encoded ID generation and uniqueness.','Rate limiting, monitoring, expiration and caching.'],keywords:['api','database','code','cache']},
 {id:'t4',kind:'Technical',time:150,question:'What is the difference between SQL indexes and a cache?',context:'Explain database indexing versus keeping a hot value nearer to the consumer.',points:['B-tree index accelerates query lookups with write/storage cost.','Cache stores previously computed/fetched values.','Address invalidation and staleness.','Describe when each helps.'],keywords:['index','cache','query','performance']},
 {id:'t5',kind:'Technical',time:150,question:'How would you debug a slow REST API endpoint?',context:'Connect your troubleshooting experience to measurable service performance.',points:['Reproduce and record latency distribution.','Identify expensive database calls and external requests.','Use logs, metrics and traces; inspect indexes and queries.','Test improvement, add regression protection.'],keywords:['latency','log','database','test']},
 {id:'t6',kind:'Technical',time:150,question:'Explain the JavaScript event loop and promises.',context:'Interviewers want to see you understand async execution.',points:['Call stack and task/microtask queues.','Promise callbacks are microtasks.','Await suspends the async function, not the whole thread.','Discuss I/O versus CPU-heavy tasks.'],keywords:['stack','promise','microtask','async']},
 {id:'t7',kind:'Technical',time:150,question:'How would you prevent duplicate requests from charging a user twice?',context:'Think about idempotency keys, transactions and retries.',points:['Client creates an idempotency key.','Server atomically associates key with result.','Retry returns same response for same key.','Handle concurrency, TTL and audit logs.'],keywords:['idempotency','retry','database','transaction']},
 {id:'t8',kind:'Technical',time:150,question:'Explain unit tests vs integration tests vs end-to-end tests.',context:'Give an example from a small web application.',points:['Unit tests isolate a function.','Integration tests verify components working together.','E2E tests exercise critical user journeys.','Trade speed, coverage and flakiness.'],keywords:['unit','integration','end','test']},
];

export const WEEKS = [
 {title:'Core patterns',theme:'Arrays, hashing, strings',desc:'Recognize common shapes before memorizing solutions.',focus:['Arrays','Stack'],goals:['Hash maps','Sets and frequency counts','Two Sum explanation','Stack mechanics','Complexity analysis']},
 {title:'Pointer mastery',theme:'Two pointers, sorting, intervals',desc:'Build reliable O(n) scans and communicate invariants.',focus:['Two Pointers','Arrays'],goals:['Two-pointer invariant','Sorting basics','Merge intervals','Two-pass technique','Boundary cases']},
 {title:'Search & windows',theme:'Binary search and sliding window',desc:'Get comfortable with boundaries, windows and off-by-one errors.',focus:['Binary Search','Sliding Window'],goals:['Binary search variants','Off-by-one boundaries','Variable window','Fixed window','Reason about complexity']},
 {title:'Recursion & graphs',theme:'Grid traversal and search',desc:'Move from loops to graph traversal and state tracking.',focus:['Graphs'],goals:['DFS','BFS','Visited sets','Grid boundaries','Iterative traversals']},
 {title:'Dynamic thinking',theme:'Dynamic programming and trade-offs',desc:'Learn to define subproblems and choose a recurrence.',focus:['DP'],goals:['Climbing stairs','Kadane’s algorithm','Coin change','Memoization','Time-space trade-offs']},
 {title:'Interview simulation',theme:'Mock interviews and applications',desc:'Practice explaining code as clearly as you can write it.',focus:['Arrays','Graphs','DP'],goals:['Timed coding mock','System design fundamentals','STAR stories','Portfolio walkthrough','Apply with evidence']},
];

export const STATUS_OPTIONS = ['Saved','Applied','Screening','Technical','Final round','Offer','Rejected'];

export const SEED_JOB_TIPS = [
 'Use your debugging experience as an advantage: show how logs, traces and measurable fixes translate into software engineering.',
 'Keep two stories ready: a production issue you solved and a small application you built and tested yourself.',
 'For every DSA answer, say brute force, optimized approach, Big-O complexity and two edge cases out loud.',
 'For SDE-1 work, explain API request/response flow, simple database choices, testing strategy and failure modes.',
];
