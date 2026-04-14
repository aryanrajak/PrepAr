const toggle = document.getElementById("theme-toggle");
const icon = document.querySelector(".theme-icon");
const API_BASE_URL = "https://prepar.onrender.com";

if (toggle && icon) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        icon.textContent = "☀️";
    } else {
        icon.textContent = "🌙";
    }

    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        icon.textContent = isLight ? "☀️" : "🌙";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
}

const title = document.querySelector(".section-title");

function revealTitle() {
    if (!title) return;

    const windowHeight = window.innerHeight;
    const elementTop = title.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100 && elementTop > 0) {
        title.classList.add("show");
    } else {
        title.classList.remove("show");
    }
}

window.addEventListener("scroll", revealTitle);
window.addEventListener("load", revealTitle);

const faqItems = document.querySelectorAll(".faq-item");

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                faqItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
            }
        });
    });
}

let isLogin = true;

function toggleForm() {
    isLogin = !isLogin;

    document.getElementById("form-title").innerText = isLogin ? "Login" : "Sign Up";
    document.getElementById("auth-btn").innerText = isLogin ? "Login" : "Sign Up";

    document.querySelector(".switch").innerHTML = isLogin
        ? `New user? <span onclick="toggleForm()">Sign Up</span>`
        : `Already user? <span onclick="toggleForm()">Login</span>`;
}

async function handleAuth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const result = document.getElementById("result");

    if (!email || !password) {
        result.innerText = "Please fill all fields";
        return;
    }

    const url = isLogin
        ? `${API_BASE_URL}/api/login`
        : `${API_BASE_URL}/api/signup`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        result.innerText = data.message;

        if (data.success) {
            localStorage.setItem("user", email);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        }
    } catch (error) {
        result.innerText = "Server error. Please try again.";
    }
}

function updateNavbarAuthButton() {
    const navBtn = document.getElementById("nav-auth-btn");
    if (!navBtn) return;

    const user = localStorage.getItem("user");

    if (user) {
        navBtn.innerText = "Dashboard";
    } else {
        navBtn.innerText = "Sign In";
    }
}

function handleNavAuth() {
    const user = localStorage.getItem("user");

    if (user) {
        window.location.href = "dashboard.html";
    } else {
        window.location.href = "login.html";
    }
}

function loadDashboardUser() {
    const welcomeText = document.getElementById("welcome-text");
    if (!welcomeText) return;

    const user = localStorage.getItem("user");

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    welcomeText.innerText = `Welcome, ${user}`;
}

function logoutUser() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
async function loadDashboardStats() {
    const totalInterviews = document.getElementById("total-interviews");
    if (!totalInterviews) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/dashboard`);
        const data = await res.json();

        if (!data.success) return;

        const stats = data.data;

        document.getElementById("total-interviews").innerText = stats.totalInterviews;
        document.getElementById("average-score").innerText = stats.averageScore + "%";
        document.getElementById("skills-mastered").innerText = stats.skillsMastered;
        document.getElementById("next-goal").innerText = stats.nextGoal + "%";
        document.getElementById("total-points").innerText = stats.totalPoints;
        document.getElementById("day-streak").innerText = stats.dayStreak;
        document.getElementById("total-challenges").innerText = stats.totalChallenges;
        document.getElementById("badges-earned").innerText = stats.badgesEarned;
    } catch (error) {
        console.log("Dashboard stats load failed");
    }
}
async function loadChallenges() {
    const challengeList = document.getElementById("challenge-list");
    if (!challengeList) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/challenges`);
        const data = await res.json();

        if (!data.success) {
            challengeList.innerHTML = "<p>Failed to load challenges.</p>";
            return;
        }

        challengeList.innerHTML = "";

        data.data.forEach((challenge) => {
            const card = document.createElement("div");
            card.className = "tool-card";

            card.innerHTML = `
                <h3>${challenge.title}</h3>
                <p>${challenge.description}</p>
                <button onclick="completeChallenge(${challenge.id})" ${challenge.completed ? "disabled" : ""}>
                    ${challenge.completed ? "Completed" : "Complete Challenge"}
                </button>
            `;

            challengeList.appendChild(card);
        });
    } catch (error) {
        challengeList.innerHTML = "<p>Server error while loading challenges.</p>";
    }
}
async function completeChallenge(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/challenges/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
        });

        const data = await res.json();

        alert(data.message);
