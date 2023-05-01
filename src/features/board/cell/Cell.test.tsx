import React, { type ComponentProps } from 'react'

import { fireEvent, render } from '@testing-library/react'
import { describe, expect, test, vitest } from 'vitest'
import Cell from './Cell'
import type { Corner, HiddenCell, RevealedCell } from './types'

import classes from './Cell.module.css'

type Props = ComponentProps<typeof Cell>

const hiddenCell: HiddenCell = {
  state: 'hidden',
  hasMine: false,
  markedAs: 'none',
  roundedCorners: [],
}

const revealedCell: RevealedCell = {
  state: 'revealed',
  hasMine: false,
  neighboringMines: 4,
}

describe('Cell component', () => {
  const restOfProps: Omit<Props, 'cell'> = {
    revealMine: false,
    fontSize: 12,
    onLeftClick: () => {},
    onRightClick: () => {},
  }

  describe('renders a hidden cell', () => {
    test('without any markings', () => {
      const { queryByTestId } = render(
        <Cell cell={hiddenCell} {...restOfProps} />
      )

      const lower = queryByTestId('cell-lower')
      const upper = queryByTestId('cell-upper')

      expect(lower).toBeInTheDocument()
      expect(lower).toBeEmptyDOMElement()

      expect(upper).toBeInTheDocument()
      expect(upper).toBeEmptyDOMElement()
    })

    test('with flag icon', () => {
      const { queryByTestId } = render(
        <Cell cell={{ ...hiddenCell, markedAs: 'flagged' }} {...restOfProps} />
      )

      const flagIcon = queryByTestId('flag-icon')

      expect(flagIcon).toBeInTheDocument()
    })

    test('with question mark', () => {
      const { queryByTestId } = render(
        <Cell cell={{ ...hiddenCell, markedAs: 'unknown' }} {...restOfProps} />
      )

      const questionMark = queryByTestId('question-mark')

      expect(questionMark).toBeInTheDocument()
    })

    describe('with revealMine true', () => {
      const propsWithRevealMine = { ...restOfProps, revealMine: true }

      test('shows mine icon if cell has mine', () => {
        const { queryByTestId } = render(
          <Cell
            cell={{ ...hiddenCell, hasMine: true }}
            {...propsWithRevealMine}
          />
        )

        const mineIcon = queryByTestId('mine-icon')

        expect(mineIcon).toBeInTheDocument()
      })

      test("doesn't show mine icon otherwise", () => {
        const { queryByTestId } = render(
          <Cell cell={hiddenCell} {...propsWithRevealMine} />
        )

        const mineIcon = queryByTestId('mine-icon')

        expect(mineIcon).not.toBeInTheDocument()
      })
    })
  })

  describe('renders a revealed cell', () => {
    test('with neighboring mine count', () => {
      const { queryByTestId } = render(
        <Cell cell={revealedCell} {...restOfProps} />
      )

      const upper = queryByTestId('cell-upper')
      const lower = queryByTestId('cell-lower')

      expect(upper).not.toBeInTheDocument()
      expect(lower).toBeInTheDocument()

      expect(lower).toHaveTextContent(revealedCell.neighboringMines.toString())
    })

    test('without neighboring mine count if count is zero', () => {
      const { queryByTestId } = render(
        <Cell
          cell={{ ...revealedCell, neighboringMines: 0 }}
          {...restOfProps}
        />
      )

      const lower = queryByTestId('cell-lower')

      expect(lower).toBeEmptyDOMElement()
    })

    describe('with revealMine true', () => {
      const propsWithRevealMine = { ...restOfProps, revealMine: true }

      test('shows mine icon if cell has mine', () => {
        const { queryByTestId } = render(
          <Cell
            cell={{ ...revealedCell, hasMine: true }}
            {...propsWithRevealMine}
          />
        )

        const mineIcon = queryByTestId('mine-icon')

        expect(mineIcon).toBeInTheDocument()
      })

      test("doesn't show mine icon otherwise", () => {
        const { queryByTestId } = render(
          <Cell cell={revealedCell} {...propsWithRevealMine} />
        )

        const mineIcon = queryByTestId('mine-icon')

        expect(mineIcon).not.toBeInTheDocument()
      })
    })
  })

  test('callbacks work', () => {
    const onLeftClick = vitest.fn()
    const onRightClick = vitest.fn()

    const { queryByTestId } = render(
      <Cell
        cell={hiddenCell}
        {...restOfProps}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
      />
    )

    const cellContainer = queryByTestId('cell-container')

    expect(cellContainer).toBeInTheDocument()

    fireEvent.click(cellContainer as HTMLDivElement)
    expect(onLeftClick).toHaveBeenCalledOnce()
    expect(onRightClick).not.toHaveBeenCalledOnce()

    vitest.resetAllMocks()

    fireEvent.contextMenu(cellContainer as HTMLDivElement)
    expect(onLeftClick).not.toHaveBeenCalledOnce()
    expect(onRightClick).toHaveBeenCalledOnce()
  })

  test('renders with correct corner classes', () => {
    const roundedCorners: Corner[] = ['bottomLeft', 'bottomRight']
    const { queryByTestId } = render(
      <Cell cell={{ ...hiddenCell, roundedCorners }} {...restOfProps} />
    )

    const upper = queryByTestId('cell-upper')

    for (const roundedCorner of roundedCorners) {
      expect(upper?.className).toContain(classes[roundedCorner])
    }
  })
})
