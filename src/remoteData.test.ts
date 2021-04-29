import {
  describe,
  it,
} from "mocha"
import {
  expect
} from "chai"
import * as RemoteData from "./remoteData"

describe('Async data', function () {
  it('It checks for loading states', function () {
    const oneLoading = [ RemoteData.loading({}), RemoteData.initial() ]
    const noLoading = [ RemoteData.error({}), RemoteData.initial() ]

    expect(RemoteData.anyLoading(...oneLoading)).equal(true)
    expect(RemoteData.anyLoading(...noLoading)).equal(false)
  })

  it('It gets data or null', function () {
    const withData = RemoteData.success(10)
    const loadingData = RemoteData.loading(15)
    const initial = RemoteData.initial()
    const error = RemoteData.error("Error")

    expect(RemoteData.unwrap(withData)).equal(10)
    expect(RemoteData.unwrap(loadingData)).equal(15)
    expect(RemoteData.unwrap(initial)).equal(null)
    expect(RemoteData.unwrap(error)).equal(null)
  })

  it('It gets error or null', function () {
    const withData = RemoteData.success(10)
    const loadingData = RemoteData.loading(15)
    const initial = RemoteData.initial()
    const error = RemoteData.error("Error")

    expect(RemoteData.unwrapError(withData)).equal(null)
    expect(RemoteData.unwrapError(loadingData)).equal(null)
    expect(RemoteData.unwrapError(initial)).equal(null)
    expect(RemoteData.unwrapError(error)).equal("Error")
  })

  it('Maps data', function() {
    const withData = RemoteData.success(10)

    const mapped = RemoteData.fmap(withData, (data) => {
      return (data ?? 0) + 10
    })

    expect(RemoteData.unwrap(mapped)).equal(20)

    const withError = RemoteData.error(30)

    const mapped2 = RemoteData.fmap(withError, (data) => {
      return 20
    })

    expect(RemoteData.unwrapError(mapped2)).equal(30)
  })

  it('Maps error', function() {
    const withError = RemoteData.error("An error occurred")

    const mapped2 = RemoteData.fmapError(withError, (error) => {
      return `${error}: Error unknown`
    })

    expect(RemoteData.unwrapError(mapped2)).equal("An error occurred: Error unknown")
  })

  it('It folds', function() {
    const stateInitial = RemoteData.initial()
    const stateLoading = RemoteData.loading<string>()
    const stateSuccess = RemoteData.success("Success")
    const stateError = RemoteData.error("Error")

    expect(testFold(stateInitial)).equal("Initial")
    expect(testFold(stateLoading)).equal("Loading")
    expect(testFold(stateSuccess)).equal("Success")
    expect(testFold(stateError)).equal("Error")

  })
})


const testFold = (state: RemoteData.State<string, string>) => {
  return RemoteData.fold(state, {
    initial: () => "Initial",
    loading: () => "Loading",
    success: (data) => data,
    error: (error) => error
  })
}