import React from 'react';
import { Box, Text, UnstyledButton } from '@mantine/core';
import './ActionCard.scss';

export default function ActionCard({ title, icon: Icon, onClick }: { title: string; icon: React.ElementType; onClick: () => void }) {
    return (
        <UnstyledButton
            className="item"
            onClick={onClick}
            p="lg"
        >
            <Box className="flex flex-col items-center justify-center text-center mx-auto my-auto">
                <Icon size="48" />
                <Text
                    size="md"
                    mt={7}
                >
                    {title}
                </Text>
            </Box>
        </UnstyledButton>
    );
}
