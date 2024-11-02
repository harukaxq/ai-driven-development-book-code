export function cowsay(message: string = "Hello, World!"): void {
    const cow = `        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
    `;

    const border = '-'.repeat(message.length + 2);
    const speechBubble = `
 ${border}
< ${message} >
 ${border}`;

    console.log(`${speechBubble}\n${cow}`);
}

cowsay();
