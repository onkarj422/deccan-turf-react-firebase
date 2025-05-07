import { Box, Title } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { JSX } from 'react';

interface ListItemProps {
    leftIcon?: JSX.ElementType;
    title: string;
    to: string;
}

export default function ListItem({ title, leftIcon: LeftIcon, to }: ListItemProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate({ to });
    };

    return (
        <Box
            px="xs"
            py="md"
            className="flex flex-row items-center :hover:opacity-80 cursor-pointer"
            onClick={handleClick}
        >
            {LeftIcon && (
                <Box
                    mr="sm"
                    p={0}
                >
                    <LeftIcon
                        size={24}
                    />
                </Box>
            )}
            <Title
                size="h3"
            >
                {title}
            </Title>
        </Box>
    );
}

ListItem.defaultProps = {
    leftIcon: undefined,
};
