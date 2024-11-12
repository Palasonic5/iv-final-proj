import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { CharterPercentagebyStatebyYear } from "./utilis";

function PieChart({ data, selectedState, selectedYear }) {
    const ref = useRef();

    useEffect(() => {
        if (!data || !selectedYear) return;

        const charterData = CharterPercentagebyStatebyYear(data);
        let aggregatedData = {};
        if (selectedState) {
            aggregatedData = charterData[selectedState] && charterData[selectedState][selectedYear] ?
                             charterData[selectedState][selectedYear] : {};
        } else {
            Object.values(charterData).forEach(state => {
                const stateData = state[selectedYear] || {};
                Object.entries(stateData).forEach(([key, value]) => {
                    aggregatedData[key] = (aggregatedData[key] || 0) + value;
                });
            });
        }

        // Determine the number of unique keys and limit it to a valid range for color schemes
        const keys = Object.keys(aggregatedData);
        const numColors = Math.min(keys.length, 9); // Limit to the available range in d3.schemeReds

        // Create the pie layout and arc generator
        const pie = d3.pie().value(d => d.value)(Object.entries(aggregatedData).map(([key, value]) => ({ key, value })));
        const arc = d3.arc().innerRadius(0).outerRadius(150);

        // Define the color scale
        const color = numColors >= 3 && numColors <= 9 ? 
                      d3.scaleOrdinal(d3.schemeReds[numColors]) :
                      d3.scaleOrdinal(["#ff0000", "#ff6666", "#ff9999"]); // Fallback colors if out of range

        // Select the SVG element and clear any existing content
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // Append a group element for positioning the pie chart
        const g = svg.append("g")
            .attr("transform", "translate(200, 200)");

        // Add pie slices
        g.selectAll("path")
            .data(pie)
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.key))
            .attr("stroke", "white")
            .style("stroke-width", "1px");

        // Add labels to pie slices
        g.selectAll("text")
            .data(pie)
            .join("text")
            .attr("transform", d => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("fill", "black")
            .text(d => d.data.key);

    }, [data, selectedState, selectedYear]);

    return (
        <svg ref={ref} width={400} height={400}></svg>
    );
}

export default PieChart;