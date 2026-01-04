import { Flexpay} from "flexpay";

const flexpay = new Flexpay({
  webhookUrl: "YOUR_WEBHOOK_URL",
  apiKey: "YOUR_API_KEY",
  merchant: "YOUR_MERCHANT_ID",
});

try{
flexpay.pay({
  amount: "amount",
  currency: "USD",
  phone: "PHONE_NUMBER",
  reference: "PAYMENT_REFERENCE",
})
}catch(e){
}
const request = { body: {} as any };
const paymentResult = Flexpay.parse(request.body);

console.log("Payment:", paymentResult.isSuccessFull);