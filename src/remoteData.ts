type Initial = {
  state: "Initial"
}

type Success<T> = {
  state: "Success"
  data: T
}

type Error<E> = {
  state: "Error"
  error: E
}

type Loading<T> = {
  state: "Loading",
  data?: T
}

/**
 * Creates a success state object
 */
export const success = <T>(data: T): Success<T> => {
  return {
    state: "Success",
    data
  }
}

/**
 * Creates an initial state object
 */
export const initial = (): Initial => {
  return {
    state: "Initial"
  }
}

/**
 * Creates a loading state object
 */
export const loading = <T>(data?: T): Loading<T> => {
  return {
    state: "Loading",
    data
  }
}

/**
 * Creates an error state object
 */
export const error = <E>(error: E): Error<E> => {
  return {
    state: "Error",
    error
  }
}

/**
 * Unwraps a state object's data if it exists, else null
 */
export const unwrap = <T, E>(rd: State<T, E>): T | null => {
  if (rd.state === "Success") {
    return rd.data
  }

  if (rd.state === "Loading") {
    return rd.data ?? null
  }

  return null
}

/**
 * Unwraps a state object's error if it exists, else null
 */
export const unwrapError = <T, E>(rd: State<T, E>): E | null => {
  if (rd.state === "Error") {
    return rd.error
  }

  return null
}

/**
 * Checks if any passed state object is loading
 */
export const anyLoading = (...asyncStates: State<any, any>[]): boolean => {
  const anyLoading = asyncStates.reduce((prev, curr) => {
      return prev || curr.state === "Loading"
    }, false)

  return anyLoading
}

export const anyError = (...asyncStates: State<any, any>[]): boolean => {
  const anyError = asyncStates.reduce((prev, curr) => {
      return prev || curr.state === "Error"
    }, false)

  return anyError
}

export const anySuccess = (...asyncStates: State<any, any>[]): boolean => {
  const anySuccess = asyncStates.reduce((prev, curr) => {
      return prev || curr.state === "Success"
    }, false)

  return anySuccess
}
/**
 * Maps the data of a state object
 */
export const fmap = <T, E, T2>(rd: State<T, E>, fn: (data?: T) => T2): State<T2, E> => {
  if (rd.state === "Initial" || rd.state === "Error") {
    return rd
  } else if (rd.state === "Loading") {
    return {
      ...rd,
      data: fn(rd.data)
    }
  } else {
    return {
      ...rd,
      data: fn(rd.data)
    }
  }
}

/**
 * Maps the error of a state object
 */
export const fmapError = <T, E, E2>(rd: State<T, E>, fn: (error?: E) => E2): State<T, E2> => {
  if (rd.state === "Error") {
    return {
      ...rd,
      error: fn(rd.error)
    }
  } else {
    return rd
  }
}

/**
 * Returns a result based on the current state
 */
export const fold = <T, E, R>(
  rd: State<T, E>,
  condition: {
    initial: () => R
    success: (data: T) => R
    error: (error: E) => R
    loading: (data?: T) => R
  }): R => {
    switch (rd.state) {
      case "Initial":
        return condition.initial()
      case "Success":
        return condition.success(rd.data)
      case "Error":
        return condition.error(rd.error)
      case "Loading":
        return condition.loading(rd.data)
    }
}

/**
 * Experimental. Expect to change
 * Like fold but with two states
 */
export const fold2 = <T1, E1, T2, E2, R>(
  state1: State<T1, E1>,
  state2: State<T2, E2>,
  condition: {
    initial: () => R
    success: (data1?: T1, data2?: T2) => R
    error: (error1?: E1, error2?: E2) => R
    loading: (data1?: T1, data2?: T2) => R
  }): R => {
    if (anyError(state1, state2)) {
      return condition.error(unwrapError(state1) ?? undefined, unwrapError(state2) ?? undefined)
    }

    if (anyLoading(state1, state2)) {
      return condition.loading(unwrap(state1) ?? undefined, unwrap(state2) ?? undefined)
    }

    if (anySuccess(state1, state2)) {
      return condition.success(unwrap(state1) ?? undefined, unwrap(state2) ?? undefined)
    }

    return condition.initial()
}

/**
 * Experimental. Expect to change
 * Like fold but with thhree states
 */
export const fold3 = <T1, E1, T2, E2, T3, E3, R>(
  state1: State<T1, E1>,
  state2: State<T2, E2>,
  state3: State<T3, E3>,
  condition: {
    initial: () => R
    success: (data1?: T1, data2?: T2, data3?: T3) => R
    error: (error1?: E1, error2?: E2, error3?: E3) => R
    loading: (data1?: T1, data2?: T2, data3?: T3) => R
  }): R => {
    if (anyError(state1, state2, state3)) {
      return condition.error(unwrapError(state1) ?? undefined, unwrapError(state2) ?? undefined, unwrapError(state3) ?? undefined)
    }

    if (anyLoading(state1, state2, state3)) {
      return condition.loading(unwrap(state1) ?? undefined, unwrap(state2) ?? undefined, unwrap(state3) ?? undefined)
    }

    if (anySuccess(state1, state2, state3)) {
      return condition.success(unwrap(state1) ?? undefined, unwrap(state2) ?? undefined, unwrap(state3) ?? undefined)
    }

    return condition.initial()
}

/**
 * Creates a loading state from a previous state object.
 * If the previous state has data it will be passed to the new loading state's data
 */
export const loadingFromPreviousState = <T, E>(prevState: State<T, E>): Loading<T> => {
  return loading(unwrap(prevState) ?? undefined)
}

export type State<T, E> = Initial | Success<T> | Error<E> | Loading<T>