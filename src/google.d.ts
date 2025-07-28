/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          prompt: () => void;
          renderButton?: (el: HTMLElement, options: object) => void;
        };
      };
    },
    gsiInitialized?: boolean;
  }
}
