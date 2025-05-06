import { ActionIcon, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconMoon, IconMoonFilled } from '@tabler/icons-react';

export default function ColorSchemeSwitch() {
    const theme = useMantineTheme();
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    return (
        <ActionIcon
            variant="subtle"
            size="xl"
            ml="auto"
            onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
        >
            {colorScheme === 'dark' ? (
                <IconMoonFilled
                    color={theme.colors.lime[6]}
                    size={32}
                />
            ) : (
                <IconMoon
                    color={theme.colors.lime[6]}
                    size={32}
                />
            )}
        </ActionIcon>
    );
}
