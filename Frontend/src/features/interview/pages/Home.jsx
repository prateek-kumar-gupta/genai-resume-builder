import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../components/Navbar';
import PastReportsModal from '../components/PastReportsModal';
import { useInterview } from '../hooks/useinterview';
import { 
    SparklesIcon, 
    UploadCloudIcon, 
    FileTextIcon, 
    TrashIcon, 
    AlertCircleIcon, 
    BriefcaseIcon, 
    TargetIcon, 
    ShieldIcon, 
    CalendarIcon, 
    RefreshCwIcon,
    CheckCircleIcon,
    LayersIcon
} from '../components/Icons';
import { sampleJobDescriptions, sampleDemoReport } from '../data/sampleData';
import "../style/home.scss";

const Home = () => {
    const navigate = useNavigate();
    const {loading, generateReport, reports, getReports} = useInterview();

    useEffect(() => {
        getReports();
    }, []);
    // Input state based on user's UI structure
    const [jobDescription, setJobDescription] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [selfDescription, setSelfDescription] = useState("");
    
    // UI states
    const [isDragging, setIsDragging] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const fileInputRef = useRef(null);

    // AI Generation progress stages
    const loadingSteps = [
        "Parsing resume PDF credentials...",
        "Evaluating candidate background against job requirements...",
        "Synthesizing high-impact technical & behavioral questions...",
        "Formulating structured answers and skill gap analysis..."
    ];

    useEffect(() => {
        let interval;
        if (loading) {
            setLoadingStage(0);
            interval = setInterval(() => {
                setLoadingStage(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    // Drag & Drop handlers for resume
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        setErrorMsg(null);
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setErrorMsg("Please upload a valid PDF document for your resume.");
            return;
        }
        if (file.size > 15 * 1024 * 1024) {
            setErrorMsg("Resume file size exceeds the 15MB limit.");
            return;
        }
        setResumeFile(file);
    };

    const handleRemoveFile = () => {
        setResumeFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Quick tag chips for self description
    const appendContextTag = (tag) => {
        setSelfDescription(prev => {
            const trimmed = prev.trim();
            if (!trimmed) return tag;
            if (trimmed.includes(tag)) return trimmed;
            return `${trimmed}, ${tag}`;
        });
    };

    // Sample Job Description applicator
    const applySampleJD = (sampleId) => {
        const sample = sampleJobDescriptions.find(s => s.id === sampleId);
        if (sample) {
            setJobDescription(sample.text);
            setErrorMsg(null);
        }
    };

    // Clear all inputs
    const handleClearInputs = () => {
        setJobDescription("");
        setSelfDescription("");
        handleRemoveFile();
        setErrorMsg(null);
    };

    // Generate Interview Report via API
    const handleGenerateReport = async (e) => {
        e?.preventDefault();
        setErrorMsg(null);

        if (!jobDescription.trim()) {
            setErrorMsg("Please enter the job description so the AI can evaluate requirements.");
            return;
        }

        if (!resumeFile) {
            setErrorMsg("Please upload your resume PDF to compare against the job description.");
            return;
        }

        try {
            const data = await generateReport({ jobDescription: jobDescription.trim(), selfDescription: selfDescription.trim(), resumeFile });
            if (data && data._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (err) {
            console.error("Report generation failed:", err);
            setErrorMsg("Failed to generate report. Please try again.");
        }
    };

    const jdCharCount = jobDescription.length;
    const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

    return (
        <div className="home-layout">
            {/* Top Navigation */}
            <Navbar 
                onOpenHistory={() => setIsHistoryModalOpen(true)}
                
                hasActiveReport={false}
                onBackToEditor={() => {}}
            />

            <main className="home">
                {/* Ambient Background Glow Elements */}
                <div className="ambient-glow glow-primary"></div>
                <div className="ambient-glow glow-secondary"></div>
                <div className="ambient-glow glow-accent"></div>

                <div className="main-content-wrapper">
                    {/* Hero Header */}
                    <header className="hero-header-banner">
                        <h1 className="hero-title">
                            Master Your Next Interview with <span className="gradient-highlight">Precision of AI</span>
                        </h1>
                        <p className="hero-description">
                            Paste your target job description and upload your resume. Gemini analyzes your fit, uncovers skill gaps, and generates targeted technical and behavioral questions with winning answers.
                        </p>

                        <div className="feature-chips-row">
                            <span className="feature-chip">
                                <TargetIcon size={13} /> ATS Match Scoring
                            </span>
                            <span className="feature-chip">
                                <BriefcaseIcon size={13} /> Custom Tech Questions
                            </span>
                            <span className="feature-chip">
                                <ShieldIcon size={13} /> STAR Behavioral Scenarios
                            </span>
                            <span className="feature-chip">
                                <AlertCircleIcon size={13} /> Skill Gap Assessment
                            </span>
                        </div>
                    </header>

                    {/* Alert Message Banner */}
                    {errorMsg && (
                        <div className="alert-card error-alert animate-fade-in">
                            <AlertCircleIcon size={20} className="alert-icon" />
                            <div className="alert-content">
                                <span className="alert-title">Attention</span>
                                <p className="alert-text">{errorMsg}</p>
                            </div>
                            <button className="alert-dismiss" onClick={() => setErrorMsg(null)} aria-label="Dismiss alert">✕</button>
                        </div>
                    )}

                    {/* Generation Loading State */}
                    {loading && (
                        <div className="loading-overlay-card animate-fade-in">
                            <div className="aurora-loader">
                                <div className="logo-icon-box" style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.6)', 
                                    width: '72px', 
                                    height: '72px', 
                                    borderRadius: '18px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    color: 'white', 
                                    animation: 'pulseGlow 2s infinite'
                                }}>
                                    <LayersIcon size={38} className="spin-icon" />
                                </div>
                            </div>

                            <h3 className="loading-title">Synthesizing Interview Playbook...</h3>
                            <p className="loading-step-text">{loadingSteps[loadingStage]}</p>

                            <div className="loading-steps-timeline">
                                {loadingSteps.map((step, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`loading-step-item ${idx <= loadingStage ? 'active' : ''} ${idx < loadingStage ? 'done' : ''}`}
                                    >
                                        <div className="step-indicator">
                                            {idx < loadingStage ? <CheckCircleIcon size={13} /> : <span>{idx + 1}</span>}
                                        </div>
                                        <span className="step-label">{step.split("...")[0]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Core Workspace: Left (JD) & Right (Resume, Self-Desc, Button) */}
                    <div className="interview-input-group">
                        {/* LEFT COLUMN: Job Description */}
                        <div className="left">
                            <div className="panel-header">
                                <div className="panel-title-group">
                                    <div className="panel-icon-badge">
                                        <BriefcaseIcon size={18} />
                                    </div>
                                    <div>
                                        <label htmlFor="job-description" className="panel-heading">
                                            Job Description
                                        </label>
                                        <p className="panel-sub">Paste the target position requirements &amp; responsibilities</p>
                                    </div>
                                </div>

                                <div className="panel-actions">
                                    <div className="dropdown-presets">
                                        <button 
                                            type="button" 
                                            className="action-pill-btn" 
                                            onClick={() => applySampleJD("fullstack")}
                                            title="Load Full-Stack Engineer sample"
                                        >
                                            ⚡ Full-Stack
                                        </button>
                                        <button 
                                            type="button" 
                                            className="action-pill-btn" 
                                            onClick={() => applySampleJD("frontend")}
                                            title="Load Frontend Lead sample"
                                        >
                                            ⚡ Frontend
                                        </button>
                                        <button 
                                            type="button" 
                                            className="action-pill-btn" 
                                            onClick={() => applySampleJD("aiml")}
                                            title="Load AI/ML Engineer sample"
                                        >
                                            ⚡ AI/ML
                                        </button>
                                    </div>

                                    {jobDescription && (
                                        <button 
                                            type="button" 
                                            className="action-pill-btn clear-btn"
                                            onClick={() => setJobDescription("")}
                                            title="Clear text"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="textarea-wrapper">
                                <textarea 
                                    name="job-description" 
                                    id="job-description" 
                                    className="modern-textarea job-description-textarea"
                                    placeholder="Enter or paste job description here (responsibilities, required skills, qualification criteria)...&#10;&#10;💡 Tip: Click any of the quick sample buttons above (Full-Stack, Frontend, AI/ML) to instantly populate this box!"
                                    value={jobDescription}
                                    onChange={(e) => {
                                        setJobDescription(e.target.value);
                                        if (errorMsg) setErrorMsg(null);
                                    }}
                                    rows={15}
                                    spellCheck="false"
                                ></textarea>

                                <div className="textarea-footer">
                                    <span className="count-tag">
                                        {jdWordCount} words • {jdCharCount} characters
                                    </span>
                                    <span className="hotkey-tip">
                                        More detailed JD = higher quality questions
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Resume, Self-Description, CTA */}
                        <div className="right">
                            {/* Input Group 1: Resume */}
                            <div className="input-group resume-input-group">
                                <p className="section-title">
                                    Resume <small className="highlight">(Use Resume and self description together for best results)</small>
                                </p>

                                {!resumeFile ? (
                                    <div 
                                        className={`dropzone-box ${isDragging ? 'drag-over' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        role="button"
                                        tabIndex={0}
                                        title="Click to browse or drop resume PDF"
                                    >
                                        <input 
                                            ref={fileInputRef}
                                            hidden 
                                            type="file" 
                                            name="resume" 
                                            id="resume" 
                                            accept=".pdf,application/pdf" 
                                            onChange={handleFileSelect}
                                        />
                                        <div className="dropzone-content">
                                            <div className="drop-icon-sphere">
                                                <UploadCloudIcon size={24} />
                                            </div>
                                            <label className="file-label" htmlFor="resume" onClick={(e) => e.stopPropagation()}>
                                                Upload Resume
                                            </label>
                                            <span className="dropzone-sub-text">
                                                PDF format only (Max 15MB)
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="uploaded-file-card animate-scale-up">
                                        <div className="file-card-left">
                                            <div className="file-icon-box">
                                                <FileTextIcon size={22} />
                                            </div>
                                            <div className="file-info-col">
                                                <span className="file-name" title={resumeFile.name}>
                                                    {resumeFile.name}
                                                </span>
                                                <span className="file-size-tag">
                                                    {(resumeFile.size / 1024).toFixed(1)} KB • PDF Attached
                                                </span>
                                            </div>
                                        </div>

                                        <div className="file-card-right">
                                            <button 
                                                type="button" 
                                                className="file-action-btn remove-btn"
                                                onClick={handleRemoveFile}
                                                title="Remove resume"
                                                aria-label="Remove uploaded resume"
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Group 2: Self Description */}
                            <div className="input-group self-desc-input-group">
                                <label htmlFor="self-description" className="section-title">
                                    Self Description
                                </label>
                                <textarea 
                                    name="self-description" 
                                    id="self-description" 
                                    className="modern-textarea self-desc-textarea"
                                    placeholder="Describe yourself, key projects, years of experience, or specific roles you're aiming for..." 
                                    rows={4}
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                ></textarea>

                                {/* Quick Add Tags */}
                                <div className="quick-tags-container">
                                    <span className="quick-tag-label">Quick Add:</span>
                                    <button 
                                        type="button" 
                                        className="context-chip"
                                        onClick={() => appendContextTag("3+ years MERN stack experience")}
                                    >
                                        + 3+ Years MERN
                                    </button>
                                    <button 
                                        type="button" 
                                        className="context-chip"
                                        onClick={() => appendContextTag("Strong System Design & Architecture")}
                                    >
                                        + System Design
                                    </button>
                                    <button 
                                        type="button" 
                                        className="context-chip"
                                        onClick={() => appendContextTag("Targeting Senior Engineer role")}
                                    >
                                        + Senior Role
                                    </button>
                                    <button 
                                        type="button" 
                                        className="context-chip"
                                        onClick={() => appendContextTag("Focus on Performance & Scalability")}
                                    >
                                        + Performance
                                    </button>
                                </div>
                            </div>

                            {/* Generate CTA Button */}
                            <div className="cta-wrapper">
                                <button 
                                    type="button"
                                    className="button primary-button generate-btn"
                                    onClick={handleGenerateReport}
                                    disabled={loading}
                                >
                                    <div className="btn-content">
                                        {loading ? (
                                            <>
                                                <LayersIcon size={20} className="spin-icon" />
                                                <span>Synthesizing Report...</span>
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon size={20} />
                                                <span>Generate Interview Report</span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                <div className="cta-sub-actions">
                                    <button 
                                        type="button" 
                                        className="text-link-btn"
                                        onClick={handleClearInputs}
                                    >
                                        Reset Inputs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports List */}
                    {reports && reports.length > 0 && (
                        <section className='recent-reports' style={{ marginTop: '40px' }}>
                            <h2>My Recent Interview Plans</h2>
                            <ul className='reports-list'>
                                {reports.map(report => (
                                    <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                        <h3>{report.title || 'Untitled Position'}</h3>
                                        <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                        <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </main>

            {/* History Modal Drawer */}
            <PastReportsModal 
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                onSelectReport={(report) => {
                    navigate(`/interview/${report._id}`);
                }}
            />
        </div>
    );
};

export default Home;
