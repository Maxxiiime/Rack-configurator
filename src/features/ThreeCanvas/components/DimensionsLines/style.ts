import React from 'react';

export const DIM_CONFIG = {
    offset: 0.8,
    tickSize: 0.1,
    detailOffset: 2.0,
    totalOffset: 3.5,
    colors: {
        main: "#16a34a",
        helper: "#16a34a",
        detail: "#f59e0b"
    }
};

export const baseLabelStyle: React.CSSProperties = {
    background: "white",
    borderRadius: "6px",
    fontFamily: "sans-serif",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    userSelect: "none"
};

export const labelStyle: React.CSSProperties = {
    ...baseLabelStyle,
    color: DIM_CONFIG.colors.main,
    padding: "4px 8px",
    fontSize: "14px",
};

export const detailLabelStyle: React.CSSProperties = {
    ...baseLabelStyle,
    color: DIM_CONFIG.colors.main,
    padding: "2px 6px",
    fontSize: "11px",
    borderRadius: "4px",
};