if (data.success) {
    loadDashboardStats();
    loadChallenges();
    loadLeaderboard();
    loadAnalytics();
}

    } catch (error) {
        alert("Failed to complete challenge");
    }
}
function showSection(sectionName, clickedTab) {
    const sections = document.querySelectorAll(".dashboard-section");
    const tabs = document.querySelectorAll(".tab");

    sections.forEach((section) => {
        section.classList.remove("active-section");
    });

    tabs.forEach((tab) => {
        tab.classList.remove("active");
    });

    const targetSection = document.getElementById(sectionName + "-section");
    if (targetSection) {
        targetSection.classList.add("active-section");
    }

    if (clickedTab) {
        clickedTab.classList.add("active");
    }
}

function showSectionByName(sectionName) {
    const matchingTab = document.querySelector(`.tab[data-section="${sectionName}"]`);
    showSection(sectionName, matchingTab);
}
function goToDashboard() {
    const loader = document.getElementById("page-loader");
    const user = localStorage.getItem("user");

    if (loader) {
        loader.classList.add("show");
    }

    setTimeout(() => {
        if (user) {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "login.html";
        }
    }, 1000);
}
function openDemoModal() {
    const modal = document.getElementById("demo-modal");
    if (modal) {
        modal.classList.add("show");
    }
}

