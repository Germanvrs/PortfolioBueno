var sieve = function (n) {
  "use strict";
  var array = new Array(n + 1).fill(true);
  var primes = [];

  array[0] = array[1] = false; // 0 y 1 no son primos

  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (array[i]) {
      for (var j = i * i; j <= n; j += i) {
        array[j] = false;
      }
    }
  }

  for (var i = 2; i <= n; i++) {
    if (array[i]) {
      primes.push(i);
    }
  }

  return primes;
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn").addEventListener("click", function () {
    var num = parseInt(document.getElementById("num").value);
    if (!isNaN(num) && num > 1) {
      var result = sieve(num);
      document.getElementById("primes").innerText = result.join(", ");
    } else {
      document.getElementById("primes").innerText = "Por favor, ingrese un número válido mayor que 1.";
    }
  });
});
