import { VStack, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Flex } from "@chakra-ui/react";
import { useBillOfMaterials } from "../hooks/useBillOfMaterials";
import {
  tableContainerStyle,
  tableStyle,
  tableSxBorderColor,
  tableTheadStyle,
  tableThStyle,
  tableTdStyle,
  tableCellPrimaryStyle,
  tableCellSecondaryStyle,
  tableCellPriceStyle,
  tableCellPriceSubStyle,
  priceTotalLabelStyle,
  priceTotalValueStyle,
  priceBoxStyle,
} from "@/features/Sidepanel/styles";

export function Step3() {
  const bom = useBillOfMaterials();

  return (
    <VStack align="stretch" spacing={4} flex={1}>
      <TableContainer {...tableContainerStyle}>
        <Table {...tableStyle} sx={tableSxBorderColor}>
          <Thead {...tableTheadStyle}>
            <Tr>
              <Th {...tableThStyle}>Component</Th>
              <Th {...tableThStyle} isNumeric>Qty</Th>
              <Th {...tableThStyle} isNumeric>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bom.items.map((item) => (
              <Tr key={item.partId}>
                <Td {...tableTdStyle} whiteSpace="normal">
                  <Text {...tableCellPrimaryStyle}>{item.name}</Text>
                  {item.code && (
                    <Text {...tableCellSecondaryStyle}>{item.code}</Text>
                  )}
                </Td>
                <Td {...tableTdStyle} isNumeric fontSize="13px" color="black">{item.quantity}</Td>
                <Td {...tableTdStyle} isNumeric>
                  <Text {...tableCellPriceStyle}>
                    {item.totalPrice > 0 ? `€${item.totalPrice.toFixed(2)}` : "-"}
                  </Text>
                  {item.quantity > 1 && item.unitPrice > 0 && (
                    <Text {...tableCellPriceSubStyle}>({item.quantity} × €{item.unitPrice.toFixed(2)})</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="space-between" align="center" mt={4} {...priceBoxStyle} bg="red.50" borderColor="red.200">
        <Text {...priceTotalLabelStyle}>Total</Text>
        <Text {...priceTotalValueStyle}>€{bom.totalPrice.toFixed(2)}</Text>
      </Flex>

    </VStack>
  );
}

