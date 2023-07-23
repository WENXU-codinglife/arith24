function solve24(numbers) {
  const operators = ["+", "-", "*", "/"];
  const permutations = permute(numbers);
  console.log(numbers);
  for (let perm of permutations) {
    for (let ops of permute(operators, 3)) {
      const [a, b, c, d] = perm;
      let result = null;
      // Case 0: a op1 b op2 c op3 d
      result = eval(`${a} ${ops[0]} ${b} ${ops[1]} ${c} ${ops[2]} ${d}`);
      if (result === 24) {
        console.log(`${a} ${ops[0]} ${b} ${ops[1]} ${c} ${ops[2]} ${d}`);
        return true;
      }
      // Case 1: (a op1 b) op2 c op3 d
      result = eval(`(${a} ${ops[0]} ${b}) ${ops[1]} ${c} ${ops[2]} ${d}`);
      if (result === 24) {
        console.log(`(${a} ${ops[0]} ${b}) ${ops[1]} ${c} ${ops[2]} ${d}`);
        return true;
      }
      // Case 2: a op1 (b op2 c) op3 d
      result = eval(`${a} ${ops[0]} (${b} ${ops[1]} ${c}) ${ops[2]} ${d}`);
      if (result === 24) {
        console.log(`${a} ${ops[0]} (${b} ${ops[1]} ${c}) ${ops[2]} ${d}`);
        return true;
      }
      // Case 3: a op1 b op2 (c op3 d)
      result = eval(`${a} ${ops[0]} ${b} ${ops[1]} (${c} ${ops[2]} ${d})`);
      if (result === 24) {
        console.log(`${a} ${ops[0]} ${b} ${ops[1]} (${c} ${ops[2]} ${d})`);
        return true;
      }
      // Case 4: ((a op1 b) op2 c) op3 d
      result = eval(`((${a} ${ops[0]} ${b}) ${ops[1]} ${c}) ${ops[2]} ${d}`);
      if (result === 24) {
        console.log(`((${a} ${ops[0]} ${b}) ${ops[1]} ${c}) ${ops[2]} ${d}`);
        return true;
      }

      // Case 5: (a op1 (b op2 c)) op3 d
      result = eval(`(${a} ${ops[0]} (${b} ${ops[1]} ${c})) ${ops[2]} ${d}`);
      if (result === 24) {
        console.log(
          `(${a} ${ops[0]} (${b} ${ops[1]} ${c})) ${ops[2]} ${d} = 24`
        );
        return true;
      }

      // Case 6: a op1 ((b op2 c) op3 d)
      result = eval(`${a} ${ops[0]} ((${b} ${ops[1]} ${c}) ${ops[2]} ${d})`);
      if (result === 24) {
        console.log(
          `${a} ${ops[0]} ((${b} ${ops[1]} ${c}) ${ops[2]} ${d}) = 24`
        );
        return true;
      }

      // Case 7: a op1 (b op2 (c op3 d))
      result = eval(`${a} ${ops[0]} (${b} ${ops[1]} (${c} ${ops[2]} ${d}))`);
      if (result === 24) {
        console.log(
          `${a} ${ops[0]} (${b} ${ops[1]} (${c} ${ops[2]} ${d})) = 24`
        );
        return true;
      }
      // Case 8: (a op1 b) op2 (c op3 d)
      result = eval(`(${a} ${ops[0]} ${b}) ${ops[1]} (${c} ${ops[2]} ${d})`);
      if (result === 24) {
        console.log(`(${a} ${ops[0]} ${b}) ${ops[1]} (${c} ${ops[2]} ${d})`);
        return true;
      }
    }
  }
  console.log("No solution found.");
  return false;

  // Function to generate all permutations of an array
  function permute(arr, k = arr.length) {
    if (k === 1) return arr.map((el) => [el]);
    const result = [];
    permute(arr, k - 1).forEach((p) => {
      arr.forEach((el) => {
        if (!p.includes(el)) {
          result.push([...p, el]);
        }
      });
    });
    return result;
  }
}
