import React from "react";
import { Box, Flex, Text, Collapse } from "@chakra-ui/react";
import { sectionLabelStyle } from "../styles";

/* ── Collapsible section header ────────────────────────────────────── */

export interface CollapsibleMenuProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  withTopBorder?: boolean;
  accentColor?: string;
}

export function CollapsibleMenu({
  label,
  isOpen,
  onToggle,
  children,
  withTopBorder = false,
  accentColor,
}: CollapsibleMenuProps) {
  return (
    <Box
      borderTop={withTopBorder ? "1px solid" : undefined}
      borderColor={withTopBorder ? "rgba(0,0,0,0.08)" : undefined}
      pt={withTopBorder ? 4 : 0}
    >
      {/* Header row */}
      <Flex
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={onToggle}
        mb={isOpen ? 3 : 0}
        py={1}
        px={1}
        borderRadius="sm"
        _hover={{ bg: "gray.50" }}
        transition="background 0.15s ease"
        userSelect="none"
      >
        <Flex align="center" gap={2}>
          {accentColor && (
            <Box w="6px" h="6px" borderRadius="full" bg={accentColor} flexShrink={0} />
          )}
          <Text {...sectionLabelStyle} mb={0}>
            {label}
          </Text>
        </Flex>

        {/* Chevron icon */}
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="18px"
          h="18px"
          borderRadius="full"
          bg="gray.100"
          transition="transform 0.2s ease"
          transform={isOpen ? "rotate(0deg)" : "rotate(-90deg)"}
          flexShrink={0}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="#718096"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>
      </Flex>

      {/* Collapsible content */}
      <Collapse in={isOpen} animateOpacity>
        <Box pb={2}>{children}</Box>
      </Collapse>
    </Box>
  );
}
