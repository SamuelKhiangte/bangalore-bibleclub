import { useState, useRef, useEffect } from 'react';
import { Camera, SwitchCamera, Upload, Sparkles, Check, RotateCcw, X } from 'lucide-react';
import { BeRealCardPreview } from './BeRealCardPreview.tsx';
import { SAMPLE_START_PHOTO, SAMPLE_END_PHOTO } from '../../data/sampleBiblePhotos.ts';
import { playShutterSound } from '../../services/sound.ts';

interface DualCameraCaptureProps {
  onPhotosCaptured: (startPhoto: string, endPhoto: string) => void;
  onCancel: () => void;
}

export const DualCameraCapture: React.FC<DualCameraCaptureProps> = ({
  onPhotosCaptured,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [startPhoto, setStartPhoto] = useState<string | null>(null);
  const [endPhoto, setEndPhoto] = useState<string | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1080 },
          height: { ideal: 1440 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      setCameraActive(false);
      setCameraError('Camera access unavailable. You can use preset sample photos or upload from device.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (step < 3) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step, facingMode]);

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const captureFrame = () => {
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);

    let photoData = '';

    if (cameraActive && videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        photoData = canvas.toDataURL('image/jpeg', 0.85);
      }
    } else {
      photoData = step === 1 ? SAMPLE_START_PHOTO : SAMPLE_END_PHOTO;
    }

    if (step === 1) {
      setStartPhoto(photoData);
      setStep(2);
    } else if (step === 2) {
      setEndPhoto(photoData);
      setStep(3);
    }
  };

  const handleUseSamples = () => {
    playShutterSound();
    setStartPhoto(SAMPLE_START_PHOTO);
    setEndPhoto(SAMPLE_END_PHOTO);
    setStep(3);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (step === 1) {
        setStartPhoto(result);
        setStep(2);
      } else if (step === 2) {
        setEndPhoto(result);
        setStep(3);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setStartPhoto(null);
    setEndPhoto(null);
    setStep(1);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#1E1B18',
        overflow: 'hidden'
      }}
    >
      {/* Flash overlay */}
      {isFlashing && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#ffffff',
            zIndex: 999,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          zIndex: 20
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Step Indicator Pill */}
        <div
          className="glass-pill"
          style={{
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-display)',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.25)'
          }}
        >
          {step === 1 && (
            <>
              <span style={{ color: '#FCD34D' }}>● Step 1/2</span>
              <span>Start Verse</span>
            </>
          )}
          {step === 2 && (
            <>
              <span style={{ color: '#A7F3D0' }}>● Step 2/2</span>
              <span>End Verse</span>
            </>
          )}
          {step === 3 && (
            <>
              <span style={{ color: '#BAE6FD' }}>● Preview</span>
              <span>Tap to Swap</span>
            </>
          )}
        </div>

        {step < 3 ? (
          <button
            onClick={toggleCameraFacing}
            title="Switch Camera"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <SwitchCamera size={18} />
          </button>
        ) : (
          <div style={{ width: '36px' }} />
        )}
      </div>

      {/* Main Viewfinder / Review Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
          position: 'relative'
        }}
      >
        {step < 3 ? (
          <div
            style={{
              width: '100%',
              aspectRatio: '4 / 5',
              borderRadius: '28px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#27231F',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: cameraActive ? 'block' : 'none',
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
              }}
            />

            {!cameraActive && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'radial-gradient(circle at 50% 40%, #302A24 0%, #1A1714 100%)'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(74, 124, 89, 0.2)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold-light)',
                    marginBottom: '14px'
                  }}
                >
                  <Camera size={28} />
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC', fontFamily: 'var(--font-display)' }}>
                  {step === 1 ? 'Point at Start Verse' : 'Point at End Verse'}
                </h4>
                <p style={{ fontSize: '13px', color: '#D4CDC5', marginTop: '6px', maxWidth: '280px' }}>
                  {cameraError || 'Hold your camera over the Bible passage you are reading.'}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '20px' }}
                    onClick={handleUseSamples}
                  >
                    <Sparkles size={13} />
                    Use Sample Bible Photos
                  </button>
                </div>
              </div>
            )}

            {/* Target Crosshair */}
            <div
              style={{
                position: 'absolute',
                inset: '20px',
                border: '1px dashed rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>┌</span>
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>┐</span>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  background: 'rgba(30, 25, 20, 0.75)',
                  padding: '5px 12px',
                  borderRadius: '12px',
                  alignSelf: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {step === 1 ? '📖 Frame Starting Verse' : '📖 Frame Ending Verse'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>└</span>
                <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>┘</span>
              </div>
            </div>

            {step === 2 && startPhoto && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  width: '26%',
                  aspectRatio: '3 / 4',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid #4A7C59',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.5)'
                }}
              >
                <img src={startPhoto} alt="Start verse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', fontSize: '8px', fontWeight: 800, textAlign: 'center', color: '#fff', borderRadius: '4px' }}>
                  START
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {startPhoto && endPhoto && (
              <BeRealCardPreview
                startPhoto={startPhoto}
                endPhoto={endPhoto}
                isInteractive={true}
              />
            )}
            <p style={{ fontSize: '12px', color: '#D4CDC5', marginTop: '12px', textAlign: 'center', fontWeight: 600 }}>
              💡 <em>Tap the small thumbnail in the top-left to swap views!</em>
            </p>
          </div>
        )}
      </div>

      {/* Bottom Controls Area */}
      <div
        style={{
          padding: '20px 24px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20
        }}
      >
        {step < 3 ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Upload photo"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <Upload size={18} />
            </button>

            {/* Shutter Button */}
            <div
              onClick={captureFrame}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                border: '4px solid #fff',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(255, 255, 255, 0.35)',
                transition: 'transform 0.15s ease'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: step === 1 ? 'var(--accent-gold)' : 'var(--accent-emerald)',
                  boxShadow: step === 1 ? '0 0 16px var(--accent-gold-glow)' : '0 0 16px var(--accent-emerald-glow)'
                }}
              />
            </div>

            <button
              onClick={handleUseSamples}
              title="Use sample verse photo"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(74, 124, 89, 0.2)',
                border: '1px solid var(--border-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-gold-light)',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={18} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: '14px', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.3)' }}
              onClick={handleRetake}
            >
              <RotateCcw size={16} />
              <span>Retake</span>
            </button>

            <button
              className="btn-primary"
              style={{ flex: 2, padding: '14px' }}
              onClick={() => {
                if (startPhoto && endPhoto) {
                  onPhotosCaptured(startPhoto, endPhoto);
                }
              }}
            >
              <Check size={18} />
              <span>Continue to Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
