const randomNumber = require('./randomNumber');

const handleRandonNumbers = (cant) => {
    const numbers = {};

    for(let i = 0; i < cant; i++) {
        const number = randomNumber(1, 1000);
        numbers[number] = numbers[number] ? numbers[number] + 1 : 1;
    }
    return numbers;
}

process.on('exit', () => {
    console.log(`Child process #${process.pid} exited with code ${process.exitCode}`);
});

process.on('message', cant => {
    console.log(`Child process #${process.pid} received cant: ${cant}`);
    const numbers = handleRandonNumbers(cant);
    process.send({ numbers });
    process.exit(0);
})

process.send('start');