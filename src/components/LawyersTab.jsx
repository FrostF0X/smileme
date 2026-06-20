import React, { useState, useRef } from 'react';

const INITIAL_LAWYERS = [
  { id: '1', name: 'Saul Goodman', color: '#ffb3ba' },
  { id: '2', name: 'Kim Wexler', color: '#ffdfba' },
  { id: '3', name: 'Howard Hamlin', color: '#ffffba' },
  { id: '4', name: 'Chuck McGill', color: '#baffc9' },
  { id: '5', name: 'Clifford Main', color: '#bae1ff' }
];

export default function LawyersTab() {
  const [lawyers, setLawyers] = useState(INITIAL_LAWYERS);
  const [selectedLawyer, setSelectedLawyer] = useState(INITIAL_LAWYERS[0]);
  const [draggingId, setDraggingId] = useState(null);
  const dragRef = useRef({ startY: 0, currentY: 0 });
  const [dragOffset, setDragOffset] = useState(0);

  const handlePointerDown = (e, id) => {
    e.target.setPointerCapture(e.pointerId);
    setDraggingId(id);
    dragRef.current.startY = e.clientY;
    dragRef.current.currentY = e.clientY;
    setDragOffset(0);
  };

  const handlePointerMove = (e) => {
    if (!draggingId) return;
    dragRef.current.currentY = e.clientY;
    const dy = dragRef.current.currentY - dragRef.current.startY;
    setDragOffset(dy);
  };

  const handlePointerUp = (e, id) => {
    if (!draggingId) return;
    e.target.releasePointerCapture(e.pointerId);
    setDraggingId(null);
    setDragOffset(0);

    const dy = dragRef.current.currentY - dragRef.current.startY;

    // If dragged up by 50px, move to front
    if (dy < -50) {
      const idx = lawyers.findIndex(l => l.id === id);
      if (idx > 0) {
        const newLawyers = [...lawyers];
        const [moved] = newLawyers.splice(idx, 1);
        newLawyers.unshift(moved);
        setLawyers(newLawyers);
        setSelectedLawyer(moved);
      }
    } else if (Math.abs(dy) < 5) {
        // Just a click
        const clicked = lawyers.find(l => l.id === id);
        setSelectedLawyer(clicked);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 relative min-h-[300px]">
      <div className="mb-4 text-white text-sm font-bold text-center">
        Selected: <span className="text-[#00FFFF]">{selectedLawyer?.name}</span>
      </div>

      <div className="relative flex-1 mt-4 h-full" style={{ minHeight: `${lawyers.length * 40 + 60}px`}}>
        {lawyers.map((lawyer, index) => {
          const isDragging = draggingId === lawyer.id;
          const topOffset = isDragging ? index * 40 + dragOffset : index * 40;
          const zIndex = isDragging ? 100 : lawyers.length - index;

          return (
            <div
              key={lawyer.id}
              onPointerDown={(e) => handlePointerDown(e, lawyer.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={(e) => handlePointerUp(e, lawyer.id)}
              className="absolute left-0 right-0 p-4 rounded-lg shadow-lg cursor-grab active:cursor-grabbing select-none border border-black/20"
              style={{
                top: `${topOffset}px`,
                zIndex: zIndex,
                backgroundColor: lawyer.color,
                color: '#111',
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              }}
            >
              <div className="font-bold">{lawyer.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
