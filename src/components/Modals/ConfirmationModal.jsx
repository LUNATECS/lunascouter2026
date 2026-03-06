import React from 'react'

export default function ConfirmationModal({ 
    show, 
    title = 'Confirm Action', 
    message, 
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onCancel, 
    onConfirm,
    isDanger = false
}) {
  if (!show) return null

  return (
    <div className="modal-overlay" style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    }}>
        <div className="modal" style={{
            maxWidth: 400, 
            textAlign: 'center',
            background: '#1e1e1e',
            borderRadius: 12,
            padding: 24,
            border: '1px solid #333',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
            <h3 style={{
                marginTop: 0, 
                color: isDanger ? 'var(--banner-red, #ff4d4d)' : 'white',
                fontSize: 20
            }}>{title}</h3>
            
            <div style={{
                color: 'var(--muted, #aaa)', 
                marginBottom: 24,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5
            }}>
                {message}
            </div>
            
            <div style={{display:'flex', gap:12, justifyContent:'center'}}>
                <button 
                    className="btn small" 
                    onClick={onCancel} 
                    style={{
                        background: 'transparent', 
                        border: '1px solid rgba(255,255,255,0.3)',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }}
                >
                    {cancelLabel}
                </button>
                <button 
                    className="btn small" 
                    style={{
                        background: isDanger ? 'rgba(255,80,80,0.8)' : '#4CAF50', 
                        color: 'white', 
                        border: 'none',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }} 
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
    </div>
  )
}
