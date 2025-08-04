---
title: "Improving Node.js with Rust-Wasm Library"
date: "2023-10-14 19:38:21"
description: "Introduction
WebAssembly (Wasm) is a binary instruction format that allows code written in languages like Rust to run on the web. By integrating Rust-Wasm libraries into Node.js, we can achieve better performance and utilize the power of Rust's memor..."
tags: ["Rust", "wasm", "Node.js", "node"]
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1697312244910/d1486ed2-9f2a-4eca-a3a0-ceccebd91c7e.webp"
---

# Improving Node.js with Rust-Wasm Library

### **Introduction**

WebAssembly (Wasm) is a binary instruction format that allows code written in languages like Rust to run on the web. By integrating Rust-Wasm libraries into Node.js, we can achieve better performance and utilize the power of Rust's memory safety features. In this tutorial, we'll walk you through the process using the `rust-wasm-lib` repository as a reference.

### **Prerequisites**

* Basic knowledge of Rust and Node.js.
    
* Rust and Cargo are installed on your machine.
    
* Node.js and npm are installed on your machine.
    

### **Setting up a New Rust Project**

First, you must have both Rust and wasm-pack installed. You can get them from here and here if you haven't done this yet.

Let's create a new Rust project:

```bash
cargo new rust_wasm_lib
cd rust_wasm_lib
```

our project is a simple Rust library that contains basic functions like `greet`, `multiply`, and `fibonacci`. The Rust code is annotated which `#[wasm_bindgen]` aids in creating bindings for WASM, edit your lib.rs in the src folder:

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
pub fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}
```

### **Directly in the Browser**

To run your WebAssembly module directly in the browser, at the root of the project, compile the Rust code targeting the web:

```bash
# compile for web
wasm-pack build --target web
```

then you will see an output like this:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1697222302376/6a1bb6c0-827f-4e93-85b6-fb519bfa59b5.png align="center")

create an index.html to call the wasm library:

```bash
# create index.html for consume lib
touch index.html
```

and consume it directly in the index.html file:

```xml
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>hello-wasm example</title>
  </head>
  <body>
    <script type="module">
      import init, { greet } from "./pkg/rust_wasm_lib.js";
      init().then(() => {
        greet("WebAssembly");
      });
    </script>
  </body>
</html>
```

start a local server to serve your files, you can use Python for this:

```bash
python3 -m http.server
```

then go to a local server in my case http://\[::\]:8000/, you will see an alert message from the wasm library, like this:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1697222485225/33c9afce-7469-400f-a4b0-7a0cad017270.png align="center")

### **Integrating with Node.js**

To harness your WASM in a Node.js ambiance, in the root folder compile the wasm library for node:

```bash
wasm-pack build --target nodejs
```

then configure a Node project:

```bash
# create folder for node project
mkdir node_example
# go into folder
cd node_example
# initialize a node project
npm init -y
# install your was library as a dependency
npm install ../pkg
# and create an index.js
touch index.js
```

now, in your index.js call your library methods:

```javascript
const wasm = require('rust-wasm-lib');

console.log(wasm.multiply(5, 7)); // prints 35

// Benchmarking Rust/WASM vs pure JavaScript
function fibonacciJS(n) {
    if (n <= 1) return n;
    return fibonacciJS(n - 1) + fibonacciJS(n - 2);
}

const num = 40;

console.time("Fibonacci Rust/WASM");
console.log(wasm.fibonacci(num));
console.timeEnd("Fibonacci Rust/WASM");

console.time("Fibonacci JavaScript");
console.log(fibonacciJS(num));
console.timeEnd("Fibonacci JavaScript");
```

In this example we have added a call to the multiplication method and a call to the [Fibonacci](https://en.wikipedia.org/wiki/Fibonacci_sequence) method, we have also added a javascript version of the Fibonacci method in order to compare its performance.

At last, run your Node script:

```bash
node index.js
```

you will see an output like this:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1697224065362/39f321fc-f53b-4ee0-85e8-6406a32d31f6.png align="center")

In computing, performance often becomes a significant concern, especially for operations that are computationally intensive. The Fibonacci sequence generation is one such operation. Given the inherent recursion in its calculation, the Fibonacci function can be slow, especially for larger values.

Let's delve into the performance comparison between Rust-WASM and pure JavaScript using the Fibonacci function as our testbed.

Both implementations (Rust-WASM and JavaScript) employ a recursive approach to calculate the Fibonacci sequence:

### **Performance Test Results**

For `num = 40`, the Fibonacci value is `102334155`.

**Rust-WASM:** The Rust-WASM version took approximately `868.066ms` to compute this value.

**JavaScript:** In contrast, the pure JavaScript version took roughly `1.543s`, which is almost twice the time.

### **Analysis**

The Rust-WASM implementation appears to be significantly faster in this specific test case, clocking in at nearly half the execution time of the pure JavaScript approach. This speed-up showcases the efficiency and performance advantages that can be gained when leveraging WebAssembly, even more so when the logic is computationally demanding. Rust's inherent performance, combined with the efficiency of WebAssembly, can lead to noticeable performance improvements.

### **Conclusion**

This comparison underscores the power of WebAssembly, especially when paired with a performant language like Rust. Developers looking to squeeze out extra performance from their applications, especially for compute-intensive tasks, might find integrating Rust-WASM a beneficial endeavor. Not only does it bolster speed, but it also offers a cross-platform runtime with consistent performance across different environments. Happy coding!