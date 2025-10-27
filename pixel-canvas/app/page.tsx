'use client';
// useState used for storing canvas data, useEffect for conncting to database
import { useState, useEffect } from 'react';
//  databse Library import
import { db } from './src/firebase/config';
// the pixel grid
import { PixelCanvas } from './src/types/pixelCanvas';
// the canvas grid
import { CanvasGrid } from './src/types';
// Firebase Realtime Databas functions:
import { ref, onValue, set } from 'firebase/database'

// On page load set up everything needed.
export default function CanvasPage() {
  // The grid we use!
  const [canvasData, setCanvasData] = useState<CanvasGrid>({});
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');

  // On load up...
  useEffect(() => {
    const canvasDataRef = ref(db, 'canvas') // The database Reference

    // Real time Listner, fetches the canvas data
    const unsubscribe = onValue(canvasDataRef, (snapshot) => {
      const data: CanvasGrid = snapshot.val() || {};
      setCanvasData(data);
    });

    // Clean up function
    return () => {
      unsubscribe();
    };
  }, [])

    // Function used to update a pixel when user places it
  const onPixelPlace = (x: number, y: number) => {
    const pixelPath = `canvas/${x}/${y}`;
    const pixelRef = ref(db, pixelPath);

    // Attemept to asychrnously change the color
    set(pixelRef, selectedColor)
          .then(() => {
              console.log(`Pixel placed at (${x}, ${y}) with color ${selectedColor}`);
          })
          .catch((error) => {
              console.error("Pixel placement failed:", error);
          });
  };


  // The main page!... finally... 
  return (
    <main style={{ padding: 20 }}>
        <h1>r/place Clone</h1>
        <p>Current Color: <span style={{ backgroundColor: selectedColor, padding: '0 10px', border: '1px solid #333' }}>{selectedColor}</span></p>

        {/* In a real app, you'd add a color picker here, but for now: */}
        <button onClick={() => setSelectedColor('#00FF00')}>Set Color to Green</button>
        <button onClick={() => setSelectedColor('#0000FF')}>Set Color to Blue</button>

        <div style={{ marginTop: 20 }}>
            {/* 🎯 STEP 2: Render the PixelCanvas and pass the required props */}
            <PixelCanvas 
                canvasData={canvasData} 
                onPixelPlace={onPixelPlace} 
            />
        </div>
    </main>
  );


}




