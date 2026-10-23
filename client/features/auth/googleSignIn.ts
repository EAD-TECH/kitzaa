import { apiFetch } from "@/lib/api/client";

const GOOGLE_AUTH_ERROR_CODES = {
  oauth_cancelled: "cancelled",
  oauth_state: "state",
  oauth_exchange: "exchange",
  oauth_email_unverified: "emailUnverified",
  oauth_use_password: "usePassword",
  oauth_inactive: "inactive",
  oauth_not_configured: "notConfigured",
} as const;

export type GoogleAuthErrorKey =
  (typeof GOOGLE_AUTH_ERROR_CODES)[keyof typeof GOOGLE_AUTH_ERROR_CODES];

export function googleAuthErrorKey(value: string | null): GoogleAuthErrorKey | null {
  if (!value || !(value in GOOGLE_AUTH_ERROR_CODES)) return null;
  return GOOGLE_AUTH_ERROR_CODES[value as keyof typeof GOOGLE_AUTH_ERROR_CODES];
}

type CredentialResponse = { credential?: string };

type GoogleIdentityService = {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    nonce: string;
    auto_select: boolean;
    ux_mode: "popup";
    use_fedcm_for_prompt: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type: "standard";
      theme: "outline";
      size: "large";
      text: "continue_with";
      shape: "pill";
      width: number;
      logo_alignment: "left";
      context: "signin" | "signup";
    },
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdentityService } };
  }
}

const GOOGLE_BUTTON_MAX_WIDTH = 400;

let gisScript: Promise<void> | null = null;
let mountGeneration = 0;
let buttonObserver: ResizeObserver | null = null;
let paintedWidth = 0;

function loadGisScript(locale: "de" | "en"): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisScript) return gisScript;

  gisScript = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://accounts.google.com/gsi/client?hl=${locale}`;
    script.async = true;
    script.defer = true;
    script.dataset.gis = "true";
    script.onload = () => resolve();
    script.onerror = () => {
      gisScript = null;
      reject(new Error("GIS script failed"));
    };
    document.head.appendChild(script);
  });

  return gisScript;
}

function googleButtonWidth(element: HTMLElement): number | null {
  const measured = Math.floor(element.getBoundingClientRect().width);
  if (measured <= 0) return null;
  return Math.min(GOOGLE_BUTTON_MAX_WIDTH, measured);
}

function paintGoogleButton(element: HTMLElement, context: "signin" | "signup"): void {
  const googleId = window.google?.accounts?.id;
  const width = googleButtonWidth(element);
  if (!googleId || width === null || width === paintedWidth) return;

  paintedWidth = width;
  googleId.renderButton(element, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "pill",
    logo_alignment: "left",
    width,
    context,
  });
}

export function cancelGoogleButtonMount(): void {
  mountGeneration += 1;
  buttonObserver?.disconnect();
  buttonObserver = null;
  paintedWidth = 0;
}

export async function mountGoogleButton(
  element: HTMLElement,
  options: {
    locale: "de" | "en";
    context: "signin" | "signup";
    onCredential: (credential: string) => void;
    onError: (key: GoogleAuthErrorKey) => void;
  },
): Promise<void> {
  const generation = ++mountGeneration;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    options.onError("notConfigured");
    return;
  }

  let nonce: string;
  try {
    const response = await apiFetch<{ nonce: string }>("/api/v1/auth/google/nonce", {
      method: "GET",
      skipAuthHeaders: true,
      skipAuthRefresh: true,
    });
    nonce = response.nonce;
  } catch {
    if (generation === mountGeneration) options.onError("exchange");
    return;
  }

  if (generation !== mountGeneration) return;

  try {
    await loadGisScript(options.locale);
  } catch {
    if (generation === mountGeneration) options.onError("exchange");
    return;
  }

  if (generation !== mountGeneration) return;

  const googleId = window.google?.accounts?.id;
  if (!googleId) {
    options.onError("exchange");
    return;
  }

  googleId.initialize({
    client_id: clientId,
    nonce,
    auto_select: false,
    ux_mode: "popup",
    use_fedcm_for_prompt: false,
    callback: (response) => {
      if (generation !== mountGeneration) return;
      if (!response.credential) {
        options.onError("cancelled");
        return;
      }
      options.onCredential(response.credential);
    },
  });

  element.replaceChildren();
  paintedWidth = 0;
  paintGoogleButton(element, options.context);

  buttonObserver?.disconnect();
  buttonObserver = new ResizeObserver(() => {
    if (generation !== mountGeneration) return;
    paintGoogleButton(element, options.context);
  });
  buttonObserver.observe(element);
}
