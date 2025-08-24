import React, { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api.js';

export default function ContactInfoAdmin() {
  const [contact, setContact] = useState({});
  const [form, setForm] = useState({ email: '', phone: '', whatsapp: '', instagram: '', linkedin: '', youtube: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.get('/contact-info')
      .then(r => {
        setContact(r.data || {});
        setForm({
          email: r.data?.email || '',
          phone: r.data?.phone || '',
          whatsapp: r.data?.whatsapp || '',
          instagram: r.data?.instagram || '',
          linkedin: r.data?.linkedin || '',
          youtube: r.data?.youtube || ''
        });
      })
      .catch(() => setContact({}));
  }, []);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      if (contact.id) {
        await adminApi.put('/contact-info', form);
      } else {
        await adminApi.post('/contact-info', form);
      }
      setSuccess(true);
    } catch (err) {
      setError('Failed to update contact info');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', background: '#232b39', borderRadius: 16, padding: '2rem', color: '#e6e6e6', boxShadow: '0 2px 16px #0003' }}>
      <h2 style={{ color: '#ffd166', marginBottom: 20 }}>Edit Contact Info</h2>
      <form onSubmit={handleSubmit}>
        <label>Email<br />
          <input name="email" value={form.email} onChange={handleChange} type="email" style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>Phone<br />
          <input name="phone" value={form.phone} onChange={handleChange} type="text" style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>WhatsApp<br />
          <input name="whatsapp" value={form.whatsapp} onChange={handleChange} type="text" style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>Instagram URL<br />
          <input name="instagram" value={form.instagram} onChange={handleChange} type="text" style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>LinkedIn URL<br />
          <input name="linkedin" value={form.linkedin} onChange={handleChange} type="text" style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>YouTube URL<br />
          <input name="youtube" value={form.youtube} onChange={handleChange} type="text" style={{ width: '100%', marginBottom: 18 }} />
        </label>
        <button type="submit" disabled={loading} style={{ background: '#ffd166', color: '#232b39', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        {success && <div style={{ color: '#06d6a0', marginTop: 12 }}>Contact info updated!</div>}
        {error && <div style={{ color: '#ef476f', marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}
