require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const connectDB = require("./db");
const User = require("./user.js");

console.log("Loaded updated server.js");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


const upload = multer();
app.post("/api/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = new User({ email, password });
        await newUser.save();

        res.json({
            success: true,
            message: "Signup successful"
        });
    } catch (error) {
        console.log("Signup error:", error.message);
        res.json({
            success: false,
            message: "Signup failed"
        });
    }
});


const dashboardData = {
    totalInterviews: 0,
    averageScore: 0,
    skillsMastered: 0,
    nextGoal: 10,
    totalPoints: 0,
    dayStreak: 0,
    totalChallenges: 0,
    badgesEarned: 0
};

const challenges = [
    {
        id: 1,
        title: "Array Basics",
        description: "Solve 5 array questions today",
        points: 10,
        completed: false
    },
    {
        id: 2,
        title: "HR Practice",
        description: "Answer 3 HR interview questions",
        points: 15,
        completed: false
    },
    {
        id: 3,
        title: "Resume Improvement",
        description: "Add 2 strong project points to your resume",
        points: 20,
        completed: false
    }
];

const leaderboard = [
    { id: 1, name: "Aryan Rajak", points: 0, rank: 1 },
    { id: 2, name: "Priya Sharma", points: 95, rank: 2 },
    { id: 3, name: "Rohit Verma", points: 80, rank: 3 },
    { id: 4, name: "Sneha Patel", points: 70, rank: 4 }
];

const interviewQuestions = [
    "Tell me about yourself.",
    "Why do you want to join this company?",
    "What are your strengths and weaknesses?",
    "Describe a project you are proud of.",
    "Where do you see yourself in the next 5 years?"
];

const interviewVault = [];

