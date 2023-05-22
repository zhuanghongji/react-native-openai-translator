import { TPageData } from '../../db/types'
import { useOnRefresh } from '../../hooks'
import { EmptyView } from '../EmptyView'
import { ErrorView } from '../ErrorView'
import { InfiniteQueryFooterView } from './InfiniteQueryFooterView'
import { InfiniteQueryFooterType } from './types'
import { getInfiniteQueryFooterType } from './utils'
import { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import { RefreshControl, StyleProp, View, ViewStyle } from 'react-native'

type EmptyType<T> = T | null | undefined

export type InfiniteQueryListContainerProps<ItemT, DataT = InfiniteData<TPageData<ItemT>>> = {
  style?: StyleProp<ViewStyle>
  result: UseInfiniteQueryResult<TPageData<ItemT>, unknown>
  plainContent?: boolean
  renderLoadingView?: () => React.ReactNode
  renderEmptyView?: (data: EmptyType<DataT>) => React.ReactNode
  renderErrorView?: (error: unknown) => React.ReactNode
  renderFooterView?: (options: {
    isEmpty: boolean
    footerType: InfiniteQueryFooterType
    onFetchNextPage: () => void
  }) => React.ReactElement | null | undefined
  renderContent: (options: {
    items: ItemT[]
    refreshControl: React.ReactElement | undefined
    footerView: React.ReactElement | null | undefined
    onEndReached: () => void
  }) => React.ReactNode
}

function _InfiniteQueryListContainer<ItemT>(props: InfiniteQueryListContainerProps<ItemT>) {
  const {
    style,
    result,
    plainContent = false,
    renderLoadingView,
    renderEmptyView,
    renderErrorView,
    renderFooterView,
    renderContent,
  } = props

  const {
    isSuccess,
    isFetching,
    isFetchingNextPage,
    data: _data,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = result

  const { refreshing, onRefresh } = useOnRefresh(refetch)
  const refreshControl = <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />

  const items = useMemo<ItemT[]>(() => {
    if (!_data) {
      return []
    }
    return _data.pages.reduce((prev, current) => prev.concat(current.items), [] as ItemT[])
  }, [_data])
  const onFetchNextPage = () => {
    if (!hasNextPage || isFetching || isFetchingNextPage) {
      return
    }
    fetchNextPage()
  }

  const isEmpty = isSuccess && !isFetching && !isFetchingNextPage && items.length === 0
  const footerType = getInfiniteQueryFooterType(isEmpty, result)
  const footerView = renderFooterView ? (
    renderFooterView({
      isEmpty,
      footerType,
      onFetchNextPage,
    })
  ) : (
    <InfiniteQueryFooterView
      type={footerType}
      onMorePress={onFetchNextPage}
      onErrorPress={onFetchNextPage}
    />
  )

  const renderLoading = (): React.ReactNode => {
    return renderLoadingView ? renderLoadingView() : null
  }

  const renderEmpty = (
    data: InfiniteData<TPageData<ItemT>> | null | undefined
  ): React.ReactNode => {
    return renderEmptyView ? renderEmptyView(data) : <EmptyView />
  }

  const renderError = (error: unknown): React.ReactNode => {
    return renderErrorView ? renderErrorView(error) : <ErrorView />
  }

  const { status, data, error } = result
  if (status === 'loading') {
    return <View style={style}>{renderLoading()}</View>
  }
  if (status === 'error') {
    return <View style={style}>{renderError(error)}</View>
  }
  // success
  if (data === null || data === undefined || isEmpty) {
    return <View style={style}>{renderEmpty(data)}</View>
  }
  const content = renderContent({
    items,
    refreshControl,
    footerView,
    onEndReached: onFetchNextPage,
  })
  if (plainContent) {
    return <>{content}</>
  }
  return <View style={style}>{content}</View>
}

export const InfiniteQueryListContainer = React.memo(_InfiniteQueryListContainer) as <T>(
  props: InfiniteQueryListContainerProps<T>
) => ReturnType<typeof _InfiniteQueryListContainer>
