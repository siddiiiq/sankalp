import { useState } from 'react';
import { updateAlert } from '../../services/alertService';

export default function DoctorNotes({ alert, onUpdate }) {
  const [note, setNote] = useState(alert.doctorNote || '');
  const [status, setStatus] = useState(alert.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await updateAlert(alert._id, { status, doctorNote: note });
      onUpdate?.(updated.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="input-field mt-1"
        >
          <option value="pending">Pending</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="actioned">Actioned</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Doctor Notes</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="input-field mt-1 h-24 resize-none"
          placeholder="Add clinical notes..."
        />
      </div>
      <button onClick={save} disabled={saving} className="btn-primary w-full">
        {saving ? 'Saving...' : 'Save Notes'}
      </button>
    </div>
  );
}
