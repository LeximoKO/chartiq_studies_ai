import { CIQ as _CIQ } from "../../../js/chartiq.js"; 
import "../../standard/studies.js";

// Функция для добавления трендовой линии в библиотеку исследований
let __js_advanced_studies_trendLine_ = (_exports) => {
  // Проверка наличия объекта CIQ
  var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

  // Проверка, включены ли исследования (Studies)
  if (!CIQ.Studies) {
    console.error("The trendLine feature requires first activating the studies feature.");
  } else {
    // Функция для вычисления трендовой линии
    CIQ.Studies.calculateTrendLine = function (stx, sd) {
      var quotes = sd.chart.scrubbed;  // Данные графика
      var startPoint = sd.inputs["Start Point"];  // Начальная точка
      var endPoint = sd.inputs["End Point"];  // Конечная точка

      // Проверка на корректность введенных точек
      if (startPoint == null || endPoint == null || startPoint >= endPoint) {
        sd.error = true;
        return;
      }

      // Получение цен для начальной и конечной точек
      var startPrice = quotes[startPoint].Close;
      var endPrice = quotes[endPoint].Close;
      var timePeriod = endPoint - startPoint;
      var slope = (endPrice - startPrice) / timePeriod;

      // Применение трендовой линии к каждому значению
      for (var i = startPoint; i <= endPoint; i++) {
        if (quotes[i]) {
          quotes[i]["Trend Line " + sd.name] = startPrice + slope * (i - startPoint);
        }
      }
    };

    // Расширение библиотеки исследований с добавлением трендовой линии
    CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
      "test1": {
        name: "test1",
        overlay: true,  // Накладываем на график
        calculateFN: CIQ.Studies.calculateTrendLine,  // Функция расчета трендовой линии
        inputs: {
          "Start Point": 0,  // По умолчанию начало с 0
          "End Point": 10    // По умолчанию конец на 10
        },
        outputs: {
          "Trend Line": "#FF0000"  // Цвет трендовой линии (красный)
        }
      }
    });
  }
};


__js_advanced_studies_trendLine_(typeof window !== "undefined" ? window : global);
