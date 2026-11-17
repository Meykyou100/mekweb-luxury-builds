import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { Contact } from "@/components/site/Contact";
import { Navbar } from "@/components/site/Navbar";
import { Pricing } from "@/components/site/Pricing";
import { FAQ } from "@/components/site/FAQ";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function completeContact() {
  fireEvent.change(screen.getByLabelText("Votre nom"), {
    target: { value: "  Test local  " },
  });
  fireEvent.change(screen.getByLabelText("Téléphone / WhatsApp"), {
    target: { value: "+212600000000" },
  });
  fireEvent.change(screen.getByLabelText("Votre adresse email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Parlez-nous de votre projet"), {
    target: { value: "Un site vitrine pour mon activité." },
  });
}

describe("Contact WhatsApp", () => {
  it("associates labels and reports validation errors on the first field", () => {
    render(<Contact />);
    fireEvent.click(
      screen.getByRole("button", { name: /Préparer ma demande/ }),
    );
    const name = screen.getByLabelText("Votre nom");
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Nom requis");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("prepares an encoded WhatsApp message without claiming delivery or clearing input", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<Contact />);
    completeContact();
    fireEvent.click(
      screen.getByRole("button", { name: /Préparer ma demande/ }),
    );
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Aucune demande n’a encore été envoyée");
    const link = within(status).getByRole("link", { name: /Ouvrir WhatsApp/ });
    const url = new URL(link.getAttribute("href")!);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/212708465603");
    expect(url.searchParams.get("text")).toContain("Nom: Test local\n");
    expect(url.searchParams.get("text")).toContain("Budget: 1500 DH");
    expect(screen.getByLabelText("Votre nom")).toHaveValue("  Test local  ");
    expect(open).not.toHaveBeenCalled();
  });
  it("invalidates the prepared link when details change", () => {
    render(<Contact />);
    completeContact();
    fireEvent.click(
      screen.getByRole("button", { name: /Préparer ma demande/ }),
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Budget envisagé"), {
      target: { value: "2500 DH" },
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("Navigation and preserved offers", () => {
  it("exposes menu state and closes with Escape while restoring focus", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Ouvrir le menu" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
  it("preserves all package prices and existing inclusions", () => {
    render(<Pricing />);
    expect(
      screen.getByRole("heading", { name: "Pack Essentiel" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pack Business" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pack E-commerce" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1500 DH", { exact: false })).toHaveTextContent(
      "à partir de1500 DH",
    );
    expect(screen.getByText("2500 DH", { exact: false })).toHaveTextContent(
      "à partir de2500 DH",
    );
    expect(screen.getByText("sur devis")).toBeInTheDocument();
    expect(screen.getByText("Admin panel si nécessaire")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(13);
  });
  it("opens the existing FAQ answer through its accessible trigger", () => {
    render(<FAQ />);
    const trigger = screen.getByRole("button", {
      name: /Combien coûte un site web/,
    });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Le prix dépend du type de site/)).toBeVisible();
  });
});
