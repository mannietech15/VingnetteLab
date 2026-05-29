'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvasStore, StrokeElement, ShapeElement } from '@/store/useCanvasStore';
import { getStroke } from 'perfect-freehand';

// Helper to convert perfect-freehand stroke to SVG path
function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return '';
  
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { 
    elements, 
    camera, 
    currentTool, 
    currentColor, 
    currentSize,
    setCamera,
    addElement,
    updateElement,
    removeElement
  } = useCanvasStore();

  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const [lastPanPoint, setLastPanPoint] = useState<{x: number, y: number} | null>(null);

  // Screen to World coordinates
  const screenToWorld = (clientX: number, clientY: number) => {
    return {
      x: (clientX - camera.x) / camera.z,
      y: (clientY - camera.y) / camera.z
    };
  };

  // Main Render Loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Apply Camera Transform
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.z, camera.z);

    // Draw Elements
    for (const element of elements) {
      if (element.type === 'stroke') {
        const strokePath = getStroke(element.points, {
          size: element.size,
          smoothing: 0.5,
          thinning: 0.5,
        });
        
        const pathData = getSvgPathFromStroke(strokePath);
        const p = new Path2D(pathData);
        ctx.fillStyle = element.color;
        ctx.fill(p);
      } else if (element.type === 'rect') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z; // Keep stroke width consistent regardless of zoom
        
        // Handle negative width/height by normalizing the coordinates
        const x = Math.min(element.x, element.x + element.width);
        const y = Math.min(element.y, element.y + element.height);
        const w = Math.abs(element.width);
        const h = Math.abs(element.height);

        if (element.isFilled) ctx.fillRect(x, y, w, h);
        else ctx.strokeRect(x, y, w, h);
      } else if (element.type === 'ellipse') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        
        ctx.beginPath();
        ctx.ellipse(
          element.x + element.width / 2, 
          element.y + element.height / 2, 
          Math.abs(element.width / 2), 
          Math.abs(element.height / 2), 
          0, 0, 2 * Math.PI
        );
        if (element.isFilled) ctx.fill();
        else ctx.stroke();
      }
    }

    ctx.restore();
  }, [elements, camera]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        canvasRef.current.style.width = `${window.innerWidth}px`;
        canvasRef.current.style.height = `${window.innerHeight}px`;
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        
        draw();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // init
    return () => window.removeEventListener('resize', handleResize);
  }, [draw]);



  // Re-draw when elements or camera change
  useEffect(() => {
    requestAnimationFrame(draw);
  }, [elements, camera, draw]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Middle click or Space/Pan tool -> Panning
    if (e.button === 1 || currentTool === 'select') {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (currentTool === 'pen') {
      setIsDrawing(true);
      const id = Date.now().toString(); // simple ID generator
      setCurrentStrokeId(id);
      
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      const newStroke: StrokeElement = {
        id,
        type: 'stroke',
        points: [[x, y, e.pressure || 0.5]],
        color: currentColor,
        size: currentSize
      };
      
      addElement(newStroke);
    } else if (currentTool === 'rect' || currentTool === 'ellipse') {
      setIsDrawing(true);
      const id = Date.now().toString();
      setCurrentStrokeId(id);
      
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      const newShape: ShapeElement = {
        id,
        type: currentTool,
        x,
        y,
        width: 0,
        height: 0,
        color: currentColor,
        isFilled: false // Could be hooked up to UI later
      };
      
      addElement(newShape);
    } else if (currentTool === 'eraser') {
      // Trigger eraser check immediately on click
      handleEraser(e.clientX, e.clientY);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isPanning && lastPanPoint) {
      const dx = e.clientX - lastPanPoint.x;
      const dy = e.clientY - lastPanPoint.y;
      
      setCamera((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (currentTool === 'eraser' && e.buttons === 1) {
      handleEraser(e.clientX, e.clientY);
      return;
    }

    if (isDrawing && currentStrokeId && currentTool === 'pen') {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      
      updateElement(currentStrokeId, (el) => {
        if (el.type !== 'stroke') return el;
        return {
          ...el,
          points: [...el.points, [x, y, e.pressure || 0.5]]
        };
      });
    } else if (isDrawing && currentStrokeId && (currentTool === 'rect' || currentTool === 'ellipse')) {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      
      updateElement(currentStrokeId, (el) => {
        if (el.type !== 'rect' && el.type !== 'ellipse') return el;
        return {
          ...el,
          width: x - el.x,
          height: y - el.y
        };
      });
    }
  };

  const handleEraser = (clientX: number, clientY: number) => {
    const { x, y } = screenToWorld(clientX, clientY);
    const eraseRadius = (currentSize * 2) / camera.z;

    for (const el of elements) {
      if (el.type === 'stroke') {
        // Quick distance check against stroke points
        for (const pt of el.points) {
          const dx = pt[0] - x;
          const dy = pt[1] - y;
          if (Math.sqrt(dx * dx + dy * dy) < eraseRadius * 2) {
            removeElement(el.id);
            break;
          }
        }
      } else if (el.type === 'rect' || el.type === 'ellipse') {
        // Basic bounding box check for shapes
        const xMin = Math.min(el.x, el.x + el.width);
        const xMax = Math.max(el.x, el.x + el.width);
        const yMin = Math.min(el.y, el.y + el.height);
        const yMax = Math.max(el.y, el.y + el.height);
        
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          removeElement(el.id);
        }
      }
    }
  };

  const onPointerUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
    setCurrentStrokeId(null);
    setLastPanPoint(null);
  };

  // Zooming
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault(); // need to attach via generic addEventListener to be passive: false
    
    // Pinch to zoom or scroll to pan
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newZ = Math.min(Math.max(0.1, camera.z * (1 + delta)), 5);
      
      // Zoom towards cursor
      const cursorX = e.clientX;
      const cursorY = e.clientY;
      
      setCamera((prev) => {
        const scaleChange = newZ / prev.z;
        return {
          x: cursorX - (cursorX - prev.x) * scaleChange,
          y: cursorY - (cursorY - prev.y) * scaleChange,
          z: newZ
        };
      });
    } else {
      // Pan
      setCamera((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  useEffect(() => {
    // Attach passive: false event listener for wheel to prevent default browser behavior
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Call our synthetic event handler logic
      onWheel(e as unknown as React.WheelEvent);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  });

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        touchAction: 'none', // Prevent browser gestures
        cursor: currentTool === 'select' ? 'grab' : isPanning ? 'grabbing' : 'crosshair'
      }}
    />
  );
}
