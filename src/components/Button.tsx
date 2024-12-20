import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface ButtonProps {
  to?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  customProp?: string | number;
}

const Button: React.FC<ButtonProps> = ({
  to,
  children,
  type,
  disabled,
  onClick,
  customProp,
}) => {
  if (to) {
    return (
      <StyledLink to={to} disabled={disabled} state={{ customProp }}>
        {children}
      </StyledLink>
    );
  }
  return (
    <StyledButton type={type} disabled={disabled} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.disabled ? "#d1d5db" : "#ff5733")};
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#d1d5db" : "#c4452f"}; /* Darker coral */
  }
`;

const StyledLink = styled(Link)<{ disabled?: boolean; $customProp?: string }>`
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.disabled ? "#d1d5db" : "#ff5733"}; /* Coral red */
  color: white;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.3s ease;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#d1d5db" : "#c4452f"}; /* Darker coral */
  }
`;
