import '../styles/LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: number
  color?: string
  thickness?: number
}

export const LoadingSpinner = ({ 
  size = 60, 
  color = 'var(--accent-color)', 
  thickness = 6, 
}: LoadingSpinnerProps) => {
  const inlineStyles = {
    width: size,
    height: size,
    borderWidth: `${thickness}px`,
    borderLeftColor: color,
    marginTop: -(size / 2),
  }
  return (
    <div style={inlineStyles} className='loading-spinner' />
  )
}
