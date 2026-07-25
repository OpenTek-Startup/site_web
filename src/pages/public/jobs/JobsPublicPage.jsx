import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDocuments, createDocument, uploadFile } from "../../../services/crudServices";
import { DATABASE_ID, JOBS_COLLECTION_ID, APPLICATIONS_COLLECTION_ID } from "../../../config/appwrite";
import { Seo } from "../../../components/seo/Seo";
import "./jobsPublic.css";

/* eslint-disable react/prop-types */
function ApplicationForm({ job, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ applicantName: "", email: "", phone: "", coverLetter: "" });
  const [website, setWebsite] = useState(""); // honeypot anti-spam
  const [cvFile, setCvFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Honeypot : un bot remplira ce champ cache, un humain ne le verra jamais
    if (website) {
      return;
    }

    if (!form.applicantName || !form.email) {
      setError(t("contactPage.errorRequired"));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t("contactPage.errorEmail"));
      return;
    }

    setSubmitting(true);
    try {
      let cvFileId = "";
      if (cvFile) {
        const uploaded = await uploadFile(cvFile, undefined, {
          maxSizeBytes: 5 * 1024 * 1024,
          allowedTypes: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
        });
        cvFileId = uploaded.$id;
      }

      await createDocument(DATABASE_ID, APPLICATIONS_COLLECTION_ID, {
        jobId: job.$id,
        jobTitle: job.position,
        applicantName: form.applicantName.slice(0, 150),
        email: form.email.slice(0, 150),
        phone: form.phone.slice(0, 50),
        coverLetter: form.coverLetter.slice(0, 2000),
        cvFile: cvFileId,
        status: "Nouvelle",
      });
      setSuccess(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la candidature:", err);
      setError(err.message && err.message.includes("taille") ? err.message : t("contactPage.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="jobs-public__apply-success">
        <p>
          {t("jobsPage.successPrefix")} {form.applicantName} <strong>{job.position}</strong>
          {t("jobsPage.successSuffix")}
        </p>
        <button className="jobs-public__btn" onClick={onClose}>
          {t("jobsPage.close")}
        </button>
      </div>
    );
  }

  return (
    <form className="jobs-public__apply-form" onSubmit={handleSubmit}>
      {error && <p className="jobs-public__apply-error">{error}</p>}
      {/* Honeypot anti-spam : invisible pour un humain */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        autoComplete="off"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
        aria-hidden="true"
      />
      <label>
        {t("jobsPage.fullName")}
        <input type="text" name="applicantName" value={form.applicantName} onChange={handleChange} maxLength={150} required />
      </label>
      <label>
        Email
        <input type="email" name="email" value={form.email} onChange={handleChange} maxLength={150} required />
      </label>
      <label>
        {t("jobsPage.phone")}
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={50} />
      </label>
      <label>
        {t("jobsPage.coverLetter")}
        <textarea name="coverLetter" rows={4} value={form.coverLetter} onChange={handleChange} maxLength={2000} />
      </label>
      <label>
        {t("jobsPage.cv")}
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} />
      </label>
      <button className="jobs-public__btn" type="submit" disabled={submitting}>
        {submitting ? t("jobsPage.sending") : t("jobsPage.send")}
      </button>
    </form>
  );
}

export default function JobsPublicPage() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyingTo, setApplyingTo] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, JOBS_COLLECTION_ID);
        setJobs(docs.filter((job) => job.status));
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="jobs-public container">
      <Seo
        title={t("jobsPage.title")}
        description="Rejoignez l'equipe OpenTek : consultez nos offres d'emploi ouvertes et postulez."
        path="/jobs"
      />
      <div className="ot-section-header">
        <span className="ot-eyebrow">{t("jobsPage.eyebrow")}</span>
        <h1 className="ot-section-title">{t("jobsPage.title")}</h1>
        <p className="ot-section-subtitle">{t("jobsPage.subtitle")}</p>
      </div>

      {loading && <p className="jobs-public__status">{t("common.loading")}</p>}

      {!loading && jobs.length === 0 && (
        <p className="jobs-public__status">{t("jobsPage.empty")}</p>
      )}

      <div className="jobs-public__list">
        {jobs.map((job) => (
          <div className="ot-card ot-card--hoverable jobs-public__card" key={job.$id}>
            <div className="jobs-public__card-main">
              <h3>{job.position}</h3>
              <p className="jobs-public__meta">
                {job.location} {job.type ? `· ${job.type}` : ""}
              </p>
              <p className="ot-clamp-2 jobs-public__description">{job.description}</p>
            </div>
            <button className="jobs-public__btn" onClick={() => setSelectedJob(job)}>
              {t("common.seeMore")}
            </button>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="ot-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setSelectedJob(null)}>
              &times;
            </button>
            <h2 className="jobs-public__modal-title">{selectedJob.position}</h2>
            <p className="jobs-public__meta">
              {selectedJob.location} {selectedJob.type ? `· ${selectedJob.type}` : ""}
            </p>
            <p className="jobs-public__modal-text">{selectedJob.description}</p>
            {selectedJob.qualifications && (
              <>
                <h4>{t("jobsPage.qualifications")}</h4>
                <p className="jobs-public__modal-text">{selectedJob.qualifications}</p>
              </>
            )}
            {selectedJob.Resposibilities && (
              <>
                <h4>{t("jobsPage.responsibilities")}</h4>
                <p className="jobs-public__modal-text">{selectedJob.Resposibilities}</p>
              </>
            )}
            {selectedJob.years_experience && (
              <>
                <h4>{t("jobsPage.experienceRequired")}</h4>
                <p className="jobs-public__modal-text">{selectedJob.years_experience}</p>
              </>
            )}
            {selectedJob.how_to_post && (
              <>
                <h4>{t("jobsPage.howToApply")}</h4>
                <p className="jobs-public__modal-text">{selectedJob.how_to_post}</p>
              </>
            )}
            {selectedJob.ending_application && (
              <p className="jobs-public__deadline">
                {t("jobsPage.deadline")} : {selectedJob.ending_application}
              </p>
            )}
            <button
              className="jobs-public__btn jobs-public__btn--primary"
              onClick={() => setApplyingTo(selectedJob)}
            >
              {t("jobsPage.apply")}
            </button>
          </div>
        </div>
      )}

      {applyingTo && (
        <div className="ot-modal-overlay" onClick={() => setApplyingTo(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setApplyingTo(null)}>
              &times;
            </button>
            <h2 className="jobs-public__modal-title">{t("jobsPage.applyTitle")} : {applyingTo.position}</h2>
            <ApplicationForm job={applyingTo} onClose={() => setApplyingTo(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
