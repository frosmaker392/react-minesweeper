import React from 'react'

import { render } from '@testing-library/react'
import { describe, test } from 'vitest'
import IntegerField from './IntegerField'
import { type ComponentProps } from 'react'

describe('IntegerField component', () => {
  test('renders correctly', () => {
    const id = 'test-id'
    const child = <div data-testid="child" />
    const props: ComponentProps<typeof IntegerField> = {
      id,
      min: 0,
      max: 5,
      value: 2,
      onChange: () => {},
    }

    const { queryByTestId } = render(
      <IntegerField {...props}>{child}</IntegerField>
    )

    const label = queryByTestId('integer-field-label')
    const input = queryByTestId('integer-input')
    const childElement = queryByTestId('child')

    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(childElement).toBeInTheDocument()

    expect(label?.getAttribute('for')).toBe(id)
    expect(input?.id).toBe(id)
    expect(label?.firstChild).toBe(childElement)
  })
})
