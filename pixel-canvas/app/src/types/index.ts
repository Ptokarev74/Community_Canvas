import { serverTimestamp } from 'firebase/database';
// This structure was chosen due to its easy acces in a Google Firebase Database, more effecient storge

// The inner object: maps a Y coordinate (as a string key) to the color (string value), which will map to x cordinate
interface YCoordinateMap {
    [y: string]: PixelData; // e.x., "5": "red"
}

// The outer object: maps an X coordinate (as a string key) to the YCoordinateMap (Color and Cordinate)
export interface CanvasGrid {
    [x: string]: YCoordinateMap; // e.x., "10": { "5": "red", "6": "blue" }
}


// Pixel Canvas
export interface PixelCanvasProps {
    canvasData: CanvasGrid;
    onPixelPlace: (x: number, y: number) => void;
}

export interface PixelData {
    color: string;
    uid: string;
    timestamp: number; 
}

export interface PixelDataToWrite {
    color: string;
    uid: string;
    timestamp: {
        '.sv': string; 
    };
}

