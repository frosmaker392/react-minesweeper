import React from 'react'

import { render } from '@testing-library/react'
import { describe, test } from 'vitest'
import Select from './Select'

describe('Select component', () => {
  test('renders correctly', () => {
    const id = 'test-id'
    const className = 'test-class'
    const child = <option data-testid="child" />
    const { queryByTestId } = render(
      <Select id={id} className={className}>
        {child}
      </Select>
    )

    const container = queryByTestId('select-container')
    const select = queryByTestId('select')
    const childElement = queryByTestId('child')

    expect(container).toBeInTheDocument()
    expect(select).toBeInTheDocument()

    expect(container?.id).not.toBe(id)
    expect(select?.id).toBe(id)
    expect(container).toHaveClass(className)
    expect(select).not.toHaveClass(className)

    expect(select?.firstChild).toBe(childElement)
  })
})
