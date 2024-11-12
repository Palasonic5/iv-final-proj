import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { AssetAndDepositbyStatebyYear } from "./utilis";

function BarChart({ data, selectedState, selectedYear }) {
    const ref = useRef();
    
    function customTickFormat(number) {
        // Convert the number to scientific notation with one decimal place
        return number.toExponential(1);
    }
    


    useEffect(() => {
        // Check to make sure we have the minimum required data to render the chart
        if (!data || !selectedYear) return; 

        const assetDepositData = AssetAndDepositbyStatebyYear(data);

        // Determine if we need state-specific data or aggregate data for the whole country
        let filteredData;
        if (selectedState) {
            // Fetch state-specific data if a state is selected
            filteredData = assetDepositData[selectedState] && assetDepositData[selectedState][selectedYear] ? 
                           [assetDepositData[selectedState][selectedYear]] : [];
        } else {
            // Aggregate data for all states for the selected year if no state is selected
            filteredData = Object.values(assetDepositData)
                .map(stateData => stateData[selectedYear])
                .filter(Boolean); // Ensure valid data is processed
            if (filteredData.length > 0) {
                // Calculate averages for assets and deposits across all states
                filteredData = [{
                    averageAsset: d3.mean(filteredData, d => d.averageAsset),
                    averageDeposit: d3.mean(filteredData, d => d.averageDeposit)
                }];
            } else {
                // Set defaults to avoid rendering errors
                filteredData = [{ averageAsset: 0, averageDeposit: 0 }];
            }
        }

        // Setup SVG and scales
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear any previous SVG elements

        const margin = { top: 20, right: 30, bottom: 40, left: 150 };
        const width = 500 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLinear().range([height, 0]);

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Prepare data for the bar chart
        const barData = [];
        filteredData.forEach(d => {
            barData.push({ type: "Assets", value: d.averageAsset });
            barData.push({ type: "Deposits", value: d.averageDeposit });
        });

        // Set domains for the scales
        x.domain(barData.map(d => d.type));
        y.domain([0, d3.max(barData, d => d.value)]);

        // Create bars
        g.selectAll(".bar")
            .data(barData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.type))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.value))
            .attr("height", d => height - y(d.value))
            .attr("fill", "#a6030e");
        const formatNumber = d3.format(".2s"); 
        // Append axes
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")  // Select all text elements for the x-axis
            .style("font-size", "16px"); 

        g.append("g")
            .call(d3.axisLeft(y).tickFormat(customTickFormat))
            .selectAll("text") 
            .style("font-size", "16px"); 

    }, [data, selectedState, selectedYear]); 
    return (
        <svg ref={ref} width={500} height={400}></svg>
    );
}

export default BarChart;