import React, { useState } from 'react';
import { 
    CheckCircleIcon, 
    AlertCircleIcon, 
    CopyIcon, 
    CheckIcon, 
    ChevronDownIcon, 
    ChevronUpIcon, 
    TargetIcon, 
    ShieldIcon, 
    CalendarIcon, 
    BookOpenIcon, 
    BriefcaseIcon,
    RefreshCwIcon
} from './Icons';

const ReportView = ({ report, onBackToEditor }) => {
    const [activeTab, setActiveTab] = useState('technical');
    const [expandedTechnical, setExpandedTechnical] = useState({ 0: true });
    const [expandedBehavioral, setExpandedBehavioral] = useState({ 0: true });
    const [completedTasks, setCompletedTasks] = useState({});
    const [copied, setCopied] = useState(false);

    if (!report) return null;

    const {
        title = "Target Position Analysis",
        matchScore = 75,
        technicalQuestions = [],
        behavioralQuestions = [],
        skillGaps = [],
        preparationPlan = [],
        createdAt
    } = report;

    // Toggle technical question accordion
    const toggleTechnical = (index) => {
        setExpandedTechnical(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Toggle behavioral question accordion
    const toggleBehavioral = (index) => {
        setExpandedBehavioral(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Toggle preparation plan task completion
    const toggleTask = (dayIndex, taskIndex) => {
        const key = `${dayIndex}-${taskIndex}`;
        setCompletedTasks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Calculate total plan tasks and completion rate
    const totalTasks = preparationPlan.reduce((acc, curr) => acc + (curr.tasks ? curr.tasks.length : 0), 0);
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    // Copy entire report text to clipboard
    const handleCopyReport = () => {
        let content = `=== INTERVIEW PREPARATION REPORT ===\n`;
        content += `Position: ${title}\nMatch Score: ${matchScore}%\n\n`;
        
        content += `--- SKILL GAPS ---\n`;
        skillGaps.forEach((g, i) => {
            content += `${i + 1}. ${g.skill} [Severity: ${g.severity}]\n`;
        });

        content += `\n--- TECHNICAL QUESTIONS ---\n`;
        technicalQuestions.forEach((q, i) => {
            content += `Q${i + 1}: ${q.question}\nIntent: ${q.intention}\nApproach: ${q.answer}\n\n`;
        });

        content += `--- BEHAVIORAL QUESTIONS ---\n`;
        behavioralQuestions.forEach((q, i) => {
            content += `Q${i + 1}: ${q.question}\nIntent: ${q.intention}\nApproach: ${q.answer}\n\n`;
        });

        content += `--- 7-DAY PREPARATION ROADMAP ---\n`;
        preparationPlan.forEach((d) => {
            content += `Day ${d.day}: ${d.focus}\n`;
            d.tasks?.forEach((t, ti) => {
                content += `  - [ ] ${t}\n`;
            });
        });

        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        });
    };

    // Match score color configuration
    const getScoreColor = (score) => {
        if (score >= 80) return { color: "#10b981", label: "Strong Match", bg: "rgba(16, 185, 129, 0.12)", border: "#10b98155" };
        if (score >= 60) return { color: "#f59e0b", label: "Moderate Match", bg: "rgba(245, 158, 11, 0.12)", border: "#f59e0b55" };
        return { color: "#ef4444", label: "Needs Skill Alignment", bg: "rgba(239, 68, 68, 0.12)", border: "#ef444455" };
    };

    const scoreInfo = getScoreColor(matchScore);

    return (
        <section className="report-dashboard animate-fade-in">
            {/* Top Toolbar */}
            <div className="report-toolbar">
                <button className="back-btn" onClick={onBackToEditor}>
                    <span>←</span> Return to Workspace
                </button>
                <div className="toolbar-actions">
                    <button className="tool-btn" onClick={handleCopyReport}>
                        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                        <span>{copied ? "Report Copied!" : "Copy Report"}</span>
                    </button>
                    <button className="tool-btn" onClick={() => window.print()}>
                        <BookOpenIcon size={16} />
                        <span>Print / Save PDF</span>
                    </button>
                </div>
            </div>

            {/* Hero Summary Card */}
            <div className="report-hero-card">
                <div className="hero-left">
                    <div className="role-pill">
                        <BriefcaseIcon size={14} />
                        <span>Target Role</span>
                    </div>
                    <h1 className="report-job-title">{title}</h1>
                    <p className="report-meta">
                        Generated by AI Intelligence • {createdAt ? new Date(createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "Just now"}
                    </p>

                    <div className="hero-stats-row">
                        <div className="stat-pill">
                            <span className="stat-num">{technicalQuestions.length}</span>
                            <span className="stat-desc">Tech Questions</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-num">{behavioralQuestions.length}</span>
                            <span className="stat-desc">Behavioral</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-num">{skillGaps.length}</span>
                            <span className="stat-desc">Identified Gaps</span>
                        </div>
                        <div className="stat-pill">
                            <span className="stat-num">{preparationPlan.length} Days</span>
                            <span className="stat-desc">Prep Timeline</span>
                        </div>
                    </div>
                </div>

                <div className="hero-right">
                    <div 
                        className="match-gauge-card" 
                        style={{ background: scoreInfo.bg, borderColor: scoreInfo.border }}
                    >
                        <div className="gauge-circle" style={{ borderColor: scoreInfo.color }}>
                            <span className="score-val" style={{ color: scoreInfo.color }}>
                                {matchScore}<span>%</span>
                            </span>
                        </div>
                        <div className="gauge-info">
                            <span className="gauge-status" style={{ color: scoreInfo.color }}>
                                {scoreInfo.label}
                            </span>
                            <span className="gauge-sub">Candidate ATS Match</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="report-tabs-bar">
                <button 
                    className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
                    onClick={() => setActiveTab('technical')}
                >
                    <TargetIcon size={18} />
                    <span>Technical Questions ({technicalQuestions.length})</span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'behavioral' ? 'active' : ''}`}
                    onClick={() => setActiveTab('behavioral')}
                >
                    <ShieldIcon size={18} />
                    <span>Behavioral Scenarios ({behavioralQuestions.length})</span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'gaps' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gaps')}
                >
                    <AlertCircleIcon size={18} />
                    <span>Skill Gaps ({skillGaps.length})</span>
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roadmap')}
                >
                    <CalendarIcon size={18} />
                    <span>7-Day Prep Roadmap</span>
                    {totalTasks > 0 && (
                        <span className="roadmap-progress-badge">
                            {completedCount}/{totalTasks}
                        </span>
                    )}
                </button>
            </div>

            {/* TAB 1: TECHNICAL QUESTIONS */}
            {activeTab === 'technical' && (
                <div className="tab-content technical-tab animate-fade-in">
                    <div className="tab-section-intro">
                        <h3>High-Yield Technical Questions</h3>
                        <p>Targeted conceptual, architectural, and coding questions crafted specifically from your resume against this job's stack.</p>
                    </div>

                    <div className="questions-list">
                        {technicalQuestions.map((q, idx) => {
                            const isExpanded = !!expandedTechnical[idx];
                            return (
                                <div key={idx} className={`question-card ${isExpanded ? 'expanded' : ''}`}>
                                    <div 
                                        className="question-card-header" 
                                        onClick={() => toggleTechnical(idx)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="q-badge">Q{idx + 1}</div>
                                        <h4 className="q-title">{q.question}</h4>
                                        <button className="expand-btn" aria-label="Toggle details">
                                            {isExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="question-body animate-slide-down">
                                            <div className="callout intent-box">
                                                <div className="callout-header">
                                                    <span className="callout-icon">🎯</span>
                                                    <span className="callout-title">Interviewer's Secret Intention</span>
                                                </div>
                                                <p className="callout-text">{q.intention}</p>
                                            </div>

                                            <div className="callout answer-box">
                                                <div className="callout-header">
                                                    <span className="callout-icon">💡</span>
                                                    <span className="callout-title">Recommended Strategy &amp; Model Answer</span>
                                                </div>
                                                <p className="callout-text">{q.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 2: BEHAVIORAL QUESTIONS */}
            {activeTab === 'behavioral' && (
                <div className="tab-content behavioral-tab animate-fade-in">
                    <div className="tab-section-intro">
                        <h3>Behavioral &amp; Culture Fit Scenarios</h3>
                        <p>Formulate your responses using the <strong>STAR Method</strong> (Situation, Task, Action, Result) to showcase leadership and composure.</p>
                    </div>

                    <div className="questions-list">
                        {behavioralQuestions.map((q, idx) => {
                            const isExpanded = !!expandedBehavioral[idx];
                            return (
                                <div key={idx} className={`question-card ${isExpanded ? 'expanded' : ''}`}>
                                    <div 
                                        className="question-card-header" 
                                        onClick={() => toggleBehavioral(idx)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <div className="q-badge b-badge">B{idx + 1}</div>
                                        <h4 className="q-title">{q.question}</h4>
                                        <button className="expand-btn" aria-label="Toggle details">
                                            {isExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <div className="question-body animate-slide-down">
                                            <div className="callout intent-box">
                                                <div className="callout-header">
                                                    <span className="callout-icon">🔍</span>
                                                    <span className="callout-title">What They Are Really Evaluating</span>
                                                </div>
                                                <p className="callout-text">{q.intention}</p>
                                            </div>

                                            <div className="callout answer-box star-box">
                                                <div className="callout-header">
                                                    <span className="callout-icon">🌟</span>
                                                    <span className="callout-title">STAR Framework Guidance</span>
                                                </div>
                                                <p className="callout-text">{q.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB 3: SKILL GAPS */}
            {activeTab === 'gaps' && (
                <div className="tab-content gaps-tab animate-fade-in">
                    <div className="tab-section-intro">
                        <h3>Identified Skill Gaps &amp; Growth Areas</h3>
                        <p>Technologies and competencies listed in the job description that were not prominently found in your resume or profile.</p>
                    </div>

                    {skillGaps.length === 0 ? (
                        <div className="empty-gaps-card">
                            <CheckCircleIcon size={32} className="success-icon" />
                            <h4>Zero Critical Gaps Found!</h4>
                            <p>Your resume demonstrates comprehensive alignment with all required core competencies for this role.</p>
                        </div>
                    ) : (
                        <div className="gaps-grid">
                            {skillGaps.map((gap, idx) => {
                                const sev = (gap.severity || "medium").toLowerCase();
                                return (
                                    <div key={idx} className={`gap-card severity-${sev}`}>
                                        <div className="gap-top">
                                            <span className={`severity-tag tag-${sev}`}>
                                                {sev.toUpperCase()} PRIORITY
                                            </span>
                                            <span className="gap-index">#{idx + 1}</span>
                                        </div>
                                        <h4 className="gap-skill-name">{gap.skill}</h4>
                                        <p className="gap-recommendation">
                                            {sev === 'high' 
                                                ? "Critical for passing technical rounds. Prioritize study topics and prepare sample implementations before the interview."
                                                : sev === 'medium'
                                                ? "Frequently tested in system architecture and technical discussions. Refresh fundamentals and tradeoffs."
                                                : "Nice-to-have skill. Familiarize yourself with high-level terminology and use cases."}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: 7-DAY ROADMAP */}
            {activeTab === 'roadmap' && (
                <div className="tab-content roadmap-tab animate-fade-in">
                    <div className="tab-section-intro roadmap-header-box">
                        <div>
                            <h3>Actionable 7-Day Interview Preparation Roadmap</h3>
                            <p>A structured day-by-day battle plan designed to systematically eliminate your skill gaps and build interview confidence.</p>
                        </div>
                        {totalTasks > 0 && (
                            <div className="progress-pill-card">
                                <div className="progress-info">
                                    <span className="progress-title">Roadmap Progress</span>
                                    <span className="progress-val">{progressPercent}%</span>
                                </div>
                                <div className="progress-track">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="days-timeline">
                        {preparationPlan.map((dayItem, dIdx) => (
                            <div key={dIdx} className="day-card">
                                <div className="day-badge-col">
                                    <div className="day-circle">
                                        <span className="day-num">D{dayItem.day || dIdx + 1}</span>
                                    </div>
                                    <div className="day-line"></div>
                                </div>

                                <div className="day-details">
                                    <div className="day-header">
                                        <span className="day-label">Day {dayItem.day || dIdx + 1} Focus</span>
                                        <h4 className="day-focus-title">{dayItem.focus}</h4>
                                    </div>

                                    <div className="day-tasks-list">
                                        {dayItem.tasks?.map((task, tIdx) => {
                                            const isDone = !!completedTasks[`${dIdx}-${tIdx}`];
                                            return (
                                                <label 
                                                    key={tIdx} 
                                                    className={`task-item ${isDone ? 'completed' : ''}`}
                                                    onClick={() => toggleTask(dIdx, tIdx)}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isDone}
                                                        onChange={() => {}}
                                                        className="task-checkbox"
                                                    />
                                                    <span className="task-text">{task}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ReportView;
