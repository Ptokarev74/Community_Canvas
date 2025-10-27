'use client';
// useState used for storing canvas data, useEffect for conncting to database
import { useState, useEffect } from 'react';
//  databse Library import
import { db } from './src/firebase/config';
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
import { auth } from './src/firebase/config';

// On page load set up everything needed.
export default function CanvasPage() {
  // The grid we use!
  const [canvasData, setCanvasData] = useState<CanvasGrid>({});
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');

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
        <main style={{ padding: 20 }}>
            <h1>r/place Clone</h1>
            <p>Loading Authentication Status...</p>
        </main>
    );
}

  // User needs to log in!
  if (!user) {
        return (
        <main style={{ padding: 20 }}>
            <h1 style={{ textAlign: 'center' }}>Welcome to r/place Clone</h1>
            <p style={{ textAlign: 'center', marginBottom: 20 }}>Please sign in to view and place pixels.</p>
            
            <SignIn /> 
        </main>
      );
    }

  // The main page!... finally... 
  // return (
  //   <main style={{ padding: 20 }}>
  //       <h1>r/place Clone</h1>
  //       <p>Current Color: <span style={{ backgroundColor: selectedColor, padding: '0 10px', border: '1px solid #333' }}>{selectedColor}</span></p>

  //       {/* In a real app, you'd add a color picker here, but for now: */}
  //       <button onClick={() => setSelectedColor('#00FF00')}>Set Color to Green</button>
  //       <button onClick={() => setSelectedColor('#0000FF')}>Set Color to Blue</button>

  //       <div style={{ marginTop: 20 }}>
  //           <PixelCanvas 
  //               canvasData={canvasData} 
  //               onPixelPlace={onPixelPlace} 
  //           />
  //       </div>
  //   </main>
  // );
  return (
    <main style={{ padding: 20 }}>
        <h1>r/place Clone</h1>
        <p>You are logged in as: **{user.email}**</p>
        
        {/* You should also add a Sign Out button now! */}
        <button onClick={() => auth.signOut()}>Sign Out</button> 
        
        {/* ... other color controls ... */}

        <div style={{ marginTop: 20 }}>
            <PixelCanvas 
                canvasData={canvasData} 
                onPixelPlace={onPixelPlace} 
            />
        </div>
    </main>
  );
}