function closeDemoModal() {
    const modal = document.getElementById("demo-modal");
    if (modal) {
        modal.classList.remove("show");
    }
}
async function loadLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    if (!leaderboardList) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/leaderboard`);
        const data = await res.json();

        if (!data.success) {
            leaderboardList.innerHTML = "<p>Failed to load leaderboard.</p>";
            return;
        }

        leaderboardList.innerHTML = "";

        data.data.forEach((user) => {
            const card = document.createElement("div");
            card.className = "leaderboard-card";

            card.innerHTML = `
                <div>
                    <h3>#${user.rank} ${user.name}</h3>
                    <p>Performance Rank</p>
                </div>
                <div class="leaderboard-points">${user.points} pts</div>
            `;

            leaderboardList.appendChild(card);
        });
    } catch (error) {
        leaderboardList.innerHTML = "<p>Server error while loading leaderboard.</p>";
    }
}
async function analyzeResume() {
    const resumeText = document.getElementById("resume-text");
    const resumeFile = document.getElementById("resume-file");
    const resultBox = document.getElementById("resume-result");

    if (!resultBox) return;

    const typedText = resumeText ? resumeText.value.trim() : "";
    const file = resumeFile && resumeFile.files.length > 0 ? resumeFile.files[0] : null;

    resultBox.innerHTML = "<p>Analyzing resume...</p>";

    try {
        let res;

        if (file) {
            const formData = new FormData();
            formData.append("resume", file);

            res = await fetch(`${API_BASE_URL}/api/resume/analyze-file`, {
                method: "POST",
                body: formData
            });
        } else if (typedText) {
            res = await fetch(`${API_BASE_URL}/api/resume/analyze`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ resumeText: typedText })
            });
        } else {
            resultBox.innerHTML = "<p>Please paste your resume or upload a PDF first.</p>";
            return;
        }

        const data = await res.json();

        if (!data.success) {
            resultBox.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        const { score, strengths, improvements, missingSections, atsTips } = data.data;

        resultBox.innerHTML = `
            <div class="resume-report">
                <div class="resume-score-card">
                    <span>Resume Score</span>
                    <h3>${score}/100</h3>
                </div>

                <div class="resume-report-grid">
                    <div class="resume-report-card">
                        <h3>Strengths</h3>
                        <ul>
                            ${strengths.length ? strengths.map(item => `<li>${item}</li>`).join("") : "<li>No major strengths detected yet</li>"}
                        </ul>
                    </div>

                    <div class="resume-report-card">
                        <h3>Improvements</h3>
                        <ul>
                            ${improvements.length ? improvements.map(item => `<li>${item}</li>`).join("") : "<li>No major improvements suggested</li>"}
                        </ul>
                    </div>

                    <div class="resume-report-card">
                        <h3>Missing Sections</h3>
                        <ul>
                            ${missingSections.length ? missingSections.map(item => `<li>${item}</li>`).join("") : "<li>No important sections missing</li>"}
                        </ul>
                    </div>

                    <div class="resume-report-card">
                        <h3>ATS Tips</h3>
                        <ul>
                            ${atsTips.length ? atsTips.map(item => `<li>${item}</li>`).join("") : "<li>Your resume looks ATS-friendly</li>"}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.log(error);

        resultBox.innerHTML = "<p>Server error while analyzing resume.</p>";
    }
}
async function startInterview() {
    const questionBox = document.getElementById("mock-question");
    const answerBox = document.getElementById("mock-answer");
    const resultBox = document.getElementById("mock-result");

    if (!questionBox || !answerBox || !resultBox) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/interview/start`);
        const data = await res.json();

        if (!data.success) {
            resultBox.innerHTML = "<p>Failed to start interview.</p>";
            return;
        }

        interviewQuestions = data.data.questions;
        currentQuestionIndex = 0;
        interviewAnswers = [];

        questionBox.innerText = interviewQuestions[currentQuestionIndex];
        answerBox.value = "";
        resultBox.innerHTML = "<p>Interview started. Answer the question and submit.</p>";
    } catch (error) {
        resultBox.innerHTML = "<p>Server error while starting interview.</p>";
    }
    resultBox.innerHTML = "<p>Interview started. Answer the question and submit.</p>";

}
async function submitAnswer() {
    const questionBox = document.getElementById("mock-question");
    const answerBox = document.getElementById("mock-answer");
    const resultBox = document.getElementById("mock-result");

    if (!questionBox || !answerBox || !resultBox) return;

    const answer = answerBox.value.trim();

    if (!answer) {
        resultBox.innerHTML = "<p>Please write an answer first.</p>";
        return;
    }

    interviewAnswers.push(answer);
    answerBox.value = "";

    currentQuestionIndex++;

    if (currentQuestionIndex < interviewQuestions.length) {
    questionBox.innerText = interviewQuestions[currentQuestionIndex];
    resultBox.innerHTML = `<p>Answer saved. Moving to question ${currentQuestionIndex + 1}.</p>`;

    const submitBtn = document.getElementById("submit-answer-btn");
    if (submitBtn) {
        if (currentQuestionIndex === interviewQuestions.length - 1) {
            submitBtn.innerText = "Finish Interview";
        } else {
            submitBtn.innerText = "Submit Answer";
        }
    }
}

     else {
        try {
            const res = await fetch(`${API_BASE_URL}/api/interview/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ answers: interviewAnswers })
            });

            const data = await res.json();

            if (!data.success) {
                resultBox.innerHTML = `<p>${data.message}</p>`;
                return;
            }

            const { score, feedback } = data.data;

            resultBox.innerHTML = `
                <div class="resume-report">
                    <div class="resume-score-card">
                        <span>Interview Score</span>
                        <h3>${score}/100</h3>
                    </div>

                    <div class="resume-report-card">
                        <h3>Interview Feedback</h3>
                        <ul>
                            ${feedback.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            `;

           questionBox.innerText = "Interview completed successfully.";
loadDashboardStats();
loadAnalytics();
loadInterviewVault();

            const submitBtn = document.getElementById("submit-answer-btn");
if (submitBtn) {
    submitBtn.innerText = "Submit Answer";
}

            loadDashboardStats();
        } catch (error) {
            resultBox.innerHTML = "<p>Server error while submitting interview.</p>";
        }
    }
}

