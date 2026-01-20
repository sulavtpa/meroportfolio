const commands = {
    help: {
        description: 'Show available commands',
        execute: () => {
            let output = 'Available commands:\n\n';
            Object.keys(commands).forEach(cmd => {
                output += `<span class="terminal-command">${cmd.padEnd(12, ' ')}</span> - ${commands[cmd].description}\n`;
            });
            output += '\nUse <span class="terminal-command">clear</span> to wipe the screen';
            return output;
        }
    },
    about: {
        description: 'Show about information',
        execute: () => 'A developer in my early 20s, continuously evolving, building, and learning through every project and mistake.'
    },
    skills: {
        description: 'List technical skills',
        execute: () => {
            return `<span class="terminal-command">Languages:</span> C/C++, Java, Rust, Python, JavaScript\n` +
                   `<span class="terminal-command">Frontend:</span> Web Development (React/Next.js), Qt Framework\n` +
                   `<span class="terminal-command">Backend:</span> Supabase, Node.js, PostgreSQL\n` +
                   `<span class="terminal-command">CS Core:</span> Algorithms, Data Structures, System Architecture`;
        }
    },
    projects: {
        description: 'Show projects',
        execute: () => 'The portfolio gallery is currently under construction. New projects will be showcased here shortly.'
    },
    clear: {
        description: 'Clear terminal screen',
        execute: (args, terminalBody) => {
            terminalBody.innerHTML = `<div class="terminal-prompt"><span class="terminal-prompt-user">sulav@portfolio</span><span class="terminal-prompt-path">~</span><span class="terminal-prompt-symbol">$</span><input type="text" class="terminal-input" autofocus></div>`;
            terminalBody.querySelector('.terminal-input').addEventListener('keydown', (e) => handleCommand(e, terminalBody, commands));
            terminalBody.querySelector('.terminal-input').focus();
            return null;
        }
    },
    echo: {
        description: 'Print arguments to terminal',
        execute: (args) => args.join(' ')
    },
    sudo: {
        description: 'Execute command as sudo',
        execute: () => `<span class="terminal-error">Error: User is not in the sudoers file. This incident will be reported.</span>`
    },
    date: {
        description: 'Show current date and time',
        execute: () => new Date().toLocaleString()
    },
    fastfetch: {
        description: 'Show system information',
        execute: () => {
            const lines = [
                ["                    -@", " <span class='terminal-success'>www.thapasulav.info.np</span>"],
                ["                   .##@", " ---------------------"],
                ["                  .####@", " <span class='terminal-command'>OS:</span> Arch Linux"],
                ["                  @#####@", " <span class='terminal-command'>Device:</span> Lenovo Legion Pro 5 16IRX9 (83DG)"],
                ["                . *######@", " <span class='terminal-command'>Kernel:</span> 6.18.6-zen1-1-zen"],
                ["               .##@o@#####@", " <span class='terminal-command'>CPU:</span> Intel i7-14700HX (28) @ 5.500GHz"],
                ["              /############@", " <span class='terminal-command'>GPU:</span> NVIDIA GeForce RTX 4070 Mobile"],
                ["             /##############@", " <span class='terminal-command'>Shell:</span> fish 4.0.2"],
                ["            @######@**%######@", " <span class='terminal-command'>Resolution:</span> 2560x1600"],
                ["           @######`     %#####o", " <span class='terminal-command'>DE:</span> GNOME 47"],
                ["          @######@       ######%", " <span class='terminal-command'>WM:</span> Mutter"],
                ["        -@#######h       ######@.`", " <span class='terminal-command'>Theme:</span> Everforest-Dark-B"],
                ["       /#####h**``       `**%@####@", " <span class='terminal-command'>Icons:</span> Tela-Circle-Dark"],
                ["      @H@*`                    `*%#@", " <span class='terminal-command'>Terminal:</span> Kitty"],
                ["     *`                            `*", ""]
            ];
            const everforestGreen = "#a7c080";
            const maxArtWidth = Math.max(...lines.map(line => line[0].length));
            const totalPadding = maxArtWidth + 5;
            let fastfetchOutput = '<pre style="font-family: monospace; line-height: 1.4; white-space: pre;">';
            lines.forEach((line) => {
                const art = `<span style="color: ${everforestGreen}">${line[0].padEnd(totalPadding, ' ')}</span>`;
                fastfetchOutput += `${art}${line[1]}\n`;
            });
            fastfetchOutput += '</pre>';
            return fastfetchOutput;
        }
    },
    socials: {
        description: 'Show social media links',
        execute: () => {
            return `<span class="terminal-command">LinkedIn:</span> https://linkedin.com/in/thapasulav\n` +
                   `<span class="terminal-command">GitHub:</span>   https://github.com/thapasulav\n` +
                   `<span class="terminal-command">Twitter:</span>  https://twitter.com/thapasulav\n` +
                   `<span class="terminal-command">Email:</span>    hello@thapasulav.info.np`;
        }
    }
};
function handleCommand(e, terminalBody, commandsObj) {
    if (e.key === 'Enter') {
        const currentInput = e.target;
        const input = currentInput.value.trim();
        currentInput.disabled = true;
        const outputContainer = document.createElement('div');
        outputContainer.className = 'terminal-output';
        const args = input.split(' ');
        const cmd = args.shift().toLowerCase();
        let result = '';
        if (commandsObj[cmd]) {
            result = commandsObj[cmd].execute(args, terminalBody);
        } else if (input) {
            result = `<span class="terminal-error">Command not found: ${cmd}</span>`;
        }
        if(input) {
            outputContainer.innerHTML = result;
            terminalBody.appendChild(outputContainer);
            gsap.from(outputContainer, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
        }
        if (cmd !== 'clear') {
            const newPrompt = document.createElement('div');
            newPrompt.className = 'terminal-prompt';
            newPrompt.innerHTML = `<span class="terminal-prompt-user">sulav@portfolio</span><span class="terminal-prompt-path">~</span><span class="terminal-prompt-symbol">$</span><input type="text" class="terminal-input" autofocus>`;
            terminalBody.appendChild(newPrompt);
            const newTerminalInput = newPrompt.querySelector('.terminal-input');
            newTerminalInput.addEventListener('keydown', (e) => handleCommand(e, terminalBody, commandsObj));
            newTerminalInput.focus();
            gsap.from(newPrompt, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
        }
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
}