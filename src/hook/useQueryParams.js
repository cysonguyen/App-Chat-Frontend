import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export function useQueryParams() {
    const [searchParams, setSearchParams] = useSearchParams()

    const getParam = useCallback(
        (key, defaultValue = null) => {
            const value = searchParams.get(key)
            return value === null ? defaultValue : value
        },
        [searchParams]
    )

    const getList = useCallback(
        (key) => searchParams.getAll(key),
        [searchParams]
    )

    const getParams = useMemo(() => {
        const result = {}
        for (const [key, value] of searchParams.entries()) {
            if (result[key]) {
                result[key] = Array.isArray(result[key])
                    ? [...result[key], value]
                    : [result[key], value]
            } else {
                result[key] = value
            }
        }
        return result
    }, [searchParams])

    const setParam = useCallback(
        (key, value, options = {}) => {
            const { replace = false, append = false, removeOnEmpty = true } = options
            const next = new URLSearchParams(searchParams)

            const shouldRemove =
                value === null || value === undefined || (removeOnEmpty && value === "")

            if (shouldRemove) {
                next.delete(key)
            } else if (append) {
                next.append(key, String(value))
            } else {
                next.set(key, String(value))
            }

            setSearchParams(next, { replace })
        },
        [searchParams, setSearchParams]
    )

    const setParams = useCallback(
        (params, options = {}) => {
            const { replace = false, mode = "merge", removeOnEmpty = true } = options
            const next = mode === "replace" ? new URLSearchParams() : new URLSearchParams(searchParams)

            Object.entries(params || {}).forEach(([key, value]) => {
                const shouldRemove =
                    value === null || value === undefined || (removeOnEmpty && value === "")

                if (shouldRemove) {
                    next.delete(key)
                    return
                }

                if (Array.isArray(value)) {
                    next.delete(key)
                    value.forEach((item) => {
                        if (item === null || item === undefined) return
                        next.append(key, String(item))
                    })
                    return
                }

                next.set(key, String(value))
            })

            setSearchParams(next, { replace })
        },
        [searchParams, setSearchParams]
    )

    const deleteParam = useCallback(
        (key, options = {}) => {
            const { replace = false } = options
            const next = new URLSearchParams(searchParams)
            next.delete(key)
            setSearchParams(next, { replace })
        },
        [searchParams, setSearchParams]
    )

    const deleteParams = useCallback(
        (keys, options = {}) => {
            const { replace = false } = options
            const next = new URLSearchParams(searchParams)
            ;(keys || []).forEach((key) => next.delete(key))
            setSearchParams(next, { replace })
        },
        [searchParams, setSearchParams]
    )

    return {
        searchParams,
        getParam,
        getList,
        getParams,
        setParam,
        setParams,
        deleteParam,
        deleteParams,
    }
}
