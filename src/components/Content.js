import React, { useState, useEffect, useCallback } from "react";
import styles from "./Content.css";
import { Service, FormPanel, Combobox, currencyFormat, Button } from "rsi-react-web-components";
import logo from "/../assets/logo.png"
import "rsi-react-web-components/dist/index.css";

import BarGraph from './BarGraph';
import LineGraph from "./LineGraph";

const monitorSvc = Service.lookup("CloudPaymentMonitoringService", "epayment");

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

const Content = (props) => {
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
  const [mode, setMode] = useState();
  
  useEffect(() => {
    monitorSvc.invoke("getInitialInfo", params, (err, info) => {
      if (!err) {
        setPartners(info.partners);
        setPayPartners(info.paypartners);
        setPeriod(info.period);
        setYears(info.years);
        getTxnInfo();
      } else {
        console.log("Error loading partners ", err);
      }
      setLoading(false);
    });
  }, []);

  const getTxnInfo = useCallback(() => {
    monitorSvc.invoke("getTxnInfo", params, (err, partners) => {
      if (!err) {
        setPartners(partners);
        console.log("partners", partners)
      }
    });
  }, [params]);

  useEffect(() => {
    const intervalId = setInterval(() => getTxnInfo, 300000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    getTxnInfo();
  }, [params]);

  if (loading) {
    return <div>Loading</div>;
  }
  if (mode === "linegraph") {
    return <LineGraph />
  }
  if (mode === "bargraph") {
    return <BarGraph />
  }
  

  return (
      <div className={styles.Content}>
        <center>
          <img src={logo} width="250"/>
          <h3>{period}</h3>
        </center>
        <FormPanel context={params} handler={setParams} row>
            <Combobox  name="month" caption="MONTH" items={months}  className={styles.Content__months} expr={month => month.caption} fullWidth={false} />
            <Combobox name="year" caption="YEAR" required={true} items={years} className={styles.Content__years} fullWidth={false}  />
            <Combobox name="measurement" items={measurements} caption="MEASUREMENT" expr={measurements => measurements.caption} required={true} className={styles.Content__measurement} fullWidth={false}  />
            <Combobox name="partner" caption="LGU" required={true} items={partners} expr={partner => partner.name} className={styles.Content__partner} fullWidth={false}  />
            <Combobox name="paypartner" caption="Payment Partner" required={true} items={payPartners} expr={paypartner => paypartner.name} className={styles.Content__paypartners} fullWidth={false}  />
            <div className={styles.Content__buttons}>
                <Button type="button" onClick={() => setMode("linegraph")}>Line Graph</Button>
                <Button type="button" onClick={() => setMode("bargraph")}>Bar Graph</Button>
            </div>
        </FormPanel>
        <table className={styles.Content__table}>
          <thead>
            <tr>
                <th  className={styles.Content__partners} scope="col">LGU</th>
              {payPartners.map((payPartner) => (
                <th key={payPartner.name} 
                  className={styles.Content__partners} 
                  scope="col"
                  style={{textAlign: params.measurement.name === "amount" ? "right" : "center"}}
                >
                  {payPartner.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            
          {partners.map((partner) => {
            const paymentComponents = payPartners.map((payPartner) => {
              const value = partner.paypartner[payPartner.name.toLowerCase()];
              return (
                <td
                  key={partner.id + ":" + payPartner.name}
                  className={styles.Content__partners}
                  style={{textAlign: params.measurement.name === "amount" ? "right" : "center"}}
                  data-label={payPartner.name}
                >
                  {value > 0 && params.measurement.name === "amount" ? currencyFormat(value) : value > 0 && value}
                </td>
              );
            });
            return (
              <tr key={partner.name} className={styles.Content__subContainer}>
                <td className={styles.Content__lgu}> {partner.name} </td>
                {paymentComponents}
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
  );
};

export default Content;
