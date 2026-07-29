---
"@paypal/react-paypal-js": minor
---

Add 22 newly onboarded local payment methods (LPMs) to the `@paypal/react-paypal-js/sdk-v6/local-payment-methods` bundle, bringing the total to 72. The new LPMs are: Airtel Kenya, Airtel Tanzania, PesaLink, HaloPesa, SPEI, PicPay, Nigeria Banks, OPay, Naver Pay, CoDi, Payattitude, Dimo, PSE, QRPh, VietQR, Mixx by Yas, Bre-B, PromptPay, Nequi, TrueMoney, NuPay, and ShopeePay.

Each new LPM is registry-driven like the existing ones and ships the same three exports plus prop-type aliases, e.g. for PSE:

```tsx
import {
  PseOneTimePaymentButton,
  usePseOneTimePaymentSession,
  PsePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6/local-payment-methods";
```

PSE and Nequi introduce two new session field types, `bic` and `identification`, supported via the `SessionFieldType` union and the corresponding `createOrder`/hook session-field props.
