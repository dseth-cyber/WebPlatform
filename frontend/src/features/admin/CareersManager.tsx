import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteContent, CareerJobSetting } from '../../hooks/useSiteContent';
import {
  Briefcase,
  Gift,
  Save,
  Check,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Pin,
} from 'lucide-react';

import { MultiLangSectionEditor } from './MultiLangSectionEditor';

export const CareersManager: React.FC = () => {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSiteContent();

  const [badge, setBadge] = useState(settings.careersBadge || 'Careers & Opportunities');
  const [heading, setHeading] = useState(
    settings.careersHeading || 'ร่วมเป็นส่วนหนึ่งของการขับเคลื่อนอุตสาหกรรมบรรจุภัณฑ์สู่อนาคต'
  );
  const [subtitle, setSubtitle] = useState(
    settings.careersSubtitle ||
      'สร้างสรรค์นวัตกรรม เติบโตไปพร้อมกับทีมงานมืออาชีพในสภาพแวดล้อมที่ทันสมัย ปลอดภัย และมั่นคง'
  );
  const [benefitsText, setBenefitsText] = useState(
    (settings.careersBenefits || []).join('\n')
  );
  const [jobs, setJobs] = useState<CareerJobSetting[]>(settings.careersJobs || []);

  const [careersTranslations, setCareersTranslations] = useState<any>(
    settings.careersTranslations || {
      en: { badge: 'Careers & Opportunities', heading: '', subtitle: '' },
      jp: { badge: '採用情報', heading: '', subtitle: '' },
      cn: { badge: '招贤纳士', heading: '', subtitle: '' },
      mm: { badge: 'အလုပ်အကိုင် အခွင့်အလမ်းများ', heading: '', subtitle: '' },
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.careersBadge) setBadge(settings.careersBadge);
      if (settings.careersHeading) setHeading(settings.careersHeading);
      if (settings.careersSubtitle) setSubtitle(settings.careersSubtitle);
      if (settings.careersBenefits && settings.careersBenefits.length > 0) {
        setBenefitsText(settings.careersBenefits.join('\n'));
      }
      if (settings.careersJobs && settings.careersJobs.length > 0) {
        setJobs(settings.careersJobs);
      }
      if (settings.careersTranslations) {
        setCareersTranslations(settings.careersTranslations);
      }
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleJobChange = (index: number, field: keyof CareerJobSetting, value: any) => {
    const updated = [...jobs];
    updated[index] = { ...updated[index], [field]: value };
    setJobs(updated);
  };

  const handleAddJob = () => {
    const newJob: CareerJobSetting = {
      id: `job-${Date.now()}`,
      titleTh: 'ตำแหน่งงานใหม่ (New Position)',
      titleEn: 'New Position Title',
      department: 'ฝ่ายผลิตและวิศวกรรม',
      type: 'งานประจำ (Full-Time)',
      location: 'โรงงานกระทุ่มแบน จ.สมุทรสาคร',
      experience: '1 - 3 ปี',
      description: 'หน้าที่ความรับผิดชอบและขอบเขตงาน...',
      requirements: ['วุฒิการศึกษาตามที่กำหนด', 'มีทักษะการทำงานเป็นทีม'],
      salaryRange: 'ตามตกลง / โครงสร้างบริษัท',
      active: true,
      isPinned: false,
    };
    setJobs([...jobs, newJob]);
  };

  const handleDeleteJob = (index: number) => {
    if (jobs.length <= 1) {
      alert('ต้องมีตำแหน่งงานอย่างน้อย 1 รายการ');
      return;
    }
    setJobs(jobs.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const parsedBenefits = benefitsText
        .split('\n')
        .map((b) => b.trim())
        .filter((b) => b.length > 0);

      await updateSettings({
        careersBadge: badge,
        careersHeading: heading,
        careersSubtitle: subtitle,
        careersBenefits: parsedBenefits,
        careersJobs: jobs,
        careersTranslations,
      });
      showToast('บันทึกข้อมูลหน้าสมัครงานเรียบร้อยแล้ว');
    } catch (err: any) {
      alert('เกิดข้อผิดพลาดในการบันทึก: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-theme-primary/40 bg-slate-900/90 px-4 py-3 text-xs font-semibold text-theme-primary shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <Check className="h-4 w-4 text-theme-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-theme-primary/10 text-theme-primary">
              <Briefcase className="h-4 w-4" />
            </span>
            <h1 className="font-display text-xl font-bold text-theme-text">
              {t('admin.careersTitle', 'จัดการเนื้อหา: สมัครงาน & ร่วมงานกับเรา (Careers CMS)')}
            </h1>
          </div>
          <p className="text-xs text-theme-text-muted mt-1">
            {t('admin.careersSubtitle', 'แก้ไขหัวข้อ สวัสดิการองค์กร และตำแหน่งงานว่าง (Job Openings) ในหน้าเว็บสาธารณะ (/careers)')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-theme-primary px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-theme-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? t('admin.saving', 'กำลังบันทึก...') : t('admin.saveChanges', 'บันทึกการเปลี่ยนแปลง')}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Page Header & Recruitment Pitch */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="border-b border-theme-border/60 pb-3">
            <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-theme-primary" />
              <span>1. ข้อมูลหัวข้อหน้าสมัครงาน (Page Banner & Header)</span>
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-theme-text mb-1.5">
                {t('admin.fieldBadge', 'ป้ายกำกับด้านบน (Badge / Subtitle Tag)')}
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Careers & Opportunities"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-text mb-1.5">
                {t('admin.fieldHeading', 'หัวข้อหลักของหน้า (Page Title)')}
              </label>
              <input
                type="text"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="ร่วมเป็นส่วนหนึ่งของการขับเคลื่อนอุตสาหกรรมบรรจุภัณฑ์สู่อนาคต"
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs font-bold text-theme-text focus:border-theme-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-text mb-1.5">
                สโลแกนเชิญชวนร่วมงาน (Subtitle / Culture Pitch)
              </label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="สร้างสรรค์นวัตกรรม เติบโตไปพร้อมกับทีมงานมืออาชีพ..."
                className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text focus:border-theme-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 1.5 Multi-Language Translations (EN, JP, CN, MM) */}
        <MultiLangSectionEditor
          title={`${t('admin.multiLangTitle', 'แปลภาษา (Multi-Language)')} - ${t('admin.careers', 'ร่วมงานกับเรา')}`}
          fields={[
            { key: 'badge', label: 'Badge' },
            { key: 'heading', label: 'Title / Heading' },
            { key: 'subtitle', label: 'Subtitle / Culture Pitch', type: 'textarea', rows: 3 },
          ]}
          value={careersTranslations}
          onChange={setCareersTranslations}
        />

        {/* Section 2: Employee Benefits */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="border-b border-theme-border/60 pb-3">
            <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
              <Gift className="h-4 w-4 text-theme-primary" />
              <span>2. สิทธิประโยชน์และสวัสดิการพนักงาน (Company Benefits)</span>
            </h2>
            <p className="text-[11px] text-theme-text-muted mt-0.5">
              พิมพ์สวัสดิการของบริษัท โดยแยก 1 รายการ ต่อ 1 บรรทัด
            </p>
          </div>

          <textarea
            rows={5}
            value={benefitsText}
            onChange={(e) => setBenefitsText(e.target.value)}
            placeholder="โบนัสประจำปีและโบนัสผลงาน&#10;กองทุนสำรองเลี้ยงชีพ (Provident Fund)&#10;ประกันสุขภาพกลุ่มและตรวจสุขภาพประจำปี&#10;เบี้ยขยันและค่าทำงานล่วงเวลา (OT)"
            className="w-full rounded-xl border border-theme-border bg-theme-surface-elevated px-3.5 py-2.5 text-xs text-theme-text font-mono focus:border-theme-primary focus:outline-none leading-relaxed"
          />
        </div>

        {/* Section 3: Job Openings List */}
        <div className="rounded-2xl border border-theme-border bg-theme-surface p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
            <div>
              <h2 className="font-display text-sm font-bold text-theme-text flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-theme-primary" />
                <span>3. ตำแหน่งงานที่เปิดรับสมัคร (Job Openings)</span>
              </h2>
              <p className="text-[11px] text-theme-text-muted mt-0.5">
                สามารถเปิด/ปิดการรับสมัครชั่วคราว หรือเพิ่ม/ลบตำแหน่งงานได้
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddJob}
              className="inline-flex items-center gap-1.5 rounded-lg border border-theme-primary/40 bg-theme-primary/10 px-3 py-1.5 text-xs font-bold text-theme-primary hover:bg-theme-primary/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t('admin.addJobPosition', 'เพิ่มตำแหน่งงานใหม่')}</span>
            </button>
          </div>

          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <div
                key={job.id || idx}
                className={`rounded-xl border p-5 space-y-4 relative transition-all ${
                  job.active
                    ? 'border-theme-border bg-theme-surface-elevated'
                    : 'border-theme-border/40 bg-theme-surface/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-theme-primary/15 text-theme-primary">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-theme-primary uppercase">
                          Position #{idx + 1}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            job.active
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {job.active ? 'กำลังเปิดรับสมัคร (Active)' : 'ปิดรับสมัครชั่วคราว'}
                        </span>
                        {Boolean(job.isPinned) && (
                          <span className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Pin className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span>{t('admin.pinToHome', 'ปักหมุดหน้าแรก')}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-theme-text truncate max-w-[300px]">
                        {job.titleTh}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 📌 Pin Toggle Button */}
                    <button
                      type="button"
                      onClick={async () => {
                        const updated = [...jobs];
                        const nextPinned = !Boolean(updated[idx].isPinned);
                        updated[idx] = { ...updated[idx], isPinned: nextPinned };
                        setJobs(updated);
                        await updateSettings({ careersJobs: updated });
                        showToast(
                          nextPinned
                            ? `📌 ปักหมุดตำแหน่งงาน "${job.titleTh || 'นี้'}" บนหน้าแรกแล้ว`
                            : `ยกเลิกการปักหมุด "${job.titleTh || 'นี้'}" แล้ว`
                        );
                      }}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                        Boolean(job.isPinned)
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                          : 'bg-theme-surface text-theme-text-muted hover:text-theme-text border border-theme-border'
                      }`}
                      title={Boolean(job.isPinned) ? 'คลิกเพื่อยกเลิกการปักหมุดหน้าแรก' : 'คลิกเพื่อปักหมุดแสดงที่หน้าแรก'}
                    >
                      <Pin className={`h-3.5 w-3.5 ${Boolean(job.isPinned) ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{Boolean(job.isPinned) ? '📌 ปักหมุดหน้าแรก' : 'ปักหมุดหน้าแรก'}</span>
                    </button>

                    {/* Toggle Active Switch */}
                    <button
                      type="button"
                      onClick={() => handleJobChange(idx, 'active', !job.active)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border border-theme-border hover:bg-theme-surface transition-colors"
                      title={job.active ? 'คลิกเพื่อปิดรับสมัครชั่วคราว' : 'คลิกเพื่อเปิดรับสมัคร'}
                    >
                      {job.active ? (
                        <ToggleRight className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-slate-400" />
                      )}
                      <span className="text-[11px] text-theme-text-muted">
                        {job.active ? 'เปิดรับ' : 'ปิดรับ'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteJob(idx)}
                      className="rounded-lg p-1.5 text-theme-text-dim hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      title="ลบตำแหน่งนี้"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        ชื่อตำแหน่งงาน (ภาษาไทย) *
                      </label>
                      <input
                        type="text"
                        value={job.titleTh}
                        onChange={(e) => handleJobChange(idx, 'titleTh', e.target.value)}
                        placeholder="เช่น วิศวกรควบคุมเครื่องเชื่อมความเร็วสูง"
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs font-bold text-theme-text focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        ชื่อตำแหน่งงาน (ภาษาอังกฤษ)
                      </label>
                      <input
                        type="text"
                        value={job.titleEn}
                        onChange={(e) => handleJobChange(idx, 'titleEn', e.target.value)}
                        placeholder="e.g. Production Engineer"
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        แผนก / ฝ่าย
                      </label>
                      <input
                        type="text"
                        value={job.department}
                        onChange={(e) => handleJobChange(idx, 'department', e.target.value)}
                        placeholder="ฝ่ายผลิต, QA/QC, ฝ่ายขาย"
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        ประเภทงาน
                      </label>
                      <select
                        value={job.type}
                        onChange={(e) => handleJobChange(idx, 'type', e.target.value)}
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                      >
                        <option value="งานประจำ (Full-Time)">งานประจำ (Full-Time)</option>
                        <option value="สัญญาจ้าง (Contract)">สัญญาจ้าง (Contract)</option>
                        <option value="นักศึกษาฝึกงาน (Internship)">นักศึกษาฝึกงาน (Internship)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        สถานที่ปฏิบัติงาน
                      </label>
                      <input
                        type="text"
                        value={job.location}
                        onChange={(e) => handleJobChange(idx, 'location', e.target.value)}
                        placeholder="โรงงานกระทุ่มแบน"
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-theme-text mb-1">
                        อัตราเงินเดือน
                      </label>
                      <input
                        type="text"
                        value={job.salaryRange || ''}
                        onChange={(e) => handleJobChange(idx, 'salaryRange', e.target.value)}
                        placeholder="30,000 - 45,000 บาท"
                        className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-theme-text mb-1">
                      หน้าที่ความรับผิดชอบ (Job Description)
                    </label>
                    <textarea
                      rows={2}
                      value={job.description}
                      onChange={(e) => handleJobChange(idx, 'description', e.target.value)}
                      placeholder="ขอบเขตงานและความรับผิดชอบในตำแหน่งนี้..."
                      className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-theme-text mb-1">
                      คุณสมบัติผู้สมัคร (Requirements - แยก 1 ข้อต่อ 1 บรรทัด)
                    </label>
                    <textarea
                      rows={3}
                      value={(job.requirements || []).join('\n')}
                      onChange={(e) =>
                        handleJobChange(
                          idx,
                          'requirements',
                          e.target.value.split('\n').filter((l) => l.trim().length > 0)
                        )
                      }
                      placeholder="วุฒิปริญญาตรี สาขาที่เกี่ยวข้อง&#10;มีประสบการณ์ 2 ปีขึ้นไป&#10;สามารถเข้ากะได้"
                      className="w-full rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text font-mono focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Multi-Language Tabs for this Job Position */}
                  <div className="pt-2">
                    <MultiLangSectionEditor
                      compact
                      title={`แปลภาษาตำแหน่งงาน: ${job.titleTh || 'ตำแหน่งงาน'}`}
                      fields={[
                        { key: 'title', label: 'ชื่อตำแหน่งงาน (Job Title)' },
                        { key: 'department', label: 'แผนก / ฝ่าย (Department)' },
                        { key: 'location', label: 'สถานที่ปฏิบัติงาน (Location)' },
                        { key: 'description', label: 'หน้าที่ความรับผิดชอบ (Description)', type: 'textarea', rows: 2 },
                      ]}
                      value={job.translations || {
                        en: { title: job.titleEn || '', department: '', location: '', description: '' },
                        jp: { title: '', department: '', location: '', description: '' },
                        cn: { title: '', department: '', location: '', description: '' },
                        mm: { title: '', department: '', location: '', description: '' },
                      }}
                      onChange={(trans) => handleJobChange(idx, 'translations' as any, trans as any)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-theme-primary px-6 py-3 text-xs font-bold text-black shadow-lg shadow-theme-primary/20 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'กำลังบันทึกข้อมูล...' : 'บันทึกการเปลี่ยนแปลงทั้งหมด'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
