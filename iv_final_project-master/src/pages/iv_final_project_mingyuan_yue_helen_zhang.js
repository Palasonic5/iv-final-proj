import React from "react";
import { csv, json } from "d3";
import { Container, Grid, Header, Segment, Dimmer, Loader, Divider } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import BankMap from "../components/bankMap";
import HeatMap from "../components/heatmap";
import PieChart from "../components/pieChart";
import BarChart from "../components/barChart";

// Custom hooks for loading CSV and JSON data
function useData(csvPath) {
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        csv(csvPath).then(data => {
            data.forEach(d => {
                d.stategdp = +d.STATEGDP;
                d.cost = +d.COST;
                d.asset = +d.ASSET;
                d.deposit = +d.DEPOSIT;
                d.state_latitude = +d.state_latitude;
                d.state_longitude = +d.state_longitude;
                d.Charter = d.CHARTER;
            });
            setData(data);
        });
    }, [csvPath]);
    return dataAll;
}

function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        json(jsonPath).then(geoJsonData => {
            setData(geoJsonData);
        });
    }, [jsonPath]);
    return data;
}

function BankFailuresVisualization() {
    const csvUrl = "https://raw.githubusercontent.com/LittleTomato-B/iv_final_project/master/Data.CSV";
    const mapUrl = "https://raw.githubusercontent.com/LittleTomato-B/iv_final_project/master/State_Geo_JSON.json";

    const bankFailuresData = useData(csvUrl);
    const usStatesGeo = useMap(mapUrl);

    const [selectedYear, setSelectedYear] = React.useState("2008");
    const [selectedState, setSelectedState] = React.useState(null);
    const [activeState, setActiveState] = React.useState(null);

    if (!usStatesGeo || !bankFailuresData) {
        return (
            <Segment>
                <Dimmer active>
                    <Loader>Loading...</Loader>
                </Dimmer>
            </Segment>
        );
    }

    return (
        <div className={StyleSheet.description} style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
        <Container fluid style={{ margin: 0, padding: 0, width: '100%' }}>
            <Segment basic textAlign="center" padded="very" className={StyleSheet.description} style={{ backgroundColor: 'black', width: '70%', padding: '150px 0', margin: '0 auto'}}>
                <Header as='h1' style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" }} >
                    Tracking the Turbulence: 
                </Header>
                <Header as='h1' style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', marginBottom: '3em', fontFamily: "'Sedan SC', serif" }} >
                    An Interactive Visualization of U.S. Bank Failures
                </Header>
                <hr style={{
                    border: 'none',
                    height: '1px',  
                    color: 'grey',  
                    backgroundColor: 'grey', 
                    marginTop: '2em',  
                    marginBottom: '1em'  
                }} />
                <Header as='h1' style={{ fontSize: '20px', fontWeight: 'bold', color: 'white',marginTop: '3em', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" }}>
                    By Mingyuan YUE  &  Helen ZHANG
                </Header>
                <Header as='h1' style={{ fontSize: '20px', fontWeight: 'bold', color: 'white',marginTop: '1em', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" }}>
                    my2321, qz2086
                </Header>
            </Segment>
            <Segment style={{ padding: '80px', fontFamily: "'DM Serif Display', serif", fontSize :'19px',width: '70%', margin: '0 auto'}}>
                <p>Bank failures can have significant ripple effects on the economy, affecting everything from local communities to global financial systems. Yet, despite their impact, the scale and scope of these failures are often not well understood by the public. This visualization tackles the lack of accessible, comprehensive, and engaging information that helps the general public, policymakers, and financial professionals understand where, why, and how bank failures have occurred over the past three decades across the United States.</p>
            </Segment>
            <Grid centered columns={1} className={StyleSheet.description}style={{ margin: 0, padding: 0, width: '70%', margin: '0 auto',border: 'none' }}>
                <Grid.Column>
                <Header as='h2' style={{ fontSize: '31px', fontWeight: 'bold', color: 'black', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" }}>Annual Number of Bank Failures </Header>
                    <div style ={{ display: 'flex', justifyContent: 'center' }} >
                    <BankMap width={1000} height={550} 
                        usStates={usStatesGeo} failuresData={bankFailuresData}
                        selectedYear={selectedYear} activeState={activeState}
                        setSelectedYear={setSelectedYear} setSelectedState={setSelectedState}
                        setActiveState={setActiveState}
                    />
                    </div>
                </Grid.Column>
            </Grid>
            <Grid columns={2} divided style = {{width: '70%', margin: '0 auto',border: 'none'}}>
                <Grid.Column>
                    <Header as='h2' style={{ fontSize: '31px', fontWeight: 'bold', color: 'black', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" }}>Charter Type Distribution</Header>
                    <div style ={{ display: 'flex', justifyContent: 'center' }} >
                    <PieChart 
                        data={bankFailuresData} 
                        selectedState={selectedState} 
                        selectedYear={selectedYear}
                    />
                    </div>
                </Grid.Column>
                <Grid.Column>
                    <Header as='h2' style={{ fontSize: '31px', fontWeight: 'bold', color: 'black', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" }}>Asset and Deposit of Failed Banks</Header>
                    <div style ={{ display: 'flex', justifyContent: 'center',border: 'none' }} >
                    <BarChart 
                        data={bankFailuresData} 
                        selectedState={selectedState} 
                        selectedYear={selectedYear}
                    />
                    </div>
                </Grid.Column>
            </Grid>
            <Segment style={{ padding: '30px', fontFamily: "'DM Serif Display', serif", fontSize: '14px', width: '70%', margin: '0 auto',backgroundColor: '#f0f0f0',border: 'none',boxShadow: 'none'}}>
    <p>Charter types include:</p>
    <ul>
        <li>National Member Banks(N): operates across state lines, tend to be larger institutions. Deposits are insured by the Federal Deposit Insurance Corporation (FDIC).</li>
        <li>State Member Banks (SM): Chartered by the states but choose to join the Federal Reserve System. Deposits are insured by FDIC. </li>
        <li>State Nonmember Banks (NM): More localized operations and may focus on community banking. Deposits are insured by FDIC.</li>
        <li>Savings Associations (SA): Focus primarily on residential mortgages, real estate lending, and retail banking. Deposits are insured by FDIC.</li>
        <li>Savings Banks and Savings and Loans (SB): Primarily engage in mortgage and real estate lending. Deposits are NOT insured by FDIC. </li>
    </ul>
</Segment>

            <Grid centered columns={1}>
                <Grid.Column>
                    <Header as='h1' textAlign='left'style={{ fontSize: '31px', fontWeight: 'bold', color: 'black', marginBottom: '0.5em', fontFamily: "'Sedan SC', serif" , width: '70%', margin: '0 auto',border: 'none'}}>Total State Bank Fail Loss / State GDP</Header>
                    <div style ={{ display: 'flex', justifyContent: 'center' }} >
                    <HeatMap 
                        data={bankFailuresData} selectedYear={selectedYear}
                        selectedState={selectedState} activeState={activeState}
                        setSelectedYear={setSelectedYear} setActiveState={setActiveState}
                        setSelectedState={setSelectedState}
                    />
                    </div>
                </Grid.Column>
            </Grid>
        </Container>
        </div>
    );
}

export default BankFailuresVisualization;
