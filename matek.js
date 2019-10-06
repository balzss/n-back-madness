#!/usr/bin/env node

let s = 0;

for (let i = 0; i < 1000000; i++) {
    const randA = (Math.random() * 100) < 29.3;
    const randB = (Math.random() * 100) < 29.3;

    if (randA || randB) {
        s += 1;
    }
}

console.log(s);
