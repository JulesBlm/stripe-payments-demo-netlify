!function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([,function(e,t){(async()=>{"use strict";const e=await store.getConfig(),t=document.getElementById("payment-form"),n=t.querySelector("button[type=submit]");let r;const a=Stripe(e.stripePublishableKey,{betas:["payment_intent_beta_3"]}),s=a.elements(),o={base:{iconColor:"#666ee8",color:"#31325f",fontWeight:400,fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',fontSmoothing:"antialiased",fontSize:"15px","::placeholder":{color:"#aab7c4"},":-webkit-autofill":{color:"#666ee8"}}},c=s.create("card",{style:o});c.mount("#card-element"),c.on("change",({error:e})=>{const t=document.getElementById("card-errors");e?(t.textContent=e.message,t.classList.add("visible")):t.classList.remove("visible"),n.disabled=!1});const i={style:o,supportedCountries:["SEPA"]},l=s.create("iban",i);l.mount("#iban-element"),l.on("change",({error:e,bankName:t})=>{const r=document.getElementById("iban-errors");e?(r.textContent=e.message,r.classList.add("visible")):(r.classList.remove("visible"),t&&h("sepa_debit",t)),n.disabled=!1});const u=s.create("idealBank",{style:{base:Object.assign({padding:"10px 15px"},o.base)}});u.mount("#ideal-bank-element"),await store.loadProducts();const d=a.paymentRequest({country:e.stripeCountry,currency:e.currency,total:{label:"Total",amount:store.getPaymentTotal()},requestShipping:!0,requestPayerEmail:!0,shippingOptions:e.shippingOptions});d.on("source",async e=>{const{error:t}=await a.confirmPaymentIntent(r.client_secret,{source:e.source.id,use_stripe_sdk:!0});if(t)e.complete("fail"),y({error:t});else{e.complete("success");const t=await a.handleCardPayment(r.client_secret);y(t)}}),d.on("shippingaddresschange",e=>{e.updateWith({status:"success"})}),d.on("shippingoptionchange",async t=>{const a=await store.updatePaymentIntentWithShippingCost(r.id,store.getLineItems(),t.shippingOption);t.updateWith({total:{label:"Total",amount:a.paymentIntent.amount},status:"success"});const s=store.formatPrice(a.paymentIntent.amount,e.currency);n.innerText=`Pay ${s}`});const m=s.create("paymentRequestButton",{paymentRequest:d});await d.canMakePayment()&&(m.mount("#payment-request-button"),document.querySelector(".instruction").innerText="Or enter your shipping and payment details below",document.getElementById("payment-request").classList.add("visible")),t.querySelector("select[name=country]").addEventListener("change",e=>{e.preventDefault(),w(e.target.value)}),t.addEventListener("submit",async e=>{e.preventDefault();const s=t.querySelector("input[name=payment]:checked").value,o=t.querySelector("input[name=name]").value,i=t.querySelector("select[name=country] option:checked").value,d=t.querySelector("input[name=email]").value;t.querySelector("input[name=address]").value,t.querySelector("input[name=city]").value,t.querySelector("input[name=postal_code]").value,t.querySelector("input[name=state]").value;if(n.disabled=!0,n.textContent="Processing…","card"===s){const e=await a.handleCardPayment(r.client_secret,c,{source_data:{owner:{name:o}}});y(e)}else if("sepa_debit"===s){const e=await a.confirmPaymentIntent(r.client_secret,l,{source_data:{type:"sepa_debit",owner:{name:o,email:d},mandate:{notification_method:"email"}}});y(e)}else{const e={type:s,amount:r.amount,currency:r.currency,owner:{name:o,email:d},redirect:{return_url:window.location.href},statement_descriptor:"Stripe Payments Demo",metadata:{paymentIntent:r.id}};switch(s){case"ideal":const{source:t}=await a.createSource(u,e);return void p(t);case"sofort":e.sofort={country:i};break;case"ach_credit_transfer":e.owner.email=`amount_${r.amount}@example.com`}const{source:t}=await a.createSource(e);p(t)}});const y=e=>{const{paymentIntent:t,error:n}=e,r=document.getElementById("main"),a=document.getElementById("confirmation");n?(r.classList.remove("processing"),r.classList.remove("receiver"),a.querySelector(".error-message").innerText=n.message,r.classList.add("error")):"succeeded"===t.status?(r.classList.remove("processing"),r.classList.remove("receiver"),a.querySelector(".note").innerText="We just sent your receipt to your email address, and your items will be on their way shortly.",r.classList.add("success")):"processing"===t.status?(r.classList.remove("processing"),a.querySelector(".note").innerText="We’ll send your receipt and ship your items as soon as your payment is confirmed.",r.classList.add("success")):(r.classList.remove("success"),r.classList.remove("processing"),r.classList.remove("receiver"),r.classList.add("error"))},p=a=>{const s=document.getElementById("main"),o=document.getElementById("confirmation");switch(a.flow){case"none":if("wechat"===a.type){new QRCode("wechat-qrcode",{text:a.wechat.qr_code_url,width:128,height:128,colorDark:"#424770",colorLight:"#f8fbfd",correctLevel:QRCode.CorrectLevel.H});t.querySelector(".payment-info.wechat p").style.display="none";let s=store.formatPrice(store.getPaymentTotal(),e.currency);n.textContent=`Scan this QR code on WeChat to pay ${s}`,g(r.id,3e5)}else console.log("Unhandled none flow.",a);break;case"redirect":n.textContent="Redirecting…",window.location.replace(a.redirect.url);break;case"code_verification":break;case"receiver":s.classList.add("success","receiver");const c=o.querySelector(".receiver .info");let i=store.formatPrice(a.amount,e.currency);switch(a.type){case"ach_credit_transfer":const e=a.ach_credit_transfer;c.innerHTML=`\n              <ul>\n                <li>\n                  Amount:\n                  <strong>${i}</strong>\n                </li>\n                <li>\n                  Bank Name:\n                  <strong>${e.bank_name}</strong>\n                </li>\n                <li>\n                  Account Number:\n                  <strong>${e.account_number}</strong>\n                </li>\n                <li>\n                  Routing Number:\n                  <strong>${e.routing_number}</strong>\n                </li>\n              </ul>`;break;case"multibanco":const t=a.multibanco;c.innerHTML=`\n              <ul>\n                <li>\n                  Amount (Montante):\n                  <strong>${i}</strong>\n                </li>\n                <li>\n                  Entity (Entidade):\n                  <strong>${t.entity}</strong>\n                </li>\n                <li>\n                  Reference (Referencia):\n                  <strong>${t.reference}</strong>\n                </li>\n              </ul>`;break;default:console.log("Unhandled receiver flow.",a)}g(r.id)}},g=async(e,t=3e4,n=500,r=null)=>{r=r||Date.now();const a=["succeeded","processing","canceled"],s=await fetch(`undefined/payment_intents?id=${e}`),o=await s.json();!a.includes(o.paymentIntent.status)&&Date.now()<r+t?setTimeout(g,n,e,t,n,r):(y(o),a.includes(o.paymentIntent.status)||console.warn(new Error("Polling timed out.")))},f=new URL(window.location.href),b=document.getElementById("main");if(f.searchParams.get("source")&&f.searchParams.get("client_secret")){b.classList.add("checkout","success","processing");const{source:e}=await a.retrieveSource({id:f.searchParams.get("source"),client_secret:f.searchParams.get("client_secret")});g(e.metadata.paymentIntent)}else{b.classList.add("checkout");const t=await store.createPaymentIntent(e.currency,store.getLineItems());r=t.paymentIntent}document.getElementById("main").classList.remove("loading");const v={ach_credit_transfer:{name:"Bank Transfer",flow:"receiver",countries:["US"],currencies:["usd"]},alipay:{name:"Alipay",flow:"redirect",countries:["CN","HK","SG","JP"],currencies:["aud","cad","eur","gbp","hkd","jpy","nzd","sgd","usd"]},bancontact:{name:"Bancontact",flow:"redirect",countries:["BE"],currencies:["eur"]},card:{name:"Card",flow:"none"},eps:{name:"EPS",flow:"redirect",countries:["AT"],currencies:["eur"]},ideal:{name:"iDEAL",flow:"redirect",countries:["NL"],currencies:["eur"]},giropay:{name:"Giropay",flow:"redirect",countries:["DE"],currencies:["eur"]},multibanco:{name:"Multibanco",flow:"receiver",countries:["PT"],currencies:["eur"]},sepa_debit:{name:"SEPA Direct Debit",flow:"none",countries:["FR","DE","ES","BE","NL","LU","IT","PT","AT","IE","FI"],currencies:["eur"]},sofort:{name:"SOFORT",flow:"redirect",countries:["DE","AT"],currencies:["eur"]},wechat:{name:"WeChat",flow:"none",countries:["CN","HK","SG","JP"],currencies:["aud","cad","eur","gbp","hkd","jpy","nzd","sgd","usd"]}},h=(t,r)=>{let a=store.formatPrice(store.getPaymentTotal(),e.currency),s=v[t].name,o=`Pay ${a}`;"card"!==t&&(o=`Pay ${a} with ${s}`),"wechat"===t&&(o=`Generate QR code to pay ${a} with ${s}`),"sepa_debit"===t&&r&&(o=`Debit ${a} from ${r}`),n.innerText=o},w=e=>{const t=document.getElementById("country");t.querySelector(`option[value=${e}]`).selected="selected",t.className=`field ${e}`,S(),L()},S=e=>{e||(e=t.querySelector("select[name=country] option:checked").value),t.querySelector("label.zip").parentElement.classList.toggle("with-state","US"===e),t.querySelector("label.zip span").innerText="US"===e?"ZIP":"GB"===e?"Postcode":"Postal Code"},L=n=>{n||(n=t.querySelector("select[name=country] option:checked").value);const r=t.querySelectorAll("input[name=payment]");for(let t=0;t<r.length;t++){let a=r[t];a.parentElement.classList.toggle("visible","card"===a.value||e.paymentMethods.includes(a.value)&&v[a.value].countries.includes(n)&&v[a.value].currencies.includes(e.currency))}const a=document.getElementById("payment-methods");a.classList.toggle("visible",a.querySelectorAll("li.visible").length>1),r[0].checked="checked",t.querySelector(".payment-info.card").classList.add("visible"),t.querySelector(".payment-info.ideal").classList.remove("visible"),t.querySelector(".payment-info.sepa_debit").classList.remove("visible"),t.querySelector(".payment-info.wechat").classList.remove("visible"),t.querySelector(".payment-info.redirect").classList.remove("visible"),h(r[0].value)};for(let e of document.querySelectorAll("input[name=payment]"))e.addEventListener("change",e=>{e.preventDefault();const n=t.querySelector("input[name=payment]:checked").value,r=v[n].flow;h(e.target.value),t.querySelector(".payment-info.card").classList.toggle("visible","card"===n),t.querySelector(".payment-info.ideal").classList.toggle("visible","ideal"===n),t.querySelector(".payment-info.sepa_debit").classList.toggle("visible","sepa_debit"===n),t.querySelector(".payment-info.wechat").classList.toggle("visible","wechat"===n),t.querySelector(".payment-info.redirect").classList.toggle("visible","redirect"===r),t.querySelector(".payment-info.receiver").classList.toggle("visible","receiver"===r),document.getElementById("card-errors").classList.remove("visible","card"!==n)});let _=e.country;var q=new URLSearchParams(window.location.search);let P=q.get("country")?q.get("country").toUpperCase():e.country;t.querySelector(`option[value="${P}"]`)&&(_=P),w(_)})()}]);