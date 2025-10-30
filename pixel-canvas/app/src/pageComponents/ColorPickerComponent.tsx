'use client';

import React from "react";
import { ColorPickerProp } from "../types";

export function ColorPickerComponent({ color, chooseColor }: ColorPickerProp) {
    
    // Handler to capture the change event from the input field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Call the prop function, passing the input's current value (the new color hex code)
        chooseColor(e.target.value);
    };

    return (
        // <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        //     <label htmlFor="color-picker" style={{ fontWeight: 'bold' }}>Current Color:</label>
            
        //     {/* 🎯 The HTML Color Input Element */}
        //     <input
        //         type="color"
        //         id="color-picker"
        //         value={color} // Display the current color (from parent state)
        //         onChange={handleChange} // Call our handler when the value changes
        //         style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
        //     />
            
        //     {/* Display the Hex Code */}
        //     <span>{color}</span>
        // </div>

        <div style={{
            // 🎯 Fixed Positioning for the right side of the viewport
            position: 'fixed',
            top: '40px',
            left: '40px',
            zIndex: 1000, // Ensure buttons appear above the canvas
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column"
            }}>
                <label htmlFor="color-picker" style={{ fontWeight: 'bold' }}>Current Color:</label>
                <span>{color}</span>
            </div>
            <input
                type="color"
                id="color-picker"
                value={color} // Display the current color (from parent state)
                onChange={handleChange} // Call our handler when the value changes
                style={{ width: '40px', height: '40px', border: 'none', cursor: 'pointer' }}
            />
            
        </div>
    );
}
