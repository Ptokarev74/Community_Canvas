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

// On page load set up everything needed.
export default function CanvasPage() {
  // The grid we use!
  const [canvasData, setCanvasData] = useState<CanvasGrid>({});
  const [selectedColor, setSelectedColor] = useState<string>('#ff0000ff');

  const { user, loading } = useAuth();

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
    <main style={{ padding: 20 }}>
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
            <PixelCanvas 
                canvasData={canvasData} 
                onPixelPlace={onPixelPlace} 
            />
        </div>
    </main>
  );
}




