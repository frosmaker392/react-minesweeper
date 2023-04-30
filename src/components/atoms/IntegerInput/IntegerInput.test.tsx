import React, { type ComponentProps } from 'react'

import { fireEvent, render } from '@testing-library/react'
import { describe, vitest } from 'vitest'
import IntegerInput from './IntegerInput'

describe('IntegerInput component', () => {
  const props: ComponentProps<typeof IntegerInput> = {
    min: -5,
    max: 5,
    value: 0,
    onChange: () => {},
  }

  test('renders correctly', () => {
    const onChange = vitest.fn()
    const { queryByTestId } = render(
      <IntegerInput {...props} onChange={onChange} />
    )

    // Input element has correct attributes
    const input = queryByTestId('integer-input') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.min).toBe(props.min.toString())
    expect(input.max).toBe(props.max.toString())
    expect(input.valueAsNumber).toBe(props.value)

    // Change event triggered with correct values
    const decrementButton = queryByTestId('decrement-button')
    const incrementButton = queryByTestId('increment-button')

    expect(decrementButton).toBeInTheDocument()
    expect(incrementButton).toBeInTheDocument()

    fireEvent.click(decrementButton as HTMLButtonElement)
    expect(onChange).toHaveBeenLastCalledWith(props.value - 1)

    fireEvent.click(incrementButton as HTMLButtonElement)
    expect(onChange).toHaveBeenLastCalledWith(props.value + 1)

    fireEvent.change(input, { target: { value: 3 } })
    expect(onChange).toHaveBeenLastCalledWith(3)
  })

  test('onChange does not trigger if value is NaN', () => {
    const onChange = vitest.fn()
    const { queryByTestId } = render(
      <IntegerInput {...props} value={NaN} onChange={onChange} />
    )

    const incrementButton = queryByTestId('increment-button')
    const decrementButton = queryByTestId('decrement-button')

    fireEvent.click(incrementButton as HTMLButtonElement)
    expect(onChange).not.toHaveBeenCalled()

    fireEvent.click(decrementButton as HTMLButtonElement)
    expect(onChange).not.toHaveBeenCalled()
  })

  test('renders with additional classes', () => {
    const extraClass = 'test-class'
    const { queryByTestId } = render(
      <IntegerInput {...props} className={extraClass} />
    )

    const container = queryByTestId('integer-input-container')
    expect(container?.className).toContain(extraClass)
  })
})
