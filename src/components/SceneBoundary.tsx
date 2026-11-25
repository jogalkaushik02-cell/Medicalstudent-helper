import { Component, type ReactNode } from 'react'
import { Box, TriangleAlert } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  failed: boolean
}

/**
 * Catches WebGL/context failures so a phone without a usable 3D context still
 * gets the structure rail, labels and detail panel instead of a blank app.
 */
export default class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="scene-fallback" role="alert">
          <Box size={22} />
          <div>
            <strong>
              <TriangleAlert size={13} style={{ marginRight: 5, verticalAlign: -2 }} />
              3D view unavailable
            </strong>
            <p>
              This browser could not start WebGL. Every structure is still available from the rail
              and the detail panel, and the rest of the atlas works normally.
            </p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
