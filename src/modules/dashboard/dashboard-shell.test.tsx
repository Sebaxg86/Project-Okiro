import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardShell } from "./dashboard-shell";

describe("DashboardShell", () => {
  it("updates mission progress when a mission is completed", () => {
    render(<DashboardShell />);

    expect(screen.getByText("3 de 5 completadas")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Completar Meta de hidratación" }),
    );

    expect(screen.getByText("4 de 5 completadas")).toBeInTheDocument();
  });

  it("registers an activity from the quick log", () => {
    render(<DashboardShell />);

    fireEvent.click(screen.getByRole("button", { name: "Registrar actividad" }));
    expect(
      screen.getByRole("heading", { name: "¿Qué quieres registrar?" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hidratación" }));
    expect(
      screen.getByText("Registro guardado: Hidratación · +5 XP provisional"),
    ).toBeInTheDocument();
  });
});
