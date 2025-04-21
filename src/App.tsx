import './App.css'

import { MantineProvider } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { theme } from './theme';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <Outlet />
    </MantineProvider>
  );
}
