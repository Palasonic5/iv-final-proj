import React from 'react';
import * as d3 from 'd3';

function HeatMap({ data, selectedYear, selectedState, activeState, setSelectedYear, setSelectedState, setActiveState }) {
    const margin = { top: 20, right: 20, bottom: 100, left: 120 };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Extract years and states
    const years = d3.range(2000, 2024); 
    const states = [...new Set(data.map(d => d.STATE))].sort();

    // Initialize processedData with zeros for each state and year
    let processedData = Array.from(states, state => ({
        state: state,
        years: years.map(year => ({
            year: year,
            lossPercentage: 0
        }))
    }));

    // Rollup data to get total cost per state per year
    let dataRollup = d3.rollup(
        data,
        (v) => ({ totalCost: d3.sum(v, d => d.COST), totalGDP: d3.sum(v, d => d.STATEGDP) }),
        d => d.STATE,
        d => new Date(d.FAILDATE).getFullYear()
    );

    dataRollup.forEach((yearsData, state) => {
        yearsData.forEach((values, year) => {
            let stateData = processedData.find(d => d.state === state);
            let yearData = stateData.years.find(y => y.year === year);
            if (yearData) {
                yearData.lossPercentage = Math.min(100, (values.totalCost / values.totalGDP) * 100);
            }
        });
    });

    // Scales
    const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.05);
    const yScale = d3.scaleBand().domain([...states]).range([0, height]).padding(0.1);
    const colorScale = d3.scaleSequential(d3.interpolateReds).domain([0, 100]);

    const getOpacity = (year, state) => {
        let opacityYear = year === parseInt(selectedYear) ? 1.0 : 0.6;
        let opacityState = state === selectedState ? 1.0 : 0.6;
        return Math.max(opacityYear, opacityState);
    };

    const handleCellClick = (year, state) => {
        setSelectedYear(year.toString());
        setActiveState(state); // Set active state for local highlighting
        setSelectedState(state === selectedState ? null : state);
    };

    return (
        <svg width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
            <g transform={`translate(${margin.left},${margin.top})`}>
                {processedData.map(d => (
                    d.years.map(year => (
                        <rect
                            key={`${d.state}-${year.year}`}
                            x={xScale(year.year)}
                            y={yScale(d.state)}
                            width={xScale.bandwidth()}
                            height={yScale.bandwidth()}
                            fill={colorScale(year.lossPercentage)}
                            opacity={getOpacity(year.year, d.state)}
                            stroke={year.year === parseInt(selectedYear) || d.state === selectedState ? "black" : "none"}
                            strokeWidth={year.year === parseInt(selectedYear) || d.state === selectedState ? 0.3 : 0}
                            onClick={() => handleCellClick(year.year, d.state)}
                        />
                    ))
                ))}
                <g>
                    {xScale.domain().map(tickValue => (
                        <text
                            key={tickValue}
                            x={xScale(tickValue) + xScale.bandwidth() / 2}
                            y={height + 20}
                            textAnchor="middle"
                            fontSize = '13px'
                        >
                            {tickValue}
                        </text>
                    ))}
                </g>
                <g>
                    {yScale.domain().map(tickValue => (
                        <text
                            key={tickValue}
                            x={-10}
                            y={yScale(tickValue) + yScale.bandwidth() / 2}
                            textAnchor="end"
                            alignmentBaseline="middle"
                            fontSize = '13px'
                        >
                            {tickValue}
                        </text>
                    ))}
                </g>
                {/* Adding a color legend */}
                <g transform={`translate(0, ${height + 40})`}>
                    {d3.range(0, 101, 10).map(value => (
                        <rect key={value} x={width * (value / 100)} width={width / 10} height={10} fill={colorScale(value)} />
                    ))}
                    {d3.range(0, 101, 10).map(value => (
                        <text key={value} x={width * (value / 100) + (width / 20)} y={25} textAnchor="middle">
                            {value}%
                        </text>
                    ))}
                </g>
            </g>
        </svg>
    );
}

export default HeatMap;