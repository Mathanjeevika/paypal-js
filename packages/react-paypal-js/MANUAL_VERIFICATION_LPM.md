# Manual Verification Checklist — Newly Onboarded LPMs (DTLAMBO-665)

This checklist covers manual/sandbox verification for the 22 Local Payment Methods (LPMs)
added to the `react-paypal-js` v6 wrapper in DTLAMBO-662. Automated E2E coverage is
intentionally out of scope for this pass: `react-paypal-js` has no existing Playwright/E2E
infrastructure (only the unrelated `packages/paypal-js` loader package does, covering
script-loading behavior, not rendered components or payment flows), and these LPMs require a
real popup/redirect round-trip against PayPal's sandbox APIs that isn't practical to fake
credibly. Unit test coverage for rendering/props/hooks already exists in
`src/v6/lpmExports.new-lpms.test.tsx` (DTLAMBO-663).

Verify each LPM using the Storybook stories (`V6/LPM/<Name>`) added in DTLAMBO-664, running
against a sandbox merchant account with the LPM enabled, per row below.

## How to run

```bash
cd packages/react-paypal-js && npm run build && npm run type-declarations
cd ../react-paypal-js-storybook/v6 && npm run storybook
```

Open the story for the LPM under test, set `testBuyerCountry` context (VPN/sandbox buyer
locale if required by the LPM), fill in any session-field controls, and exercise the flow.

## Checklist

For each LPM below, confirm:
- [ ] Button renders with the correct label/branding (no console errors)
- [ ] Clicking the button opens the payment flow (popup or redirect per `presentationMode`)
- [ ] Required session fields are accepted and submitted (see "Session fields" column)
- [ ] Approving the sandbox payment fires `onApprove` and the order captures successfully
- [ ] Cancelling the flow fires `onCancel`
- [ ] An invalid/forced-error case fires `onError`

| LPM | Registry key | Test buyer country | Session fields to verify |
|---|---|---|---|
| Airtel Kenya | `airtelKenya` | KE | phone |
| Airtel Tanzania | `airtelTanzania` | TZ | — |
| PesaLink | `pesalink` | KE | — |
| HaloPesa | `halopesa` | TZ | — |
| SPEI | `spei` | MX | — |
| PicPay | `picpay` | BR | — |
| Nigeria Banks | `nigeriaBanks` | NG | — |
| OPay | `opay` | NG | — |
| Naver Pay | `naverpay` | KR | — |
| CoDi | `codi` | MX | — |
| Payattitude | `payattitude` | NG | phone |
| Dimo | `dimo` | BR | — |
| PSE | `pse` | CO | phone, billingAddress, bic, identification |
| QRPh | `qrph` | PH | — |
| VietQR | `vietqr` | VN | — |
| Mixx by Yas | `mixxByYas` | TG | — |
| Bre-B | `breB` | CO | — |
| PromptPay | `promptpayQr` | TH | — |
| Nequi | `nequi` | CO | phone, billingAddress, identification |
| TrueMoney | `truemoney` | TH | phone |
| NuPay | `nupay` | IN | phone, taxInfo |
| ShopeePay | `shopeepay` | ID | phone |

## Notes

- PSE and Nequi are the first LPMs to exercise the `bic` and `identification` session field
  types end-to-end — pay particular attention to these two during sandbox verification, since
  they're new field types with no prior production usage in this wrapper.
- Record sign-off (verifier name + date) per LPM in the DTLAMBO-665 Jira ticket comments once
  verified against sandbox.