const codingQuestions = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        topic: "Arrays",
        link: "https://leetcode.com/problems/two-sum/"
    },
    {
        id: 2,
        title: "Valid Parentheses",
        difficulty: "Easy",
        topic: "Stack",
        link: "https://leetcode.com/problems/valid-parentheses/"
    },
    {
        id: 3,
        title: "Merge Two Sorted Lists",
        difficulty: "Easy",
        topic: "Linked List",
        link: "https://leetcode.com/problems/merge-two-sorted-lists/"
    },
    {
        id: 4,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        topic: "Arrays",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"
    },
    {
        id: 5,
        title: "Maximum Subarray",
        difficulty: "Easy",
        topic: "Dynamic Programming",
        link: "https://leetcode.com/problems/maximum-subarray/"
    },
    {
        id: 6,
        title: "Contains Duplicate",
        difficulty: "Easy",
        topic: "Hashing",
        link: "https://leetcode.com/problems/contains-duplicate/"
    },
    {
        id: 7,
        title: "Invert Binary Tree",
        difficulty: "Easy",
        topic: "Trees",
        link: "https://leetcode.com/problems/invert-binary-tree/"
    },
    {
        id: 8,
        title: "Valid Anagram",
        difficulty: "Easy",
        topic: "Strings",
        link: "https://leetcode.com/problems/valid-anagram/"
    },
    {
        id: 9,
        title: "Binary Search",
        difficulty: "Easy",
        topic: "Searching",
        link: "https://leetcode.com/problems/binary-search/"
    },
    {
        id: 10,
        title: "Climbing Stairs",
        difficulty: "Easy",
        topic: "Dynamic Programming",
        link: "https://leetcode.com/problems/climbing-stairs/"
    },
    {
        id: 11,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        topic: "Sliding Window",
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/"
    },
    {
        id: 12,
        title: "3Sum",
        difficulty: "Medium",
        topic: "Two Pointers",
        link: "https://leetcode.com/problems/3sum/"
    },
    {
        id: 13,
        title: "Container With Most Water",
        difficulty: "Medium",
        topic: "Two Pointers",
        link: "https://leetcode.com/problems/container-with-most-water/"
    },
    {
        id: 14,
        title: "Group Anagrams",
        difficulty: "Medium",
        topic: "Hashing",
        link: "https://leetcode.com/problems/group-anagrams/"
    },
    {
        id: 15,
        title: "Top K Frequent Elements",
        difficulty: "Medium",
        topic: "Heap",
        link: "https://leetcode.com/problems/top-k-frequent-elements/"
    },
    {
        id: 16,
        title: "Product of Array Except Self",
        difficulty: "Medium",
        topic: "Arrays",
        link: "https://leetcode.com/problems/product-of-array-except-self/"
    },
    {
        id: 17,
        title: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        topic: "Binary Search",
        link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
    },
    {
        id: 18,
        title: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        topic: "Binary Search",
        link: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
    },
    {
        id: 19,
        title: "Longest Consecutive Sequence",
        difficulty: "Medium",
        topic: "Hashing",
        link: "https://leetcode.com/problems/longest-consecutive-sequence/"
    },
    {
        id: 20,
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        topic: "Trees",
        link: "https://leetcode.com/problems/binary-tree-level-order-traversal/"
    },
    {
        id: 21,
        title: "Validate Binary Search Tree",
        difficulty: "Medium",
        topic: "Trees",
        link: "https://leetcode.com/problems/validate-binary-search-tree/"
    },
    {
        id: 22,
        title: "Kth Smallest Element in a BST",
        difficulty: "Medium",
        topic: "Trees",
        link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/"
    },
    {
        id: 23,
        title: "Number of Islands",
        difficulty: "Medium",
        topic: "Graphs",
        link: "https://leetcode.com/problems/number-of-islands/"
    },
    {
        id: 24,
        title: "Course Schedule",
        difficulty: "Medium",
        topic: "Graphs",
        link: "https://leetcode.com/problems/course-schedule/"
    },
    {
        id: 25,
        title: "Coin Change",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        link: "https://leetcode.com/problems/coin-change/"
    },
    {
        id: 26,
        title: "Longest Increasing Subsequence",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        link: "https://leetcode.com/problems/longest-increasing-subsequence/"
    },
    {
        id: 27,
        title: "Word Break",
        difficulty: "Medium",
        topic: "Dynamic Programming",
        link: "https://leetcode.com/problems/word-break/"
    },
    {
        id: 28,
        title: "Combination Sum",
        difficulty: "Medium",
        topic: "Backtracking",
        link: "https://leetcode.com/problems/combination-sum/"
    },
    {
        id: 29,
        title: "Permutations",
        difficulty: "Medium",
        topic: "Backtracking",
        link: "https://leetcode.com/problems/permutations/"
    },
    {
        id: 30,
        title: "Merge Intervals",
        difficulty: "Medium",
        topic: "Intervals",
        link: "https://leetcode.com/problems/merge-intervals/"
    },
    {
        id: 31,
        title: "Word Ladder",
        difficulty: "Hard",
        topic: "Graphs",
        link: "https://leetcode.com/problems/word-ladder/"
    },
    {
        id: 32,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        topic: "Binary Search",
        link: "https://leetcode.com/problems/median-of-two-sorted-arrays/"
    },
    {
        id: 33,
        title: "Trapping Rain Water",
        difficulty: "Hard",
        topic: "Two Pointers",
        link: "https://leetcode.com/problems/trapping-rain-water/"
    },
    {
        id: 34,
        title: "Minimum Window Substring",
        difficulty: "Hard",
        topic: "Sliding Window",
        link: "https://leetcode.com/problems/minimum-window-substring/"
    },
    {
        id: 35,
        title: "Serialize and Deserialize Binary Tree",
        difficulty: "Hard",
        topic: "Trees",
        link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
    }
];

function analyzeResumeText(resumeText) {
    const text = resumeText.toLowerCase();
    let score = 30;

    const strengths = [];
    const improvements = [];
    const missingSections = [];
    const atsTips = [];

    if (text.includes("education")) {
        score += 10;
        strengths.push("Education section detected");
    } else {
        missingSections.push("Add an Education section");
    }

    if (text.includes("skills")) {
        score += 10;
        strengths.push("Skills section detected");
    } else {
        missingSections.push("Add a Skills section");
    }

    if (text.includes("project") || text.includes("projects")) {
        score += 15;
        strengths.push("Projects section detected");
    } else {
        missingSections.push("Add a Projects section");
    }

    if (text.includes("experience")) {
        score += 15;
        strengths.push("Experience section detected");
    } else {
        improvements.push("Add internship, freelance, or practical experience");
    }

    if (resumeText.length > 400) {
        score += 10;
        strengths.push("Resume has good detail and content depth");
    } else {
        improvements.push("Add more specific details, metrics, and achievements");
    }

    if (/@/.test(resumeText)) {
        score += 5;
        strengths.push("Contact email detected");
    } else {
        improvements.push("Add a professional email address");
    }

    if (/\d{10}/.test(resumeText.replace(/\s/g, ""))) {
        score += 5;
        strengths.push("Phone number detected");
    } else {
        improvements.push("Add a contact number");
    }

    if (
        text.includes("developed") ||
        text.includes("built") ||
        text.includes("designed") ||
        text.includes("implemented")
    ) {
        score += 10;
        strengths.push("Strong action verbs detected");
    } else {
        atsTips.push("Use action verbs like Developed, Built, Designed, Implemented");
    }

    if (!text.includes("github") && !text.includes("linkedin")) {
        atsTips.push("Add GitHub or LinkedIn links for stronger profile credibility");
    }

    atsTips.push("Use clear section headings for ATS readability");
    atsTips.push("Mention relevant tools, technologies, and measurable impact");

    if (score > 100) score = 100;

    return {
        score,
        strengths,
        improvements,
        missingSections,
        atsTips
    };
}

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (user) {
            res.json({
                success: true,
                message: "Login successful"
            });
        } else {
            res.json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.log("Login error:", error.message);
        res.json({
            success: false,
            message: "Login failed"
        });
    }
});

