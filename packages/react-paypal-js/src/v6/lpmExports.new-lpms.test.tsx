import React from "react";
import { render, act } from "@testing-library/react";

import {
  AirtelKenyaOneTimePaymentButton,
  AirtelTanzaniaOneTimePaymentButton,
  PesalinkOneTimePaymentButton,
  HalopesaOneTimePaymentButton,
  SpeiOneTimePaymentButton,
  PicpayOneTimePaymentButton,
  NigeriaBanksOneTimePaymentButton,
  OpayOneTimePaymentButton,
  NaverpayOneTimePaymentButton,
  CodiOneTimePaymentButton,
  PayattitudeOneTimePaymentButton,
  DimoOneTimePaymentButton,
  PseOneTimePaymentButton,
  QrphOneTimePaymentButton,
  VietqrOneTimePaymentButton,
  MixxByYasOneTimePaymentButton,
  BreBOneTimePaymentButton,
  PromptpayQrOneTimePaymentButton,
  NequiOneTimePaymentButton,
  TruemoneyOneTimePaymentButton,
  NupayOneTimePaymentButton,
  ShopeepayOneTimePaymentButton,
  useNequiOneTimePaymentSession,
  usePseOneTimePaymentSession,
  AirtelKenyaPaymentButton,
  PsePaymentButton,
  NequiPaymentButton,
  ShopeepayPaymentButton,
  LPM_REGISTRY,
} from "./lpmExports";
import { useLPMOneTimePaymentSession } from "./hooks/useLPMOneTimePaymentSession";

import type { LPMOneTimePaymentSession } from "./types";
import type { LPMName } from "./config/lpmRegistry";

jest.mock("./hooks/useLPMOneTimePaymentSession", () => ({
  useLPMOneTimePaymentSession: jest.fn().mockReturnValue({
    error: null,
    isPending: false,
    handleClick: jest.fn(),
  }),
}));
jest.mock("./hooks/usePayPal", () => ({
  usePayPal: jest.fn().mockReturnValue({ isHydrated: true }),
}));

const mockedUseLPM = jest.mocked(useLPMOneTimePaymentSession);

function makeDefaultMockReturn(session: LPMOneTimePaymentSession | null = null) {
  return {
    error: null,
    isPending: false,
    session,
    handleClick: jest.fn(),
    handleCancel: jest.fn(),
    handleDestroy: jest.fn(),
    handleValidate: jest.fn().mockResolvedValue(true),
  };
}

// 22 LPMs onboarded in core-web-sdk and wired up for DTLAMBO-662.
const NEW_LPM_BUTTONS: Array<{
  lpm: LPMName;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: React.ComponentType<any>;
}> = [
  { lpm: "airtelKenya", Button: AirtelKenyaOneTimePaymentButton },
  { lpm: "airtelTanzania", Button: AirtelTanzaniaOneTimePaymentButton },
  { lpm: "pesalink", Button: PesalinkOneTimePaymentButton },
  { lpm: "halopesa", Button: HalopesaOneTimePaymentButton },
  { lpm: "spei", Button: SpeiOneTimePaymentButton },
  { lpm: "picpay", Button: PicpayOneTimePaymentButton },
  { lpm: "nigeriaBanks", Button: NigeriaBanksOneTimePaymentButton },
  { lpm: "opay", Button: OpayOneTimePaymentButton },
  { lpm: "naverpay", Button: NaverpayOneTimePaymentButton },
  { lpm: "codi", Button: CodiOneTimePaymentButton },
  { lpm: "payattitude", Button: PayattitudeOneTimePaymentButton },
  { lpm: "dimo", Button: DimoOneTimePaymentButton },
  { lpm: "pse", Button: PseOneTimePaymentButton },
  { lpm: "qrph", Button: QrphOneTimePaymentButton },
  { lpm: "vietqr", Button: VietqrOneTimePaymentButton },
  { lpm: "mixxByYas", Button: MixxByYasOneTimePaymentButton },
  { lpm: "breB", Button: BreBOneTimePaymentButton },
  { lpm: "promptpayQr", Button: PromptpayQrOneTimePaymentButton },
  { lpm: "nequi", Button: NequiOneTimePaymentButton },
  { lpm: "truemoney", Button: TruemoneyOneTimePaymentButton },
  { lpm: "nupay", Button: NupayOneTimePaymentButton },
  { lpm: "shopeepay", Button: ShopeepayOneTimePaymentButton },
];

describe("Factory-generated LPM exports — 22 newly onboarded LPMs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLPM.mockReturnValue(makeDefaultMockReturn());
  });

  test.each(NEW_LPM_BUTTONS)(
    "$lpm OneTimePaymentButton passes lpm='$lpm' to the session hook",
    ({ lpm, Button }) => {
      render(
        <Button
          presentationMode="auto"
          orderId="test"
          onApprove={jest.fn().mockResolvedValue(undefined)}
        />,
      );

      expect(useLPMOneTimePaymentSession).toHaveBeenCalledWith(
        expect.objectContaining({ lpm }),
      );
    },
  );

  test.each(NEW_LPM_BUTTONS)(
    "$lpm OneTimePaymentButton has displayName matching the registry entry",
    ({ lpm, Button }) => {
      expect(Button.displayName).toBe(
        `${LPM_REGISTRY[lpm].displayName}OneTimePaymentButton`,
      );
    },
  );

  test.each(NEW_LPM_BUTTONS)(
    "$lpm OneTimePaymentButton renders the '$lpm' registry buttonTag element",
    ({ lpm, Button }) => {
      const { container } = render(
        <Button
          presentationMode="auto"
          orderId="test"
          onApprove={jest.fn().mockResolvedValue(undefined)}
        />,
      );

      expect(
        container.querySelector(LPM_REGISTRY[lpm].buttonTag),
      ).not.toBeNull();
    },
  );
});