async function loadCodingQuestions() {
    const codingList = document.getElementById("coding-list");
    if (!codingList) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/coding-questions`);
        const data = await res.json();

        if (!data.success) {
            codingList.innerHTML = "<p>Failed to load coding questions.</p>";
            return;
        }

        allCodingQuestions = data.data;
        renderCodingQuestions(allCodingQuestions);
    } catch (error) {
        codingList.innerHTML = "<p>Server error while loading coding questions.</p>";
    }
}
function renderCodingQuestions(questions) {
    const codingList = document.getElementById("coding-list");
    if (!codingList) return;

    if (questions.length === 0) {
        codingList.innerHTML = "<p>No coding questions found.</p>";
        return;
    }

    codingList.innerHTML = "";

    questions.forEach((question) => {
        const difficultyClass = question.difficulty.toLowerCase();

        const card = document.createElement("div");
        card.className = "coding-card";

        card.innerHTML = `
            <div class="coding-card-top">
                <h3>${question.title}</h3>
                <span class="difficulty-badge ${difficultyClass}">${question.difficulty}</span>
            </div>
            <p><strong>Topic:</strong> ${question.topic}</p>
            <a href="${question.link}" target="_blank" class="coding-btn">Solve on LeetCode</a>
        `;

        codingList.appendChild(card);
    });
}

function filterCodingQuestions() {
    const searchInput = document.getElementById("coding-search");
    const difficultySelect = document.getElementById("coding-difficulty");

    if (!searchInput || !difficultySelect) return;

    const searchValue = searchInput.value.toLowerCase();
    const difficultyValue = difficultySelect.value;

    const filteredQuestions = allCodingQuestions.filter((question) => {
        const matchesSearch = question.title.toLowerCase().includes(searchValue);
        const matchesDifficulty =
            difficultyValue === "All" || question.difficulty === difficultyValue;

        return matchesSearch && matchesDifficulty;
    });

    renderCodingQuestions(filteredQuestions);
}
async function loadAnalytics() {
    const analyticsBox = document.getElementById("analytics-box");
    if (!analyticsBox) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/analytics`);
        const data = await res.json();

        if (!data.success) {
            analyticsBox.innerHTML = "<p>Failed to load analytics.</p>";
            return;
        }

        const analytics = data.data;

        analyticsBox.innerHTML = `
            <div class="analytics-card">
                <h3>Performance Level</h3>
                <p class="analytics-highlight">${analytics.performanceLevel}</p>
            </div>

            <div class="analytics-card">
                <h3>Total Interviews</h3>
                <p class="analytics-highlight">${analytics.totalInterviews}</p>
            </div>

            <div class="analytics-card">
                <h3>Average Score</h3>
                <p class="analytics-highlight">${analytics.averageScore}%</p>
            </div>

            <div class="analytics-card">
                <h3>Total Points</h3>
                <p class="analytics-highlight">${analytics.totalPoints}</p>
            </div>

            <div class="analytics-card">
                <h3>Total Challenges</h3>
                <p class="analytics-highlight">${analytics.totalChallenges}</p>
            </div>

            <div class="analytics-card">
                <h3>Day Streak</h3>
                <p class="analytics-highlight">${analytics.dayStreak}</p>
            </div>

            <div class="analytics-card full-width">
                <h3>Recommendations</h3>
                <ul>
                    ${analytics.recommendations.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
        `;
    } catch (error) {
        analyticsBox.innerHTML = "<p>Server error while loading analytics.</p>";
    }
}
const submitBtn = document.getElementById("submit-answer-btn");
if (submitBtn) {
    submitBtn.innerText = "Submit Answer";
}
async function loadInterviewVault() {
    const vaultList = document.getElementById("vault-list");
    if (!vaultList) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/interview-vault`);
        const data = await res.json();

        if (!data.success) {
            vaultList.innerHTML = "<p>Failed to load interview vault.</p>";
            return;
        }

        if (data.data.length === 0) {
            vaultList.innerHTML = "<p>No interview records yet.</p>";
            return;
        }

        vaultList.innerHTML = "";

        data.data.forEach((record) => {
            const card = document.createElement("div");
            card.className = "vault-card";

            card.innerHTML = `
                <h3>Interview Attempt #${record.id}</h3>
                <p><strong>Score:</strong> ${record.score}/100</p>
                <p><strong>Date:</strong> ${record.date}</p>
                <div class="vault-feedback">
                    <h4>Feedback</h4>
                    <ul>
                        ${record.feedback.map(item => `<li>${item}</li>`).join("")}
                    </ul>
                </div>
            `;

            vaultList.appendChild(card);
        });
    } catch (error) {
        vaultList.innerHTML = "<p>Server error while loading interview vault.</p>";
    }
}
async function getCareerAdvice() {
    const role = document.getElementById("career-role");
    const background = document.getElementById("career-input");
    const resultBox = document.getElementById("career-result");

    if (!role || !background || !resultBox) return;

    if (!role.value || !background.value.trim()) {
        resultBox.innerHTML = "<p>Please select a role and describe your background.</p>";
        return;
    }

    resultBox.innerHTML = "<p>Generating career guidance...</p>";

    try {
        const res = await fetch(`${API_BASE_URL}/api/career-coach`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                role: role.value,
                background: background.value
            })
        });

        const data = await res.json();

        if (!data.success) {
            resultBox.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        const { role: targetRole, roadmap, tips } = data.data;

        resultBox.innerHTML = `
            <div class="career-report">
                <div class="career-head">
                    <h3>Target Role: ${targetRole}</h3>
                </div>

                <div class="resume-report-grid">
                    <div class="resume-report-card">
                        <h3>Roadmap</h3>
                        <ul>
                            ${roadmap.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="resume-report-card">
                        <h3>Career Tips</h3>
                        <ul>
                            ${tips.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        resultBox.innerHTML = "<p>Server error while generating career guidance.</p>";
    }
}
function formatLinesAsList(text) {
    const lines = text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line);

    if (lines.length === 0) {
        return "<li>No content added yet.</li>";
    }

    return lines.map(line => `<li>${line}</li>`).join("");
}

