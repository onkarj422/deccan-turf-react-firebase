import { User } from '@/lib/firebase/firestore/users';
import { useUsersHash } from '@/store/server/users/hooks';
import {
    Box,
    Combobox, Input, InputBase, Title, useCombobox,
} from '@mantine/core';
import { useCallback, useEffect, useMemo } from 'react';

interface UserSelectProps {
    onChange: (value: User) => void;
    value: string;
}

export default function UserSelect({ onChange, value }: UserSelectProps) {
    const {
        usersByRole,
    } = useUsersHash();

    const users = useMemo(() => usersByRole.user, [usersByRole]);

    const combobox = useCombobox();

    // Memoize options for performance
    const options = useMemo(() => users?.map((user) => ({
        value: user.userId,
        label: user.name,
    })) || [], [users]);

    useEffect(() => {
        if (users && users.length > 0 && !value) {
            onChange(users[0]);
        }
    }, [users, onChange, value]);

    const selected = options.find((opt) => opt.value === value);

    const renderOption = (option) => (
        <Title
            key={option.value}
            size="lg"
            px="xs"
        >
            {option.label}
        </Title>
    );

    const handleOnOptionSubmit = useCallback((val) => {
        const selectedUser = users?.find((user) => user.userId === val);
        if (selectedUser) {
            onChange(selectedUser);
        }
        combobox.closeDropdown();
    }, [combobox, onChange, users]);

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={handleOnOptionSubmit}
            withinPortal={false}
        >
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    miw={200}
                    onClick={() => combobox.toggleDropdown()}
                    rightSectionPointerEvents="none"
                >
                    {selected ? renderOption(selected) : (
                        <Input.Placeholder>Select User</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown
                px="0"
            >
                {options.length === 0 && (
                    <Combobox.Empty>No users found</Combobox.Empty>
                )}
                <Combobox.Options>
                    {options.map((option) => (
                        <Combobox.Option
                            key={option.value}
                            value={option.value}
                        >
                            <Box
                                className="text-start flex items-center"
                                h={40}
                                bg={selected?.value === option.value ? 'lime.2' : 'var(--mantine-color-body)'}
                            >
                                {renderOption(option)}
                            </Box>
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}
