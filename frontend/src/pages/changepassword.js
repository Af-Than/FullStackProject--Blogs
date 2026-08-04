import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChangePassword.css';
import { AuthContext } from '../helpers/authcontext';

function ChangePassword() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Send OTP Request
  const handleSendOtp = () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    axios
      .post(
        'http://localhost:3000/auth/send-change-otp',
        {},
        { headers: { accessToken: localStorage.getItem('accessToken') } }
      )
      .then((res) => {
        if (res.data.error) {
          setStatusMessage({ type: 'error', text: res.data.error });
        } else {
          setStatusMessage({ type: 'success', text: res.data.success });
          setIsOtpSent(true);
        }
      })
      .catch(() => setStatusMessage({ type: 'error', text: 'Failed to send OTP code.' }))
      .finally(() => setLoading(false));
  };

  // 2. Verify OTP Code
  const handleVerifyOtp = () => {
    if (!otpCode || otpCode.length !== 6) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP.' });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    axios
      .post(
        'http://localhost:3000/auth/verify-otp',
        { otp: otpCode },
        { headers: { accessToken: localStorage.getItem('accessToken') } }
      )
      .then((res) => {
        if (res.data.error) {
          setStatusMessage({ type: 'error', text: res.data.error });
        } else {
          setStatusMessage({ type: 'success', text: 'OTP verified! You can now change your password.' });
          setIsOtpVerified(true);
        }
      })
      .catch(() => setStatusMessage({ type: 'error', text: 'OTP verification failed' }))
      .finally(() => setLoading(false));
  };

  // Formik setup
  const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one capital letter')
      .matches(/[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]/, 'Password must contain at least one special symbol')
      .notOneOf([Yup.ref('oldPassword')], 'New password cannot be the same as your current password')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please confirm your new password'),
  });

  const onSubmit = (data, { setSubmitting, resetForm }) => {
    setStatusMessage({ type: '', text: '' });

    axios
      .put(
        'http://localhost:3000/auth/changepassword',
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        { headers: { accessToken: localStorage.getItem('accessToken') } }
      )
      .then((res) => {
        if (res.data.error) {
          setStatusMessage({ type: 'error', text: res.data.error });
        } else {
          setStatusMessage({ type: 'success', text: 'Password updated successfully!' });
          resetForm();
          setTimeout(() => {
            navigate(`/profile/${authState.id}`);
          }, 1500);
        }
      })
      .catch((err) => {
       const backendError = err.response?.data?.error || 'Failed to send OTP code. Check backend connection.';
      setStatusMessage({ type: 'error', text: backendError });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2>Change Password</h2>

        {statusMessage.text && (
          <div className={`status-banner ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        {/*  OTP VERIFICATION  */}
        {!isOtpVerified && (
          <div className="otp-verification-section">
            {!isOtpSent ? (
              <div className="form-group">
                <p className="subtitle">
                  Click the button below to receive an OTP code on your registered email address before resetting your password.
                </p>
                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                </button>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="otpCode">ENTER VERIFICATION CODE</label>
                <input
                  type="text"
                  id="otpCode"
                  className="otp-input"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  maxLength="6"
                  onChange={(e) => setOtpCode(e.target.value)}
                />
                <button
                  type="button"
                  className="submit-btn otp-submit-btn"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- STAGE 2: PASSWORD UPDATE FORM ---------------- */}
        {isOtpVerified && (
          <>
            <p className="subtitle">
              Ensure your password has at least 8 characters, one capital letter, and one special symbol.
            </p>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="change-password-form">
                  {/* CURRENT PASSWORD */}
                  <div className="form-group">
                    <label htmlFor="oldPassword">CURRENT PASSWORD</label>
                    <div className="password-input-wrapper">
                      <Field
                        type={showOldPassword ? 'text' : 'password'}
                        id="oldPassword"
                        name="oldPassword"
                        placeholder="Enter current password"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="toggle-visibility-btn"
                        onClick={() => setShowOldPassword((prev) => !prev)}
                      >
                        {showOldPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <ErrorMessage name="oldPassword" component="span" className="error-text" />
                  </div>

                  {/* NEW PASSWORD */}
                  <div className="form-group">
                    <label htmlFor="newPassword">NEW PASSWORD</label>
                    <div className="password-input-wrapper">
                      <Field
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="toggle-visibility-btn"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <ErrorMessage name="newPassword" component="span" className="error-text" />
                  </div>

                  {/* CONFIRM NEW PASSWORD */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">CONFIRM NEW PASSWORD</label>
                    <div className="password-input-wrapper">
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="toggle-visibility-btn"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="span" className="error-text" />
                  </div>

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;