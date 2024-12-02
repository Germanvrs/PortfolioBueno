function igpayAtinlay(str) {
  var returnArray = [];
  var wordArray = str.split(" ");

  for (var i = 0; i < wordArray.length; i++) {
    var word = wordArray[i];
    var beginning = word.charAt(0);

    if (/[aeiouAEIOU]/.test(beginning)) {
      returnArray.push(word + "way");
      continue;
    }

    for (var ii = 1; ii < word.length; ii++) {
      if (/[aeiouAEIOU]/.test(word.charAt(ii))) {
        returnArray.push(word.slice(ii) + beginning + "ay");
        break;
      } else {
        beginning += word.charAt(ii);
      }
    }
  }
  return returnArray.join(" ");
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn").addEventListener("click", function () {
    var input = document.getElementById("txtVal").value;
    var result = igpayAtinlay(input);
    document.getElementById("pigLatLbl").textContent = result;
  });
});
