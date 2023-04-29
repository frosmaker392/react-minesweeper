import React from 'react'

import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import classes from './Clickable.module.css'
import Button from './Button'

describe('Button componennt', () => {
  test('renders correctly', () => {
    const child = 'text content'
    const { queryByTestId } = render(<Button>{child}</Button>)

    const button = queryByTestId('button')

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(child)
    expect(button?.className).toContain(classes.clickable)
  })

  test('renders with additional classes', () => {
    const extraClass = 'test-class'
    const { queryByTestId } = render(<Button className={extraClass} />)

    const button = queryByTestId('button')

    expect(button?.className).toContain(classes.clickable)
    expect(button?.className).toContain(extraClass)
  })
})
