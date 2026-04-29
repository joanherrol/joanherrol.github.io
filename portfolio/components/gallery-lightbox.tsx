"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";

interface GalleryLightboxProps {
  src: string;
  title: string;
  desc: string;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({ src, title, desc, index, total, onClose, onPrev, onNext }: GalleryLightboxProps) {
  const [detailMode, setDetailMode] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const didDragRef = useRef(false);
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const setCursor = useCallback((cursor: "default" | "grab" | "grabbing") => {
    if (!innerRef.current) return;
    innerRef.current.style.cursor = cursor;
  }, []);

  const applyTransform = useCallback((z: number, x: number, y: number, animated = false) => {
    if (!imgRef.current) return;
    imgRef.current.style.transition = animated ? "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)" : "none";
    imgRef.current.style.transform = `scale(${z}) translate(${x / z}px, ${y / z}px)`;
  }, []);

  const enterDetail = useCallback(() => {
    zoomRef.current = 2.5;
    panRef.current = { x: 0, y: 0 };
    applyTransform(2.5, 0, 0, true);
    setCursor("grab");
    setDetailMode(true);
  }, [applyTransform, setCursor]);

  const exitDetail = useCallback(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    applyTransform(1, 0, 0, true);
    setCursor("default");
    setDetailMode(false);
  }, [applyTransform, setCursor]);

  // Reset zoom/pan when navigating to a different image
  useEffect(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    applyTransform(1, 0, 0, false);
    setCursor("default");
    setDetailMode(false);
    setImgLoaded(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (detailMode) exitDetail(); else onClose(); }
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [detailMode, exitDetail, onClose, onPrev, onNext]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!detailMode) return;
    e.preventDefault();
    didDragRef.current = false;
    setCursor("grabbing");
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: panRef.current.x, panY: panRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true;
    panRef.current = { x: dragRef.current.panX + dx, y: dragRef.current.panY + dy };
    applyTransform(zoomRef.current, panRef.current.x, panRef.current.y);
  };

  const stopDrag = () => {
    if (dragRef.current) {
      dragRef.current = null;
      setCursor(detailMode ? "grab" : "default");
    }
  };

  const getTouchDist = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchRef.current = { dist: getTouchDist(e.touches), zoom: zoomRef.current };
      dragRef.current = null;
    } else if (e.touches.length === 1 && detailMode) {
      const t = e.touches[0];
      didDragRef.current = false;
      dragRef.current = { startX: t.clientX, startY: t.clientY, panX: panRef.current.x, panY: panRef.current.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const scale = getTouchDist(e.touches) / pinchRef.current.dist;
      zoomRef.current = Math.min(4, Math.max(1, pinchRef.current.zoom * scale));
      applyTransform(zoomRef.current, panRef.current.x, panRef.current.y);
    } else if (e.touches.length === 1 && detailMode && dragRef.current) {
      const t = e.touches[0];
      const dx = t.clientX - dragRef.current.startX;
      const dy = t.clientY - dragRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true;
      panRef.current = { x: dragRef.current.panX + dx, y: dragRef.current.panY + dy };
      applyTransform(zoomRef.current, panRef.current.x, panRef.current.y);
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
    dragRef.current = null;
  };

  const handleImageClick = () => {
    didDragRef.current = false;
  };

  // Desktop only: click outside image closes
  const handleBackdropClick = () => { onClose(); };

  // Shared zoom button label — avoids repeating in desktop + mobile layouts
  const zoomLabel = detailMode
    ? <><ZoomOut className="w-5 h-5" /><span>Exit zoom</span></>
    : <><ZoomIn className="w-5 h-5" /><span>Zoom in</span></>;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">

      {/* Desktop backdrop — click outside image to close (hidden on mobile) */}
      <div className="hidden sm:block absolute inset-0 z-0" onClick={handleBackdropClick} />

      {/* Close button — mobile only */}
      <button
        className="sm:hidden absolute top-4 right-4 z-20 p-1 text-white/50 hover:text-white transition-colors cursor-pointer"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Chevrons — desktop: absolute mid-sides; mobile: in bottom bar */}
      <button
        className="hidden sm:block absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>
      <button
        className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* Image area */}
      <div
        ref={innerRef}
        className="flex-1 flex items-center justify-center select-none px-4 sm:px-16 pt-12 sm:pt-4 pb-[28vh] sm:pb-[16vh]"
        style={{ cursor: "default" }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative" onClick={handleImageClick}>
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-white/10 rounded-xl" />
          )}
          <Image
            ref={imgRef}
            src={src}
            alt={title}
            width={1200}
            height={1600}
            className={`max-h-[60vh] sm:max-h-[75vh] max-w-full w-auto object-contain rounded-xl shadow-2xl transition-opacity duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            priority
            draggable={false}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
      </div>

      {/* Bottom bar — fixed height, glass background like navbar */}
      <div
        className="absolute bottom-0 inset-x-0 z-10 bg-background/80 backdrop-blur-sm border-t border-border px-4 pb-4 h-[28vh] sm:h-[16vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop layout: text centred + zoom button right, count at bottom */}
        <div className="hidden sm:flex items-start gap-6 flex-1 pt-3">
          <div className="flex-1 flex justify-center overflow-hidden">
            <div className="max-w-lg w-full">
              <h2 className="text-white text-lg font-semibold">{title}</h2>
              <p className="text-white/60 text-sm mt-1">{desc}</p>
            </div>
          </div>
          <button
            className="flex-shrink-0 self-center flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium border border-white/30 rounded-full px-4 py-1.5 transition-colors cursor-pointer mr-4"
            onClick={() => detailMode ? exitDetail() : enterDetail()}
            aria-label={detailMode ? "Exit zoom" : "Zoom in"}
          >
            {zoomLabel}
          </button>
        </div>
        <p className="hidden sm:block text-white/30 text-xs text-center pb-2">{index + 1} / {total}</p>

        {/* Mobile layout: title+desc → chevrons+zoom → count pinned at bottom */}
        <div className="sm:hidden flex flex-col flex-1 pt-3">
          <div className="flex-shrink-0">
            <h2 className="text-white text-base font-semibold">{title}</h2>
            <p className="text-white/60 text-sm mt-0.5">{desc}</p>
          </div>
          <div className="flex items-center justify-between gap-2 mt-auto mb-8">
            <button
              className="flex-1 flex justify-center items-center py-1 text-white/60 active:text-white transition-colors"
              onClick={onPrev}
              aria-label="Previous"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
            <button
              className="flex items-center gap-2 text-white/70 text-sm font-medium border border-white/30 rounded-full px-4 py-2 transition-colors"
              onClick={() => detailMode ? exitDetail() : enterDetail()}
              aria-label={detailMode ? "Exit zoom" : "Zoom in"}
            >
              {zoomLabel}
            </button>
            <button
              className="flex-1 flex justify-center items-center py-1 text-white/60 active:text-white transition-colors"
              onClick={onNext}
              aria-label="Next"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
          <p className="text-white/30 text-xs text-center mt-2">{index + 1} / {total}</p>
        </div>
      </div>
    </div>
  );
}
