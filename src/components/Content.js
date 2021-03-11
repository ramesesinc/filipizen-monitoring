import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Content.css";
import { Service, FormPanel, Combobox } from "rsi-react-web-components";
import logo from "/../assets/logo.png"

const partnerSvc = Service.lookup("CloudPartnerService", "partner");
const txnSvc = Service.lookup("CloudPaymentMonitoringService", "epayment");

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

const Content = (props) => {
  const [lgus, setLgus] = useState([]);
  const [payPartners, setPayPartners] = useState([]);
  const [partners, setPartners] = useState([]);
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [params, setParams] = useState({month: months[0], year: 2021});

  const lgusRef = useRef([]);

  useEffect(() => {
    partnerSvc.invoke("getActivePartners", null, (err, lguList) => {
      if (!err) {
        const lgus = lguList.map((lgu) => ({ id: lgu.id, name: lgu.name }));
        setLgus(lgus);
        lgusRef.current = lgus;
      }
    });
  }, []);

  const getInitialInfo  = () => {
    txnSvc.invoke("getInitialInfo", params, (err, info) => {
      if (!err) {
        info.partners.forEach((partner) => {
          const lgu = lgus.find((lgu) => lgu.id === partner.id);
          partner.name = lgu.name;
        });
        setPartners(info.partners);
        setPayPartners(info.paypartners);
        setPeriod(info.period);
        setYears(info.years);
        setParams({...params, year: info.years[info.years.size()-1]});
        getTxnCounts();
      } else {
        console.log("Error loading partners ", err);
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    getInitialInfo();
  }, [lgus]);

  const getTxnCounts = useCallback(() => {
    txnSvc.invoke("getTxnCounts", params, (err, partners) => {
      if (!err) {
        partners.forEach((partner) => {
          const lgu = lgusRef.current.find((lgu) => lgu.id === partner.id);
          partner.name = lgu.name;
        });
        const p1 = partners.filter((p) => p.paypartner.total > 0);
        const p2 = partners.filter((p) => p.paypartner.total === 0);
        p1.sort((a, b) => {
          if (a.paypartner.total < b.paypartner.total) return 1;
          if (a.paypartner.total > b.paypartner.total) return -1;
          return 0;
        });
        p2.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        setPartners([...p1, ...p2]);
      }
    });
  }, [lgus, params]);

  useEffect(() => {
    const intervalId = setInterval(() => getTxnCounts, 300000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    getInitialInfo();
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
