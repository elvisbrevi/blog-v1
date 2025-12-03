---
title: "Advent of Code 2015, Day 7: Some Assembly Required"
date: "2023-12-20 16:51:19"
description: "Puzzle Part One:
This year, Santa brought little Bobby Tables a set of wires and bitwise logic gates! Unfortunately, little Bobby is a little under the recommended age range, and he needs help assembling the circuit.
Each wire has an identifier (some..."
tags: ["adventofcode2015"]
cover: "/images/covers/aoc-day-7-cover.png"
---

# Advent of Code 2015, Day 7: Some Assembly Required

## Puzzle Part One:

This year, Santa brought little Bobby Tables a set of wires and [bitwise logic gates](https://en.wikipedia.org/wiki/Bitwise_operation)! Unfortunately, little Bobby is a little under the recommended age range, and he needs help assembling the circuit.

Each wire has an identifier (some lowercase letters) and can carry a [16-bit](https://en.wikipedia.org/wiki/16-bit) signal (a number from `0` to `65535`). A signal is provided to each wire by a gate, another wire, or some specific value. Each wire can only get a signal from one source, but can provide its signal to multiple destinations. A gate provides no signal until all of its inputs have a signal.

The included instructions booklet describes how to connect the parts together: `x AND y -> z` means to connect wires `x` and `y` to an AND gate, and then connect its output to wire `z`.

For example:

* `123 -> x` means that the signal `123` is provided to wire `x`.
    
* `x AND y -> z` means that the [bitwise AND](https://en.wikipedia.org/wiki/Bitwise_operation#AND) of wire `x` and wire `y` is provided to wire `z`.
    
* `p LSHIFT 2 -> q` means that the value from wire `p` is [left-shifted](https://en.wikipedia.org/wiki/Logical_shift) by `2` and then provided to wire `q`.
    
* `NOT e -> f` means that the [bitwise complement](https://en.wikipedia.org/wiki/Bitwise_operation#NOT) of the value from wire `e` is provided to wire `f`.
    

Other possible gates include `OR` ([bitwise OR](https://en.wikipedia.org/wiki/Bitwise_operation#OR)) and `RSHIFT` ([right-shift](https://en.wikipedia.org/wiki/Logical_shift)). If, for some reason, you'd like to *emulate* the circuit instead, almost all programming languages (for example, [C](https://en.wikipedia.org/wiki/Bitwise_operations_in_C), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators), or [Python](https://wiki.python.org/moin/BitwiseOperators)) provide operators for these gates.

For example, here is a simple circuit:

```markdown
123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
```

After it is run, these are the signals on the wires:

```markdown
d: 72
e: 507
f: 492
g: 114
h: 65412
i: 65079
x: 123
y: 456
```

In little Bobby's kit's instructions booklet (provided as your puzzle input), what signal is ultimately provided to *wire* `a`?

## My Solution:

1. **Module Import and Variable Creation**: It imports the `input` module and the `HashMap` library from `std::collections`. Then, it creates two `HashMaps`: `operations` to store operations and `operations_solved` to keep track of the results of solved operations.
    
2. **Reading and Preparing Data**:
    
    * Reads an input string (possibly bitwise operation instructions) from `input::get_input()`.
        
    * Removes "-&gt;" characters from the input string.
        
    * Splits the input into lines and each line into words, storing these words in `operations`. Each key in `operations` is a wire identifier, and the value is a vector of words representing an operation.
        
3. **Executing Operations**:
    
    * Calls the `find_value` function for wire "a" and passes the operations and the solved operations `HashMap` as references.
        
    * Prints the result of this operation.
        
4. **Function** `is_numeric`:
    
    * Checks if a string is numeric, returning `true` if all characters in the string are digits.
        
5. **Function** `find_value`:
    
    * Recursive, used to find and compute the value for a given key (a wire identifier).
        
    * First, it looks in `operations_solved` to see if the value has already been computed.
        
    * If not, it parses and executes the specified operation in `operations`, which can be a numeric value, NOT, AND, OR, RSHIFT, or LSHIFT.
        
    * Computes the value, stores it in `operations_solved`, and returns it.
        

```rust
mod input;
use std::collections::HashMap;

fn main() {
    let input = input::get_input();
    let mut operations: HashMap<&str, Vec<&str>> = HashMap::new();
    let mut operations_solved: HashMap<&str, u16> = HashMap::new();
    let binding = input.replace("->", "");

    // reading input
    for operation_string in binding.split("\n") {
        // divide usefull words in a vector
        let mut words: Vec<&str> = operation_string.trim().split(" ").collect();
        // get the character identifier for wire
        let key = words.pop().expect("No key found");
        // remove las element '->'
        words.pop();

        // save wire and it's bitwise operation in a hasmap
        operations.insert(key, words);
    }

    //excute operation
    let result = find_value("a", &operations, &mut operations_solved);
    println!("{}", result)
}

fn is_numeric(value: &str) -> bool {
    value.chars().all(char::is_numeric)
}

fn find_value<'a>(
    key: &'a str,
    operations: &'a HashMap<&str, Vec<&str>>,
    operations_solved: &mut HashMap<&'a str, u16>,
) -> u16 {
    if let Some(op) = operations_solved.get(key) {
        return *op;
    }

    if let Some(op) = &operations.get(key) {
        let result = match op.as_slice() {
            [value] => {
                if is_numeric(value) {
                    value.parse::<u16>().expect("conversion error")
                } else {
                    find_value(value, operations, operations_solved)
                }
            }
            ["NOT", value] => {
                let value_u16 = if is_numeric(value) {
                    value.parse::<u16>().expect("conversion error")
                } else {
                    find_value(value, operations, operations_solved)
                };
                !value_u16
            }
            [left_value, op, right_value] => {
                let left_value_u16 = if is_numeric(left_value) {
                    left_value.parse::<u16>().expect("conversion error")
                } else {
                    find_value(left_value, operations, operations_solved)
                };

                let right_value_u16 = if is_numeric(right_value) {
                    right_value.parse::<u16>().expect("conversion error")
                } else {
                    find_value(right_value, operations, operations_solved)
                };

                match *op {
                    "AND" => left_value_u16 & right_value_u16,
                    "OR" => left_value_u16 | right_value_u16,
                    "RSHIFT" => left_value_u16 >> right_value_u16,
                    "LSHIFT" => left_value_u16 << right_value_u16,
                    _ => {
                        println!("not found");
                        0
                    }
                }
            }
            _ => {
                println!("not found");
                0
            }
        };

        operations_solved.insert(key, result);
        result
    } else {
        println!("not found");
        0
    }
}
```

`input.rs` (for testing)

```rust
pub fn get_input() -> &'static str {
    "123 -> x
    NOT y -> i
    x LSHIFT 2 -> f
    x AND y -> d
    456 -> y
    x OR y -> e
    b RSHIFT 2 -> g
    NOT x -> h
    g -> a
    h RSHIFT 2 -> b"
}
```

## Part Two:

Now, take the signal you got on wire `a`, override wire `b` to that signal, and reset the other wires (including wire `a`). What new signal is ultimately provided to wire `a`?

## My Solution:

The same code is fine, joust only changes the b value.