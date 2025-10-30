'use client';

import React from "react";

export function LoadingSpinner() {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            textAlign: 'center', 
            color: 'black'
        }}>
            <h2>Pixel Canvas Loading...</h2>
            <div className="spinner-animation"></div>
            <p style={{ marginTop: '20px', fontSize: '1.2em' }}>
                Checking authentication...
            </p>
            
        </div>
    );
}