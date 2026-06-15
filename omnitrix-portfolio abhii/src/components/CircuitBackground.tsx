/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  currentIdx: number;
  progress: number;
  speed: number;
  color: string;
  width: number;
}

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Track state of circuit lines
    let activeLines: Line[] = [];
    const maxLines = 15;

    // Helper: generate random coordinate matching viewport
    const getRandomPoint = (): Point => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
      };
    };

    // Helper: generate new branching trace path
    const createLine = (): Line => {
      const start = getRandomPoint();
      const points: Point[] = [start];
      
      let currentX = start.x;
      let currentY = start.y;
      const legCount = 3 + Math.floor(Math.random() * 4); // 3-6 turns

      for (let i = 0; i < legCount; i++) {
        const length = 40 + Math.random() * 120;
        // Sci-fi circuits grow in 45/90 degree angles
        const angleChoice = Math.floor(Math.random() * 8);
        const angle = (angleChoice * Math.PI) / 4; // Multiples of 45 deg
        
        currentX += Math.cos(angle) * length;
        currentY += Math.sin(angle) * length;

        // Keep inside canvas bounds
        currentX = Math.max(10, Math.min(width - 10, currentX));
        currentY = Math.max(10, Math.min(height - 10, currentY));

        points.push({ x: currentX, y: currentY });
      }

      return {
        points,
        currentIdx: 0,
        progress: 0,
        speed: 1.5 + Math.random() * 2,
        color: Math.random() > 0.4 ? "rgba(0, 255, 65, 0.4)" : "rgba(0, 143, 31, 0.35)",
        width: Math.random() > 0.7 ? 1.5 : 1,
      };
    };

    // Pre-populate initial circuits
    for (let i = 0; i < maxLines; i++) {
      activeLines.push(createLine());
    }

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw active circuit lines
      activeLines.forEach((line, index) => {
        ctx.beginPath();
        ctx.lineWidth = line.width;
        ctx.strokeStyle = line.color;
        ctx.shadowColor = "#00ff41";
        ctx.shadowBlur = line.width > 1.2 ? 6 : 2;

        // Draw already completed segments
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 0; i < line.currentIdx; i++) {
          ctx.lineTo(line.points[i + 1].x, line.points[i + 1].y);
        }

        // Draw segment being drawn right now
        const currentSegmentStart = line.points[line.currentIdx];
        const currentSegmentEnd = line.points[line.currentIdx + 1];

        if (currentSegmentStart && currentSegmentEnd) {
          const dx = currentSegmentEnd.x - currentSegmentStart.x;
          const dy = currentSegmentEnd.y - currentSegmentStart.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const stepSize = line.speed;
          line.progress += stepSize;

          if (line.progress >= distance) {
            // Finished current segment, move to next
            line.currentIdx++;
            line.progress = 0;
            ctx.lineTo(currentSegmentEnd.x, currentSegmentEnd.y);
          } else {
            const ratio = line.progress / distance;
            const targetX = currentSegmentStart.x + dx * ratio;
            const targetY = currentSegmentStart.y + dy * ratio;
            ctx.lineTo(targetX, targetY);
          }
        }

        ctx.stroke();

        // Draw terminal light node at final point when completed
        if (line.currentIdx >= line.points.length - 1) {
          const lastPt = line.points[line.points.length - 1];
          ctx.beginPath();
          ctx.arc(lastPt.x, lastPt.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00ff41";
          ctx.fill();

          // Recycle line
          activeLines[index] = createLine();
        } else {
          // Draw tiny light trailing at current head of line
          const currentSegStart = line.points[line.currentIdx];
          const currentSegEnd = line.points[line.currentIdx + 1];
          if (currentSegStart && currentSegEnd) {
            const dx = currentSegEnd.x - currentSegStart.x;
            const dy = currentSegEnd.y - currentSegStart.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const ratio = line.progress / dist;
            const traceX = currentSegStart.x + dx * ratio;
            const traceY = currentSegStart.y + dy * ratio;

            ctx.beginPath();
            ctx.arc(traceX, traceY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "#00ff41";
            ctx.fill();
          }
        }
      });

      // Simple grid overlays occasionally
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-45 mix-blend-screen"
      style={{ filter: "drop-shadow(0 0 1px rgba(0,255,65,0.3))" }}
    />
  );
}
