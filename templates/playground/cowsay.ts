import { cow, penguin } from './aa';

function cowsay(message: string, animal: 'cow' | 'penguin' = 'cow'): string {
    const art = animal === 'cow' ? cow : penguin;
    return art.replace(/\${message}/g, message);
}

const message = "Hello, World!";
console.log(cowsay(message, 'cow'));
console.log(cowsay(message, 'penguin'));