import React, { useState, useEffect, useCallback } from "react";
import styles from "./BarGraph.css";
import { Service, FormPanel, Combobox, Button } from "rsi-react-web-components";
import logo from "/../assets/logo.png";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown.js';

drilldown(Highcharts);

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

const measurements = [
    {name: "count", caption: "Count" },
    {name: "amount", caption: "Amount"}
  ]

  const initialYear = new Date().getFullYear();

const bar = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Bar Graph'
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
        type: 'category'
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    legend: {
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'bottom',
        borderWidth: 0,
        showInLegend: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
            }
        }
    },
    series: [
        {
            name: "LGUs",
            colorByPoint: true,
            data: [
                {
                    name: "Tagbilaran",
                    y: 62.74,
                    drilldown: "Tagbilaran"
                },
                {
                    name: "Ubay",
                    y: 10.57,
                    drilldown: "Ubay"
                },
                {
                    name: "Albay",
                    y: 7.23,
                    drilldown: "albay"
                }   
            ]
        }
    ],
    drilldown: {
        series: [
            {
                name: "Tagbilaran",
                id: "Tagbilaran",
                data: [
                    [
                        "DBP",
                        20
                    ],
                    [
                        "LBP",
                        20
                    ],
                ]
            },
            {
                name: "Ubay",
                id: "Ubay",
                data: [
                    [
                        "DBP",
                        10
                    ],
                    [
                        "LBP",
                        5
                    ],
                ]
            }
        ]
    }

}

const BarGraph = (props) => {
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
                <Button>Line Graph</Button>
            </div>
        </FormPanel>
        <div className={styles.Content__graph}>
            <HighchartsReact
                highcharts={Highcharts}
                options={bar}
            /> 
        </div>       
      </div>
  );
};

export default BarGraph;
