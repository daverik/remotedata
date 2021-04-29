# A TypeScript implementation of [RemoteData for Elm](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/)

This is a lightweight typescript implementation of RemoteData for Elm. This is not intended to be a 1 to 1 copy.
One key difference is that the Loading state can hold the previous state's data.

## How to use

Example using react

```
import { useState, useEffect } from 'react';
import RemoteData from "remotedata"

type User = {
  name: string
}

function App() {
  const [ state, setState ] = useState<RemoteData.State<User, string>>(RemoteData.initial())

  useEffect(() => {
    // Sets loading and uses the previous state's data
    setState(RemoteData.loadingFromPreviousState)

    setTimeout(() => {
      setState(RemoteData.success({
        name: "John"
      }))
    }, 4000);
  }, [ setState ])


  return (
    <div>
      {
        RemoteData.fold(state, {
          notAsked: () => "Initial",
          loading: (prevState) => "Loading: " + (prevState?.name ?? ""),
          success: (data) => data.name,
          error: (error) => error
        })
      }
    </div>
  );
}

export default App;
```


## Prior work

[RemoteData for Elm](https://package.elm-lang.org/packages/krisajenkins/remotedata/latest/) The original library this library is inspired by


[RemoteData](https://github.com/abraham/remotedata#readme) Lightweight TypeScript RemoteData implementation