import { render, screen } from "@testing-library/react"
import Dashboard from "./page"

describe("Dashboard", () => {
  it("renders title", () => {
    render(<Dashboard />)
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  })
})
