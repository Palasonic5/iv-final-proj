import React, { useState } from "react";
import { geoPath, geoMercator } from "d3-geo";
import { scaleLog } from "d3-scale";
import { FailurebyStatebyYear } from "./utilis";

function BankMap({ width, height, failuresData, usStates, selectedYear, setSelectedYear, setSelectedState, selectedState, activeState, setActiveState }) {
    const [tooltip, setTooltip] = useState({ visible: false, content: "" });
    const failuresByStateByYear = FailurebyStatebyYear(failuresData);

    let projection = geoMercator().scale(780).translate([width / 2 + 1275, height / 2 + 510]);
    let path = geoPath().projection(projection);
    let maxFailures = 0;

    Object.values(failuresByStateByYear).forEach(state => {
        Object.values(state).forEach(failures => {
            if (failures > maxFailures) maxFailures = failures;
        });
    });

    const colorScale = scaleLog().domain([1, maxFailures]).range(["#ffe5e5", "#b30000"]).clamp(true);

    const handleStateClick = (stateName) => {
        setSelectedState(stateName === selectedState ? null : stateName);
        setActiveState(stateName); // Set active state for local highlighting
    };

    // Define the legend's attributes
    const legendWidth = 300;
    const legendHeight = 20;
    const legendNumStops = 10;
    const legendX = width - legendWidth - 20;
    const legendY = height - legendHeight - 70;

    // Generate gradient stops for the legend
    const gradientStops = Array.from({ length: legendNumStops }).map((_, i) => {
        const value = 1 + (maxFailures - 1) * (i / (legendNumStops - 1));
        return { offset: `${(i / (legendNumStops - 1)) * 100}%`, color: colorScale(value) };
    });

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {usStates.features.map(state => {
                const stateName = state.properties.NAME;
                const stateFailures = failuresByStateByYear[stateName]?.[selectedYear] || 0;
                const fillColor = stateName === activeState ? '#00008B' : colorScale(stateFailures + 1);
                return (
                    <path
                        key={stateName}
                        d={path(state)}
                        fill={fillColor}
                        stroke="#000"
                        onClick={() => handleStateClick(stateName)}
                        style={{ cursor: 'pointer' }}
                    >
                        <title>{stateName}</title>
                    </path>
                );
            })}
            
            {/* Year selection slider */}
            <foreignObject x={100} y={height - 40} width={width - 200} height={40}>
                <input type="range" min="2000" max="2023"
                       value={selectedYear}
                       onChange={(e) => setSelectedYear(e.target.value)}
                       style={{ width: "100%" }}
                />
                <div style={{ textAlign: "center" }}>{selectedYear}</div>
            </foreignObject>

            {/* Color scale legend */}
            <g transform={`translate(${legendX}, ${legendY})`}>
                <rect width={legendWidth} height={legendHeight} fill="url(#gradient)" />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {gradientStops.map(stop => (
                            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
                        ))}
                    </linearGradient>
                </defs>
                {/* Adding text labels at start and end of legend */}
                <text x="0" y="30" fontSize="12" fill="#000">{`1 failure`}</text>
                <text x={legendWidth} y="30" fontSize="12" fill="#000" textAnchor="end">{`${maxFailures}+ failures`}</text>
            </g>
            {/* Tooltip */}
            {tooltip.visible && (
                <text x={width / 2} y={30} textAnchor="middle" fontSize="16" fill="black" stroke="white" strokeWidth="0.5">
                    {tooltip.content}
                </text>
            )}
        </svg>
    );
}

export default BankMap;
