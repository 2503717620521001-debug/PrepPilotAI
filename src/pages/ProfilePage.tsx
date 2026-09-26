import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CareerRole } from '../types';
import {
  User,
  Save,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Clock,
  Target,
  Mail,
  KeyRound,
  Database,
  LogOut,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateStudentProfile, currentUser, sendVerificationEmail, reloadUser, logout, isGuest } = useAuth();

  const [name, setName] = useState(profile?.displayName || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(profile?.branch || 'Computer Science and Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.yearOfStudy || 'Final Year (4th)');
  const [targetCareer, setTargetCareer] = useState<CareerRole>(profile?.targetCareer || 'Software Developer');
  const [preferredLanguage, setPreferredLanguage] = useState<'Python' | 'Java' | 'C' | 'C++'>(profile?.preferredLanguage || 'Python');
  const [prepLevel, setPrepLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(profile?.prepLevel || 'Intermediate');
  const [dailyMinutes, setDailyMinutes] = useState(profile?.dailyStudyTimeMinutes || 90);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Email verification state
  const [sendingVerify, setSendingVerify] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [verifyErr, setVerifyErr] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateStudentProfile({
        displayName: name,
        college,
        degree,
        branch,
        yearOfStudy,
        targetCareer,
        preferredLanguage,
        prepLevel,
        dailyStudyTimeMinutes: dailyMinutes
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingVerify(true);
    setVerifyMsg(null);
    setVerifyErr(null);
    try {
      await sendVerificationEmail();
      setVerifyMsg('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setVerifyErr(err.message || 'Failed to send verification email.');
    } finally {
      setSendingVerify(false);
    }
  };

  const handleCheckVerification = async () => {
    setCheckingStatus(true);
    try {
      await reloadUser();
    } catch (err: any) {
      console.error(err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const isGoogleUser = currentUser?.providerData?.some((p) => p.providerId === 'google.com');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              Student Profile & Placement Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your academic background, target placement track, and daily study schedule.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200 animate-in fade-in">
            <CheckCircle2 size={15} /> Saved successfully!
          </div>
        )}
      </div>

      {/* Account & Authentication Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-[#172554] dark:text-white">
              Authentication & Security Details
            </h2>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 dark:text-rose-300 text-xs font-semibold transition-colors"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Sign-In Provider
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                {isGoogleUser ? 'Google OAuth 2.0' : isGuest ? 'Guest Demo Mode' : 'Email & Password'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {isGoogleUser ? 'Verified with Google Account' : isGuest ? 'Local evaluation state' : 'Firebase Password Auth'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Cloud Firestore Persistence
            </span>
            <div className="mt-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Active & Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
              {currentUser ? `users/${currentUser.uid}` : 'Local temporary state'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Email Verification
            </span>
            <div className="mt-1 flex items-center gap-2">
              {currentUser?.emailVerified || isGoogleUser ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400">
                  <CheckCircle2 size={14} /> Verified
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Unverified
                </span>
              )}
            </div>
            {currentUser && !currentUser.emailVerified && !isGoogleUser && (
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={sendingVerify}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 underline"
                >
                  {sendingVerify ? 'Sending...' : 'Send link'}
                </button>
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={checkingStatus}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  <RefreshCw size={11} className={checkingStatus ? 'animate-spin' : ''} /> Check
                </button>
              </div>
            )}
          </div>
        </div>

        {verifyMsg && (
          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={14} /> {verifyMsg}
          </div>
        )}
        {verifyErr && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={14} /> {verifyErr}
          </div>
        )}
      </div>

      {/* Main Student Profile Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              College or University
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Chennai Institute of Technology"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Degree Program
            </label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>B.Tech</option>
              <option>B.E.</option>
              <option>M.Tech</option>
              <option>MCA</option>
              <option>BCA</option>
              <option>B.Sc Computer Science</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Academic Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Computer Science and Engineering</option>
              <option>Information Technology</option>
              <option>Electronics and Communication (ECE)</option>
              <option>Electrical and Electronics (EEE)</option>
              <option>Artificial Intelligence & Data Science</option>
              <option>Mechanical Engineering</option>
              <option>Other Engineering Discipline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Year
            </label>
            <select
              value={yearOfStudy}
              onChange={(e) => setYearOfStudy(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>1st Year (Freshman)</option>
              <option>2nd Year (Sophomore)</option>
              <option>3rd Year (Pre-Final)</option>
              <option>Final Year (4th)</option>
              <option>Recent Graduate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Placement Career
            </label>
            <select
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value as CareerRole)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Software Developer</option>
              <option>VLSI Engineer</option>
              <option>Embedded Systems Engineer</option>
              <option>Electronics Engineer</option>
              <option>Data Analyst</option>
              <option>Data Scientist</option>
              <option>DevOps / Cloud Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Primary Language
            </label>
            <select
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              <option>C</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Daily Study Goal (Minutes)
            </label>
            <select
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={45}>45 Minutes / day</option>
              <option value={60}>1 Hour / day</option>
              <option value={90}>1.5 Hours / day</option>
              <option value={120}>2 Hours / day</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