function updateResumePreview() {
    const template = document.getElementById("resume-template");
    const preview = document.getElementById("resume-preview");

    const name = document.getElementById("resume-name")?.value || "";
    const email = document.getElementById("resume-email")?.value || "";
    const phone = document.getElementById("resume-phone")?.value || "";
    const location = document.getElementById("resume-location")?.value || "";
    const linkedin = document.getElementById("resume-linkedin")?.value || "";
    const github = document.getElementById("resume-github")?.value || "";
    const summary = document.getElementById("resume-summary")?.value || "";
    const education = document.getElementById("resume-education")?.value || "";
    const projects = document.getElementById("resume-projects")?.value || "";
    const skills = document.getElementById("resume-skills")?.value || "";
    const experience = document.getElementById("resume-experience")?.value || "";
    const certifications = document.getElementById("resume-certifications")?.value || "";
    const achievements = document.getElementById("resume-achievements")?.value || "";

    document.getElementById("preview-name").innerText = name || "Your Name";
    document.getElementById("preview-contact").innerText =
        `${email || "email@example.com"} | ${phone || "+91 9876543210"} | ${location || "Your City"}`;
    document.getElementById("preview-links").innerText =
        `${linkedin || "linkedin"} | ${github || "github"}`;

    document.getElementById("preview-summary").innerText =
        summary || "Your summary will appear here.";
    document.getElementById("preview-education").innerText =
        education || "Your education details will appear here.";
    document.getElementById("preview-skills").innerText =
        skills || "Your skills will appear here.";
    document.getElementById("preview-experience").innerText =
        experience || "Your experience will appear here.";
    document.getElementById("preview-certifications").innerText =
        certifications || "Your certifications will appear here.";
    document.getElementById("preview-achievements").innerText =
        achievements || "Your achievements will appear here.";

    document.getElementById("preview-projects").innerHTML = formatLinesAsList(projects || "");

    if (preview && template) {
        preview.className = `resume-preview ${template.value}-template`;
    }
}
function downloadResume() {
    const resumePreview = document.getElementById("resume-preview");
    const name = document.getElementById("resume-name")?.value || "resume";

    if (!resumePreview) return;

    const options = {
        margin: 0.3,
        filename: `${name.replace(/\s+/g, "_")}_Resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(resumePreview).save();
}




window.addEventListener("load", () => {
    updateNavbarAuthButton();
    loadDashboardUser();
    loadDashboardStats();
    loadChallenges();
    loadLeaderboard();
    loadCodingQuestions();
    loadAnalytics();
    loadInterviewVault();
    updateResumePreview();


    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");

    if (tab) {
        showSectionByName(tab);
    } else {
        showSectionByName("overview");
    }
});



let interviewQuestions = [];
let currentQuestionIndex = 0;
let interviewAnswers = [];
let allCodingQuestions = [];



