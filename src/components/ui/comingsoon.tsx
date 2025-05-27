import React from 'react'
import clsx from 'clsx'

interface ComingSoonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  color?: string
  className?: string
  center?: boolean
  children?: React.ReactNode
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  size = '5xl',
  color = 'text-primary',
  className = '',
  center = true,
  children = 'Coming Soon',
}) => {
  return (
    <div
      className={clsx(
        `text-${size}`,
        color,
        { 'text-center': center },
        'font-bold',
        className
      )}
    >
      {children}
    </div>
  )
}

export default ComingSoon
