import {
    Box, Switch, Title, useMantineColorScheme,
} from '@mantine/core';
import { IconMoon } from '@tabler/icons-react';

export default function ColorSchemeSwitch() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    const isDark = colorScheme === 'dark';

    const onChange = (event) => {
        setColorScheme(event.currentTarget.checked ? 'dark' : 'light');
    };

    return (
        <Box
            px="xs"
            py="md"
            className="flex flex-row items-center :hover:opacity-80 cursor-pointer"
        >
            <Box
                mr="sm"
                p={0}
            >
                <IconMoon
                    size={24}
                />
            </Box>
            <Title
                size="h3"
            >
                Dark Mode
            </Title>
            <Switch
                ml="auto"
                checked={isDark}
                onChange={onChange}
                size="lg"
                color="lime"
            />
        </Box>
    );
}
