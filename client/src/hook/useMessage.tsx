import { use, useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

export interface SubmitMessageStyleProps {
  $isVisible?: boolean;
  type?: 'success' | 'error';
  $time?: number;
}

// Keyframes
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(120%);
  }
`;

const submitLoading = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
`;

// Estilos base
const submitMessageBaseStyle = css<SubmitMessageStyleProps>`
  padding: 1rem 2rem;
  position: fixed;
  font-size: 1rem;
  top: 2rem;
  right: 1rem;
  z-index: 99;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${(props) => (props.$isVisible ? slideIn : slideOut)}
    ${(props) => (props.$time ? props.$time / 4 / 1000 : 0.5)}s ease forwards;
`;

const SubmitMessageDiv = styled.div<SubmitMessageStyleProps>`
  ${submitMessageBaseStyle}

  background-color: ${(props) =>
    props.type === 'success'
      ? '#28e0a9'
      : props.type === 'error'
      ? '#fe853e'
      : '#cccccc'};

  color: ${(props) =>
    props.type === 'success'
      ? '#002e26'
      : props.type === 'error'
      ? '#531f00'
      : '#333333'};

  &::before {
    content: '';
    position: absolute;
    height: 3px;
    left: 0;
    bottom: 0;
    z-index: 100;
    animation: ${submitLoading}
      ${(props) => (props.$time ? props.$time / 2 / 1000 : 2)}s ease-in-out
      forwards;
    background-color: ${(props) =>
      props.type === 'success'
        ? '#002e26'
        : props.type === 'error'
        ? '#531f00'
        : '#333333'};
  }
`;

export type SubmitMessageStatus = null | 'success' | 'error';

type SubmitMessageProps = {
  type: SubmitMessageStatus;
  successMessage?: string;
  errorMessage?: string;
  displayTime?: number;
};

const default_displayTime = 2500;

const useVisibilityTimer = (active: boolean, duration: number): boolean => {
  const [isVisible, setIsVisible] = useState(active);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  return isVisible;
};

const SubmitMessage = ({
  type,
  successMessage = 'Mensagem enviada com sucesso!',
  errorMessage = 'Erro ao enviar a mensagem. Tente novamente mais tarde.',
  displayTime = default_displayTime,
}: SubmitMessageProps) => {
  const isVisible = useVisibilityTimer(true, displayTime);
  if (type === null) return null;

  const message = type === 'success' ? successMessage : errorMessage;

  return (
    <SubmitMessageDiv
      type={type}
      $isVisible={isVisible}

      aria-live="polite"
      role="alert"
    >
      {message}
    </SubmitMessageDiv>
  );
};

const useSubmitMessage = ({
  type,
  successMessage,
  errorMessage,
  displayTime = default_displayTime,
}: SubmitMessageProps) => {
  const [visibleType, setVisibleType] = useState<SubmitMessageStatus | null>(type);

  useEffect(() => {
    setVisibleType(type);

    if (type !== null) {
      const timer = setTimeout(() => {
        setVisibleType(null);
      }, displayTime + 1000);
      return () => clearTimeout(timer);
    }
  }, [type, displayTime]);

  if (visibleType === null) return null;

  return (
    <SubmitMessage
      type={visibleType}
      successMessage={successMessage}
      errorMessage={errorMessage}
      displayTime={displayTime}
    />
  );
};

export { SubmitMessage, useSubmitMessage };
