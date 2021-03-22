import React, { useState, useEffect, useCallback } from "react";
import styles from "./Content.css";
import { Service, FormPanel, Combobox } from "rsi-react-web-components";
import logo from "/../assets/logo.png"

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

const initialMeasurements = [
      {caption: "Count", idx: 0},
      {caption: "Amount", idx: 1}
    ]

  const initialYear = new Date().getFullYear();

const Content = (props) => {
  const [payPartners, setPayPartners] = useState([]);
  const [partners, setPartners] = useState([]);
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [params, setParams] = useState({month: months[0], year: initialYear});
  const [measurements, setMeasurements] = useState(initialMeasurements[0]);

  useEffect(() => {
    monitorSvc.invoke("getInitialInfo", params, (err, info) => {
      if (!err) {
        setPartners(info.partners);
        setPayPartners(info.paypartners);
        setPeriod(info.period);
        setYears(info.years);
        getTxnCounts();
      } else {
        console.log("Error loading partners ", err);
      }
      setLoading(false);
    });
  }, []);

  const getTxnCounts = useCallback(() => {
    monitorSvc.invoke("getTxnCounts", params, (err, partners) => {
      if (!err) {
        setPartners(partners);
      }
    });
  }, [params]);

  useEffect(() => {
    const intervalId = setInterval(() => getTxnCounts, 300000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    getTxnCounts();
  }, [params]);

  if (loading) {
    return <div>Loading</div>;
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
            <Combobox name="measurements" caption="MEASUREMENT" expr={measurements => measurements.caption} required={true} items={initialMeasurements} className={styles.Content__years} fullWidth={false}  />
        </FormPanel>
        <table>
          <thead>
            <tr>
                <th  className={styles.Content__partners} scope="col">LGU</th>
              {payPartners.map((payPartner) => (
                <th key={payPartner.name} className={styles.Content__partners} scope="col">{payPartner.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            
          {partners.map((partner) => {
            const paymentComponents = payPartners.map((payPartner) => {
              const count = partner.paypartner[payPartner.name.toLowerCase()];
              return (
                <td
                  key={partner.id + ":" + payPartner.name}
                  className={styles.Content__partners}
                  data-label={payPartner.name}
                >
                  {count > 0 && count}
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
