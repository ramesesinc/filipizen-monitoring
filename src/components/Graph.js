import React, { useState, useEffect, useCallback } from "react";
import styles from "./Content.css";
import { Service, FormPanel, Combobox } from "rsi-react-web-components";
import logo from "/../assets/logo.png";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import drilldown from 'highcharts/modules/drilldown.js';

drilldown(Highcharts);

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
        align: 'right',
        verticalAlign: 'middle',
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
        align: 'right',
        verticalAlign: 'middle',
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

const Graph = (props) => {

  return (
      <div className={styles.Content}>
        <center>
          <img src={logo} width="250"/>
        </center>
        <HighchartsReact
            highcharts={Highcharts}
            options={line}
        />
        <HighchartsReact
            highcharts={Highcharts}
            options={bar}
        />        
      </div>
  );
};

export default Graph;
