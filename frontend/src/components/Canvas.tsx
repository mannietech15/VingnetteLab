'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvasStore, StrokeElement, ShapeElement, TextElement } from '@/store/useCanvasStore';
import { getStroke } from 'perfect-freehand';
import { TEMPLATES } from '@/data/templates';
import TemplatePreview from '@/components/TemplatePreview';

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

export const SHAPE_TOOLS = ['line', 'rect', 'rounded_rect', 'ellipse', 'triangle', 'right_triangle', 'diamond', 'pentagon', 'hexagon', 'arrow_right', 'arrow_left', 'arrow_up', 'arrow_down', 'star_4', 'star_5', 'star_6', 'heart', 'lightning'];

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

export default function Canvas({ templateId }: { templateId?: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { 
    elements, 
    camera, 
    currentTool, 
    currentColor, 
    currentSize,
    currentFontFamily,
    currentFontSize,
    isFilled,
    setCamera,
    addElement,
    updateElement,
    removeElement,
    selectedId,
    setSelectedId
  } = useCanvasStore();

  const template = templateId ? TEMPLATES.find(t => t.id === templateId) : null;

  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const [lastPanPoint, setLastPanPoint] = useState<{x: number, y: number} | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<{x: number, y: number} | null>(null);

  // Keyboard shortcut for deleting selected element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        removeElement(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, removeElement, setSelectedId]);

  const getElementAtPosition = useCallback((x: number, y: number) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (el.type === 'stroke') {
        for (const pt of el.points) {
          const dx = pt[0] - x;
          const dy = pt[1] - y;
          if (Math.sqrt(dx * dx + dy * dy) < (el.size * 2) / camera.z + 5) {
            return el;
          }
        }
      } else if (el.type === 'text') {
        const textWidth = el.text.length * el.fontSize * 0.6; // rough estimate
        const textHeight = el.fontSize * 1.2 * (el.text.split('\n').length);
        if (x >= el.x && x <= el.x + textWidth && y >= el.y && y <= el.y + textHeight) {
          return el;
        }
      } else {
        const xMin = Math.min(el.x, el.x + el.width);
        const xMax = Math.max(el.x, el.x + el.width);
        const yMin = Math.min(el.y, el.y + el.height);
        const yMax = Math.max(el.y, el.y + el.height);
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          return el;
        }
      }
    }
    return null;
  }, [elements, camera.z]);

  // Screen to World coordinates — accounts for canvas element position (e.g. sidebar offset)
  const screenToWorld = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    return {
      x: (localX - camera.x) / camera.z,
      y: (localY - camera.y) / camera.z
    };
  }, [camera]);

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
        const isBrush = element.strokeType === 'brush';
        const strokePath = getStroke(element.points, {
          size: element.size,
          smoothing: isBrush ? 0.8 : 0.5,
          thinning: isBrush ? 0 : 0.5,
          simulatePressure: !isBrush,
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
      } else if (element.type === 'triangle') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        // Equilateral-ish triangle fitting in the bounding box
        ctx.moveTo(element.x + element.width / 2, element.y);
        ctx.lineTo(element.x + element.width, element.y + element.height);
        ctx.lineTo(element.x, element.y + element.height);
        ctx.closePath();
        if (element.isFilled) ctx.fill();
        else ctx.stroke();
      } else if (element.type === 'diamond') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        ctx.moveTo(element.x + element.width / 2, element.y);
        ctx.lineTo(element.x + element.width, element.y + element.height / 2);
        ctx.lineTo(element.x + element.width / 2, element.y + element.height);
        ctx.lineTo(element.x, element.y + element.height / 2);
        ctx.closePath();
        if (element.isFilled) ctx.fill();
        else ctx.stroke();
      } else if (element.type === 'hexagon') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        const w = element.width;
        const h = element.height;
        ctx.moveTo(element.x + w * 0.25, element.y);
        ctx.lineTo(element.x + w * 0.75, element.y);
        ctx.lineTo(element.x + w, element.y + h * 0.5);
        ctx.lineTo(element.x + w * 0.75, element.y + h);
        ctx.lineTo(element.x + w * 0.25, element.y + h);
        ctx.lineTo(element.x, element.y + h * 0.5);
        ctx.closePath();
        if (element.isFilled) ctx.fill();
        else ctx.stroke();
      } else if (element.type === 'line') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x + element.width, element.y + element.height);
        ctx.stroke();
      } else if (element.type === 'rounded_rect') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        ctx.roundRect(
          Math.min(element.x, element.x + element.width),
          Math.min(element.y, element.y + element.height),
          Math.abs(element.width),
          Math.abs(element.height),
          10 / camera.z
        );
        if (element.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type === 'right_triangle') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        ctx.moveTo(element.x, element.y);
        ctx.lineTo(element.x, element.y + element.height);
        ctx.lineTo(element.x + element.width, element.y + element.height);
        ctx.closePath();
        if (element.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type === 'pentagon') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const px = element.x + element.width/2 + Math.cos(angle) * element.width/2;
          const py = element.y + element.height/2 + Math.sin(angle) * element.height/2;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (element.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type.startsWith('arrow_')) {
        const shape = element as ShapeElement;
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.lineWidth = 2 / camera.z;
        const dir = shape.type.split('_')[1];
        ctx.beginPath();
        const xMin = Math.min(shape.x, shape.x + shape.width);
        const xMax = Math.max(shape.x, shape.x + shape.width);
        const yMin = Math.min(shape.y, shape.y + shape.height);
        const yMax = Math.max(shape.y, shape.y + shape.height);
        const w = Math.abs(shape.width);
        const h = Math.abs(shape.height);

        if (dir === 'right') {
          ctx.moveTo(xMin, yMin + h*0.25); ctx.lineTo(xMin + w*0.5, yMin + h*0.25); ctx.lineTo(xMin + w*0.5, yMin);
          ctx.lineTo(xMax, yMin + h*0.5); ctx.lineTo(xMin + w*0.5, yMax); ctx.lineTo(xMin + w*0.5, yMax - h*0.25);
          ctx.lineTo(xMin, yMax - h*0.25);
        } else if (dir === 'left') {
          ctx.moveTo(xMax, yMin + h*0.25); ctx.lineTo(xMin + w*0.5, yMin + h*0.25); ctx.lineTo(xMin + w*0.5, yMin);
          ctx.lineTo(xMin, yMin + h*0.5); ctx.lineTo(xMin + w*0.5, yMax); ctx.lineTo(xMin + w*0.5, yMax - h*0.25);
          ctx.lineTo(xMax, yMax - h*0.25);
        } else if (dir === 'up') {
          ctx.moveTo(xMin + w*0.25, yMax); ctx.lineTo(xMin + w*0.25, yMin + h*0.5); ctx.lineTo(xMin, yMin + h*0.5);
          ctx.lineTo(xMin + w*0.5, yMin); ctx.lineTo(xMax, yMin + h*0.5); ctx.lineTo(xMax - w*0.25, yMin + h*0.5);
          ctx.lineTo(xMax - w*0.25, yMax);
        } else if (dir === 'down') {
          ctx.moveTo(xMin + w*0.25, yMin); ctx.lineTo(xMin + w*0.25, yMax - h*0.5); ctx.lineTo(xMin, yMax - h*0.5);
          ctx.lineTo(xMin + w*0.5, yMax); ctx.lineTo(xMax, yMax - h*0.5); ctx.lineTo(xMax - w*0.25, yMax - h*0.5);
          ctx.lineTo(xMax - w*0.25, yMin);
        }
        ctx.closePath();
        if (shape.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type.startsWith('star_')) {
        const shape = element as ShapeElement;
        ctx.strokeStyle = shape.color;
        ctx.fillStyle = shape.color;
        ctx.lineWidth = 2 / camera.z;
        const points = parseInt(shape.type.split('_')[1] || '5');
        ctx.beginPath();
        const cx = shape.x + shape.width / 2;
        const cy = shape.y + shape.height / 2;
        const outerRadius = Math.min(Math.abs(shape.width), Math.abs(shape.height)) / 2;
        const innerRadius = points === 4 ? outerRadius * 0.3 : (points === 5 ? outerRadius * 0.5 : outerRadius * 0.6);
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points - Math.PI / 2;
          const px = cx + Math.cos(angle) * radius;
          const py = cy + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        if (shape.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type === 'heart') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        const x = Math.min(element.x, element.x + element.width);
        const y = Math.min(element.y, element.y + element.height);
        const w = Math.abs(element.width);
        const h = Math.abs(element.height);
        const topCurveHeight = h * 0.3;
        ctx.moveTo(x + w / 2, y + topCurveHeight);
        ctx.bezierCurveTo(x, y, x - w / 2, y + h * 0.5, x + w / 2, y + h);
        ctx.bezierCurveTo(x + w * 1.5, y + h * 0.5, x + w, y, x + w / 2, y + topCurveHeight);
        ctx.closePath();
        if (element.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type === 'lightning') {
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = 2 / camera.z;
        ctx.beginPath();
        const xMin = Math.min(element.x, element.x + element.width);
        const xMax = Math.max(element.x, element.x + element.width);
        const yMin = Math.min(element.y, element.y + element.height);
        const yMax = Math.max(element.y, element.y + element.height);
        const w = Math.abs(element.width);
        const h = Math.abs(element.height);
        ctx.moveTo(xMin + w*0.6, yMin);
        ctx.lineTo(xMin + w*0.1, yMin + h*0.55);
        ctx.lineTo(xMin + w*0.5, yMin + h*0.55);
        ctx.lineTo(xMin + w*0.3, yMax);
        ctx.lineTo(xMax, yMin + h*0.45);
        ctx.lineTo(xMin + w*0.5, yMin + h*0.45);
        ctx.closePath();
        if (element.isFilled) ctx.fill(); else ctx.stroke();
      } else if (element.type === 'text') {
        if (element.id !== editingTextId) {
          ctx.font = `${element.fontSize}px "${element.fontFamily}", sans-serif`;
          ctx.textBaseline = 'top';
          ctx.fillStyle = element.color;
          const lines = element.text.split('\n');
          lines.forEach((line, i) => {
            ctx.fillText(line, element.x, element.y + i * element.fontSize * 1.2);
          });
        }
      }
    }

    // Draw Selection Bounding Box
    if (selectedId) {
      const el = elements.find(e => e.id === selectedId);
      if (el) {
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2 / camera.z;
        ctx.setLineDash([5 / camera.z, 5 / camera.z]);
        
        let minX = 0, minY = 0, w = 0, h = 0;
        if (el.type === 'stroke') {
          let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
          for (const pt of el.points) {
            if (pt[0] < xMin) xMin = pt[0];
            if (pt[0] > xMax) xMax = pt[0];
            if (pt[1] < yMin) yMin = pt[1];
            if (pt[1] > yMax) yMax = pt[1];
          }
          minX = xMin - el.size;
          minY = yMin - el.size;
          w = xMax - xMin + el.size * 2;
          h = yMax - yMin + el.size * 2;
        } else if (el.type === 'text') {
          ctx.font = `${el.fontSize}px "${el.fontFamily}", sans-serif`;
          const lines = el.text.split('\n');
          let maxW = 0;
          for (const line of lines) {
            const wText = ctx.measureText(line).width;
            if (wText > maxW) maxW = wText;
          }
          minX = el.x;
          minY = el.y;
          w = maxW;
          h = lines.length * el.fontSize * 1.2;
        } else {
          minX = Math.min(el.x, el.x + el.width);
          minY = Math.min(el.y, el.y + el.height);
          w = Math.abs(el.width);
          h = Math.abs(el.height);
        }
        
        const pad = 4 / camera.z;
        ctx.strokeRect(minX - pad, minY - pad, w + pad * 2, h + pad * 2);
        ctx.setLineDash([]);
      }
    }

    ctx.restore();
  }, [elements, camera, selectedId, editingTextId]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        const parent = canvasRef.current.parentElement;
        const width = parent ? parent.clientWidth : window.innerWidth;
        const height = parent ? parent.clientHeight : window.innerHeight;
        
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
        
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
    // Middle click -> Panning
    if (e.button === 1) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const { x, y } = screenToWorld(e.clientX, e.clientY);

    if (currentTool === 'select') {
      const clickedEl = getElementAtPosition(x, y);
      if (clickedEl) {
        setSelectedId(clickedEl.id);
        setDragStartPoint({x, y});
        setIsDraggingElement(true);
      } else {
        setSelectedId(null);
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    // if not select, clear selection
    setSelectedId(null);

    if (currentTool === 'text') {
      e.preventDefault(); // Prevent canvas from stealing focus via default mousedown
      const clickedEl = getElementAtPosition(x, y);
      if (clickedEl && clickedEl.type === 'text') {
        setEditingTextId(clickedEl.id);
      } else {
        const id = generateId();
        const newText: TextElement = {
          id,
          type: 'text',
          x,
          y,
          text: '',
          fontFamily: currentFontFamily,
          fontSize: currentFontSize,
          color: currentColor
        };
        addElement(newText);
        setEditingTextId(id);
      }
      return;
    }

    if (currentTool === 'pen' || currentTool === 'brush') {
      setIsDrawing(true);
      const id = generateId(); // simple ID generator
      setCurrentStrokeId(id);
      
      const newStroke: StrokeElement = {
        id,
        type: 'stroke',
        strokeType: currentTool,
        points: [[x, y, e.pressure]],
        color: currentColor,
        size: currentSize * (currentTool === 'brush' ? 1.5 : 1) // slightly thicker for brush
      };
      
      addElement(newStroke);
    } else if (SHAPE_TOOLS.includes(currentTool)) {
      setIsDrawing(true);
      const id = generateId();
      setCurrentStrokeId(id);
      
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      const newShape: ShapeElement = {
        id,
        type: currentTool as ShapeElement['type'],
        x,
        y,
        width: 0,
        height: 0,
        color: currentColor,
        isFilled: isFilled
      };
      
      addElement(newShape);
    } else if (currentTool === 'eraser') {
      setIsDrawing(true);
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

    const { x, y } = screenToWorld(e.clientX, e.clientY);

    if (isDraggingElement && selectedId && dragStartPoint) {
      const dx = x - dragStartPoint.x;
      const dy = y - dragStartPoint.y;
      
      updateElement(selectedId, (el) => {
        if (el.type === 'stroke') {
          return { ...el, points: el.points.map(p => [p[0] + dx, p[1] + dy, p[2]]) };
        } else {
          return { ...el, x: el.x + dx, y: el.y + dy };
        }
      });
      setDragStartPoint({x, y});
      return;
    }

    if (currentTool === 'eraser' && isDrawing) {
      handleEraser(e.clientX, e.clientY);
      return;
    }

    if (isDrawing && currentStrokeId && (currentTool === 'pen' || currentTool === 'brush')) {
      
      updateElement(currentStrokeId, (el) => {
        if (el.type !== 'stroke') return el;
        return {
          ...el,
          points: [...el.points, [x, y, e.pressure || 0.5]]
        };
      });
    } else if (isDrawing && currentStrokeId && SHAPE_TOOLS.includes(currentTool)) {
      
      updateElement(currentStrokeId, (el) => {
        if (el.type === 'stroke') return el;
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
      } else if (SHAPE_TOOLS.includes(el.type)) {
        const shape = el as ShapeElement;
        // Basic bounding box check for shapes
        const xMin = Math.min(shape.x, shape.x + shape.width);
        const xMax = Math.max(shape.x, shape.x + shape.width);
        const yMin = Math.min(shape.y, shape.y + shape.height);
        const yMax = Math.max(shape.y, shape.y + shape.height);
        
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          removeElement(shape.id);
        }
      }
    }
  };

  const onPointerUp = () => {
    setIsDrawing(false);
    setIsPanning(false);
    setIsDraggingElement(false);
    setCurrentStrokeId(null);
    setLastPanPoint(null);
    setDragStartPoint(null);
  };

  // Zooming
  const onWheel = useCallback((e: WheelEvent | React.WheelEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      // Zoom towards cursor
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      
      setCamera((prev) => {
        const newZ = Math.min(Math.max(0.1, prev.z * (1 + delta)), 5);
        const scaleChange = newZ / prev.z;
        return {
          x: localX - (localX - prev.x) * scaleChange,
          y: localY - (localY - prev.y) * scaleChange,
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
  }, [setCamera]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      onWheel(e as unknown as React.WheelEvent);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [onWheel]);

  return (
    <>
      {template && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0
        }}>
          <div style={{
            position: 'absolute',
            width: '2000px',
            height: '1200px',
            left: 0,
            top: 0,
            transform: `translate(${camera.x + 100 * camera.z}px, ${camera.y + 100 * camera.z}px) scale(${camera.z})`,
            transformOrigin: '0 0',
            opacity: 0.8,
            boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
            borderRadius: '20px',
            background: 'var(--bg-secondary)',
          }}>
            <TemplatePreview pattern={template.pattern} color={template.color} width={2000} height={1200} />
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerOut={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          touchAction: 'none', // Prevent browser gestures
          cursor: currentTool === 'select' ? 'grab' : isPanning ? 'grabbing' : currentTool === 'text' ? 'text' : 'crosshair'
        }}
      />
      {editingTextId && elements.find(el => el.id === editingTextId)?.type === 'text' && (() => {
        const textEl = elements.find(el => el.id === editingTextId) as TextElement;
        const screenX = textEl.x * camera.z + camera.x;
        const screenY = textEl.y * camera.z + camera.y;
        return (
          <div
            key={textEl.id}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              // Read directly from the store to avoid stale closures if React hasn't re-rendered yet
              const latestElements = useCanvasStore.getState().elements;
              const latestEl = latestElements.find(el => el.id === textEl.id) as TextElement;
              
              if (!latestEl || !latestEl.text.trim()) {
                useCanvasStore.getState().removeElement(textEl.id);
              }
              
              // Only clear editingTextId if it hasn't already been moved to a new text element
              setEditingTextId(prev => prev === textEl.id ? null : prev);
            }}
            onInput={(e) => {
              // innerText preserves newlines properly for contentEditable
              const newText = (e.currentTarget as HTMLElement).innerText || '';
              updateElement(textEl.id, (el) => ({ ...el, text: newText }));
            }}
            onPointerDown={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: screenX,
              top: screenY,
              fontSize: `${textEl.fontSize * camera.z}px`,
              fontFamily: `"${textEl.fontFamily}", sans-serif`,
              color: textEl.color,
              caretColor: 'var(--text-primary)',
              background: 'transparent',
              border: '2px dashed var(--accent-primary)',
              borderRadius: '4px',
              outline: 'none',
              padding: '0 4px',
              margin: '0',
              whiteSpace: 'pre',
              lineHeight: 1.2,
              minWidth: '20px',
              minHeight: `${textEl.fontSize * camera.z * 1.2}px`,
              zIndex: 10,
              cursor: 'text'
            }}
            ref={(el) => {
              if (el && document.activeElement !== el) {
                el.innerText = textEl.text;
                el.focus();
                const range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
              }
            }}
          />
        );
      })()}
    </>
  );
}
