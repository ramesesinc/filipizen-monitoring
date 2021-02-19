import React, { useState, useEffect } from "react";
import styles from "./Content.css";
import { Service} from "rsi-react-web-components";

const txnSvc = Service.lookup("CloudPaymentMonitoringService", "epayment");

const initialPartners = [
  { lgu: "legazpi", paypartner: { landbank: 0, dbp: 0, paymaya: 0, gcash: 0, total: 0 }},
  { lgu: "ligao", paypartner: { landbank: 0, dbp: 0, paymaya: 0, gcash: 0, total: 0 }},
  { lgu: "iriga", paypartner: { landbank: 0, dbp: 0, paymaya: 0, gcash: 0, total: 0 }},
  { lgu: "tagbilaran", paypartner: { landbank: 0, dbp: 0, paymaya: 0, gcash: 0, total: 0 }},
  { lgu: "ubay", paypartner: { landbank: 0, dbp: 0, paymaya: 0, gcash: 0, total: 0 }},
  { lgu: "nabunturan", paypartner: { landbank: 0, dbp: 0, paymaya: 0, gcash: 0, total: 0 }},
];

const Content = (props) => {
  const [payPartners, setPayPartners] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    txnSvc.invoke("getInitialInfo", {}, (err, info) => {
      if (!err) {
        setPartners(info.partners);
        setPayPartners(info.paypartners);
      } else {
        console.log("Error loading partners ", err);
      }
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      txnSvc.invoke("getTxnCounts", {}, (err, partners) => {
        if (!err) {
          setPartners(partners);
        }
      });
    }, 60000);
    return () => {clearInterval(intervalId)};
  }, [])

  if (loading) {
    return <div>Loading</div>
  }

  return (
    <div className={styles.Content}>
      <center>
        <h1>ePayment Monitoring</h1>
      </center>
      <div className={styles.Content__header}>
        <p className={styles.Content__lgu}>LGU</p>
        {payPartners.map((payPartner) => (
          <p key={payPartner.name} className={styles.Content__partners}>{payPartner.name}</p>
        ))}
      </div>
      {partners.map((partner) => {
        const paymentComponents = payPartners.map((payPartner) => {
          return (
            <p key={partner.id + ":" + payPartner.name} className={styles.Content__partners}>
              {" "}
              {partner.paypartner[payPartner.name.toLowerCase()]}{" "}
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
  );
};

export default Content;
