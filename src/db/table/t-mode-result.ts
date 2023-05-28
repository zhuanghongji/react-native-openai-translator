import { TranslatorMode } from '../../preferences/options'
import { QueryKey } from '../../query/keys'
import { getNextPageParamForT } from '../../query/utils'
import { dbExecuteSql } from '../manager'
import { DBTableName } from '../table-names'
import { TModeResult, TModeResultBasic, TPageParams, TResultBase } from '../types'
import {
  dbExecuteSelectPageable,
  dbGenDeleteExecution,
  dbGenDeleteWhereExecution,
  dbGenInsertExecution,
  dbGenSelectExecution,
  dbGenSelectWhereExecution,
  dbGenUpdateWhereExecution,
} from '../utils'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

const TABLE_NAME = DBTableName.modeResult

// insert

export function dbInsertModeResult(target: Omit<TModeResult, keyof TResultBase>) {
  return dbExecuteSql<TModeResult>(dbGenInsertExecution(TABLE_NAME, target))
}

// update

export function dbUpdateModeResultValuesOfId(id: number, values: Partial<TModeResultBasic>) {
  return dbExecuteSql<TModeResult>(dbGenUpdateWhereExecution(TABLE_NAME, values, { id }))
}

export function dbUpdateModeResultCollectedOfId(id: number, toCollected: boolean) {
  return dbExecuteSql<TModeResult>(
    dbGenUpdateWhereExecution(TABLE_NAME, { collected: toCollected ? '1' : '0' }, { id })
  )
}

// select

export function dbSelectModeResult() {
  return dbExecuteSql<TModeResult>(dbGenSelectExecution(TABLE_NAME))
}

export function dbSelectModeResultWhereModeAndType(mode: TranslatorMode, type: string) {
  return dbExecuteSql<TModeResult>(dbGenSelectWhereExecution(TABLE_NAME, { mode, type }))
}

export function dbSelectModeResultPageableWhere(
  params: TPageParams,
  conditions: Partial<TModeResultBasic>
) {
  return dbExecuteSelectPageable<TModeResult>(TABLE_NAME, params, conditions)
}

// find

export async function dbFindModeResultWhere(
  target: Pick<TModeResult, 'mode' | 'target_lang' | 'user_content' | 'type'>
): Promise<TModeResult | null> {
  try {
    const result = await dbExecuteSql<TModeResult>(dbGenSelectWhereExecution(TABLE_NAME, target))
    if (result.rows._array.length === 0) {
      return null
    }
    return result.rows._array[0]
  } catch (e) {
    return Promise.reject(e)
  }
}

// delete

export function dbDeleteModeResultOfId(id: number) {
  return dbExecuteSql<TModeResult>(dbGenDeleteWhereExecution(TABLE_NAME, { id }))
}

export function dbDeleteAllModeResult() {
  return dbExecuteSql<TModeResult>(dbGenDeleteExecution(TABLE_NAME))
}

// query

export function useQueryFindModeResultWhere(
  target: Pick<TModeResult, 'mode' | 'target_lang' | 'user_content' | 'type'>
) {
  return useQuery({
    queryFn: () => dbFindModeResultWhere(target),
    queryKey: [QueryKey.findModeResultWhere, target],
    enabled: target.user_content ? true : false,
  })
}

export function useInfiniteQueryModeResultPageableWhere(
  conditions: Partial<TModeResultBasic>,
  pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: [QueryKey.modeResult, 'infinite', conditions, pageSize],
    queryFn: ({ pageParam }) => {
      return dbSelectModeResultPageableWhere(
        {
          nextCursor: pageParam ?? null,
          pageSize,
        },
        conditions
      )
    },
    getNextPageParam: getNextPageParamForT,
  })
}
