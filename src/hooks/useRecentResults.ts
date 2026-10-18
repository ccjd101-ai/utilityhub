import { useCallback, useEffect, useState } from 'react'

const DEFAULT_MAX_ITEMS = 10

export interface RecentResult<T> {
  id: string
  createdAt: string
  data: T
}

interface UseRecentResultsOptions {
  storageKey: string
  maxItems?: number
}

interface UseRecentResultsReturn<T> {
  items: RecentResult<T>[]
  add: (data: T) => void
  remove: (id: string) => void
  clear: () => void
}

function readStoredResults<T>(
  storageKey: string,
  maxItems: number,
): RecentResult<T>[] {
  try {
    const stored = localStorage.getItem(storageKey)

    if (!stored) {
      return []
    }

    const parsed: unknown = JSON.parse(stored)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (item): item is RecentResult<T> =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.createdAt === 'string' &&
          'data' in item,
      )
      .slice(0, maxItems)
  } catch {
    return []
  }
}

export function useRecentResults<T>({
  storageKey,
  maxItems = DEFAULT_MAX_ITEMS,
}: UseRecentResultsOptions): UseRecentResultsReturn<T> {
  const [items, setItems] = useState<RecentResult<T>[]>(() =>
    readStoredResults<T>(storageKey, maxItems),
  )

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch {
      // Persistence is best-effort. Keep in-memory results available.
    }
  }, [items, storageKey])

  const add = useCallback(
    (data: T) => {
      const item: RecentResult<T> = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        data,
      }

      setItems((current) => [item, ...current].slice(0, maxItems))
    },
    [maxItems],
  )

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    add,
    remove,
    clear,
  }
}