import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import Devis from "@/pages/Devis";
function renderWizard(path = "/devis") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          requestsEnabled: false,
          uploadsEnabled: false,
          agency: null,
        }),
      }),
  );
  vi.stubGlobal("scrollTo", vi.fn());
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Devis />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Quotation wizard behavior", () => {
  it("requires a project choice and preserves values when navigating backwards", async () => {
    renderWizard();
    fireEvent.click(screen.getByRole("button", { name: /Continuer/ }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/Site vitrine/));
    fireEvent.click(screen.getByRole("button", { name: /Continuer/ }));
    const name = await screen.findByLabelText(/Nom de votre entreprise/);
    fireEvent.change(name, { target: { value: "Activité de test" } });
    fireEvent.click(screen.getByRole("button", { name: /Précédent/ }));
    await screen.findByText("Que souhaitez-vous créer ?");
    fireEvent.click(screen.getByRole("button", { name: /Continuer/ }));
    expect(await screen.findByLabelText(/Nom de votre entreprise/)).toHaveValue(
      "Activité de test",
    );
  });
  it("preselects the package and does not claim persistence when services are unavailable", async () => {
    renderWizard("/devis?pack=business");
    expect(screen.getByText("Pack Business")).toBeInTheDocument();
    expect(screen.getByLabelText(/Site corporate/)).toBeChecked();
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "L’enregistrement en ligne n’est pas encore ouvert",
      ),
    );
    expect(
      screen.queryByText(/demande est enregistrée/),
    ).not.toBeInTheDocument();
  });
});
