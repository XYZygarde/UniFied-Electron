import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Setup from '../Setup'

describe('Setup page', () => {
  it('renders the setup heading, description, and start button', () => {
    render(<Setup />)

    expect(screen.getByRole('heading', { name: /setup/i })).toBeInTheDocument()
    expect(screen.getByText(/configure the secure kiosk environment/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /begin setup/i })).toBeInTheDocument()
  })
})
