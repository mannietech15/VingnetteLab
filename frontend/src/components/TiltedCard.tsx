import React, { useRef, useState } from 'react';

interface TiltedCardProps {
  imageSrc?: string | React.ReactNode;
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, rotate: 0 });
  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    setTransform(`rotateX(${rotationX}deg) rotateY(${rotationY}deg)`);

    const velocityY = offsetY - lastY;
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      rotate: -velocityY * 0.6
    });
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    setScale(scaleOnHover);
    setOpacity(1);
  }

  function handleMouseLeave() {
    setOpacity(0);
    setScale(1);
    setTransform(`rotateX(0deg) rotateY(0deg)`);
    setTooltipPos(prev => ({ ...prev, rotate: 0 }));
  }

  return (
    <figure
      ref={ref}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        height: containerHeight,
        width: containerWidth,
        perspective: '800px',
        zIndex: opacity === 1 ? 20 : 1 // Elevate when hovered to prevent overlap issues
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div style={{ position: 'absolute', top: '16px', textAlign: 'center', fontSize: '14px', opacity: 0.5, zIndex: 10 }}>
          Mobile view
        </div>
      )}

      <div
        style={{
          position: 'relative',
          width: imageWidth,
          height: imageHeight,
          transform: `${transform} scale(${scale})`,
          transition: opacity === 0 ? 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {typeof imageSrc === 'string' ? (
          <img
            src={imageSrc}
            alt={altText}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '15px',
              transform: 'translateZ(0)',
              boxShadow: opacity === 1 ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none',
              transition: 'box-shadow 0.3s ease'
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '15px',
              overflow: 'hidden',
              transform: 'translateZ(0)',
              boxShadow: opacity === 1 ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
              transition: 'box-shadow 0.3s ease'
            }}
          >
            {imageSrc}
          </div>
        )}

        {displayOverlayContent && overlayContent && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            transform: 'translateZ(30px)', // This gives the 3D pop out effect
            pointerEvents: 'none' // Let hover events pass through to figure
          }}>
            {overlayContent}
          </div>
        )}
      </div>

      {showTooltip && (
        <figcaption
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: `translate(${tooltipPos.x}px, ${tooltipPos.y}px) rotate(${tooltipPos.rotate}deg)`,
            opacity,
            transition: 'opacity 0.3s ease',
            zIndex: 30
          }}
        >
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
