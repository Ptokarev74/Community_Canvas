import { PixelCanvasProps } from "./index";

// Size of the Canvas
const CANVAS_SIZE = 50;

export function PixelCanvas({ canvasData, onPixelPlace}: PixelCanvasProps) {
    const currentColor = '#333333'; // Placeholder for now (e.g., Red)

    return (
        <div className="canvas-container">
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