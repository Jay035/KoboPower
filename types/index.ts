export interface Disco {
  id: string;
  name: string;
  logo: string;
  color: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface VerifiedDataProps {
  Address: string;
  Customer_Account_Type: string;
  Customer_Arrears: string;
  Customer_Name: string;
  Customer_Number: string;
  Customer_Phone: string;
  KCT1: string;
  KCT2: string;
  Last_Purchase_Days: string;
  MAX_Purchase_Amount: string;
  MeterNumber: string;
  Meter_Type: string;
  Min_Purchase_Amount: number;
  WrongBillersCode: boolean;
  commission_details: {
    amount: string | number;
    computation_type: string;
    rate: string;
    rate_type: string;
  };
}

export interface PaymentProps {
  code: string;
  content: {
    transactions: {
      status: "delivered";
      product_name: "PHED - Port Harcourt Electric";
      unique_element: "1111111111111";
      unit_price: "5000";
      quantity: 1;
      service_verification: null;
      channel: "api";
      commission: 100;
      total_amount: 4900;
      discount: null;
      type: "Electricity Bill";
      email: "jaydencolins08@gmail.com";
      phone: "codexjay08@gmail.com";
      name: null;
      convinience_fee: 0;
      amount: "5000";
      platform: "api";
      method: "api";
      transactionId: "17687591136621539718968147";
      commission_details: {
        amount: 100;
        rate: "2.00";
        rate_type: "percent";
        computation_type: "default";
      };
    };
  };
  response_description: string;
  requestId: string;
  amount: 5000;
  transaction_date: "2026-01-18T17:58:33.000000Z";
  purchased_code: "Token: 35419981304203731832";
  customerName: "Testmeter1";
  address: "Muyibat oyefusi crescent";
  meterNumber: null;
  customerNumber: "25113291196";
  token: "35419981304203731832";
  tokenAmount: "500";
  tokenValue: "465.12";
  tariff: "56.38,SDUTY:N0 ";
  businessCenter: null;
  exchangeReference: null;
  units: "8.2";
  energyAmt: "465.12";
  vat: "34.88";
  arrears: "0.00";
  revenueLoss: null;
  kct1: null;
  kct2: null;
}
