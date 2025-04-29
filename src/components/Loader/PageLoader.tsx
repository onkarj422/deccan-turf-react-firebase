import { Group, Loader } from "@mantine/core";

export default function PageLoader() {
    return (
        <Group
            align="center"
            justify="center"
            w="100%"
            h="100%"
            flex="1"
        >
            <Loader size="lg" color="blue" />
        </Group>
    );
}