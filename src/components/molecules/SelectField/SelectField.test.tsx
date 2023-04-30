import React from 'react'

import { describe, test, vitest } from 'vitest'
import SelectField, { type SelectFieldProps } from './SelectField'
import { fireEvent, render } from '@testing-library/react'

const testOptions = ['option-a', 'option-b', 'option-c'] as const

type TestOption = (typeof testOptions)[number]

describe('SelectField component', () => {
  test('renders correctly', () => {
    const id = 'test-id'
    const onChange = vitest.fn()
    const props: SelectFieldProps<TestOption> = {
      id,
      value: 'option-a',
      options: testOptions,
      onChange,
      renderOption: (value) => (
        <option key={value} data-testid="select-field-option">
          {value}
        </option>
      ),
    }
    const { queryByTestId, queryAllByTestId } = render(
      <SelectField<TestOption> {...props} />
    )

    const label = queryByTestId('select-field-label')
    const select = queryByTestId('select')
    const options = queryAllByTestId('select-field-option')

    expect(label).toBeInTheDocument()
    expect(select).toBeInTheDocument()

    expect(label?.getAttribute('for')).toBe(id)
    expect(select?.id).toBe(id)
    expect(options.length).toBe(testOptions.length)

    for (const option of options) {
      expect(testOptions).toContain(option.textContent)
    }

    const nextOption = testOptions[1]
    fireEvent.change(select as HTMLSelectElement, {
      target: { value: nextOption },
    })

    expect(onChange).toHaveBeenLastCalledWith(nextOption)
  })
})
