import React, { useState, useEffect } from 'react';

export default function EventForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    venue: '',
    organizerEmail: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        date: initialData.date || '',
        venue: initialData.venue || '',
        organizerEmail: initialData.organizerEmail || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        venue: '',
        organizerEmail: '',
      });
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Event name is required';
    }

    if (!formData.date) {
      errs.date = 'Event date is required';
    }

    if (!formData.venue.trim()) {
      errs.venue = 'Event venue is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.organizerEmail.trim()) {
      errs.organizerEmail = 'Organizer email is required';
    } else if (!emailRegex.test(formData.organizerEmail.trim())) {
      errs.organizerEmail = 'Please enter a valid email address (e.g. organizer@college.edu)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      // Handled by parent or API
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>{isEditing ? '✏️ Edit Event Details' : '➕ Create New College Event'}</h2>
        <p className="card-subtitle">
          {isEditing
            ? 'Update the event information below. Click Save Changes when done.'
            : 'Fill in the event details to publish an event for student registrations.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">
            Event Name <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Annual Tech Symposium 2026"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">
              Event Date <span className="required">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'input-error' : ''}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="venue">
              Venue / Location <span className="required">*</span>
            </label>
            <input
              id="venue"
              name="venue"
              type="text"
              placeholder="e.g. Main Auditorium, Block A"
              value={formData.venue}
              onChange={handleChange}
              className={errors.venue ? 'input-error' : ''}
            />
            {errors.venue && <span className="error-text">{errors.venue}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="organizerEmail">
            Organizer Contact Email <span className="required">*</span>
          </label>
          <input
            id="organizerEmail"
            name="organizerEmail"
            type="email"
            placeholder="e.g. coordinator@college.edu"
            value={formData.organizerEmail}
            onChange={handleChange}
            className={errors.organizerEmail ? 'input-error' : ''}
          />
          {errors.organizerEmail && <span className="error-text">{errors.organizerEmail}</span>}
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

