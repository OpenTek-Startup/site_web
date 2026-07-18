import { useState, useEffect } from "react";
import { createDocument, deleteDocument, getDocuments, updateDocument } from "../../../services/crudServices";
import { FormComponent } from "../../../components/FormComponent/formComponent";
import { DataList } from "../../../components/admin/DatatList/DataList";
import './jobs.css';
import { DATABASE_ID, JOBS_COLLECTION_ID } from "../../../config/appwrite";


export function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  const jobs_fields = [
    { label: "position", name: "position", type: "text", placeholder: "Job position" },
    { label: "Description", name: "description", type: "textarea", placeholder: "Job Description", rows: 4 },
    { label: "status", name: "status", type:  "bool", placeholder: "Job Status" },
    { label: "requirements", name: "requirements", type: "textarea", placeholder: "Ex: React, TypeScript, Git...", rows: 3 },
    { label: "location", name: "location", type: "text", placeholder: "Job Location" },
    { label: "Resposibilities", name: "Resposibilities", type: "textarea", placeholder: "Job Resposibilities", rows: 3 },
    { label: "Type", name: "type", type: "text", placeholder: "Job Type" },
    { label: "how_to_post", name: "how_to_post", type: "text", placeholder: "Job How to post" },
    { label: "years_experience", name: "years_experience", type: "text", placeholder: "Job Years of experience" },
    { label: "qualifications", name: "qualifications", type: "text", placeholder: "Job Qualifications" },
    { label: "ending_application", name: "ending_application", type: "text", placeholder: "Job Ending Application" },
    // { label: "image", name: "image", type: "file" }
  ]
  const columns = [
    { header: 'Position', accessor: 'position' },
    { header: 'Description', accessor: 'description' },
    { header: 'Location', accessor: 'location' },
    { header: 'Type', accessor: 'type' },
    { header: 'requirements', accessor: 'requirements' },
    { header: "Responsibilities", accessor: "Responsibilities", },
    { header: "Resposibilities", accessor: "Resposibilities", },
    { header: "how_to_post", accessor: "how_to_post", },
    { header: "years_experience", accessor: "years_experience", },
    { header: "qualifications", accessor: "qualifications", },
    {
      header: 'Statut',
      accessor: 'status',
      render: (value) => (value ? 'Actif' : 'Inactif'),
    },
  ];

  const fetchJobs = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, JOBS_COLLECTION_ID);
        setJobs(docs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
  }

  useEffect(() => {
      fetchJobs();
  }, []);

  const handleCreateOrUpdateJob = async (data) => {
    try {
      if (editingJob) {
        await updateDocument(DATABASE_ID, JOBS_COLLECTION_ID, editingJob.$id, data, []);
      } else {
        await createDocument(DATABASE_ID, JOBS_COLLECTION_ID, data);
      }
      setEditingJob(null);
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error("Error creating or updating job:", error);
      alert("Une erreur est survenue lors de l'enregistrement de l'offre. Verifiez que tous les champs requis sont corrects.");
    }
  }

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Supprimer definitivement cette offre d'emploi ?")) return;
    try {
      await deleteDocument(DATABASE_ID, JOBS_COLLECTION_ID, jobId);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Une erreur est survenue lors de la suppression de l'offre.");
    }
  }
 
  const handleOpenCreateForm = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingJob(null);
  };

  const handleSeeMore = (job) => {
    setShowDetails(job);
  };

  const handleCloseDetails = () => {
    setShowDetails(null);
  };

  return (
    <div className="jobs-page">
      <h2 className="titre-centre">JOBS MANAGEMENT</h2>      
      <button className="create-button" onClick={handleOpenCreateForm}>
        Create job
      </button>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseForm}>
              X
            </button>
            <FormComponent 
              onSubmit={handleCreateOrUpdateJob}
              fields={jobs_fields}
              submitLabel={editingJob ? "Update Job" : "Create Job"}
              initialData={editingJob || {}}
            />
          </div>
        </div>
      )}
      <DataList      
      data={jobs}
      columns={columns}
      onSeeMore={handleSeeMore}
      onEdite={handleEditJob}
      onDelete={handleDeleteJob}
      />
{showDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseDetails}>X</button>
            <h3>{showDetails.position}</h3>
            <p><strong>Description:</strong> {showDetails.description}</p>
            <p><strong>Status:</strong> {showDetails.status ? "Actif" : "Inactif"}</p>
            <p><strong>Requirements:</strong> {showDetails.requirements}</p>
            <p><strong>Type:</strong> {showDetails.type}</p>
            <p><strong>Location:</strong> {showDetails.location}</p>
            <p><strong>Company:</strong> {showDetails.company}</p>
            <p><strong>Salary:</strong> {showDetails.salary}</p>
            <p><strong>Years Experience:</strong> {showDetails.years_experience}</p>
            <p><strong>Ending Application:</strong> {showDetails.ending_application}</p>
            <p><strong>Link:</strong> {showDetails.link}</p>
            {/* Ajouter d'autres champs si nécessaire */}
          </div>
        </div>
      )}
    </div>
  )
}