app.post("/api/signup", (req, res) => {
    const { email, password } = req.body;

    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
        return res.json({ success: false, message: "User already exists" });
    }

    users.push({ email, password });
    res.json({ success: true, message: "Signup successful" });
});

app.get("/api/dashboard", (req, res) => {
    res.json({
        success: true,
        data: dashboardData
    });
});

app.get("/api/challenges", (req, res) => {
    res.json({
        success: true,
        data: challenges
    });
});

app.post("/api/challenges/complete", (req, res) => {
    const { id } = req.body;

    const challenge = challenges.find((c) => c.id === id);

    if (!challenge) {
        return res.json({ success: false, message: "Challenge not found" });
    }

    if (challenge.completed) {
        return res.json({ success: false, message: "Challenge already completed" });
    }

    challenge.completed = true;
    dashboardData.totalPoints += challenge.points;
    dashboardData.totalChallenges += 1;

    const currentUser = leaderboard.find((user) => user.name === "Aryan Rajak");
    if (currentUser) {
        currentUser.points = dashboardData.totalPoints;
    }

    res.json({
        success: true,
        message: "Challenge completed successfully",
        data: dashboardData
    });
});

app.get("/api/leaderboard", (req, res) => {
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);

    const rankedLeaderboard = sortedLeaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
    }));

    res.json({
        success: true,
        data: rankedLeaderboard
    });
});

app.post("/api/resume/analyze", (req, res) => {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
        return res.json({
            success: false,
            message: "Resume text is required"
        });
    }

    const result = analyzeResumeText(resumeText);

    res.json({
        success: true,
        data: result
    });
});

app.post("/api/resume/analyze-file", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                success: false,
                message: "Resume file is required"
            });
        }

        console.log("Uploaded file name:", req.file.originalname);
        console.log("Uploaded file type:", req.file.mimetype);

        if (req.file.mimetype !== "application/pdf" && req.file.mimetype !== "text/plain") {
            return res.json({
                success: false,
                message: "Only PDF and TXT files are supported right now"
            });
        }

        let extractedText = "";

        if (req.file.mimetype === "application/pdf") {
            const pdfData = await pdfParse(req.file.buffer);
            extractedText = pdfData.text;
        } else {
            extractedText = req.file.buffer.toString("utf-8");
        }

        if (!extractedText || !extractedText.trim()) {
            return res.json({
                success: false,
                message: "Could not extract text from file"
            });
        }

        const result = analyzeResumeText(extractedText);

        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log("Resume file analyze error:", error);

        return res.json({
            success: false,
            message: error.message || "Error analyzing resume file"
        });
    }
});

app.get("/api/interview/start", (req, res) => {
    res.json({
        success: true,
        data: {
            questions: interviewQuestions
        }
    });
});

app.post("/api/interview/submit", (req, res) => {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.json({
            success: false,
            message: "Answers are required"
        });
    }

    let score = 50;
    const feedback = [];

    answers.forEach((answer, index) => {
        if (answer.trim().length > 80) {
            score += 10;
            feedback.push(`Answer ${index + 1}: Good detail and explanation.`);
        } else {
            feedback.push(`Answer ${index + 1}: Try to explain with more depth and examples.`);
        }
    });

    if (score > 100) score = 100;

    dashboardData.totalInterviews += 1;
    dashboardData.averageScore = score;

    const interviewRecord = {
        id: interviewVault.length + 1,
        score,
        feedback,
        date: new Date().toLocaleString()
    };

    interviewVault.push(interviewRecord);

    res.json({
        success: true,
        data: {
            score,
            feedback
        }
    });
});

