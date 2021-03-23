import React, { useState, useEffect, useCallback } from "react";
import { Service, FormPanel, Combobox, Button } from "rsi-react-web-components";
import logo from "/../assets/logo.png"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import styles from "./LineGraph.css";



const months = [
    {caption:"ALL",idx:0},
    {caption:"JANUARY",idx:1},
    {caption:"FEBRUARY",idx:2},
    {caption:"MARCH",idx:3},
    {caption:"APRIL",idx:4},
    {caption:"MAY",idx:5},
    {caption:"JUNE",idx:6},
    {caption:"JULY",idx:7},
    {caption:"AUGUST",idx:8},
    {caption:"SEPTEMBER",idx:9},
    {caption:"OCTOBER",idx:10},
    {caption:"NOVEMBER",idx:11},
    {caption:"DECEMBER",idx:12},
  ]

const years = [
  {name: "count", caption: "Count" },
  {name: "amount", caption: "Amount"}
]

const measurements = [
    {name: "count", caption: "Count" },
    {name: "amount", caption: "Amount"}
  ]

const initialYear = new Date().getFullYear();

const line = {
    title: {
        text: 'Line Graph'
    },
    subtitle: {
        text: ''
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    legend: {
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 0,
        showInLegend: false
    },
    series: [{
        marker: {
            lineColor: 'red',
        },
        name:'Tagbilaran',
        data: [41,62,83,34,25,96,27,78,29,30,71,92]
    },
    {
    marker: {
        lineColor: 'Blue',
    },
    name:'Albay',
    data: [11,22,33,44,15,26,72,18,29,310,91,22]
    },
    {
    marker: {
        lineColor: 'Green',
    },
    name:'Legazpi',
    data: [21,42,13,34,51,16,72,68,19,10,21,42]
    }],

}


const LineGraph = (props) => {
    const [payPartners, setPayPartners] = useState([]);
    const [partners, setPartners] = useState([]);
    const [period, setPeriod] = useState("");
    const [loading, setLoading] = useState(true);
    const [years, setYears] = useState([]);
    const [params, setParams] = useState({
      month: months[0], 
      year: initialYear, 
      measurement: measurements[0]
    });

  

  return (
      <div className={styles.Content}>
        <center>
          <img src={logo} width="250"/>
        </center>
        <FormPanel  row>
            <Combobox  name="month" caption="MONTH" items={months}  className={styles.Content__months} expr={month => month.caption} fullWidth={false} />
            <Combobox name="year" caption="YEAR" required={true} items={years} className={styles.Content__years} fullWidth={false}  />
            <Combobox name="measurement" items={measurements} caption="MEASUREMENT" expr={measurements => measurements.caption} required={true} className={styles.Content__measurement} fullWidth={false}  />
            <Combobox name="partner" caption="LGU" required={true} items={partners} className={styles.Content__partners} fullWidth={false}  />
            <Combobox name="paypartner" caption="Payment Partner" required={true} items={payPartners} className={styles.Content__paypartners} fullWidth={false}  />
            <div className={styles.Content__buttons}>
                <Button>Table</Button>
                <Button>Bar Graph</Button>
            </div>
        </FormPanel>
      
        <div className={styles.Content__graph}>
            <HighchartsReact
                highcharts={Highcharts}
                options={line}
            /> 
        </div>     
      </div>
  );
};

export default LineGraph;