describe("PSE — bic and identification session fields", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLPM.mockReturnValue(makeDefaultMockReturn());
  });

  test("PSE registry entry requires bic and identification session fields", () => {
    expect(LPM_REGISTRY.pse.sessionFields).toContain("bic");
    expect(LPM_REGISTRY.pse.sessionFields).toContain("identification");
  });

  test("usePseOneTimePaymentSession returns field components for fields: ['name', 'email']", () => {
    let captured: ReturnType<typeof usePseOneTimePaymentSession> | null = null;

    function Probe() {
      captured = usePseOneTimePaymentSession({
        presentationMode: "popup",
        createOrder: jest.fn().mockResolvedValue({ orderId: "test" }),
        onApprove: jest.fn().mockResolvedValue(undefined),
      });
      return null;
    }

    render(<Probe />);

    expect(typeof captured!.NameField).toBe("function");
    expect(typeof captured!.EmailField).toBe("function");
  });
});

describe("Nequi — identification session field", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseLPM.mockReturnValue(makeDefaultMockReturn());
  });

  test("Nequi registry entry requires identification session field", () => {
    expect(LPM_REGISTRY.nequi.sessionFields).toContain("identification");
  });

  test("useNequiOneTimePaymentSession returns field components for fields: ['name', 'email']", () => {
    let captured: ReturnType<typeof useNequiOneTimePaymentSession> | null =
      null;

    function Probe() {
      captured = useNequiOneTimePaymentSession({
        presentationMode: "popup",
        createOrder: jest.fn().mockResolvedValue({ orderId: "test" }),
        onApprove: jest.fn().mockResolvedValue(undefined),
      });
      return null;
    }

    render(<Probe />);

    expect(typeof captured!.NameField).toBe("function");
    expect(typeof captured!.EmailField).toBe("function");
  });

  test("Nequi field calls createPaymentFields when session becomes available", async () => {
    const makeSession = (): LPMOneTimePaymentSession => ({
      start: jest.fn().mockResolvedValue(undefined),
      cancel: jest.fn(),
      destroy: jest.fn(),
      createPaymentFields: jest.fn().mockReturnValue(document.createElement("div")),
      validate: jest.fn().mockResolvedValue(true),
    });

    const session1 = makeSession();
    let currentSession: LPMOneTimePaymentSession | null = null;

    mockedUseLPM.mockImplementation(() => makeDefaultMockReturn(currentSession));

    let capturedResult: ReturnType<typeof useNequiOneTimePaymentSession> | null = null;

    function TestTree() {
      capturedResult = useNequiOneTimePaymentSession({
        presentationMode: "popup",
        createOrder: jest.fn().mockResolvedValue({ orderId: "t" }),
        onApprove: jest.fn().mockResolvedValue(undefined),
      });
      if (!capturedResult) {
        return null;
      }
      const NF = capturedResult.NameField as React.FC;
      return <NF />;
    }

    const { rerender } = render(<TestTree />);

    expect(session1.createPaymentFields).not.toHaveBeenCalled();

    currentSession = session1;
    await act(async () => {
      rerender(<TestTree />);
    });

    expect(session1.createPaymentFields).toHaveBeenCalledWith({ type: "name" });
  });
});

describe("Standalone LPM payment buttons — sample of newly onboarded LPMs", () => {
  test("AirtelKenyaPaymentButton has correct displayName and renders its buttonTag", () => {
    expect(AirtelKenyaPaymentButton.displayName).toBe(
      "AirtelKenyaPaymentButton",
    );

    const { container } = render(
      <AirtelKenyaPaymentButton
        paymentSession={{ handleClick: jest.fn(), isPending: false, error: null }}
      />,
    );

    expect(
      container.querySelector(LPM_REGISTRY.airtelKenya.buttonTag),
    ).not.toBeNull();
  });

  test("PsePaymentButton renders the pse-button web component", () => {
    const { container } = render(
      <PsePaymentButton
        paymentSession={{ handleClick: jest.fn(), isPending: false, error: null }}
      />,
    );

    expect(container.querySelector("pse-button")).not.toBeNull();
  });

  test("NequiPaymentButton is disabled when isPending=true", () => {
    const { container } = render(
      <NequiPaymentButton
        paymentSession={{ handleClick: jest.fn(), isPending: true, error: null }}
      />,
    );

    expect(
      container.querySelector("nequi-button")?.getAttribute("disabled"),
    ).not.toBeNull();
  });

  test("ShopeepayPaymentButton is disabled when error is present", () => {
    const { container } = render(
      <ShopeepayPaymentButton
        paymentSession={{
          handleClick: jest.fn(),
          isPending: false,
          error: new Error("Something went wrong"),
        }}
      />,
    );

    expect(
      container.querySelector("shopeepay-button")?.getAttribute("disabled"),
    ).not.toBeNull();
  });
});
