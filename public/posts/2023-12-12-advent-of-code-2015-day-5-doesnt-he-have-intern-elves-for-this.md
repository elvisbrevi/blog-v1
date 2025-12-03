---
title: "Advent of Code 2015, Day 5: Doesn't He Have Intern-Elves For This?"
date: "2023-12-12 10:31:58"
description: "Puzzle Part One
Santa needs help figuring out which strings in his text file are naughty or nice.
A nice string is one with all of the following properties:

It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.

It c..."
tags: ["adventofcode2015"]
cover: "/images/covers/aoc-day-5-cover.svg"
---

# Advent of Code 2015, Day 5: Doesn't He Have Intern-Elves For This?

## Puzzle Part One

Santa needs help figuring out which strings in his text file are naughty or nice.

A *nice string* is one with all of the following properties:

* It contains at least three vowels (`aeiou` only), like `aei`, `xazegov`, or `aeiouaeiouaeiou`.
    
* It contains at least one letter that appears twice in a row, like `xx`, `abcdde` (`dd`), or `aabbccdd` (`aa`, `bb`, `cc`, or `dd`).
    
* It does *not* contain the strings `ab`, `cd`, `pq`, or `xy`, even if they are part of one of the other requirements.
    

For example:

* `ugknbfddgicrmopn` is nice because it has at least three vowels (`u...i...o...`), a double letter (`...dd...`), and none of the disallowed substrings.
    
* `aaa` is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
    
* `jchzalrnumimnmhp` is naughty because it has no double letter.
    
* `haegwjzuvuyypxyu` is naughty because it contains the string `xy`.
    
* `dvszwmarrgswjxmb` is naughty because it contains only one vowel.
    

How many strings are nice?

## My Solution:

* First I created an `input` file to store the large input string.
    
* Then I read, split for each broken line, and converted it into Vect&lt;&str&gt; named `input`.
    
* declared a variable named `nice_count` for counting nice words.
    
* in the input words iteration, first, trim each of the words and check if it's a nice word with the `is_nice` function, if true add one to the `nice_count` variable.
    
* in the `is_nice` function, I invoke other three functions:
    
    * `has_three_vowels`: iterate the `vowels` string and check that it contains at least three characters from the `word`.
        
    * `letter_appears_twice`: iterate `word` chars and return true if the last character in the interaction is the same as the current.
        
    * `not_contain_strings`: iterate the `bad_strings` vec and check if any word in vec is in the `word`, return false.
        
* finally return nice\_count, which returns the total of nice words.
    

```rust
mod input;

fn main() {
    let input: Vec<&str> = input::input().split('\n').collect();
    let mut nice_count = 0;
    for i in input {
        let input_trimmed = i.trim();
        if is_nice(input_trimmed) {
            nice_count += 1
        }
    }
    println!("There are {} nice strings", nice_count)
}

fn is_nice(word: &str) -> bool {
    return has_three_vowels(word) && letter_appears_twice(word) && not_contain_strings(word);
}

fn not_contain_strings(word: &str) -> bool {
    let bad_strings = vec!["ab", "cd", "pq", "xy"];

    return !bad_strings.iter().any(|i| word.contains(i));
}

fn letter_appears_twice(word: &str) -> bool {
    let mut last_letter = ' ';
    let mut twice = false;

    for c in word.chars() {
        if c == last_letter {
            twice = true
        }
        last_letter = c
    }

    twice
}

fn has_three_vowels(word: &str) -> bool {
    let mut vowels_count = 0;
    let vowels = "aeiou";

    for c in word.chars() {
        if vowels.contains(c) {
            vowels_count += 1
        }
    }

    vowels_count > 2
}
```

`Input.rs`

```rust
pub fn input() -> &'static str {
    "knpwpcnnimyjlsyz
    fezotpoicsrshfnh
    dkiwkgpmhudghyhk
    yzptxekgldksridv
    pckmzqzyiyzdbcts
    oqshafncvftvwvsi
    yynihvdywxupqmbt
    iwmbeunfiuhjaaic
    pkpkrqjvgocvaxjs
    ieqspassuvquvlyz
    xshhahjaxjoqsjtl
    fxrrnaxlqezdcdvd
    pksrohfwlaqzpkdd
    ravytrdnbxvnnoyy
    atkwaifeobgztbgo
    inkcabgfdobyeeom
    ywpfwectajohqizp
    amcgorhxjcybbisv
    mbbwmnznhafsofvr
    wofcubucymnhuhrv"
}
```

