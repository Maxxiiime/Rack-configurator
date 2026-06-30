import { VStack, Box, Text, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex } from "@chakra-ui/react";
import { useBillOfMaterials } from "../hooks/useBillOfMaterials";

interface Step3Props {
  onBack?: () => void;
}

export function Step3({ onBack }: Step3Props) {
  const bom = useBillOfMaterials();

  return (
    <VStack align="stretch" spacing={4} flex={1}>
      <TableContainer border="1px solid" borderColor="gray.100" borderRadius="md">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th px={2} py={3} fontSize="12px">Component</Th>
              <Th px={2} py={3} fontSize="12px" isNumeric>Qty</Th>
              <Th px={2} py={3} fontSize="12px" isNumeric>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bom.items.map((item) => (
              <Tr key={item.partId}>
                <Td px={2} py={3} whiteSpace="normal">
                  <Text fontWeight="500" fontSize="13px">{item.name}</Text>
                  {item.code && (
                    <Text color="gray.500" fontSize="11px">{item.code}</Text>
                  )}
                </Td>
                <Td px={2} py={3} isNumeric fontSize="13px">{item.quantity}</Td>
                <Td px={2} py={3} isNumeric>
                  <Text fontWeight="600" fontSize="13px">
                    {item.totalPrice > 0 ? `€${item.totalPrice.toFixed(2)}` : "-"}
                  </Text>
                  {item.quantity > 1 && item.unitPrice > 0 && (
                    <Text color="gray.500" fontSize="11px" fontWeight="normal">({item.quantity} × €{item.unitPrice.toFixed(2)})</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="space-between" align="center" mt={4} p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
        <Text fontSize="15px" fontWeight="bold">Total</Text>
        <Text fontSize="18px" fontWeight="bold" color="blue.600">€{bom.totalPrice.toFixed(2)}</Text>
      </Flex>

      <Box pt={5} borderTop="1px solid" borderColor="rgba(0,0,0,0.08)">
        <Button
          w="full"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          fontSize="14px"
          fontWeight={600}
          color="gray.700"
          borderRadius="lg"
          _hover={{ bg: "gray.50", borderColor: "gray.300" }}
          _active={{ bg: "gray.100" }}
          onClick={onBack}
        >
          Back
        </Button>
      </Box>
    </VStack>
  );
}
