import React from "react";
import { Flex, Button, IconButton, Text } from "@chakra-ui/react";
import {
  pillButtonStyle,
  stepperContainerStyle,
  stepperButtonStyle,
  stepperIconStyle,
  stepperValueStyle,
  rowLabelStyle,
} from "@/features/Sidepanel/styles";

/* ─── Pill button group ──────────────────────────────────────────── */

export interface PillGroupProps<T extends string | number> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}

export function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
}: PillGroupProps<T>) {
  return (
    <Flex flexWrap="wrap" gap="6px">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <Button
            key={String(opt.value)}
            {...pillButtonStyle(isActive)}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        );
      })}
    </Flex>
  );
}

/* ─── Stepper ────────────────────────────────────────────────────── */

export interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}

export function Stepper({ value, min, max, step = 1, onChange }: StepperProps) {
  return (
    <Flex {...stepperContainerStyle}>
      <IconButton
        aria-label="Decrease"
        icon={<Text {...stepperIconStyle}>−</Text>}
        {...stepperButtonStyle}
        isDisabled={value <= min}
        onClick={() => onChange(Math.max(min, value - step))}
      />
      <Text {...stepperValueStyle}>{value}</Text>
      <IconButton
        aria-label="Increase"
        icon={<Text {...stepperIconStyle}>+</Text>}
        {...stepperButtonStyle}
        isDisabled={value >= max}
        onClick={() => onChange(Math.min(max, value + step))}
      />
    </Flex>
  );
}

/* ─── Row helper ─────────────────────────────────────────────────── */

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Flex align="center" gap={3}>
      <Text {...rowLabelStyle}>{label}</Text>
      {children}
    </Flex>
  );
}
