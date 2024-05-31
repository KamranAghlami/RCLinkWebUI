import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import '@xterm/xterm/css/xterm.css';

export function initiate_termial() {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(document.getElementById('terminal') as HTMLElement);

    window.addEventListener('resize', () => fitAddon.fit());
    window.addEventListener('orientationchange', () => fitAddon.fit());

    fitAddon.fit();

    console.clear = () => terminal.clear();
    console.log = (...args: unknown[]) => terminal.writeln(args.join(' '));
    console.info = (...args: unknown[]) => terminal.writeln('\x1B[1;32m' + args.join(' ') + '\x1B[0m');
    console.warn = (...args: unknown[]) => terminal.writeln('\x1B[1;33m' + args.join(' ') + '\x1B[0m');
    console.error = (...args: unknown[]) => terminal.writeln('\x1B[1;31m' + args.join(' ') + '\x1B[0m');
}