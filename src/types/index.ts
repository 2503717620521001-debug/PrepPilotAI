/**
 * Shared TypeScript types for PrepPilot AI
 */

export type CareerRole =
  | 'Software Developer'
  | 'VLSI Engineer'
  | 'Embedded Systems Engineer'
  | 'Electronics Engineer'
  | 'Data Analyst'
  | 'Data Scientist'
  | 'DevOps / Cloud Engineer';

export type AssessmentCategory =
  | 'Quantitative Aptitude'
  | 'Logical Reasoning'
  | 'Programming'
  | 'Data Structures and Algorithms'
  | 'Technical Knowledge'
  | 'Communication';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  college?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: string;
  targetCareer: CareerRole;
  preferredLanguage: 'Python' | 'Java' | 'C' | 'C++';
  prepLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weakSubjects: string[];
  dailyStudyTimeMinutes: number;
  targetDurationDays: number;
  isOnboarded: boolean;
  currentStreak: number;
  totalStudyMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  category: AssessmentCategory;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  codeSnippet?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  category: AssessmentCategory | 'Comprehensive Diagnostic';
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  score: number; // percentage 0-100
  totalQuestions: number;
  correctCount: number;
  timeSpentSeconds: number;
  isComparableDiagnostic: boolean;
  topicBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  userAnswers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  completedAt: string;
  createdAt: string;
}

export interface SkillProfile {
  userId: string;
  overallScore: number;
  aptitudeScore: number;
  logicalScore: number;
  codingScore: number;
  technicalScore: number;
  communicationScore: number;
  strongTopics: string[];
  weakTopics: string[];
  repeatedMistakes: string[];
  learningPriorities: { topic: string; reason: string; priority: 'High' | 'Medium' | 'Low' }[];
  aiExplanation: string;
  updatedAt: string;
}

export interface RoadmapTask {
  id: string;
  roadmapId: string;
  userId: string;
  dayNumber: number;
  title: string;
  topic: string;
  category: AssessmentCategory;
  estimatedMinutes: number;
  description: string;
  exercises: string[];
  revisionNotes?: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  durationDays: 7 | 15 | 30 | 60;
  targetCareer: CareerRole;
  progressPercentage: number;
  completedTasksCount: number;
  totalTasksCount: number;
  currentDay: number;
  status: 'active' | 'completed' | 'archived';
  suggestedAdjustment?: {
    reason: string;
    newFocusTopic: string;
    adjustedDays: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InterviewMessage {
  id: string;
  role: 'interviewer' | 'student';
  content: string;
  timestamp: string;
  feedback?: {
    relevanceScore: number;
    technicalAccuracyScore: number;
    clarityScore: number;
    tips: string[];
  };
}

export interface InterviewSession {
  id: string;
  userId: string;
  interviewType: 'HR' | 'Technical' | 'Behavioral' | 'Role-Specific';
  targetCareer: CareerRole;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  messages: InterviewMessage[];
  overallScore?: number;
  feedback?: {
    answerRelevance: string;
    technicalAccuracy: string;
    clarity: string;
    completeness: string;
    strengths: string[];
    areasForImprovement: string[];
    suggestedAnswerStructure: string;
    recommendedPractice: string[];
  };
  completedAt?: string;
  createdAt: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  category:
    | 'Arrays'
    | 'Strings'
    | 'Searching'
    | 'Sorting'
    | 'Recursion'
    | 'Linked Lists'
    | 'Stacks'
    | 'Queues'
    | 'Trees'
    | 'Dynamic Programming';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    Python: string;
    Java: string;
    C: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
  hints: string[];
  solutionExplanation: string;
}

export interface CodingSubmission {
  id: string;
  userId: string;
  problemId: string;
  language: 'Python' | 'Java' | 'C';
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error';
  passedTests: number;
  totalTests: number;
  executionTimeMs: number;
  memoryKb?: number;
  outputLog?: string;
  submittedAt: string;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  identifiedSkills: string[];
  missingKeywords: string[];
  projectCritique: {
    title: string;
    originalBullet: string;
    improvedBullet: string;
    metricSuggestion: string;
  }[];
  structureReview: {
    section: string;
    status: 'Strong' | 'Needs Improvement' | 'Missing';
    notes: string;
  }[];
  readabilityScore: number;
  actionableFeedback: string[];
  improvedSummaryDraft: string;
}

export interface AchievementBadge {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface CompanyTrack {
  id: string;
  companyName: string;
  category: 'Product Based' | 'Service Based' | 'Core Hardware / Semiconductor';
  hiringRounds: {
    roundNumber: number;
    roundName: string;
    description: string;
    commonTopics: string[];
  }[];
  cutoffAptitudeScore: number;
  frequentlyAskedDSA: string[];
  sampleQuestions: {
    question: string;
    type: 'Coding' | 'Technical MCQs' | 'Behavioral';
  }[];
  prepTips: string[];
}