app.get("/api/interview-vault", (req, res) => {
    res.json({
        success: true,
        data: interviewVault
    });
});

app.get("/api/coding-questions", (req, res) => {
    res.json({
        success: true,
        data: codingQuestions
    });
});

app.get("/api/analytics", (req, res) => {
    let performanceLevel = "Beginner";

    if (dashboardData.totalPoints >= 100 && dashboardData.averageScore >= 70) {
        performanceLevel = "Intermediate";
    }

    if (dashboardData.totalPoints >= 200 && dashboardData.averageScore >= 85) {
        performanceLevel = "Advanced";
    }

    const recommendations = [];

    if (dashboardData.totalInterviews < 3) {
        recommendations.push("Practice more mock interviews to improve confidence.");
    }

    if (dashboardData.totalChallenges < 5) {
        recommendations.push("Complete more coding challenges to build consistency.");
    }

    if (dashboardData.averageScore < 60) {
        recommendations.push("Focus on improving answer depth and communication quality.");
    }

    if (dashboardData.totalPoints === 0) {
        recommendations.push("Start with daily challenges to earn points and build momentum.");
    }

    if (recommendations.length === 0) {
        recommendations.push("You are doing well. Keep practicing regularly to maintain your growth.");
    }

    res.json({
        success: true,
        data: {
            totalInterviews: dashboardData.totalInterviews,
            averageScore: dashboardData.averageScore,
            totalPoints: dashboardData.totalPoints,
            totalChallenges: dashboardData.totalChallenges,
            dayStreak: dashboardData.dayStreak,
            performanceLevel,
            recommendations
        }
    });
});
app.post("/api/career-coach", (req, res) => {
    const { role, background } = req.body;

    if (!role || !background) {
        return res.json({
            success: false,
            message: "Role and background are required"
        });
    }

    const roadmap = [];
    const tips = [];

    if (role === "Frontend Developer") {
        roadmap.push("Strengthen HTML, CSS, JavaScript, and React fundamentals.");
        roadmap.push("Build 3 polished frontend projects with responsive design.");
        roadmap.push("Practice API integration and state management.");
        roadmap.push("Prepare for frontend interview questions and coding rounds.");
    } else if (role === "Backend Developer") {
        roadmap.push("Learn Node.js, Express, APIs, authentication, and databases.");
        roadmap.push("Build backend projects with CRUD and login functionality.");
        roadmap.push("Understand REST APIs, middleware, and deployment.");
        roadmap.push("Practice DSA and backend interview questions.");
    } else if (role === "Full Stack Developer") {
        roadmap.push("Combine frontend and backend project development.");
        roadmap.push("Master React, Node.js, Express, and database integration.");
        roadmap.push("Build full-stack projects with auth and deployment.");
        roadmap.push("Prepare for system design basics and coding interviews.");
    } else if (role === "Data Analyst") {
        roadmap.push("Learn Excel, SQL, Python, and data visualization.");
        roadmap.push("Build projects using datasets and dashboards.");
        roadmap.push("Practice data cleaning, analysis, and communication.");
        roadmap.push("Prepare for analytics case studies and SQL rounds.");
    } else if (role === "Machine Learning Engineer") {
        roadmap.push("Strengthen Python, statistics, machine learning, and data preprocessing.");
        roadmap.push("Build ML projects with model training and evaluation.");
        roadmap.push("Learn deployment basics and model explainability.");
        roadmap.push("Practice ML theory, coding, and project explanation.");
    } else {
        roadmap.push("Build strong DSA fundamentals.");
        roadmap.push("Create strong technical projects.");
        roadmap.push("Prepare resume, coding rounds, and mock interviews.");
        roadmap.push("Practice communication and problem solving regularly.");
    }

    tips.push("Keep your resume aligned with your target role.");
    tips.push("Practice consistently instead of studying randomly.");
    tips.push("Track progress with coding, interviews, and projects.");
    tips.push("Focus on both technical skills and communication.");

    res.json({
        success: true,
        data: {
            role,
            roadmap,
            tips
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
