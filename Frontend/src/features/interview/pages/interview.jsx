import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router";
import { 
    TargetIcon, 
    ShieldIcon, 
    CalendarIcon, 
    ChevronDownIcon, 
    ChevronUpIcon, 
    CopyIcon, 
    CheckIcon, 
    AlertCircleIcon, 
    CheckCircleIcon,
    BriefcaseIcon,
    RefreshCwIcon,
    SparklesIcon,
    BookOpenIcon
} from "../components/Icons";
import { getInterviewReportByIdApi } from "../services/interview.api";
import "../style/interview.scss";

// Initial fallback data matching the exact schema provided by user
const defaultInterviewData = {
    _id: "6ac3179fa85a16ad2f36d6f2",
    user: "6a870e3a92f0076466a5c5b2",
    title: "Senior Full-Stack & Microservices Engineer",
    matchScore: 95,
    technicalQuestions: [
        {
            question: "You mentioned migrating a monolith to microservices at Tech Innovators. What were the specific challenges you faced regarding data consistency across services, and how did you resolve them?",
            intention: "To evaluate the candidate's deep understanding of distributed systems and their ability to handle the complexities of microservices architecture.",
            answer: "Discuss patterns like Saga or Two-Phase Commit if applicable, or the use of event-driven architecture with message brokers to ensure eventual consistency. Emphasize how you handled failure states and transaction rollbacks."
        },
        {
            question: "GlobalTech uses both PostgreSQL and Redis. Can you explain a scenario where you would choose Redis over a traditional relational database, and how you would implement a cache-aside strategy for an ERP system?",
            intention: "To test knowledge of performance optimization and caching strategies critical for high-scale enterprise applications.",
            answer: "Explain that Redis is ideal for high-speed lookups and volatile data. For the cache-aside strategy, describe the process: application checks cache, if miss, it reads from DB, updates cache, and returns. Mention TTL and invalidation logic."
        },
        {
            question: "The JD highlights GraphQL as a 'Nice-to-Have'. Since your resume focuses on REST, how would you design a schema for a complex ERP entity (like an Invoice) that has nested relationships, and how would you solve the N+1 problem?",
            intention: "To assess the candidate's ability to learn and apply new technologies relevant to the company's preferred stack.",
            answer: "Explain the concept of types and resolvers. Address the N+1 problem by suggesting the use of DataLoader to batch and cache requests to the database, ensuring efficiency."
        }
    ],
    behavioralQuestions: [
        {
            question: "As a Senior Engineer, you are expected to mentor others. Tell me about a time when you had a significant technical disagreement with a mid-level engineer. How did you resolve it while maintaining a positive culture?",
            intention: "To evaluate leadership, communication, and the ability to foster a collaborative engineering environment.",
            answer: "Use the STAR method. Focus on objective criteria (performance, scalability) rather than personal preference. Show how you reached a consensus and used it as a learning opportunity for the team."
        },
        {
            question: "We are a fast-growing Series C startup. Can you describe a time when you had to balance delivering a feature quickly versus ensuring perfect code quality?",
            intention: "To see if the candidate understands the pragmatism required in a startup environment while managing technical debt.",
            answer: "Discuss the concept of 'intentional technical debt.' Explain how you prioritized the most critical paths for quality (testing, security) while being agile on less critical components, and how you planned for future refactoring."
        }
    ],
    skillGaps: [
        {
            skill: "GraphQL / Apollo",
            severity: "low"
        },
        {
            skill: "ERP Domain Knowledge",
            severity: "medium"
        },
        {
            skill: "GCP Infrastructure",
            severity: "low"
        }
    ],
    preparationPlan: [
        {
            day: 1,
            focus: "Enterprise Architecture and GraphQL",
            tasks: [
                "Study the basics of GraphQL schemas, queries, and mutations.",
                "Research common ERP system modules (Accounting, HR, Inventory) to understand typical data relationships."
            ]
        },
        {
            day: 2,
            focus: "Backend Scaling and Caching",
            tasks: [
                "Review Redis patterns: Caching, Session management, and Pub/Sub.",
                "Practice designing a system that handles 1 million+ daily requests focusing on load balancing and database sharding."
            ]
        },
        {
            day: 3,
            focus: "Advanced React and TypeScript",
            tasks: [
                "Deep dive into React Context API vs Redux/Zustand performance.",
                "Practice advanced TypeScript patterns like Generics and Mapped Types for enterprise-grade type safety."
            ]
        },
        {
            day: 4,
            focus: "System Design and Performance",
            tasks: [
                "Review PostgreSQL indexing strategies and query plan analysis.",
                "Design a real-time notification system for an ERP dashboard using WebSockets."
            ]
        },
        {
            day: 5,
            focus: "Leadership and Behavioral Preparation",
            tasks: [
                "Prepare STAR stories for mentoring, conflict resolution, and technical strategy.",
                "Prepare questions for the interviewer regarding GlobalTech's engineering culture and technical roadmap."
            ]
        }
    ],
    createdAt: "2026-10-05T03:21:03.205Z",
    updatedAt: "2026-10-05T03:21:03.205Z",
    __v: 0
};

