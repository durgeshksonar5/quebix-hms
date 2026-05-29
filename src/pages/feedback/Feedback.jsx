import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Star, Search, MessageSquare, ThumbsUp, CheckCircle, Award } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function Feedback() {
  const { feedbackList, addFeedback, resolveFeedback, doctors, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isResolveOpen, setIsResolveOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    doctorRating: 5,
    hospitalRating: 5,
    receptionRating: 5,
    pharmacyRating: 5,
    comment: ''
  });

  const [resolveText, setResolveText] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient Name is required';
    if (!formData.comment.trim()) errors.comment = 'Feedback comment note is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({
      patientName: currentUser?.name || '',
      doctorName: doctors[0]?.name || 'Dr. Priya Sharma',
      doctorRating: 5,
      hospitalRating: 5,
      receptionRating: 5,
      pharmacyRating: 5,
      comment: ''
    });
    setFormErrors({});
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addFeedback({
      ...formData,
      doctorRating: Number(formData.doctorRating),
      hospitalRating: Number(formData.hospitalRating),
      receptionRating: Number(formData.receptionRating),
      pharmacyRating: Number(formData.pharmacyRating)
    });
    setIsAddOpen(false);
  };

  const openResolveModal = (fdb) => {
    setSelectedFeedback(fdb);
    setResolveText('');
    setIsResolveOpen(true);
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!resolveText.trim()) return;
    resolveFeedback(selectedFeedback.id, resolveText);
    setIsResolveOpen(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star key={idx} className={`h-3 w-3 ${idx < rating ? 'fill-amber-500' : 'text-border'}`} />
        ))}
      </div>
    );
  };

  // Average Rating
  const avgDoctorRating = feedbackList.length > 0
    ? (feedbackList.reduce((sum, f) => sum + f.doctorRating, 0) / feedbackList.length).toFixed(1)
    : '5.0';

  const avgHospitalRating = feedbackList.length > 0
    ? (feedbackList.reduce((sum, f) => sum + f.hospitalRating, 0) / feedbackList.length).toFixed(1)
    : '5.0';

  const columns = [
    { header: 'Feedback ID', accessor: 'id', sortable: true },
    { header: 'Patient Name', accessor: 'patientName', sortable: true },
    { header: 'Consultant', accessor: 'doctorName', sortable: true },
    {
      header: 'Ratings (Doc / Hosp / Rec / Pharm)',
      render: (row) => (
        <div className="flex flex-col gap-1 text-[10px] text-text-muted">
          <span className="flex items-center gap-1">Doctor: {renderStars(row.doctorRating)}</span>
          <span className="flex items-center gap-1">Hospital: {renderStars(row.hospitalRating)}</span>
        </div>
      )
    },
    {
      header: 'Review Comments',
      accessor: 'comment',
      render: (row) => <p className="text-xs text-text max-w-[200px] truncate block">{row.comment}</p>
    },
    {
      header: 'Resolution / Response',
      render: (row) => (
        <span className="text-[10px] text-text max-w-[150px] truncate block">
          {row.response || 'No administrative response yet'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status || 'Pending'} />
    },
    {
      header: 'Actions',
      render: (row) => {
        const isPending = row.status !== 'Resolved';
        return (
          <div className="flex gap-2">
            {(currentUser?.role === 'Admin' || currentUser?.role === 'Receptionist') && isPending && (
              <Button variant="ghost" size="sm" className="p-1 text-success hover:bg-green-50" onClick={() => openResolveModal(row)}>
                Reply
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Experience Ratings Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
            <Award className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Average Attending Doctor Rating</span>
            <span className="text-lg font-extrabold text-text mt-1 block flex items-center gap-1.5">
              {avgDoctorRating} / 5.0 <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </span>
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <ThumbsUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Average Hospital Rating</span>
            <span className="text-lg font-extrabold text-text mt-1 block flex items-center gap-1.5">
              {avgHospitalRating} / 5.0 <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search patient reviews & feedbacks..." />
        {currentUser?.role === 'Patient' && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Submit Feedback
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={feedbackList}
        searchQuery={searchQuery}
        searchFields={['patientName', 'doctorName', 'comment', 'id']}
        pageSize={10}
        emptyMessage="No patient feedback logged."
      />

      {/* Submit Feedback Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Submit Patient Feedback Form">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={handleInputChange} error={formErrors.patientName} required />
          <SelectField label="Select Attending Doctor" name="doctorName" value={formData.doctorName} onChange={handleInputChange} options={doctors.map(d => d.name)} required />
          
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Doctor Care Rating (1-5)" name="doctorRating" value={formData.doctorRating} onChange={handleInputChange} options={[5, 4, 3, 2, 1]} required />
            <SelectField label="Hospital Cleanliness Rating (1-5)" name="hospitalRating" value={formData.hospitalRating} onChange={handleInputChange} options={[5, 4, 3, 2, 1]} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Reception Service Rating (1-5)" name="receptionRating" value={formData.receptionRating} onChange={handleInputChange} options={[5, 4, 3, 2, 1]} required />
            <SelectField label="Pharmacy Waiting Rating (1-5)" name="pharmacyRating" value={formData.pharmacyRating} onChange={handleInputChange} options={[5, 4, 3, 2, 1]} required />
          </div>

          <InputField label="Patient Review Notes" name="comment" value={formData.comment} onChange={handleInputChange} placeholder="e.g. Doctor sharma was extremely descriptive and receptionist aditya was fast." error={formErrors.comment} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Review</Button>
          </div>
        </form>
      </Modal>

      {/* Resolve Feedback Modal */}
      <Modal isOpen={isResolveOpen} onClose={() => setIsResolveOpen(false)} title="Write Management Response Slip" size="sm">
        <form onSubmit={handleResolveSubmit} className="space-y-4">
          <InputField label="Attending Response Notes" value={resolveText} onChange={(e) => setResolveText(e.target.value)} placeholder="e.g. Thank you for your feedback. We will note and review." required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsResolveOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Send Response</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
