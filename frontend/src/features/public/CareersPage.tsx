import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, CareerJobSetting } from '../../hooks/useSiteContent';
import {
  Briefcase,
  Gift,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Send,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building,
  Pin,
} from 'lucide-react';

export const CareersPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSiteContent();
  const isEn = i18n.language === 'en';

  const [selectedJob, setSelectedJob] = useState<CareerJobSetting | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantSalary, setApplicantSalary] = useState('');
  const [applicantNote, setApplicantNote] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const activeJobs = (settings.careersJobs || []).filter((j) => j.active !== false);
  const sortedJobs = [...activeJobs].sort((a, b) => {
    if (Boolean(a.isPinned) && !Boolean(b.isPinned)) return -1;
    if (!Boolean(a.isPinned) && Boolean(b.isPinned)) return 1;
    return 0;
  });

  const handleOpenApply = (job: CareerJobSetting) => {
    setSelectedJob(job);
    setApplySuccess(false);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplyModalOpen(false);
      setApplySuccess(false);
      setApplicantName('');
      setApplicantPhone('');
      setApplicantEmail('');
      setApplicantSalary('');
      setApplicantNote('');
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-20 sm:px-6 lg:px-8 space-y-16 font-sans">
      {/* 1. Page Hero Banner */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-theme-primary">
          {settings.careersBadge || 'Careers & Opportunities'}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-theme-text leading-tight">
          {settings.careersHeading || 'ร่วมเป็นส่วนหนึ่งของการขับเคลื่อนอุตสาหกรรมบรรจุภัณฑ์สู่อนาคต'}
        </h1>
        <p className="text-sm sm:text-base text-theme-text-muted leading-relaxed">
          {settings.careersSubtitle ||
            'สร้างสรรค์นวัตกรรม เติบโตไปพร้อมกับทีมงานมืออาชีพในสภาพแวดล้อมที่ทันสมัย ปลอดภัย และมั่นคง'}
        </p>
      </div>

      {/* 2. Company Benefits Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-theme-border pb-3">
          <Gift className="h-5 w-5 text-theme-primary" />
          <h2 className="font-display text-lg font-bold text-theme-text">
            สิทธิประโยชน์และสวัสดิการพนักงาน (Benefits & Culture)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(settings.careersBenefits || []).map((benefit, idx) => (
            <div
              key={idx}
              className="glow-card flex items-start gap-3 rounded-2xl border border-theme-border bg-theme-surface p-5 transition-all"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-theme-primary/10 text-theme-primary">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-theme-text leading-relaxed">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Open Positions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-theme-border pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-theme-primary" />
            <h2 className="font-display text-lg font-bold text-theme-text">
              ตำแหน่งงานที่เปิดรับสมัคร (Open Positions)
            </h2>
          </div>
          <span className="text-xs font-bold text-theme-primary bg-theme-primary/10 px-3 py-1 rounded-full border border-theme-primary/20">
            {activeJobs.length} ตำแหน่งว่าง
          </span>
        </div>

        {activeJobs.length === 0 ? (
          <div className="rounded-2xl border border-theme-border bg-theme-surface p-12 text-center space-y-4">
            <Building className="h-12 w-12 text-theme-text-muted mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-theme-text">ยังไม่มีตำแหน่งงานเปิดรับสมัครในขณะนี้</h3>
              <p className="text-xs text-theme-text-muted max-w-md mx-auto">
                คุณสามารถส่งประวัติส่วนตัวและเรซูเม่มาที่อีเมล{' '}
                <a href={`mailto:${settings.email}`} className="text-theme-primary underline">
                  {settings.email}
                </a>{' '}
                เพื่อร่วมเป็นส่วนหนึ่งในฐานข้อมูลผู้สมัครล่วงหน้าได้ตลอดเวลา
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedJobs.map((job) => (
              <div
                key={job.id}
                className="glow-card flex flex-col justify-between rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-6 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-theme-primary/15 border border-theme-primary/30 px-2.5 py-1 text-[11px] font-bold text-theme-primary">
                        {job.department}
                      </span>
                      {Boolean(job.isPinned) && (
                        <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          <Pin className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>📌 เปิดรับด่วน / แนะนำ</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {job.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-theme-text leading-snug">
                      {isEn ? (job.titleEn || job.titleTh) : job.titleTh}
                    </h3>
                    {isEn && job.titleTh && (
                      <span className="text-[11px] text-theme-text-muted">{job.titleTh}</span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-theme-text-muted">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-theme-primary flex-shrink-0" />
                      <span>ประสบการณ์: {job.experience}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-2 text-theme-text font-semibold">
                        <DollarSign className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                        <span>เงินเดือน: {job.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-theme-border/60">
                      <span className="text-[11px] font-bold text-theme-text uppercase tracking-wider">
                        คุณสมบัติสำคัญ:
                      </span>
                      <ul className="space-y-1 text-xs text-theme-text-muted">
                        {job.requirements.slice(0, 3).map((req, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-1.5">
                            <span className="h-1 w-1 rounded-full bg-theme-primary" />
                            <span className="truncate">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenApply(job)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-theme-primary/15 border border-theme-primary/40 py-2.5 text-xs font-bold text-theme-primary hover:bg-theme-primary hover:text-black transition-all shadow-sm"
                >
                  <span>สมัครตำแหน่งนี้</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {applyModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-theme-border bg-theme-surface p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-5 right-5 rounded-full p-2 text-theme-text-muted hover:bg-theme-surface-elevated hover:text-theme-text transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-theme-primary uppercase">ใบสมัครงานออนไลน์</span>
              <h3 className="font-display text-lg font-bold text-theme-text">
                {selectedJob.titleTh}
              </h3>
              <p className="text-xs text-theme-text-muted">{selectedJob.department} • {selectedJob.location}</p>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-base font-bold text-theme-text">ส่งใบสมัครเรียบร้อยแล้ว!</h4>
                <p className="text-xs text-theme-text-muted max-w-xs mx-auto">
                  ฝ่ายทรัพยากรบุคคล (HR) ได้รับข้อมูลของคุณแล้ว และจะติดต่อกลับโดยเร็วที่สุด
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-theme-text mb-1">ชื่อ - นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="นายสมชาย ใจดี"
                    className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-theme-text focus:border-theme-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-theme-text mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="081-234-5678"
                      className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-theme-text focus:border-theme-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-theme-text mb-1">อีเมล *</label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-theme-text focus:border-theme-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-theme-text mb-1">เงินเดือนที่คาดหวัง</label>
                  <input
                    type="text"
                    value={applicantSalary}
                    onChange={(e) => setApplicantSalary(e.target.value)}
                    placeholder="เช่น 35,000 บาท/เดือน"
                    className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-theme-text focus:border-theme-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-theme-text mb-1">ข้อความแนะนำตัว / ลิงก์ Resume</label>
                  <textarea
                    rows={3}
                    value={applicantNote}
                    onChange={(e) => setApplicantNote(e.target.value)}
                    placeholder="สรุปประสบการณ์ทำงานโดยย่อ หรือแปะลิงก์ Google Drive / LinkedIn..."
                    className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-theme-primary py-3 text-xs font-bold text-black shadow-lg shadow-theme-primary/20 hover:opacity-90 transition-all mt-2"
                >
                  <Send className="h-4 w-4" />
                  <span>ส่งใบสมัครงานทันที</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
