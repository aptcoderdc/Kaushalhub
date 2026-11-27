import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FacultySection } from "@/components/faculty-section";
import { facultyMembers } from "@/lib/faculty";
import { programs } from "@/lib/programs";

describe("FacultySection", () => {
  it("renders nothing when a program has no faculty", () => {
    const { container } = render(<FacultySection faculty={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one card per faculty member with photo, designation, short bio and LinkedIn link when available", () => {
    render(<FacultySection faculty={facultyMembers} />);
    expect(screen.getByRole("heading", { name: "Meet Your Faculty" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(facultyMembers.length);
    for (const member of facultyMembers) {
      const card = screen.getByRole("heading", { name: member.name }).closest("article")!;
      const scope = within(card as HTMLElement);
      expect(scope.getByRole("img", { name: `Portrait of ${member.name}` })).toHaveAttribute(
        "src",
        expect.stringContaining(member.photo),
      );
      expect(scope.getByText(member.designation)).toBeInTheDocument();
      expect(scope.getByText(member.shortBio)).toBeInTheDocument();
      if (!member.linkedinUrl) {
        expect(scope.queryByRole("link")).not.toBeInTheDocument();
        continue;
      }
      const link = scope.getByRole("link", { name: `${member.name} on LinkedIn (opens in a new tab)` });
      expect(link).toHaveAttribute("href", member.linkedinUrl);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("keeps the order of the faculty list and the confirmed LinkedIn URLs", () => {
    expect(facultyMembers.map((member) => member.name)).toEqual([
      "Ankit Saxena",
      "Ashutosh Pastor",
      "Rashmi Jain",
      "Neelabh Pathak",
      "Prasanjeet Sinha",
    ]);
    expect(Object.fromEntries(facultyMembers.map((m) => [m.name, m.linkedinUrl]))).toEqual({
      "Ankit Saxena": "https://www.linkedin.com/in/ankitsaxena771/",
      "Ashutosh Pastor": "https://www.linkedin.com/in/ashutoshpastor/",
      "Rashmi Jain": "https://www.linkedin.com/in/rashmi-jain-305a8417/",
      "Neelabh Pathak": "https://www.linkedin.com/in/neelabh-pathak-035674b7/",
      "Prasanjeet Sinha": "https://www.linkedin.com/in/prasanjeet-sinha-117214b8/",
    });
  });

  it("starts the carousel with only the next arrow enabled when cards overflow", () => {
    // jsdom has no layout, so give the track a width narrower than its content.
    const spies = [
      vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(2000),
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1200),
    ];
    render(<FacultySection faculty={facultyMembers} />);
    expect(screen.getByRole("region", { name: "Faculty profiles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous faculty profiles" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next faculty profiles" })).toBeEnabled();
    for (const spy of spies) spy.mockRestore();
  });

  it("hides the carousel arrows when every card already fits", () => {
    render(<FacultySection faculty={facultyMembers.slice(0, 1)} />);
    expect(screen.queryByRole("button", { name: /faculty profiles/ })).not.toBeInTheDocument();
  });

  it("opens a popup with the matching faculty member's full bio and LinkedIn link when available", () => {
    render(<FacultySection faculty={facultyMembers} />);
    for (const member of facultyMembers) {
      fireEvent.click(screen.getByRole("button", { name: `Read more about ${member.name}` }));
      const dialog = screen.getByRole("dialog");
      const scope = within(dialog);
      expect(scope.getByRole("heading", { name: member.name })).toBeInTheDocument();
      expect(scope.getByText(member.designation)).toBeInTheDocument();
      expect(scope.getByRole("img", { name: `Portrait of ${member.name}` })).toBeInTheDocument();
      expect(scope.getByText("About")).toBeInTheDocument();
      for (const paragraph of member.fullBio) expect(scope.getByText(paragraph)).toBeInTheDocument();
      if (member.linkedinUrl) {
        const link = scope.getByRole("link", { name: /View LinkedIn Profile/ });
        expect(link).toHaveAttribute("href", member.linkedinUrl);
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      } else {
        expect(scope.queryByRole("link")).not.toBeInTheDocument();
      }
      fireEvent.keyDown(dialog, { key: "Escape" });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    }
  });

  it("shows a neutral placeholder instead of a broken image when a photo fails to load", () => {
    const member = { ...facultyMembers[0]!, photo: "/faculty/missing.jpg" };
    render(<FacultySection faculty={[member]} />);
    fireEvent.error(screen.getByRole("img", { name: `Portrait of ${member.name}` }));
    expect(
      screen.getByRole("img", { name: `Portrait of ${member.name} unavailable` }),
    ).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it("gives every program faculty profiles except the Microsoft AI course", () => {
    // The shared faculty list does not teach the Microsoft AI course, so its page has none.
    for (const program of programs) {
      if (program.slug === "generative-ai-in-action") expect(program.faculty).toHaveLength(0);
      else expect(program.faculty.length).toBeGreaterThan(0);
    }
  });
});
