import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Activity, Thermometer, ShieldAlert, Plus, CheckCircle, RefreshCw, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';

export default function ICUMonitoring() {
  const { icuVitals, updateICUVitals, addICUMonitoring, removeICUMonitoring, doctors, patients, currentUser } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedICU, setSelectedICU] = useState(null);

  const [formData, setFormData] = useState({
    bedNumber: '',
    patientName: '',
    assignedDoctor: '',
    heartRate: 75,
    bloodPressure: '120/80',
    oxygenLevel: 98,
    temperature: 98.6,
    status: 'Stable'
  });

  const [vitalForm, setVitalForm] = useState({
    heartRate: '',
    bloodPressure: '',
    oxygenLevel: '',
    temperature: '',
    status: 'Stable'
  });

  // Simulating Live Telemetry fluctuate slightly every 4 seconds to make the UI look alive and dynamic!
  useEffect(() => {
    const timer = setInterval(() => {
      icuVitals.forEach(icu => {
        if (icu.patientName && icu.patientName !== 'None') {
          // slight fluctuation
          const hrDelta = Math.floor(Math.random() * 5 - 2);
          const o2Delta = Math.floor(Math.random() * 3 - 1);
          const newHR = Math.min(130, Math.max(50, icu.heartRate + hrDelta));
          const newO2 = Math.min(100, Math.max(85, icu.oxygenLevel + o2Delta));
          updateICUVitals(icu.id, {
            heartRate: newHR,
            oxygenLevel: newO2
          });
        }
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [icuVitals, updateICUVitals]);

  const openAddModal = () => {
    setFormData({
      bedNumber: 'RM-101-B',
      patientName: patients.filter(p => p.status === 'ICU')[0]?.name || '',
      assignedDoctor: doctors[0]?.name || '',
      heartRate: 80,
      bloodPressure: '120/80',
      oxygenLevel: 98,
      temperature: 98.6,
      status: 'Stable'
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName) return;

    addICUMonitoring({
      ...formData,
      heartRate: Number(formData.heartRate),
      oxygenLevel: Number(formData.oxygenLevel),
      temperature: Number(formData.temperature)
    });
    setIsAddOpen(false);
  };

  const openUpdateModal = (icu) => {
    setSelectedICU(icu);
    setVitalForm({
      heartRate: icu.heartRate,
      bloodPressure: icu.bloodPressure,
      oxygenLevel: icu.oxygenLevel,
      temperature: icu.temperature,
      status: icu.status
    });
    setIsUpdateOpen(true);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateICUVitals(selectedICU.id, {
      heartRate: Number(vitalForm.heartRate),
      bloodPressure: vitalForm.bloodPressure,
      oxygenLevel: Number(vitalForm.oxygenLevel),
      temperature: Number(vitalForm.temperature),
      status: vitalForm.status
    });
    setIsUpdateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-text">ICU Vitals Telemetry Dashboard</h2>
          <p className="text-xs text-text-muted mt-0.5">Real-time ICU ward patient vitals streaming. Fluctuation simulated.</p>
        </div>
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
          <Button variant="primary" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Admit Patient to ICU Monitor
          </Button>
        )}
      </div>

      {/* Grid of Realtime Monitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {icuVitals.map((icu) => {
          const hasPatient = icu.patientName && icu.patientName !== 'None';
          const isO2Low = hasPatient && icu.oxygenLevel < 95;
          const isHRLowOrHigh = hasPatient && (icu.heartRate < 60 || icu.heartRate > 100);

          return (
            <div
              key={icu.id}
              className={`bg-card border rounded-3xl shadow-sm p-6 flex flex-col justify-between transition-all duration-300 ${
                hasPatient
                  ? (isO2Low || isHRLowOrHigh
                    ? 'border-red-500/60 ring-2 ring-red-500/10'
                    : 'border-border/80')
                  : 'border-dashed border-border'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary font-bold text-[10px]">
                    {icu.bedNumber}
                  </span>
                  <h3 className="font-extrabold text-base text-text mt-2">
                    {hasPatient ? icu.patientName : 'No Patient Admitted'}
                  </h3>
                  {hasPatient && (
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Attending Consultant: <strong>{icu.assignedDoctor}</strong>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasPatient && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                      isO2Low || isHRLowOrHigh
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {isO2Low || isHRLowOrHigh ? 'CRITICAL WARN' : 'STABLE'}
                    </span>
                  )}
                  {hasPatient && (currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
                    <Button variant="ghost" size="sm" className="p-1 text-danger hover:bg-danger/10" onClick={() => removeICUMonitoring(icu.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Vitals Readings */}
              {hasPatient ? (
                <div className="grid grid-cols-2 gap-6 my-6">
                  {/* Heart Rate */}
                  <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
                    <Heart className={`h-8 w-8 text-red-500 ${icu.heartRate > 0 ? 'animate-pulse' : ''}`} />
                    <div>
                      <span className="text-[10px] text-text-muted block">Pulse Rate</span>
                      <span className="text-xl font-extrabold text-red-500 mt-1 block">
                        {icu.heartRate} <span className="text-xs font-semibold text-text-muted">bpm</span>
                      </span>
                    </div>
                  </div>

                  {/* Blood Pressure */}
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
                    <Activity className="h-8 w-8 text-blue-500" />
                    <div>
                      <span className="text-[10px] text-text-muted block">Blood Pressure</span>
                      <span className="text-lg font-extrabold text-blue-500 mt-1 block">
                        {icu.bloodPressure} <span className="text-xs font-semibold text-text-muted">mmHg</span>
                      </span>
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-center gap-4">
                    <Heart className="h-8 w-8 text-cyan-500 animate-bounce" />
                    <div>
                      <span className="text-[10px] text-text-muted block">SpO2 Oxygen</span>
                      <span className="text-xl font-extrabold text-cyan-500 mt-1 block">
                        {icu.oxygenLevel} <span className="text-xs font-semibold text-text-muted">%</span>
                      </span>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-4">
                    <Thermometer className="h-8 w-8 text-amber-500" />
                    <div>
                      <span className="text-[10px] text-text-muted block">Body Temp</span>
                      <span className="text-lg font-extrabold text-amber-500 mt-1 block">
                        {icu.temperature} <span className="text-xs font-semibold text-text-muted">°F</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-10 text-center text-xs text-text-muted">
                  ICU bed telemetry station is offline. Admit patient to stream vitals.
                </div>
              )}

              {/* Card Footer Actions */}
              {hasPatient && (currentUser?.role === 'Admin' || currentUser?.role === 'Doctor') && (
                <Button variant="outline" className="w-full flex justify-center items-center gap-2" onClick={() => openUpdateModal(icu)}>
                  <RefreshCw className="h-4 w-4" />
                  Override Telemetry Readings
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Admit Patient Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Admit Patient to ICU vital stream">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <InputField label="ICU Bed Location" name="bedNumber" value={formData.bedNumber} onChange={handleInputChange} required />
          <SelectField label="Select ICU Admitted Patient" name="patientName" value={formData.patientName} onChange={handleInputChange} options={patients.filter(p => p.status === 'ICU').map(p => p.name)} required />
          <SelectField label="Assigned ICU Doctor" name="assignedDoctor" value={formData.assignedDoctor} onChange={handleInputChange} options={doctors.map(d => d.name)} required />
          
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Initial Heart Rate" type="number" name="heartRate" value={formData.heartRate} onChange={handleInputChange} required />
            <InputField label="Initial BP (mmHg)" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Initial Oxygen Level (%)" type="number" name="oxygenLevel" value={formData.oxygenLevel} onChange={handleInputChange} required />
            <InputField label="Body Temp (°F)" type="number" name="temperature" value={formData.temperature} onChange={handleInputChange} required />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Admit to Monitor</Button>
          </div>
        </form>
      </Modal>

      {/* Update Vitals Modal */}
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} title="Override Vitals Telemetry Screen" size="sm">
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <InputField label="Heart Rate (bpm)" type="number" value={vitalForm.heartRate} onChange={(e) => setVitalForm(prev => ({ ...prev, heartRate: e.target.value }))} required />
          <InputField label="Blood Pressure (mmHg)" value={vitalForm.bloodPressure} onChange={(e) => setVitalForm(prev => ({ ...prev, bloodPressure: e.target.value }))} required />
          <InputField label="Oxygen Level (% SpO2)" type="number" value={vitalForm.oxygenLevel} onChange={(e) => setVitalForm(prev => ({ ...prev, oxygenLevel: e.target.value }))} required />
          <InputField label="Body Temperature (°F)" type="number" value={vitalForm.temperature} onChange={(e) => setVitalForm(prev => ({ ...prev, temperature: e.target.value }))} required />
          <SelectField label="Vital Condition Status" value={vitalForm.status} onChange={(e) => setVitalForm(prev => ({ ...prev, status: e.target.value }))} options={['Stable', 'Fluctuating', 'Critical']} required />

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Override Stream</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