## Part Two:

Realizing the error of his ways, Santa has switched to a better model of determining whether a string is naughty or nice. None of the old rules apply, as they are all clearly ridiculous.

Now, a nice string is one with all of the following properties:

* It contains a pair of any two letters that appears at least twice in the string without overlapping, like `xyxy` (`xy`) or `aabcdefgaa` (`aa`), but not like `aaa` (`aa`, but it overlaps).
    
* It contains at least one letter which repeats with exactly one letter between them, like `xyx`, `abcdefeghi` (`efe`), or even `aaa`.
    

For example:

* `qjhvhtzxzqqjkmpb` is nice because is has a pair that appears twice (`qj`) and a letter that repeats with exactly one letter between them (`zxz`).
    
* `xxyxx` is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
    
* `uurcxstgmygtbstg` is naughty because it has a pair (`tg`) but no repeat with a single letter between them.
    
* `ieodomkazucvgmuy` is naughty because it has a repeating letter with one between (`odo`), but no pair that appears twice.
    

How many strings are nice under these new rules?

## My solution:

in the `is_nice_part_two` function, I invoke other two functions:

* `have_pair_twice`: This function in Rust checks if a given string (`word`) contains any pair of adjacent characters that repeats elsewhere in the string, not directly adjacent to the first occurrence.
    
    * It initializes `pair_list`, a vector of tuples, each containing a `u32` and a `String`. The vector starts with a single element `(0, String::new())`.
        
    * The function then iterates through the characters of the input string `word`, starting from the first character (index 1).
        
    * For each character, it retrieves the current character and the one preceding it.
        
    * A new string `new_pair` is formed by concatenating these two characters.
        
    * The function checks if `new_pair` already exists in `pair_list`, with the condition that the pair is not immediately adjacent to the current pair (`x.0 != (i - 1) as u32`). If such a pair is found, the function returns `true`, indicating a repeat of a character pair elsewhere in the string.
        
    * If no repeat is found, the new pair `(i as u32, new_pair)` is added to `pair_list`.
        
    * The function returns `false` if no repeating pair is found after iterating through all characters.
        
* This Rust function, `have_letter_repeat`, checks if a given string (`word`) contains any characters that repeat with exactly one character in between them.
    
    * It iterates through the characters of the string starting from the third character (index 2).
        
    * For each iteration, the function retrieves the current character and the character two positions before it.
        
    * It then checks if these two characters are the same. If they are, the function immediately returns `true`, indicating that there is a repeating character with exactly one character in between.
        
    * If no such repeating characters are found throughout the iteration, the function returns `false`.
        

```rust
mod input;

fn main() {
    let input: Vec<&str> = input::input().split('\n').collect();

    nice_count = 0;
    for i in &input {
        let input_trimmed = i.trim();
        if is_nice_part_two(input_trimmed) {
            nice_count += 1
        }
    }

    println!("There are {} nice strings for part two", nice_count);
}

fn is_nice_part_two(word: &str) -> bool {
    return have_pair_twice(word) && have_letter_repeat(word);
}

fn have_letter_repeat(word: &str) -> bool {
    for i in 2..word.chars().count() {
        let current_char = word.chars().nth(i).unwrap_or(' ');
        let previous_char = word.chars().nth((i as u32 - 2) as usize).unwrap_or(' ');

        if current_char == previous_char {
            return true;
        }
    }

    false
}

fn have_pair_twice(word: &str) -> bool {
    let mut pair_list: Vec<(u32, String)> = vec![(0, String::new())];

    for i in 1..word.chars().count() {
        let current_char = word.chars().nth(i).unwrap_or(' ');
        let previous_char = word.chars().nth((i as u32 - 1) as usize).unwrap_or(' ');

        let new_pair = format!("{}{}", previous_char, current_char);

        if pair_list
            .iter()
            .any(|x| x.1 == new_pair && x.0 != (i - 1) as u32)
        {
            return true;
        }

        pair_list.push((i as u32, new_pair));
    }

    false
}
```