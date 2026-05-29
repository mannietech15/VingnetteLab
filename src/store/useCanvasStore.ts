import { create } from 'zustand';

export type Tool = 'select' | 'pen' | 'eraser' | 'rect' | 'ellipse';

export type Point = [number, number, number]; // [x, y, pressure]

export interface StrokeElement {
  id: string;
  type: 'stroke';
  points: Point[];
  color: string;
  size: number;
}

export interface ShapeElement {
  id: string;
  type: 'rect' | 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isFilled: boolean;
}

export type CanvasElement = StrokeElement | ShapeElement;

interface Camera {
  x: number;
  y: number;
  z: number; // zoom level
}

interface CanvasState {
  elements: CanvasElement[];
  camera: Camera;
  currentTool: Tool;
  currentColor: string;
  currentSize: number;
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCamera: (updater: (prev: Camera) => Camera) => void;
  
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updater: (el: CanvasElement) => CanvasElement) => void;
  removeElement: (id: string) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  elements: [],
  camera: { x: 0, y: 0, z: 1 },
  currentTool: 'pen',
  currentColor: '#1a1a1a', // defaults to dark, will adapt based on theme if needed
  currentSize: 4,
  theme: 'system',

  setTool: (tool) => set({ currentTool: tool }),
  setColor: (color) => set({ currentColor: color }),
  setSize: (size) => set({ currentSize: size }),
  setTheme: (theme) => set({ theme }),
  
  setCamera: (updater) => set((state) => ({ camera: updater(state.camera) })),
  
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element] 
  })),
  
  updateElement: (id, updater) => set((state) => ({
    elements: state.elements.map(el => el.id === id ? updater(el) : el)
  })),
  
  removeElement: (id) => set((state) => ({
    elements: state.elements.filter(el => el.id !== id)
  }))
}));
