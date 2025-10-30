'use client';

import React from "react";

import { ZoomControlsProps } from "../types";

export function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
    return (
        <div style={{
            // 🎯 Fixed Positioning for the right side of the viewport
            position: 'fixed',
            bottom: '40px',
            right: '40px',
            zIndex: 1000, // Ensure buttons appear above the canvas
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
            <button 
                onClick={onZoomIn} 
                style={{ fontSize: '24px', padding: '10px 15px', cursor: 'pointer', border: 'none', borderRadius: '5px' }}
            >
                +
            </button>
            <button 
                onClick={onZoomOut} 
                style={{ fontSize: '24px', padding: '10px 15px', cursor: 'pointer', border: 'none', borderRadius: '5px' }}
            >
                -
            </button>
        </div>
    );
}
