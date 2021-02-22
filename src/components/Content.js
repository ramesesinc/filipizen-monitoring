import React, { useState, useEffect, useRef } from "react";
import styles from "./Content.css";
import { Service } from "rsi-react-web-components";

const partnerSvc = Service.lookup("CloudPartnerService", "partner");
const txnSvc = Service.lookup("CloudPaymentMonitoringService", "epayment");

const Content = (props) => {
  const [lgus, setLgus] = useState([]);
  const [payPartners, setPayPartners] = useState([]);
  const [partners, setPartners] = useState([]);
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (lgus.length === 0 && loading) return;

    txnSvc.invoke("getInitialInfo", {}, (err, info) => {
      if (!err) {
        info.partners.forEach((partner) => {
          const lgu = lgus.find((lgu) => lgu.id === partner.id);
          partner.name = lgu.name;
        });
        setPartners(info.partners);
        setPayPartners(info.paypartners);
        setPeriod(info.period);
      } else {
        console.log("Error loading partners ", err);
      }
      setLoading(false);
    });
  }, [lgus]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      txnSvc.invoke("getTxnCounts", {}, (err, partners) => {
        if (!err) {
          partners.forEach((partner) => {
            const lgu = lgusRef.current.find((lgu) => lgu.id === partner.id);
            partner.name = lgu.name;
          });
          setPartners(partners);
        }
      });
    }, 300000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <div className={styles.Content}>
        <center>
          <h1>ePayment Monitoring</h1>
          <h3>{period}</h3>
        </center>
        <div className={styles.Content__header}>
          <p className={styles.Content__lgu}>LGU</p>
          {payPartners.map((payPartner) => (
            <p key={payPartner.name} className={styles.Content__partners}>
              {payPartner.name}
            </p>
          ))}
        </div>
        {partners.map((partner) => {
          const paymentComponents = payPartners.map((payPartner) => {
            const count = partner.paypartner[payPartner.name.toLowerCase()];
            return (
              <p
                key={partner.id + ":" + payPartner.name}
                className={styles.Content__partners}
              >
                {count > 0 && count}
              </p>
            );
          });
          return (
            <div key={partner.name} className={styles.Content__subContainer}>
              <p className={styles.Content__lgu}> {partner.name} </p>
              {paymentComponents}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
