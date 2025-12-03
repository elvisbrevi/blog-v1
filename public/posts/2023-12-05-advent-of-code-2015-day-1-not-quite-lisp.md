---
title: "Advent of Code 2015, Day 1: Not Quite Lisp"
date: "2023-12-05 16:02:21"
description: "The Puzzle, Part One: Santa was hoping for a white Christmas, but his weather machine's 'snow' function is powered by stars, and he's fresh out! To save Christmas, he needs you to collect fifty stars by December 25th. Collect stars by helping Santa s..."
tags: ["adventofcode2015", "Rust"]
cover: "/images/covers/aoc-day-1-cover.png"
---

# Advent of Code 2015, Day 1: Not Quite Lisp

## The Puzzle, Part One:

Santa was hoping for a white Christmas, but his weather machine's "snow" function is powered by stars, and he's fresh out! To save Christmas, he needs you to collect *fifty stars* by December 25th.

Collect stars by helping Santa solve puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants *one star*. Good luck!

Here's an easy puzzle to warm you up.

Santa is trying to deliver presents in a large apartment building, but he can't find the right floor - the directions he got are a little confusing. He starts on the ground floor (floor `0`) and then follows the instructions one character at a time.

An opening parenthesis, `(`, means he should go up one floor, and a closing parenthesis, `)`, means he should go down one floor.

The apartment building is very tall, and the basement is very deep; he will never find the top or bottom floors.

For example:

* `(())` and `()()` both result in floor `0`.
    
* `(((` and `(()(()(` both result in floor `3`.
    
* `))(((((` also results in floor `3`.
    
* `())` and `))(` both result in floor `-1` (the first basement level).
    
* `)))` and `)())())` both result in floor `-3`.
    

To *what floor* do the instructions take Santa?

## My Solution

* I create a file [`Input.rs`](http://Input.rs) the module for storing input of puzzles, and read this in `input` variable.
    
* declared a `posible_values` hashmap to determine the value of characters `(` and `)` .
    
* finally, iterate the `input` values, get the value of each character from the hashmap `possible_values`, and add them to the `floor` variable.
    

```rust
use std::collections::HashMap;
mod input;

fn main() {
    let posible_values = HashMap::from([('(', 1), (')', -1)]);
    let input = input::get_input();
    let mut floor = 0;

    for char in input.chars() {
        if let Some(value) = posible_values.get(&char) {
            floor += value;
        }
    }

    println!("The instructions take Santa to floor {} 🏢", floor);
}
```

`Input.rs` :

```rust
pub fn get_input() -> &'static str {
    "()(((()))(()()()())))))(((()()(((()))(()()()((((()"
}
```

## The Puzzle, Part Two:

Now, given the same instructions, find the *position* of the first character that causes him to enter the basement (floor `-1`). The first character in the instructions has position `1`, the second character has position `2`, and so on.

For example:

* `)` causes him to enter the basement at character position `1`.
    
* `()())` causes him to enter the basement at character position `5`.
    

What is the *position* of the character that causes Santa to first enter the basement?

## My Solution

* I declared two new variables:
    
    * a flag `index` to get the position of character in the input iteration.
        
    * and `character_position` variable for storing the `index` value when the `floor` is -1 for the first time.
        

```rust
use std::collections::HashMap;

fn main() {
    let posible_values = HashMap::from([('(', 1), (')', -1)]);
    let input = "()(((()))(()()()())))))(((()()(((()))(()()()((((()";
    let mut floor = 0;
    let mut index = 1;
    let mut character_position = 0;

    for char in input.chars() {
        if let Some(value) = posible_values.get(&char) {
            floor += value;
        }

        if character_position == 0 && floor == -1 {
            character_position = index;
        }

        index += 1;
    }

    println!(
        "The position of the character that causes Santa to first enter the basement is {} 🎅",
        character_position
    );
    println!("The instructions take Santa to floor {} 🏢", floor);
}
```