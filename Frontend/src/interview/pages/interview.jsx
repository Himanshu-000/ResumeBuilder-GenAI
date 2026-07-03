import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hook/useinterview'
import { useParams } from "react-router-dom";
import {
    Code2,
    MessageCircleMore,
    Target,
    Brain,
    Download,
    BookOpen,
    TrendingUp,
    CalendarDays,
    Award,
    CheckCircle2,
    ChevronDown,
    Sparkles,
    Clock3,
    CircleAlert,
    ArrowRight,
    BadgeCheck,
    PlayCircle
} from 'lucide-react'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: <Code2 size={16} /> },
    { id: 'behavioral', label: 'Behavioral Questions', icon: <MessageCircleMore size={16} /> },
    { id: 'roadmap', label: 'Road Map', icon: <Target size={16} /> }
]

const QuestionCard = ({ item, index, section }) => {
    const [open, setOpen] = useState(false)
    const isBehavioral = section === 'behavioral'
    const difficulty = isBehavioral ? 'Moderate' : 'Advanced'
    const expectedTime = isBehavioral ? '8–10 min' : '6–8 min'
    const tags = isBehavioral
        ? ['STAR Method', 'Leadership', 'Communication']
        : ['Core Concepts', 'Trade-offs', 'Scalability']
    const keyConcepts = isBehavioral
        ? ['Ownership', 'Outcome', 'Reflection']
        : ['System design', 'Performance', 'Edge cases']
    const commonMistakes = isBehavioral
        ? ['Vague examples', 'No ownership', 'Weak reflection']
        : ['Over-explaining', 'Ignoring constraints', 'No trade-offs']

    const handleCopy = async () => {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(item.answer)
        }
    }

    return (
        <article className={`q-card ${open ? 'q-card--open' : ''}`}>
            <button
                type='button'
                className='q-card__header'
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
            >
                <div className='q-card__leading'>
                    <span className='q-card__index'>Q{index + 1}</span>
                    <div className='q-card__meta'>
                        <p className='q-card__eyebrow'>{isBehavioral ? 'Behavioral focus' : 'Technical focus'}</p>
                        <h3 className='q-card__question'>{item.question}</h3>
                    </div>
                </div>
                <div className='q-card__actions'>
                    <span className='q-card__pill'>{difficulty}</span>
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <ChevronDown size={16} />
                    </span>
                </div>
            </button>

            <div className={`q-card__body ${open ? 'q-card__body--open' : ''}`}>
                <div className='q-card__grid'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Interviewer intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>

                <div className='q-card__footer'>
                    <div className='q-card__chip-row'>
                        {tags.map((tag) => (
                            <span key={tag} className='q-card__chip'>{tag}</span>
                        ))}
                    </div>

                    <div className='q-card__meta-row'>
                        <div className='q-card__meta-item'>
                            <Brain size={14} />
                            <span>Key concepts: {keyConcepts.join(', ')}</span>
                        </div>
                        <div className='q-card__meta-item'>
                            <CircleAlert size={14} />
                            <span>Common mistakes: {commonMistakes.join(', ')}</span>
                        </div>
                        <div className='q-card__meta-item'>
                            <Clock3 size={14} />
                            <span>Expected answer: {expectedTime}</span>
                        </div>
                    </div>

                    <div className='q-card__footer-actions'>
                        <button type='button' className='button button--secondary' onClick={handleCopy}>
                            <BookOpen size={14} />
                            Copy answer
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

const RoadMapDay = ({ day, index }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__marker' />
        <div className='roadmap-day__card'>
            <div className='roadmap-day__top'>
                <span className='roadmap-day__badge'>Day {day.day}</span>
                <span className='roadmap-day__progress'>Step {index + 1}</span>
            </div>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
            <ul className='roadmap-day__tasks'>
                {day.tasks.map((task, i) => (
                    <li key={i}>
                        <CheckCircle2 size={14} />
                        <span>{task}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
   

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])


     if(loading || !report) {
        return (
            <main className='loading-screen'>
                <div className='loading-screen__card'>
                    <div className='loading-screen__icon'>
                        <Sparkles size={20} />
                    </div>
                    <h1>Preparing your interview workspace…</h1>
                    <p>We are assembling your tailored questions, insights, and roadmap.</p>
                </div>
            </main>
        )
    }





    const scoreTone = report.matchScore >= 90 ? 'score--high' : report.matchScore >= 70 ? 'score--mid' : 'score--low'
    const scoreLabel = report.matchScore >= 90 ? 'Excellent fit' : report.matchScore >= 70 ? 'Strong fit' : 'Needs sharpening'
    const assessmentText = report.matchScore >= 80
        ? 'Your profile already shows a strong alignment with the role. The biggest gains now come from refining delivery and closing the remaining skill gaps.'
        : 'The foundation is solid, but a few targeted gaps remain. Focus on clarity, storytelling, and technical depth for the strongest interview performance.'
    const progressPercent = Math.min(100, Math.round((report.preparationPlan?.length || 0) / 7 * 100))

    return (
        <div className='interview-page'>
            <div className='interview-shell'>
                <aside className='interview-sidebar-left'>
                    <div className='brand-card'>
                        <div className='brand-card__mark'>
                            <Sparkles size={18} />
                        </div>

                        <div>
                            <p className='brand-card__eyebrow'>Interview report</p>
                            <h1>Resume AI</h1>
                        </div>
                    </div>

                    <nav className='interview-nav' aria-label='Interview sections'>
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                type='button'
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <button type='button' className='button button--primary interview-sidebar-left__action' onClick={() => { getResumePdf(interviewId) }}>
                        <Download size={16} />
                        Download resume
                    </button>
                </aside>

                <main className='interview-content'>
                    <section className='hero-card'>
                        <div className='hero-card__copy'>
                            <p className='hero-card__eyebrow'>AI preparation workspace</p>
                            <h2>{report.title || 'Interview report'}</h2>
                            <p>Review your tailored interview questions, gaps, and next-step roadmap in one premium workspace.</p>
                        </div>
                        <div className='hero-card__badges'>
                            <span className='hero-chip'>
                                <Award size={14} />
                                Updated insights
                            </span>
                            <span className='hero-chip'>
                                <TrendingUp size={14} />
                                Premium dashboard
                            </span>
                        </div>
                    </section>

                    {activeNav === 'technical' && (
                        <section className='section-card'>
                            <div className='section-card__header'>
                                <div>
                                    <p className='section-card__eyebrow'>Curated questions</p>
                                    <h3>Technical Questions</h3>
                                </div>
                                <span className='section-card__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} section='technical' />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section className='section-card'>
                            <div className='section-card__header'>
                                <div>
                                    <p className='section-card__eyebrow'>Story-driven prompts</p>
                                    <h3>Behavioral Questions</h3>
                                </div>
                                <span className='section-card__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} section='behavioral' />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section className='section-card'>
                            <div className='section-card__header'>
                                <div>
                                    <p className='section-card__eyebrow'>Preparation path</p>
                                    <h3>Preparation Roadmap</h3>
                                </div>
                                <span className='section-card__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day, index) => (
                                    <RoadMapDay key={day.day} day={day} index={index} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <aside className='interview-sidebar-right'>
                    <div className='summary-card summary-card--score'>
                        <div className='summary-card__header'>
                            <p className='summary-card__eyebrow'>Match score</p>
                            <h3>{report.matchScore}%</h3>
                        </div>
                        <div className={`score-ring ${scoreTone}`}>
                            <svg viewBox='0 0 120 120' className='score-ring__svg'>
                                <circle cx='60' cy='60' r='48' className='score-ring__track' />
                                <circle
                                    cx='60'
                                    cy='60'
                                    r='48'
                                    className='score-ring__value'
                                    style={{ strokeDasharray: `${(report.matchScore / 100) * 301.59} 301.59` }}
                                />
                            </svg>
                            <div className='score-ring__label'>
                                <span>{report.matchScore}</span>
                                <small>%</small>
                            </div>
                        </div>
                        <p className='summary-card__text'>{scoreLabel}</p>
                    </div>

                    <div className='summary-card'>
                        <div className='summary-card__header'>
                            <p className='summary-card__eyebrow'>Overall assessment</p>
                            <h3>Executive summary</h3>
                        </div>
                        <p className='summary-card__text'>{assessmentText}</p>
                    </div>

                    <div className='summary-card'>
                        <div className='summary-card__header'>
                            <p className='summary-card__eyebrow'>Skill gap analysis</p>
                            <h3>Focus areas</h3>
                        </div>
                        <div className='skill-gaps'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className='summary-card'>
                        <div className='summary-card__header'>
                            <p className='summary-card__eyebrow'>Preparation progress</p>
                            <h3>Next milestones</h3>
                        </div>
                        <div className='progress-meter'>
                            <div className='progress-meter__bar' style={{ width: `${progressPercent}%` }} />
                        </div>
                        <div className='summary-card__meta'>
                            <span>{report.preparationPlan.length} day plan</span>
                            <span>{progressPercent}% ready</span>
                        </div>
                    </div>

                    <div className='summary-card'>
                        <div className='summary-card__header'>
                            <p className='summary-card__eyebrow'>Recommended resources</p>
                            <h3>Study stack</h3>
                        </div>
                        <ul className='resource-list'>
                            <li><BookOpen size={14} /> <span>System design primer</span></li>
                            <li><PlayCircle size={14} /> <span>Mock interview set</span></li>
                            <li><CalendarDays size={14} /> <span>Weekly review planner</span></li>
                        </ul>
                    </div>

                    <div className='summary-card'>
                        <div className='summary-card__header'>
                            <p className='summary-card__eyebrow'>Quick tips</p>
                            <h3>Interview playbook</h3>
                        </div>
                        <ul className='tip-list'>
                            <li><ArrowRight size={14} /> <span>Lead with the outcome before the process.</span></li>
                            <li><ArrowRight size={14} /> <span>Use a concise STAR story structure.</span></li>
                            <li><ArrowRight size={14} /> <span>Quantify impact whenever possible.</span></li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default Interview