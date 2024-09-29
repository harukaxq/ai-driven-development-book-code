function cowsay(message: string): string {
    const cow = `
        ${"_".repeat(message.length + 2)}
       < ${message} >
        ${"-".repeat(message.length + 2)}
               \\   ^__^
                \\  (oo)\\_______
                   (__)\\       )\\/\\
                       ||----w |
                       ||     ||
    `;
    return cow;
}

const message = "Hello, World!";
console.log(cowsay(message));
