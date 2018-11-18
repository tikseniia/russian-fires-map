document.getElementById("count").addEventListener('click', countPercentage);

function countPercentage() {
  document.getElementById("info").style.opacity = 0;
  document.getElementById("info").style.visibility = 'hidden';

  document.getElementById("salary").value = Math.abs(parseInt(document.getElementById("salary").value));
  document.getElementById("age").value = Math.abs(parseInt(document.getElementById("salary").value));
  document.getElementById("exp").value = Math.abs(parseInt(document.getElementById("salary").value));

  var salary = Math.abs(parseInt(document.getElementById("salary").value));
  var age = Math.abs(parseInt(document.getElementById("age").value));
  var exp = Math.abs(parseInt(document.getElementById("exp").value));
  var region = document.getElementById("region").value;

  if (!isNaN(salary) && !isNaN(exp)) {
    if (age < 31) {
      var r_info = Benefits_b30.regions[region];
    } else {
      var r_info = Benefits_a30.regions[region];
    }

    var p = 0;
    for (var i=0; i<(exp*2-r_info.start_date); i++) {
      if (p < r_info.end) {
        p = p + r_info.step;
      }
    }

    var s = salary*r_info.coef+(salary*(p/100))

    document.getElementById("output").innerHTML = '<h3>'+s+' рублей</h3><p>Ваша зарплата с <span id="nord_benefit" onclick="benefitInfo('+p+')">"северной" надбавкой</span> и минимальным <span id="coef" onclick="coefInfo('+p+')">районным коэффициентом</span></p>';
  }
}

function coefInfo(p) {
  document.getElementById("info").style.visibility = 'visible';
  document.getElementById("info").style.opacity = 1;
  document.getElementById("info").innerHTML = '<p>Оклад умножается на районный коэффициент. Здесь мы учитываем минимальное значение для '+document.getElementById("region").value+' - '+Benefits_b30.regions[document.getElementById("region").value].coef+'.</p>';
}

function benefitInfo(p) {
  document.getElementById("info").style.visibility = 'visible';
  document.getElementById("info").style.opacity = 1;
  document.getElementById("info").innerHTML = '<p>К зарплате прибавляется "северный" процент от оклада. Для '+document.getElementById("region").value+' и вашего стажа и возраста - это '+(p)+'%.</p>';
}
