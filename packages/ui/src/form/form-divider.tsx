import { Container } from "../layout";
import { Bold } from "../text";

export function FormDivider({ label }: { label: string }) {
  return (
    <Container alignItems="center" justifyContent="center" position="relative">
      <Container
        height={1}
        backgroundColor="Primary/700"
        position="absolute"
        left={0}
        right={0}
      />
      <Container px={10} backgroundColor="Bg Color">
        <Bold color="Primary/50" fontSize={14}>
          {label}
        </Bold>
      </Container>
    </Container>
  );
}
