import React, { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRCodeModal({ show, onClose, payload, initialBaseUrl, title, message, includeUrl = true }) {
  const [baseUrl, setBaseUrl] = useState(initialBaseUrl || '')
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  useEffect(() => {
    if (initialBaseUrl) setBaseUrl(initialBaseUrl)
  }, [initialBaseUrl])

  if (!show) return null

  const qrValue = includeUrl 
    ? `${baseUrl}?importedTeams=${payload}`
    : payload

  if (isFullscreen) {
    return (
      <div 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'black', zIndex: 9999, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
        }}
        onClick={() => setIsFullscreen(false)}
      >
        <div style={{background: 'white', padding: 20, borderRadius: 12}}>
          <QRCodeCanvas 
            value={qrValue} 
            size={Math.min(window.innerWidth, window.innerHeight) * 0.8} 
            fgColor="#000000"
            bgColor="#FFFFFF"
            level="L"
          />
        </div>
        <div style={{color: 'rgba(255,255,255,0.7)', marginTop: 20, fontSize: 14}}>
          Tap anywhere to close
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{textAlign:'center', maxWidth:400}}>
        <h3 style={{marginTop:0}}>{title || 'Share Team List'}</h3>
        
        {includeUrl && (
          <div style={{marginBottom:16, textAlign:'left'}}>
            <label style={{fontSize:12, fontWeight:700, display:'block', marginBottom:4}}>Base URL (editable)</label>
            <input 
                className="input" 
                style={{width:'100%', fontSize:14, padding:8}} 
                value={baseUrl} 
                onChange={e => setBaseUrl(e.target.value)} 
            />
          </div>
        )}

        <div 
          className="qr-container" 
          style={{
            background:'white', padding:16, borderRadius:8, display:'inline-block', marginBottom:16,
            cursor: 'zoom-in'
          }}
          onClick={() => setIsFullscreen(true)}
          title="Click to expand"
        >
          <QRCodeCanvas 
            value={qrValue} 
            size={256} 
            fgColor="#000000"
            bgColor="#FFFFFF"
            level="L"
          />
        </div>
        <div style={{color:'var(--muted)', fontSize:12, marginBottom:16, wordBreak:'break-all'}}>
          {message || 'Scan this code with another device to import the team list.'}
        </div>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
