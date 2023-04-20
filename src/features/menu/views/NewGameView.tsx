import React from 'react'
import { pipe } from 'fp-ts/lib/function'
import * as S from 'fp-ts/lib/string'
import type { BoardParams } from '../../board/types'

import MenuButton from '../../../components/atoms/MenuButton'
import IntegerField from '../../../components/molecules/IntegerField'
import SelectField from '../../../components/molecules/SelectField'
import { type Difficulty, difficultyList } from '../types'

interface Props {
  setupDifficulty: Difficulty
  setupParams: BoardParams
  onChangeDifficulty: (difficulty: Difficulty) => void
  onChangeBoardParams: (boardParams: BoardParams) => void
  onSubmit: (boardParams: BoardParams) => void
  onReturn: () => void
}

const capitalize = (string: string) =>
  pipe(
    string,
    S.split(''),
    ([firstChar, ...rest]) => [S.toUpperCase(firstChar), ...rest],
    (arr) => arr.join('')
  )

const NewGameView: React.FC<Props> = ({
  setupDifficulty,
  setupParams,
  onChangeDifficulty,
  onChangeBoardParams,
  onSubmit,
  onReturn,
}) => {
  const { width, height, mineCount } = setupParams

  const onInputChange = (key: keyof BoardParams) => (value: number) => {
    onChangeBoardParams({ ...setupParams, [key]: value })
  }

  const renderOption = (difficulty: Difficulty) => (
    <option key={difficulty} value={difficulty}>
      {capitalize(difficulty)}
    </option>
  )

  return (
    <form
      className="menu-view new-game"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ width, height, mineCount })
      }}
    >
      <SelectField<Difficulty>
        id="difficulty-select"
        value={setupDifficulty}
        options={[...difficultyList]}
        onOptionChange={onChangeDifficulty}
        renderOption={renderOption}
      >
        Difficulty
      </SelectField>

      <IntegerField
        id="width"
        range={[5, 30]}
        value={width}
        onChange={onInputChange('width')}
      >
        Width
      </IntegerField>

      <IntegerField
        id="height"
        range={[5, 30]}
        value={height}
        onChange={onInputChange('height')}
      >
        Height
      </IntegerField>

      <IntegerField
        id="mineCount"
        range={[0, Math.floor((width * height) / 2)]}
        value={mineCount}
        onChange={onInputChange('mineCount')}
      >
        Mines
      </IntegerField>

      <MenuButton className="highlight" type="submit" name="submit">
        Generate
      </MenuButton>

      <MenuButton name="cancel" onClick={onReturn}>
        Back
      </MenuButton>
    </form>
  )
}

export default NewGameView
