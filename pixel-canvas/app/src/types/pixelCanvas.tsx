import { PixelCanvasProps } from "./index";
import { useState, useEffect } from 'react';

// Size of the Canvas
const CANVAS_SIZE = 50;

export function PixelCanvas({ canvasData, onPixelPlace, scale, translateX, translateY, setTranslateX, setTranslateY, setScale}: PixelCanvasProps) {
    const currentColor = '#333333'; // Placeholder for now (e.g., Red)

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    const handleMouseDown = (e: React.MouseEvent) => {

        if (e.button !== 0) {
            setIsDragging(true);
            // Record the mouse position relative to the viewport
            setStartX(e.clientX);
            setStartY(e.clientY);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        // Calculate the difference between the starting and current position
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Update the parent's state by adding the change to the current position
        setTranslateX(translateX + dx);
        setTranslateY(translateY + dy);

        // Reset start position for the *next* move event
        setStartX(e.clientX);
        setStartY(e.clientY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Allow scroll wheel to handle zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault(); 

        const zoomFactor = 0.1;
        
        const direction = e.deltaY < 0 ? 1 : -1;
        const newScale = scale * (1 + direction * zoomFactor);

        const clampedScale = Math.max(0.2, Math.min(5, newScale)); // Limits zoom between 20% and 500%

        setScale(clampedScale);
    };

    return (
        <div 
        style={{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transformOrigin: '0 0', // Crucial: scale from the top-left corner
            cursor: 'grab' // Indicate it can be dragged
        }}
        className="canvas-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        onWheel={handleWheel}
        >
            
                {Array.from({ length: CANVAS_SIZE }).map((_, x) => (
                    <div key={x} className="canvas-row">
                        {Array.from({ length: CANVAS_SIZE }).map((_, y) => {
                            const pixelData = canvasData[x]?.[y];
                            const pixelColor: string = pixelData?.color || '#444444';

                            // Return the pixel element (The JSX)
                            return (
                                <div 
                                    key={y}
                                    className="pixel-cell"
                                    style={{ backgroundColor: pixelColor }}

                                    onClick={() => onPixelPlace(x, y)}
                                />
                            );
                        })}

                    </div>
                ))}
            </div>
    );
}