---
title: "Advent of Code 2015, Day 4: The Ideal Stocking Stuffer"
date: "2023-12-11 10:45:01"
description: "Puzzle, Part One:
Santa needs help mining some AdventCoins (very similar to bitcoins) to use as gifts for all the economically forward-thinking little girls and boys.
To do this, he needs to find MD5 hashes which, in hexadecimal, start with at least ..."
tags: ["adventofcode2015", "Rust"]
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1702289980318/1ac7f839-4da6-4d3a-b5dc-d8297261291e.png"
---

# Advent of Code 2015, Day 4: The Ideal Stocking Stuffer

## Puzzle, Part One:

Santa needs help [mining](https://en.wikipedia.org/wiki/Bitcoin#Mining) some AdventCoins (very similar to [bitcoins](https://en.wikipedia.org/wiki/Bitcoin)) to use as gifts for all the economically forward-thinking little girls and boys.

To do this, he needs to find [MD5](https://en.wikipedia.org/wiki/MD5) hashes which, in [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal), start with at least *five zeroes*. The input to the MD5 hash is some secret key (your puzzle input, given below) followed by a number in decimal. To mine AdventCoins, you must find Santa the lowest positive number (no leading zeroes: `1`, `2`, `3`, ...) that produces such a hash.

For example:

* If your secret key is `abcdef`, the answer is `609043`, because the MD5 hash of `abcdef609043` starts with five zeroes (`000001dbbfa...`), and it is the lowest such number to do so.
    
* If your secret key is `pqrstuv`, the lowest number it combines with to make an MD5 hash starting with five zeroes is `1048970`; that is, the MD5 hash of `pqrstuv1048970` looks like `000006136ef...`.
    

## My Solution:

* I set the input string to `"iwrupvqb"` and initialize the answer variable to 0.
    
* I use a loop to test each consecutive number starting from 0.
    
* In each iteration, I concatenate the current number with the input string and compute its MD5 hash.
    
* I check if the first six characters of the hash are zeroes.
    
* If the condition is met, I break out of the loop, having found the lowest number that satisfies the condition.
    
* Finally, I print out the answer, which is the lowest positive number that, combined with the input string, produces an MD5 hash starting with six zeroes.
    

```rust
fn main() {
    let input = "iwrupvqb";
    let mut answer = 0;

    loop {
        let md5 = format!("{:?}", md5::compute(format!("{}{}", input, answer)));

        if &md5[..5] == "00000" {
            break;
        }

        answer += 1;
    }

    println!("the lowest positive number is: {}", answer);
}
```

## Part Two

Now find one that starts with *six zeroes*.

## My Solution:

The change in the code alters the break condition from requiring the first five characters of the MD5 hash to be "00000" to needing the first six characters to be "000000", thus increasing the required number of leading zeros by one.

```rust
fn main() {
    let input = "iwrupvqb";
    let mut answer = 0;

    loop {
        let md5 = format!("{:?}", md5::compute(format!("{}{}", input, answer)));

        if &md5[..6] == "000000" {
            break;
        }

        answer += 1;
    }

    println!("the lowest positive number is: {}", answer);
}
```