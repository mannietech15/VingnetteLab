import { create } from 'zustand';
import * as Y from 'yjs';
import { supabase } from '@/lib/supabase';
import { SupabaseProvider } from '@/lib/yjsSupabaseProvider';

export type Tool = 'select' | 'pen' | 'brush' | 'text' | 'eraser' | 'line' | 'rect' | 'rounded_rect' | 'ellipse' | 'triangle' | 'right_triangle' | 'diamond' | 'pentagon' | 'hexagon' | 'arrow_right' | 'arrow_left' | 'arrow_up' | 'arrow_down' | 'star_4' | 'star_5' | 'star_6' | 'heart' | 'lightning';
export type Point = [number, number, number];

export type BrushType = 'round' | 'flat' | 'marker' | 'splatter' | 'calligraphy';

export interface StrokeElement {
  id: string;
  type: 'stroke';
  strokeType?: 'pen' | 'brush' | 'eraser';
  brushType?: BrushType;
  points: Point[];
  color: string;
  size: number;
}

export interface ShapeElement {
  id: string;
  type: 'line' | 'rect' | 'rounded_rect' | 'ellipse' | 'triangle' | 'right_triangle' | 'diamond' | 'pentagon' | 'hexagon' | 'arrow_right' | 'arrow_left' | 'arrow_up' | 'arrow_down' | 'star_4' | 'star_5' | 'star_6' | 'heart' | 'lightning';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isFilled: boolean;
}

export interface TextElement {
  id: string;
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
}

export type CanvasElement = StrokeElement | ShapeElement | TextElement;

interface Camera {
  x: number;
  y: number;
  z: number;
}

// Global Yjs Document
const ydoc = new Y.Doc();
const yElements = ydoc.getMap<CanvasElement>('elements');

// Optional: Initialize Supabase provider if supabase is available
let provider: SupabaseProvider | null = null;
if (supabase) {
  provider = new SupabaseProvider(ydoc, supabase, 'global-canvas-room');
}
export const supabaseProvider = provider;

// Yjs Undo Manager
export const undoManager = new Y.UndoManager(yElements);

interface CanvasState {
  elements: CanvasElement[];
  camera: Camera;
  currentTool: Tool;
  currentColor: string;
  currentSize: number;
  currentBrushType: BrushType;
  currentFontFamily: string;
  currentFontSize: number;
  isFilled: boolean;
  theme: 'light' | 'dark' | 'system';
  
  selectedId: string | null;

  // Actions
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  setBrushType: (brushType: BrushType) => void;
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setIsFilled: (isFilled: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setCamera: (updater: (prev: Camera) => Camera) => void;
  setSelectedId: (id: string | null) => void;
  
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updater: (el: CanvasElement) => CanvasElement) => void;
  removeElement: (id: string) => void;
  clearElements: () => void;

  undo: () => void;
  redo: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => {
  
  // Listen to Yjs changes and sync back to Zustand
  yElements.observe(() => {
    const elementsArray = Array.from(yElements.values());
    set({ elements: elementsArray });
  });

  return {
    elements: Array.from(yElements.values()),
    camera: { x: 0, y: 0, z: 1 },
    currentTool: 'pen',
    currentColor: '#1a1a1a',
    currentSize: 4,
    currentBrushType: 'round',
    currentFontFamily: 'Inter',
    currentFontSize: 24,
    isFilled: false,
    theme: 'system',
    selectedId: null,

    setTool: (tool) => set({ currentTool: tool, selectedId: tool === 'select' ? get().selectedId : null }),
    setBrushType: (brushType) => set({ currentBrushType: brushType }),
    setColor: (color) => {
      set({ currentColor: color });
      const { selectedId, updateElement, elements } = get();
      if (selectedId) {
        updateElement(selectedId, (el) => ({ ...el, color }));
      }
    },
    setSize: (size) => {
      set({ currentSize: size });
      const { selectedId, updateElement, elements } = get();
      if (selectedId) {
        const el = elements.find(e => e.id === selectedId);
        if (el?.type === 'stroke') updateElement(selectedId, (e) => ({ ...e, size }));
      }
    },
    setFontFamily: (fontFamily) => {
      set({ currentFontFamily: fontFamily });
      const { selectedId, updateElement, elements } = get();
      if (selectedId) {
        const el = elements.find(e => e.id === selectedId);
        if (el?.type === 'text') updateElement(selectedId, (e) => ({ ...e, fontFamily } as TextElement));
      }
    },
    setFontSize: (fontSize) => {
      const newSize = Math.max(8, Math.min(200, fontSize));
      set({ currentFontSize: newSize });
      const { selectedId, updateElement, elements } = get();
      if (selectedId) {
        const el = elements.find(e => e.id === selectedId);
        if (el?.type === 'text') updateElement(selectedId, (e) => ({ ...e, fontSize: newSize } as TextElement));
      }
    },
    setIsFilled: (isFilled) => {
      set({ isFilled });
      const { selectedId, updateElement, elements } = get();
      if (selectedId) {
        const el = elements.find(e => e.id === selectedId);
        if (el?.type && el.type !== 'stroke' && el.type !== 'text') updateElement(selectedId, (e) => ({ ...e, isFilled } as ShapeElement));
      }
    },
    setTheme: (theme) => set({ theme }),
    setSelectedId: (id) => set({ selectedId: id }),
    
    setCamera: (updater) => set((state) => ({ camera: updater(state.camera) })),
    
    addElement: (element) => {
      // Mutate Yjs directly; the observer will update Zustand
      yElements.set(element.id, element);
    },
    
    updateElement: (id, updater) => {
      const el = yElements.get(id);
      if (el) {
        yElements.set(id, updater(el as CanvasElement));
      }
    },
    
    removeElement: (id) => {
      yElements.delete(id);
    },

    clearElements: () => {
      yElements.clear();
    },

    undo: () => undoManager.undo(),
    redo: () => undoManager.redo()
  };
});
