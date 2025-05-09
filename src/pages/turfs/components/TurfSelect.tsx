import { Turf } from '@/lib/firebase/firestore/turfs';
import { useFetchTurfs } from '@/store/server/turfs';
import {
    Box,
    Combobox, Input, InputBase, Title, useCombobox,
} from '@mantine/core';
import { useEffect, useMemo } from 'react';

interface TurfSelectProps {
    onChange: (value: Turf) => void;
    value: string;
}

export default function TurfSelect({ onChange, value }: TurfSelectProps) {
    const {
        data: turfs,
    } = useFetchTurfs();

    const combobox = useCombobox();

    // Memoize options for performance
    const options = useMemo(() => turfs?.map((turf) => ({
        value: turf.turfId,
        label: turf.name,
    })) || [], [turfs]);

    useEffect(() => {
        if (turfs && turfs.length > 0 && !value) {
            onChange(turfs[0]);
        }
    }, [turfs, onChange, value]);

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

    const handleOnOptionSubmit = (val) => {
        const selectedTurf = turfs?.find((turf) => turf.turfId === val);
        if (selectedTurf) {
            onChange(selectedTurf);
        }
        combobox.closeDropdown();
    };

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
                    multiline
                >
                    {selected ? renderOption(selected) : (
                        <Input.Placeholder>Select Turf</Input.Placeholder>
                    )}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown px="0">
                {options.length === 0 && (
                    <Combobox.Empty>No turfs found</Combobox.Empty>
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
