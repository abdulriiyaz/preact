import { useState, useEffect, useMemo } from 'preact/hooks'
import { listenKeys } from 'nanostores'

export function useStore(store, opts = {}) {
  let [, forceRender] = useState({})
  let [valueBeforeEffect, setValueBeforeEffect] = useState(store.get())

  useEffect(() => {
    setValueBeforeEffect(store.get())
  }, [])

  useEffect(() => {
    let batching, timer, unlisten
    let rerender = () => {
      if (!batching) {
        batching = 1
        timer = setTimeout(() => {
          batching = undefined
          forceRender({})
        })
      }
    }
    if (opts.keys) {
      unlisten = listenKeys(store, opts.keys, rerender)
    } else {
      unlisten = store.listen(rerender)
    }
    return () => {
      unlisten()
      clearTimeout(timer)
    }
  }, [store, '' + opts.keys])

  return useMemo(() => store.get(), [store, valueBeforeEffect])
}
