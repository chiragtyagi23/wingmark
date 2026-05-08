import { useEffect, useState } from 'react';
import { X, RefreshCw, Send } from 'lucide-react';

function makeChallenge() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

const initialForm = { name: '', email: '', mobile: '' };

function LeadModal({
  open,
  onClose,
  title = 'Get a Quote',
  submitLabel = 'Submit',
  onSubmit,
  context,
}) {
  const [form, setForm] = useState(initialForm);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [captcha, setCaptcha] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setChallenge(makeChallenge());
      setCaptcha('');
      setError('');
      setSubmitted(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const refreshCaptcha = () => {
    setChallenge(makeChallenge());
    setCaptcha('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError('Please fill in all the fields.');
      return;
    }
    if (parseInt(captcha, 10) !== challenge.answer) {
      setError('Captcha answer is incorrect. Please try again.');
      refreshCaptcha();
      return;
    }
    setError('');
    setSubmitted(true);
    onSubmit?.({ ...form, context });
  };

  return (
    <div
      className="lead-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="lead-modal-card">
        <button
          type="button"
          className="lead-modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <h3 id="lead-modal-title" className="lead-modal-title">{title}</h3>

        {context && <div className="lead-modal-sub">{context}</div>}

        {submitted ? (
          <div className="lead-modal-success">
            <div className="lead-modal-success-tick">✓</div>
            <div className="lead-modal-success-h">Thank you!</div>
            <div className="lead-modal-success-p">
              We&apos;ve received your details. Our team will reach out within 24 hours.
            </div>
            <button
              type="button"
              className="lead-modal-submit"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="lead-modal-form" onSubmit={handleSubmit} noValidate>
            <div className="lead-modal-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={form.name}
                onChange={handleChange('name')}
                autoFocus
              />
            </div>

            <div className="lead-modal-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>

            <div className="lead-modal-field">
              <label>Mobile</label>
              <input
                type="tel"
                placeholder="Enter Your Phone Number"
                value={form.mobile}
                onChange={handleChange('mobile')}
              />
            </div>

            <div className="lead-modal-captcha">
              <div className="lead-modal-captcha-row">
                <div className="lead-modal-captcha-q">
                  {challenge.a} <span>+</span> {challenge.b} <span>=</span>
                </div>
                <input
                  type="number"
                  className="lead-modal-captcha-input"
                  placeholder="?"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  aria-label="Captcha answer"
                />
                <button
                  type="button"
                  className="lead-modal-captcha-refresh"
                  onClick={refreshCaptcha}
                  aria-label="Refresh captcha"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              <div className="lead-modal-captcha-hint">
                Verify you&apos;re human by solving the sum above
              </div>
            </div>

            {error && <div className="lead-modal-error">{error}</div>}

            <button type="submit" className="lead-modal-submit">
              <Send size={14} />
              {submitLabel}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LeadModal;
