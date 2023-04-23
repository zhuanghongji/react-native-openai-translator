import PagerView from 'react-native-pager-view'
import { OnPageScrollEventData } from 'react-native-pager-view/lib/typescript/PagerViewNativeComponent'
import Animated, { useEvent, useHandler } from 'react-native-reanimated'

export const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

type DependencyList = ReadonlyArray<any>

type Context = Record<string, unknown>

type Handler<T, TContext extends Context> = (event: T, context: TContext) => void

// type Event = { eventName: string } & OnPageScrollEventData
// type Event = { eventName: string; position: number; offset: number }
// type Event = { eventName: string } & OnPageScrollEventData
type Event = OnPageScrollEventData

type Handlers = {
  onPageScroll?: Handler<Event, Context>
}

export function usePageScrollHandler(handlers: Handlers, dependencies?: DependencyList) {
  const { context, doDependenciesDiffer } = useHandler<Event, Context>(handlers, dependencies)
  const subscribeForEvents = ['onPageScroll']

  return useEvent<Event>(
    event => {
      'worklet'
      const { eventName, ...data } = event as Event & { eventName: string }
      const { onPageScroll } = handlers
      if (onPageScroll && eventName.endsWith('onPageScroll')) {
        onPageScroll(data, context)
      }
    },
    subscribeForEvents,
    doDependenciesDiffer
  )
}