// Sketch wireframe chips fallback (if user wants to see redis, Message queue, Event loop)
const sketchWireframeSkills = [
    { skill: "redis", severity: "low" },
    { skill: "Message queue", severity: "medium" },
    { skill: "Event loop", severity: "high" }
];

const Interview = () => {
    const { interviewId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Data state
    const [reportData, setReportData] = useState(() => {
        return location.state?.report || defaultInterviewData;
    });
    const [loading, setLoading] = useState(false);

    // Active navigation tab on the left: 'technical' | 'behavioral' | 'roadmap'
    const [activeTab, setActiveTab] = useState("technical");

    // Accordion expand/collapse states
    const [expandedCards, setExpandedCards] = useState({ 0: true });

    // Interactive checklist for Road Map tasks
    const [completedTasks, setCompletedTasks] = useState({});

    // Copy state feedback
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [reportCopied, setReportCopied] = useState(false);

    // Optional skill gap filter
    const [activeSkillFilter, setActiveSkillFilter] = useState(null);

    // Fetch report by ID if provided and not in location state
    useEffect(() => {
        if (!interviewId || interviewId === "demo" || location.state?.report) {
            return;
        }

        let isMounted = true;
        const fetchReport = async () => {
            setLoading(true);
            try {
                const res = await getInterviewReportByIdApi(interviewId);
                if (isMounted && res?.report) {
                    setReportData(res.report);
                }
            } catch (err) {
                console.warn("Could not load report from API, using default report data:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchReport();
        return () => { isMounted = false; };
    }, [interviewId, location.state]);

    // Reset accordion expansions on tab switch
    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setExpandedCards({ 0: true });
    };

    // Toggle single card
    const toggleCard = (index) => {
        setExpandedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Expand all / Collapse all
    const expandAll = (listLength) => {
        const allOpen = {};
        for (let i = 0; i < listLength; i++) {
            allOpen[i] = true;
        }
        setExpandedCards(allOpen);
    };

    const collapseAll = () => {
        setExpandedCards({});
    };

    // Toggle task in roadmap
    const toggleTask = (dayIndex, taskIndex) => {
        const key = `${dayIndex}-${taskIndex}`;
        setCompletedTasks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Copy single Q&A
    const handleCopyQuestion = (item, index) => {
        const text = `Q: ${item.question}\n\nINTENTION:\n${item.intention}\n\nANSWER:\n${item.answer}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        });
    };

    // Copy entire report
    const handleCopyFullReport = () => {
        let content = `=== INTERVIEW PREPARATION REPORT ===\n`;
        content += `Position: ${reportData.title || "Target Position"}\n`;
        content += `Match Score: ${reportData.matchScore || 95}%\n\n`;

        content += `--- SKILL GAPS ---\n`;
        (reportData.skillGaps || []).forEach((g, i) => {
            const skillName = typeof g === "string" ? g : g.skill;
            const sev = typeof g === "object" ? g.severity : "medium";
            content += `${i + 1}. ${skillName} (${sev})\n`;
        });

        content += `\n--- TECHNICAL QUESTIONS ---\n`;
        (reportData.technicalQuestions || []).forEach((q, i) => {
            content += `Q${i + 1}: ${q.question}\nIntent: ${q.intention}\nAnswer: ${q.answer}\n\n`;
        });

        content += `--- BEHAVIORAL QUESTIONS ---\n`;
        (reportData.behavioralQuestions || []).forEach((q, i) => {
            content += `B${i + 1}: ${q.question}\nIntent: ${q.intention}\nAnswer: ${q.answer}\n\n`;
        });

        content += `--- ROAD MAP ---\n`;
        (reportData.preparationPlan || []).forEach((d) => {
            content += `Day ${d.day}: ${d.focus}\n`;
            d.tasks?.forEach(t => content += `  - ${t}\n`);
        });

        navigator.clipboard.writeText(content).then(() => {
            setReportCopied(true);
            setTimeout(() => setReportCopied(false), 2200);
        });
    };

    // Extract lists with safe fallbacks
    const technicalQuestions = reportData.technicalQuestions || [];
    const behavioralQuestions = reportData.behavioralQuestions || [];
    const preparationPlan = reportData.preparationPlan || [];
    
    // Skill gaps: normalize to array of objects { skill, severity }
    const rawSkillGaps = reportData.skillGaps && reportData.skillGaps.length > 0
        ? reportData.skillGaps
        : sketchWireframeSkills;

    const skillGaps = rawSkillGaps.map(item => {
        if (typeof item === "string") {
            return { skill: item, severity: "low" };
        }
        return {
            skill: item.skill || item.name || "Skill",
            severity: (item.severity || "medium").toLowerCase()
        };
    });

    // Score calculations
    const scoreVal = typeof reportData.matchScore === "number" 
        ? reportData.matchScore 
        : parseInt(reportData.matchScore, 10) || 95;

    const getScoreClass = (score) => {
        if (score >= 80) return "score--high";
        if (score >= 60) return "score--mid";
        return "score--low";
    };

    // Road Map task completion progress
    const totalRoadmapTasks = preparationPlan.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
    const completedTasksCount = Object.values(completedTasks).filter(Boolean).length;
    const roadmapProgressPct = totalRoadmapTasks > 0 ? Math.round((completedTasksCount / totalRoadmapTasks) * 100) : 0;

    return (
        <div className="interview-page">
            <div className="interview-layout">

                {/* ── LEFT COLUMN: Navigation ──────────────────────────────── */}
                <nav className="interview-nav" aria-label="Interview Navigation">
                    <div className="interview-nav__top">
                        <div className="interview-nav__brand">
                            <Link to="/" className="interview-nav__back" title="Return to Workspace">
                                <span className="back-arrow">←</span>
                                <span>Workspace</span>
                            </Link>
                        </div>

                        <p className="interview-nav__label">Sections</p>

                        <div className="interview-nav__menu">
                            {/* Technical questions */}
                            <button
                                type="button"
                                className={`interview-nav__item ${activeTab === "technical" ? "interview-nav__item--active" : ""}`}
                                onClick={() => handleTabChange("technical")}
                            >
                                <span className="interview-nav__icon">
                                    <TargetIcon size={17} />
                                </span>
                                <span className="interview-nav__text">Technical questions</span>
                                <span className="interview-nav__count">{technicalQuestions.length}</span>
                            </button>

                            {/* Behavioral questions */}
                            <button
                                type="button"
                                className={`interview-nav__item ${activeTab === "behavioral" ? "interview-nav__item--active" : ""}`}
                                onClick={() => handleTabChange("behavioral")}
                            >
                                <span className="interview-nav__icon">
                                    <ShieldIcon size={17} />
                                </span>
                                <span className="interview-nav__text">Behavioral questions</span>
                                <span className="interview-nav__count">{behavioralQuestions.length}</span>
                            </button>

                            {/* Road Map */}
                            <button
                                type="button"
                                className={`interview-nav__item ${activeTab === "roadmap" ? "interview-nav__item--active" : ""}`}
                                onClick={() => handleTabChange("roadmap")}
                            >
                                <span className="interview-nav__icon">
                                    <CalendarIcon size={17} />
                                </span>
                                <span className="interview-nav__text">Road Map</span>
                                <span className="interview-nav__count">{preparationPlan.length}d</span>
                            </button>
                        </div>
                    </div>

                    <div className="interview-nav__footer">
                        <button 
                            type="button" 
                            className="interview-nav__action-btn"
                            onClick={handleCopyFullReport}
                            title="Copy entire interview prep summary"
                        >
                            {reportCopied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
                            <span>{reportCopied ? "Copied!" : "Copy Full Report"}</span>
                        </button>
                        <button 
                            type="button" 
                            className="interview-nav__action-btn print-btn"
                            onClick={() => window.print()}
                            title="Print or export as PDF"
                        >
                            <BookOpenIcon size={15} />
                            <span>Print Report</span>
                        </button>
                    </div>
                </nav>

                {/* ── VERTICAL DIVIDER 1 ───────────────────────────────────── */}
                <div className="interview-divider"></div>

                {/* ── CENTER COLUMN: Main Content ──────────────────────────── */}
                <main className="interview-content">
                    {loading ? (
                        <div className="content-loading-state">
                            <RefreshCwIcon size={28} className="spin-icon" />
                            <p>Loading interview data...</p>
                        </div>
                    ) : (
                        <>
                            {/* TAB 1: TECHNICAL QUESTIONS */}
                            {activeTab === "technical" && (
                                <section className="content-section animate-fade-in">
                                    <div className="content-header">
                                        <div className="content-header__titles">
                                            <h2>Technical questions</h2>
                                            <span className="content-header__count">
                                                {technicalQuestions.length} Questions
                                            </span>
                                        </div>

                                        <div className="content-header__actions">
                                            <button 
                                                type="button" 
                                                className="header-pill-btn"
                                                onClick={() => expandAll(technicalQuestions.length)}
                                            >
                                                Expand All
                                            </button>
                                            <button 
                                                type="button" 
                                                className="header-pill-btn"
                                                onClick={collapseAll}
                                            >
                                                Collapse All
                                            </button>
                                        </div>
                                    </div>

                                    <div className="q-list">
                                        {technicalQuestions.map((item, idx) => {
                                            const isOpen = !!expandedCards[idx];
                                            const isCopied = copiedIndex === idx;

                                            return (
                                                <article key={idx} className={`q-card ${isOpen ? "q-card--open" : ""}`}>
                                                    <div 
                                                        className="q-card__header"
                                                        onClick={() => toggleCard(idx)}
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-expanded={isOpen}
                                                    >
                                                        <span className="q-card__index">Q{idx + 1}</span>
                                                        <h3 className="q-card__question">{item.question}</h3>
                                                        <div className="q-card__chevron-wrap">
                                                            <span className={`q-card__chevron ${isOpen ? "q-card__chevron--open" : ""}`}>
                                                                <ChevronDownIcon size={18} />
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {isOpen && (
                                                        <div className="q-card__body animate-slide-down">
                                                            {/* Intention Section */}
                                                            <div className="q-card__section intention-section">
                                                                <div className="q-card__tag q-card__tag--intention">
                                                                    <span>🎯 Interviewer Intention</span>
                                                                </div>
                                                                <p>{item.intention}</p>
                                                            </div>

                                                            {/* Answer Section */}
                                                            <div className="q-card__section answer-section">
                                                                <div className="q-card__tag q-card__tag--answer">
                                                                    <span>💡 Recommended Answer &amp; Strategy</span>
                                                                </div>
                                                                <p>{item.answer}</p>
                                                            </div>

                                                            {/* Card Footer Actions */}
                                                            <div className="q-card__footer">
                                                                <button
                                                                    type="button"
                                                                    className="q-card__copy-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopyQuestion(item, idx);
                                                                    }}
                                                                >
                                                                    {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                                                                    <span>{isCopied ? "Copied" : "Copy Q&A"}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </article>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* TAB 2: BEHAVIORAL QUESTIONS */}
                            {activeTab === "behavioral" && (
                                <section className="content-section animate-fade-in">
                                    <div className="content-header">
                                        <div className="content-header__titles">
                                            <h2>Behavioral questions</h2>
                                            <span className="content-header__count">
                                                {behavioralQuestions.length} Questions
                                            </span>
                                        </div>

                                        <div className="content-header__actions">
                                            <button 
                                                type="button" 
                                                className="header-pill-btn"
                                                onClick={() => expandAll(behavioralQuestions.length)}
                                            >
                                                Expand All
                                            </button>
                                            <button 
                                                type="button" 
                                                className="header-pill-btn"
                                                onClick={collapseAll}
                                            >
                                                Collapse All
                                            </button>
                                        </div>
                                    </div>

                                    <div className="q-list">
                                        {behavioralQuestions.map((item, idx) => {
                                            const isOpen = !!expandedCards[idx];
                                            const isCopied = copiedIndex === idx;

                                            return (
                                                <article key={idx} className={`q-card ${isOpen ? "q-card--open" : ""}`}>
                                                    <div 
                                                        className="q-card__header"
                                                        onClick={() => toggleCard(idx)}
                                                        role="button"
                                                        tabIndex={0}
                                                        aria-expanded={isOpen}
                                                    >
                                                        <span className="q-card__index behavioral-index">B{idx + 1}</span>
                                                        <h3 className="q-card__question">{item.question}</h3>
                                                        <div className="q-card__chevron-wrap">
                                                            <span className={`q-card__chevron ${isOpen ? "q-card__chevron--open" : ""}`}>
                                                                <ChevronDownIcon size={18} />
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {isOpen && (
                                                        <div className="q-card__body animate-slide-down">
                                                            {/* Intention Section */}
                                                            <div className="q-card__section intention-section">
                                                                <div className="q-card__tag q-card__tag--intention">
                                                                    <span>🎯 Core Evaluation Goal</span>
                                                                </div>
                                                                <p>{item.intention}</p>
                                                            </div>

                                                            {/* STAR Answer Section */}
                                                            <div className="q-card__section star-section">
                                                                <div className="q-card__tag q-card__tag--answer">
                                                                    <span>⭐ STAR Method Guidance</span>
                                                                </div>
                                                                <p>{item.answer}</p>
                                                            </div>

                                                            {/* Card Footer Actions */}
                                                            <div className="q-card__footer">
                                                                <button
                                                                    type="button"
                                                                    className="q-card__copy-btn"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCopyQuestion(item, idx);
                                                                    }}
                                                                >
                                                                    {isCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                                                                    <span>{isCopied ? "Copied" : "Copy Scenario"}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </article>
                                            );
                                        })}
                                    </div>
                                </section>
                            )}

                            {/* TAB 3: ROAD MAP */}
                            {activeTab === "roadmap" && (
                                <section className="content-section animate-fade-in">
                                    <div className="content-header">
                                        <div className="content-header__titles">
                                            <h2>Road Map</h2>
                                            <span className="content-header__count">
                                                {preparationPlan.length} Days Plan
                                            </span>
                                        </div>

                                        {totalRoadmapTasks > 0 && (
                                            <div className="roadmap-header-progress">
                                                <div className="roadmap-progress-bar-wrap">
                                                    <div 
                                                        className="roadmap-progress-bar-fill" 
                                                        style={{ width: `${roadmapProgressPct}%` }}
                                                    ></div>
                                                </div>
                                                <span className="roadmap-progress-label">
                                                    {completedTasksCount}/{totalRoadmapTasks} Tasks ({roadmapProgressPct}%)
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="roadmap-list">
                                        {preparationPlan.map((dayItem, dIdx) => (
                                            <div key={dIdx} className="roadmap-day">
                                                <div className="roadmap-day__header">
                                                    <span className="roadmap-day__badge">
                                                        Day {dayItem.day || dIdx + 1}
                                                    </span>
                                                    <h3 className="roadmap-day__focus">{dayItem.focus}</h3>
                                                </div>

                                                <ul className="roadmap-day__tasks">
                                                    {dayItem.tasks?.map((task, tIdx) => {
                                                        const isChecked = !!completedTasks[`${dIdx}-${tIdx}`];

                                                        return (
                                                            <li 
                                                                key={tIdx} 
                                                                className={`roadmap-task-row ${isChecked ? "roadmap-task-row--done" : ""}`}
                                                                onClick={() => toggleTask(dIdx, tIdx)}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => {}}
                                                                    className="roadmap-task-checkbox"
                                                                    aria-label={`Mark task completed: ${task}`}
                                                                />
                                                                <span className="roadmap-day__task-text">{task}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </main>

                {/* ── VERTICAL DIVIDER 2 ───────────────────────────────────── */}
                <div className="interview-divider"></div>

                {/* ── RIGHT COLUMN: Skill Gaps & Overview ──────────────────── */}
                <aside className="interview-sidebar" aria-label="Interview Insights">
                    {/* TOP SECTION: Skill Gaps (Matching the Wireframe Image) */}
                    <div className="skill-gaps">
                        <div className="skill-gaps__header">
                            <h3 className="skill-gaps__title">Skill Gaps</h3>
                            <span className="skill-gaps__count">{skillGaps.length}</span>
                        </div>

                        <div className="skill-gaps__list">
                            {skillGaps.map((item, idx) => (
                                <span
                                    key={idx}
                                    className={`skill-tag skill-tag--${item.severity || "medium"} ${activeSkillFilter === item.skill ? "skill-tag--selected" : ""}`}
                                    onClick={() => setActiveSkillFilter(prev => prev === item.skill ? null : item.skill)}
                                    title={`Severity: ${item.severity || "medium"}`}
                                >
                                    {item.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-divider"></div>

                    {/* MATCH SCORE SECTION */}
                    <div className="match-score">
                        <p className="match-score__label">Match Score</p>
                        
                        <div className={`match-score__ring ${getScoreClass(scoreVal)}`}>
                            <span className="match-score__value">{scoreVal}</span>
                            <span className="match-score__pct">%</span>
                        </div>

                        <p className="match-score__sub">
                            {scoreVal >= 80 ? "Strong Role Alignment" : scoreVal >= 60 ? "Moderate Match" : "Needs Further Preparation"}
                        </p>
                    </div>

                    <div className="sidebar-divider"></div>

                    {/* TARGET METADATA SUMMARY */}
                    <div className="sidebar-summary">
                        <div className="summary-row">
                            <span className="summary-label">Target Role</span>
                            <span className="summary-value" title={reportData.title || "Full-Stack Engineer"}>
                                {reportData.title || "Senior Engineer"}
                            </span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Total Tech Qs</span>
                            <span className="summary-value">{technicalQuestions.length}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Behavioral Scenarios</span>
                            <span className="summary-value">{behavioralQuestions.length}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Prep Duration</span>
                            <span className="summary-value">{preparationPlan.length} Days</span>
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default Interview;
