import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { XIcon, BriefcaseIcon, CalendarIcon, TargetIcon, RefreshCwIcon } from './Icons';
import { getMyInterviewReportsApi } from '../services/interview.api';

const PastReportsModal = ({ isOpen, onClose, onSelectReport }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getMyInterviewReportsApi();
                if (isMounted) {
                    setReports(res?.reports || []);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Could not load previous reports. Please try again.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchReports();
        return () => { isMounted = false; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop animate-fade-in" onClick={onClose}>
            <div className="modal-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-box">
                        <BriefcaseIcon size={20} className="modal-icon" />
                        <div>
                            <h3 className="modal-title">Your Interview Preparation Reports</h3>
                            <p className="modal-subtitle">Revisit and practice with previously generated interview analyses</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
                        <XIcon size={18} />
                    </button>
                </div>

                <div className="modal-content">
                    {loading && (
                        <div className="modal-state-box">
                            <RefreshCwIcon size={24} className="spin-icon" />
                            <p>Loading your saved reports...</p>
                        </div>
                    )}

                    {error && (
                        <div className="modal-state-box error-box">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && reports.length === 0 && (
                        <div className="modal-state-box empty-box">
                            <p>No reports generated yet.</p>
                            <span>Fill in the job description and upload your resume to generate your first custom report!</span>
                        </div>
                    )}

                    {!loading && !error && reports.length > 0 && (
                        <div className="reports-history-list">
                            {reports.map((rpt) => (
                                <div key={rpt._id} className="history-item-card">
                                    <div className="history-item-info">
                                        <h4 className="history-job-title">{rpt.title || "Interview Report"}</h4>
                                        <div className="history-meta">
                                            <span>
                                                <CalendarIcon size={13} />
                                                {new Date(rpt.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            </span>
                                            <span>
                                                {rpt.technicalQuestions?.length || 0} Tech Qs
                                            </span>
                                            <span>
                                                {rpt.behavioralQuestions?.length || 0} Behavioral
                                            </span>
                                        </div>
                                    </div>

                                    <div className="history-actions">
                                        <div className="history-score-chip">
                                            <span>{rpt.matchScore || 0}%</span> Match
                                        </div>
                                        <button 
                                            className="open-report-btn"
                                            onClick={() => {
                                                onSelectReport(rpt);
                                                onClose();
                                            }}
                                        >
                                            Inline View
                                        </button>
                                        <button 
                                            className="open-report-btn studio-btn"
                                            onClick={() => {
                                                navigate(`/interview/${rpt._id}`, { state: { report: rpt } });
                                                onClose();
                                            }}
                                            title="Open report in 3-column studio layout"
                                        >
                                            Studio Layout ↗
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PastReportsModal;
