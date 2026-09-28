import { Fragment } from 'react'

// Renders copy text: *text* becomes bold, and any "[ placeholder ]" that still needs
// a real value is highlighted.
export function Text({ children }: { children: string }) {
  const parts = children.split(/(\[[^\]]+\]|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <mark key={i} className="placeholder" title="Placeholder — content still to be provided">
              {part}
            </mark>
          )
        }
        if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
          return <strong key={i}>{part.slice(1, -1)}</strong>
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
