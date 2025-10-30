'use client';
// useState used for storing canvas data, useEffect for conncting to database
import { useState, useEffect } from 'react';
//  databse Library import
import { db, auth } from './src/firebase/config';
// the pixel grid
import { PixelCanvas } from './src/types/pixelCanvas';
// the canvas grid
import { CanvasGrid, PixelDataToWrite } from './src/types';
// Firebase Realtime Database functions:
import { ref, onValue, set, serverTimestamp } from 'firebase/database'
// Authentication
import { useAuth } from './src/context/AuthContext';
// SignIn Functionality
import { SignIn } from './src/context/SignIn';
import { LoadingSpinner } from './src/pageComponents/LoadingSpinner';
import { ZoomControls } from './src/pageComponents/ZoomControls';
import { ColorPickerComponent } from './src/pageComponents/ColorPickerComponent';


// On page load set up everything needed.
export default function CanvasPage() {
  // The grid we use!
  const [canvasData, setCanvasData] = useState<CanvasGrid>({});
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  // Viewport state to control position and scale
  const [scale, setScale] = useState(1); // 1 = 100% zoom
  const [translateX, setTranslateX] = useState(0); // X position for panning
  const [translateY, setTranslateY] = useState(0); // Y position for panning
  const { user, loading } = useAuth();
  const handleZoomIn = () => handleZoom(1);
  const handleZoomOut = () => handleZoom(-1);

  const handleZoom = (direction: 1 | -1) => { // 1 for in, -1 for out
    const zoomFactor = 0.1;
    const newScale = scale * (1 + direction * zoomFactor);
    const clampedScale = Math.max(0.2, Math.min(5, newScale)); // Same limits as wheel zoom
    setScale(clampedScale);
};

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

    if (!user || !user.uid) {
        console.error("User not authenticated. Cannot place pixel.");
        // In a real app, you'd show a login modal here
        return; 
    }

    const newPixelData: PixelDataToWrite = {
      color: selectedColor,
      uid: user.uid,
      timestamp: serverTimestamp() as { '.sv': 'timestamp' },
    };

    // Attemept to asychrnously change the color
    set(pixelRef, newPixelData)
          .then(() => {
              console.log(`Pixel placed at (${x}, ${y}) with color ${selectedColor}, by ${newPixelData.uid}, at ${newPixelData.timestamp}`);
          })
          .catch((error) => {
              console.error("Pixel placement failed:", error);
          });
  };

  if (loading) {
    return (
        <LoadingSpinner />
    );
  }

  // User needs to log in!
  if (!user) {
        return (
        <main style={{ padding: 20 }}>
            <SignIn /> 
        </main>
      );
    }

  return (
    <main style={{minHeight: '98vh', maxHeight: '98vh', display: 'flex', flexDirection: 'column'}}>
        {/* <h1>r/place Clone</h1> */}
        {/* <p>You are logged in as: **{user.email}**</p> */}
        
        {/* You should also add a Sign Out button now! */}
        {/* <button onClick={() => auth.signOut()}>Sign Out</button>  */}
        
        {/* ... other color controls ... */}

        <div style={{ 
          flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            border: '4px solid #333',
            borderRadius: '25px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.2)',
          }}>
            <ColorPickerComponent
              color={selectedColor} 
              chooseColor={setSelectedColor}
            />

            <PixelCanvas 
                canvasData={canvasData} 
                onPixelPlace={onPixelPlace} 
                scale={scale}
                translateX={translateX}
                translateY={translateY}
                setTranslateX={setTranslateX} 
                setTranslateY={setTranslateY}
                setScale={setScale}
            />

            <ZoomControls 
            onZoomIn={handleZoomIn} 
            onZoomOut={handleZoomOut} 
            />
        </div>
        
    </main>
  );
}




