import { render, screen } from "@testing-library/react";
import RequireAuth from "./RequireAuth";
import { useAuthStore } from "../store/authStore";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { redirectExternal } from "../utils/navigation";

/* mock toollar */
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../store/authStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("../hooks/useCurrentUser", () => ({
  useCurrentUser: jest.fn(),
}));

// YENİ: Kendi yönlendirme fonksiyonumuzu dublörlüyoruz
jest.mock("../utils/navigation", () => ({
  redirectExternal: jest.fn(),
}));

describe("RequireAuth guvenlik sefini test ediyorum", () => {
  const mockedUseAuthStore = useAuthStore as jest.MockedFunction<
    typeof useAuthStore
  >;
  const mockedUseCurrentUser = useCurrentUser as jest.MockedFunction<
    typeof useCurrentUser
  >;

  // Casusumuzu hazırladık
  const mockedRedirectExternal = redirectExternal as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* 1. Senaryom */
  it("sistem hazir degilse ekran bisey basmamali", () => {
    mockedUseAuthStore.mockReturnValue(false);
    mockedUseCurrentUser.mockReturnValue({ data: null } as any);

    render(
      <RequireAuth roles="admin">
        <div>Gizli Hazine</div>
      </RequireAuth>,
    );

    expect(screen.queryByText("Gizli Hazine")).not.toBeInTheDocument();
  });

  /* 2. Senaryom */
  it("kullanici giris yapmadiysa login sayfasina yonlendirmeli", () => {
    mockedUseAuthStore.mockReturnValue(true);
    mockedUseCurrentUser.mockReturnValue({ data: null } as any);

    render(
      <RequireAuth roles="admin">
        <div>Gizli Hazine</div>
      </RequireAuth>,
    );

    // KONTROL: JSDOM'u hacklemek yerine kendi casusumuzu kontrol ediyoruz!
    expect(mockedRedirectExternal).toHaveBeenCalledWith(
      "http://localhost:3000/login",
    );
  });

  /* 3. Senaryom */
  it("kullanici admin degilse ana sayfaya yonlendirmeli", () => {
    mockedUseAuthStore.mockReturnValue(true);
    mockedUseCurrentUser.mockReturnValue({ data: { role: "user" } } as any);

    render(
      <RequireAuth roles="admin">
        <div>Gizli Hazine</div>
      </RequireAuth>,
    );

    // KONTROL
    expect(mockedRedirectExternal).toHaveBeenCalledWith(
      "http://localhost:3000",
    );
  });

  /* 4. Senaryom */
  it("kullanici admin ise icerikteki (children) sayfayi gostermeli", () => {
    mockedUseAuthStore.mockReturnValue(true);
    mockedUseCurrentUser.mockReturnValue({ data: { role: "admin" } } as any);

    render(
      <RequireAuth roles="admin">
        <div>Gizli Hazine</div>
      </RequireAuth>,
    );

    expect(screen.queryByText("Gizli Hazine")).toBeInTheDocument();
  });
});
