import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check, CircleAlert } from 'lucide-react'
import type { ActionFeedbackState } from '../../hooks/useActionFeedback'

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  feedbackState?: ActionFeedbackState
  successLabel?: string
  errorLabel?: string
  variant?: 'primary' | 'secondary'
}

function ActionButton({
  children,
  feedbackState = 'idle',
  successLabel = 'Done!',
  errorLabel = 'Failed',
  variant = 'secondary',
  className = '',
  disabled,
  ...props
}: ActionButtonProps) {
  const feedbackContent = {
    idle: children,
    success: (
      <>
        <Check size={16} aria-hidden="true" />
        {successLabel}
      </>
    ),
    error: (
      <>
        <CircleAlert size={16} aria-hidden="true" />
        {errorLabel}
      </>
    ),
  }

  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      disabled={disabled}
      className={[
        'action-button',
        `action-button-${variant}`,
        `action-button-${feedbackState}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-live="polite"
    >
      <span className="action-button-content">
        {feedbackContent[feedbackState]}
      </span>
    </button>
  )
}

export default ActionButton