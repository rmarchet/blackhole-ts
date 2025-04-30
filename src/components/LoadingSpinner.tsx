import '../styles/LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: number
  color?: string
  thickness?: number
}

export const LoadingSpinner = ({ 
  size = 60, 
  color = '#ffffff', 
  thickness = 4 
}: LoadingSpinnerProps) => {
  const inlineStyles = {
    width: size,
    height: size,
    border: `${thickness}px solid rgba(255, 255, 255, 0.1)`,
    borderLeftColor: color,
    animation: 'spin 1s linear infinite',
    marginTop: -(size / 2),
  }
  return (
    <div style={inlineStyles} className='loading-spinner' />
  )
}
