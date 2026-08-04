import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import './CustomDialog.css';

/**
 * Reusable dialog component for replacing window.confirm and alert.
 * @param {Object} props
 * @param {boolean} props.isOpen - Is dialog open
 * @param {string} props.type - 'alert' | 'confirm'
 * @param {string} props.variant - 'info' | 'success' | 'warning' | 'danger'
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message body
 * @param {Function} props.onConfirm - Callback when confirm/ok is clicked
 * @param {Function} props.onCancel - Callback when cancel is clicked
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 */
const CustomDialog = ({
  isOpen,
  type = 'alert',
  variant = 'info',
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (variant) {
      case 'success': return <CheckCircle size={28} className="dialog-icon success" />;
      case 'warning': return <AlertCircle size={28} className="dialog-icon warning" />;
      case 'danger': return <XCircle size={28} className="dialog-icon danger" />;
      default: return <Info size={28} className="dialog-icon info" />;
    }
  };

  return (
    <div className="dialog-overlay animate-fade-in">
      <div className={`dialog-box dialog-${variant} animate-scale-in`}>
        <div className="dialog-content">
          <div className="dialog-icon-wrapper">
            {renderIcon()}
          </div>
          <div className="dialog-text">
            {title && <h3 className="dialog-title">{title}</h3>}
            {message && <p className="dialog-message">{message}</p>}
          </div>
        </div>
        <div className="dialog-actions">
          {type === 'confirm' && (
            <button className="dialog-btn cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className={`dialog-btn confirm dialog-btn-${variant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
