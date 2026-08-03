import React, { useState } from 'react';
import { Target, Upload, CheckCircle, AlertTriangle, Lightbulb, Cpu, FileText, Check, Award, BookOpen, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { checkAtsScore, uploadDocument } from '../../services/api';
import { translations } from '../../utils/translations';
import AiModelSelector, { AI_MODELS } from '../AiModelSelector';

export default function AtsTool({ lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [jobFileName, setJobFileName] = useState('');

  const activeModelObj = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('toolType', 'ATS Resume');

    try {
      const res = await uploadDocument(formData);
      if (res.data?.document?.extractedText) {
        setResumeText(res.data.document.extractedText);
      }
    } catch (err) {
      console.warn('Resume upload notice:', err.message);
    }
  };

  const handleJobUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setJobFileName(file.name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('toolType', 'Job Description');

    try {
      const res = await uploadDocument(formData);
      if (res.data?.document?.extractedText) {
        setJobDescription(res.data.document.extractedText);
      }
    } catch (err) {
      console.warn('Job description upload notice:', err.message);
    }
  };

  const handleLoadSample = () => {
    const sampleResume = `KWAHISH SHARMA
Senior Full Stack Engineer | React & Node.js Specialist
Email: khwahish@example.com | Phone: +1 (555) 019-2834 | GitHub: github.com/khwahish

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack Developer with 5+ years of experience building scalable web applications, microservices, and RESTful APIs using React.js, Node.js, Express, TypeScript, and MongoDB. Proven track record of reducing page load times by 40% and deploying cloud infrastructure on AWS and Docker.

TECHNICAL SKILLS
- Frontend: React.js, Redux Toolkit, TypeScript, Next.js, HTML5, CSS3, TailwindCSS
- Backend: Node.js, Express.js, REST APIs, GraphQL, Microservices, Python
- Databases: MongoDB, PostgreSQL, Redis, Mongoose
- Cloud & DevOps: AWS (EC2, S3), Docker, Kubernetes, CI/CD, Git

WORK EXPERIENCE
Senior Full Stack Developer | Tech Innovations Inc. (2022 - Present)
- Engineered scalable React frontend and Express microservices processing 50,000+ daily requests.
- Optimized MongoDB queries and Redis caching, reducing API response latency by 35%.
- Implemented JWT authentication and Google OAuth 2.0 with reCAPTCHA bot verification.

Full Stack Engineer | Web Solutions Ltd. (2019 - 2022)
- Built interactive dashboard web applications using React, Redux, and Node.js REST APIs.
- Integrated automated CI/CD pipelines with GitHub Actions and Docker containerization.

EDUCATION & CERTIFICATIONS
- B.Tech in Computer Science & Engineering | State University (2019)
- AWS Certified Solutions Architect | Associate Level (2023)`;

    const sampleJob = `Job Title: Senior Full Stack Developer (React / Node.js)
Location: Remote / Full-time

Job Description:
We are looking for a Senior Full Stack Developer to build high-performance web applications and backend APIs.

Requirements & Qualifications:
- 4+ years of hands-on experience with React.js, Node.js, and Express.
- Strong proficiency in JavaScript/TypeScript, REST APIs, and MongoDB / PostgreSQL.
- Experience with Cloud services (AWS EC2/S3), Docker containerization, and microservices architecture.
- Knowledge of state management (Redux) and GraphQL is a plus.
- Bachelor's degree in Computer Science, Software Engineering, or equivalent experience.
- Excellent communication skills and passion for clean, maintainable code.`;

    setResumeText(sampleResume);
    setJobDescription(sampleJob);
    setResumeFileName('');
    setJobFileName('');
  };

  const handleAnalyze = async () => {
    const effectiveResume = (resumeText.trim() || `[Resume File: ${resumeFileName}]`).trim();
    const effectiveJob = (jobDescription.trim() || `[Job File: ${jobFileName}]`).trim();
    
    if (!effectiveResume || !effectiveJob) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await checkAtsScore({ resumeText: effectiveResume, jobDescription: effectiveJob, model: selectedModel });
      if (res.data && (res.data.atsScore !== undefined || res.data.keywordMatch !== undefined)) {
        setResult({
          ...res.data,
          usedModel: activeModelObj
        });
      } else {
        throw new Error(res.data?.error || 'Invalid ATS analysis response received from server.');
      }
    } catch (err) {
      console.error('Backend ATS call error:', err);
      alert(err.response?.data?.error || err.message || 'ATS Resume Analysis failed. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#4f46e5';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const factorItems = result ? [
    { label: 'Keyword Match', weight: '30%', score: result.keywordMatch },
    { label: 'Skills Match', weight: '20%', score: result.skillsMatch },
    { label: 'Experience Relevance', weight: '15%', score: result.experienceMatch },
    { label: 'Education Match', weight: '10%', score: result.educationMatch },
    { label: 'Projects Relevance', weight: '10%', score: result.projectMatch },
    { label: 'Resume Formatting', weight: '5%', score: result.formattingScore },
    { label: 'Certifications', weight: '5%', score: result.certificationsScore },
    { label: 'Grammar & Readability', weight: '5%', score: result.grammarScore }
  ] : [];

  return (
    <div className="main-card">
      <div className="card-header-bar">
        <div className="card-title">
          <Target size={22} style={{ color: 'var(--primary-teal)' }} />
          <span>Professional ATS Resume Checker & Job Matcher</span>
        </div>
      </div>

      {/* AI Model Selector Bar */}
      <AiModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <button
          type="button"
          onClick={handleLoadSample}
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
            color: '#4f46e5',
            border: '1px solid rgba(79, 70, 229, 0.25)',
            padding: '7px 15px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sparkles size={14} color="#4f46e5" /> Load Sample Full-Stack Resume & Job Posting
        </button>
      </div>

      <div className="dual-pane-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {/* Left Column: Resume Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>Your Resume</label>
            <label className="btn-upload-file" style={{ cursor: 'pointer' }}>
              <Upload size={14} /> Upload Resume (PDF, DOCX, TXT)
              <input type="file" onChange={handleResumeUpload} accept=".pdf,.txt,.docx" hidden />
            </label>
          </div>
          <textarea
            className="custom-textarea"
            style={{ minHeight: '180px' }}
            placeholder="Paste your resume text or upload your CV file..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          {resumeFileName && (
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
              ✓ Loaded resume file: {resumeFileName}
            </div>
          )}
        </div>

        {/* Right Column: Job Description Input */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>Target Job Description</label>
            <label className="btn-upload-file" style={{ cursor: 'pointer' }}>
              <Upload size={14} /> Upload Job Posting
              <input type="file" onChange={handleJobUpload} accept=".pdf,.txt,.docx" hidden />
            </label>
          </div>
          <textarea
            className="custom-textarea"
            style={{ minHeight: '180px' }}
            placeholder="Paste the target job posting requirements, responsibilities, and key skills here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          {jobFileName && (
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, marginTop: '4px' }}>
              ✓ Loaded job description file: {jobFileName}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <button 
          className="btn-primary-action" 
          onClick={handleAnalyze}
          disabled={loading || ((!resumeText.trim() && !resumeFileName) || (!jobDescription.trim() && !jobFileName))}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          {loading ? 'Evaluating ATS Criteria...' : `Run Weighted ATS Resume Audit (${activeModelObj.name})`}
        </button>
      </div>

      {result && (
        <div className="results-card" style={{ marginTop: '24px', padding: '24px', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
          
          {/* Executive ATS Score Header & Circular Ring */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(16, 185, 129, 0.04) 100%)',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid rgba(79, 70, 229, 0.15)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Circular SVG Gauge */}
              <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--border-color, #e2e8f0)"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={getScoreColor(result.atsScore)}
                    strokeWidth="3.2"
                    strokeDasharray={`${result.atsScore}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: getScoreColor(result.atsScore) }}>
                    {result.atsScore}%
                  </span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>
                    ATS Compatibility
                  </span>
                  <span style={{
                    background: getScoreColor(result.atsScore),
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {result.overallRating || 'Good Match'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} color="#4f46e5" /> Powered by {result.provider || result.usedModel?.name || activeModelObj.name}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-dark)', lineHeight: '1.5', background: 'var(--card-bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <strong>ATS Summary:</strong> Your resume demonstrates a <strong>{result.atsScore}% overall match</strong> for the target role. Incorporate missing target keywords to boost scanner match rates.
            </div>
          </div>

          {/* 8-Factor Weighted Breakdown */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} style={{ color: '#4f46e5' }} /> 8-Factor Weighted Criteria Breakdown
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {factorItems.map((item, index) => (
                <div key={index} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-dark)' }}>{item.label} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({item.weight})</span></span>
                    <span style={{ color: getScoreColor(item.score) }}>{item.score}%</span>
                  </div>
                  <div style={{ height: '7px', width: '100%', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.score}%`, background: getScoreColor(item.score), borderRadius: '10px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords Matched vs Missing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Matched Keywords */}
            <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <CheckCircle size={17} /> Matched Target Keywords ({result.matchedKeywords?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.matchedKeywords && result.matchedKeywords.length > 0 ? (
                  result.matchedKeywords.map((kw, i) => (
                    <span key={i} style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '4px 10px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No exact keyword matches found.</span>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div style={{ background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <AlertTriangle size={17} /> Missing Target Keywords ({result.missingKeywords?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.missingKeywords && result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((kw, i) => (
                    <span key={i} style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '4px 10px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 700 }}>
                      + {kw}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 600 }}>Great job! No major missing keywords identified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Section-by-Section Analysis */}
          {result.sectionAnalysis && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} style={{ color: '#10b981' }} /> Section-by-Section ATS Audit
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {Object.entries(result.sectionAnalysis).map(([secKey, secVal], idx) => {
                  const titleMap = {
                    summary: 'Summary / Objective',
                    skills: 'Technical Skills',
                    experience: 'Work Experience',
                    projects: 'Projects & Portfolio',
                    education: 'Education & Degree',
                    certifications: 'Certifications & Licenses'
                  };
                  return (
                    <div key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', textTransform: 'capitalize' }}>
                          {titleMap[secKey] || secKey}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: getScoreColor(secVal.score || 80), background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '12px' }}>
                          {secVal.score || 80}%
                        </span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                        {secVal.feedback || 'Section formatted well for ATS scanning.'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths, Weaknesses, Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Strengths */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldCheck size={17} /> Key Resume Strengths
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
                {result.strengths && result.strengths.length > 0 ? (
                  result.strengths.map((str, i) => <li key={i}>{str}</li>)
                ) : (
                  <li>Good technical alignment with target position specifications.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <AlertTriangle size={17} /> Areas for Optimization
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
                {result.weaknesses && result.weaknesses.length > 0 ? (
                  result.weaknesses.map((w, i) => <li key={i}>{w}</li>)
                ) : (
                  <li>Ensure all work bullet points include quantifiable metrics.</li>
                )}
              </ul>
            </div>

            {/* Recommendations */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Lightbulb size={17} /> Actionable Steps to Boost Score
              </h4>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '6px', lineHeight: '1.4' }}>
                {result.recommendations && result.recommendations.length > 0 ? (
                  result.recommendations.map((rec, i) => <li key={i}>{rec}</li>)
                ) : (
                  <li>Add missing technical keywords to increase your overall match score.</li>
                )}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
